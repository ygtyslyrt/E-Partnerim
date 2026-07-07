"use server"

import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import type { ActionResult } from "@/types/cms"
import type { Role } from "@prisma/client"

export interface UserListItem {
  id: string
  email: string
  name: string
  role: Role
  avatar: string | null
  active: boolean
  createdAt: Date
}

const userListSelect = {
  id: true, email: true, name: true, role: true, avatar: true, active: true, createdAt: true,
} as const

async function requireAdmin() {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return { ok: false as const, error: "Sadece adminler kullanıcı yönetebilir" }
  }
  return { ok: true as const, userId: session.user.id }
}

export async function getUsers(): Promise<UserListItem[]> {
  return prisma.user.findMany({ select: userListSelect, orderBy: { createdAt: "asc" } })
}

export interface CreateUserInput {
  name: string
  email: string
  password: string
  role: Role
  active?: boolean
}

export async function createUser(data: CreateUserInput): Promise<ActionResult<UserListItem>> {
  const check = await requireAdmin()
  if (!check.ok) return { success: false, error: check.error }

  const name = data.name.trim()
  const email = data.email.trim().toLowerCase()
  if (!name || !email) return { success: false, error: "Ad ve e-posta zorunludur" }
  if (data.password.length < 8) return { success: false, error: "Şifre en az 8 karakter olmalıdır" }

  try {
    const hashedPassword = await bcrypt.hash(data.password, 12)
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: data.role, active: data.active ?? true },
      select: userListSelect,
    })
    revalidatePath("/panel/kullanicilar")
    return { success: true, data: user }
  } catch (e) {
    if ((e as { code?: string }).code === "P2002") return { success: false, error: "Bu e-posta zaten kullanımda" }
    return { success: false, error: (e as Error).message }
  }
}

export interface UpdateUserInput {
  name: string
  email: string
  role: Role
  active: boolean
  password?: string
}

export async function updateUser(id: string, data: UpdateUserInput): Promise<ActionResult<UserListItem>> {
  const check = await requireAdmin()
  if (!check.ok) return { success: false, error: check.error }

  const name = data.name.trim()
  const email = data.email.trim().toLowerCase()
  if (!name || !email) return { success: false, error: "Ad ve e-posta zorunludur" }
  if (data.password && data.password.length < 8) return { success: false, error: "Şifre en az 8 karakter olmalıdır" }

  if ((data.role !== "ADMIN" || !data.active) && id === check.userId) {
    const adminCount = await prisma.user.count({ where: { role: "ADMIN", active: true } })
    if (adminCount <= 1) return { success: false, error: "Son aktif admin kendi rolünü değiştiremez veya kendini devre dışı bırakamaz" }
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data: {
        name, email, role: data.role, active: data.active,
        ...(data.password ? { password: await bcrypt.hash(data.password, 12) } : {}),
      },
      select: userListSelect,
    })
    revalidatePath("/panel/kullanicilar")
    return { success: true, data: user }
  } catch (e) {
    if ((e as { code?: string }).code === "P2002") return { success: false, error: "Bu e-posta zaten kullanımda" }
    return { success: false, error: (e as Error).message }
  }
}

export async function toggleUserActive(id: string, current: boolean): Promise<ActionResult> {
  const check = await requireAdmin()
  if (!check.ok) return { success: false, error: check.error }

  if (current && id === check.userId) {
    return { success: false, error: "Kendinizi devre dışı bırakamazsınız" }
  }

  if (current) {
    const user = await prisma.user.findUnique({ where: { id }, select: { role: true } })
    if (user?.role === "ADMIN") {
      const activeAdmins = await prisma.user.count({ where: { role: "ADMIN", active: true } })
      if (activeAdmins <= 1) return { success: false, error: "Son aktif admin devre dışı bırakılamaz" }
    }
  }

  try {
    await prisma.user.update({ where: { id }, data: { active: !current } })
    revalidatePath("/panel/kullanicilar")
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteUser(id: string): Promise<ActionResult> {
  const check = await requireAdmin()
  if (!check.ok) return { success: false, error: check.error }
  if (id === check.userId) return { success: false, error: "Kendinizi silemezsiniz" }

  const user = await prisma.user.findUnique({ where: { id }, select: { role: true, active: true } })
  if (user?.role === "ADMIN" && user.active) {
    const activeAdminCount = await prisma.user.count({ where: { role: "ADMIN", active: true } })
    if (activeAdminCount <= 1) return { success: false, error: "Son aktif admin silinemez" }
  }

  try {
    await prisma.user.delete({ where: { id } })
    revalidatePath("/panel/kullanicilar")
    return { success: true }
  } catch (e) {
    if ((e as { code?: string }).code === "P2003") {
      return { success: false, error: "Bu kullanıcıya bağlı kayıtlar var (blog yazısı, lead vb.). Silmek yerine devre dışı bırakın." }
    }
    return { success: false, error: (e as Error).message }
  }
}
