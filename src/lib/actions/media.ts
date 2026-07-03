"use server"

import { prisma } from "@/lib/prisma"
import { supabaseAdmin, MEDIA_BUCKET } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import type { Prisma } from "@prisma/client"
import type { ActionResult } from "@/types/cms"

export type MediaItem = {
  id: string
  filename: string
  originalName: string
  url: string
  webpUrl: string | null
  thumbnailUrl: string | null
  mimeType: string
  size: number
  width: number | null
  height: number | null
  alt: string | null
  title: string | null
  description: string | null
  folderId: string | null
  createdAt: string
}

export type FolderItem = {
  id: string
  name: string
  parentId: string | null
  createdAt: string
  _count: { media: number; children: number }
}

function toMediaItem(m: {
  id: string; filename: string; originalName: string; url: string
  webpUrl: string | null; thumbnailUrl: string | null; mimeType: string
  size: number; width: number | null; height: number | null
  alt: string | null; title: string | null; description: string | null
  folderId: string | null; createdAt: Date
}): MediaItem {
  return { ...m, createdAt: m.createdAt.toISOString() }
}

function toFolderItem(f: {
  id: string; name: string; parentId: string | null; createdAt: Date
  _count: { media: number; children: number }
}): FolderItem {
  return { ...f, createdAt: f.createdAt.toISOString() }
}

// ── Helpers ───────────────────────────────────────────────────────────────

function extractStoragePath(url: string): string {
  const marker = `/object/public/${MEDIA_BUCKET}/`
  const idx = url.indexOf(marker)
  return idx !== -1 ? url.slice(idx + marker.length) : url
}

// ── Queries ───────────────────────────────────────────────────────────────

export async function getMedia({
  folderId,
  search = "",
  mimePrefix = "",
  page = 1,
  pageSize = 48,
}: {
  folderId?: string | null
  search?: string
  mimePrefix?: string
  page?: number
  pageSize?: number
} = {}) {
  const where: Prisma.MediaWhereInput = {}
  if (folderId !== undefined) where.folderId = folderId ?? null
  if (search) where.OR = [
    { originalName: { contains: search, mode: "insensitive" } },
    { title: { contains: search, mode: "insensitive" } },
    { alt: { contains: search, mode: "insensitive" } },
  ]
  if (mimePrefix) where.mimeType = { startsWith: mimePrefix }

  const [raw, total] = await Promise.all([
    prisma.media.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
    prisma.media.count({ where }),
  ])
  return { data: raw.map(toMediaItem), total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
}

export async function getFolders(parentId?: string | null): Promise<FolderItem[]> {
  const raw = await prisma.mediaFolder.findMany({
    where: { parentId: parentId ?? null },
    include: { _count: { select: { media: true, children: true } } },
    orderBy: { name: "asc" },
  })
  return raw.map(toFolderItem)
}

export async function getAllFolders(): Promise<FolderItem[]> {
  const raw = await prisma.mediaFolder.findMany({
    include: { _count: { select: { media: true, children: true } } },
    orderBy: { name: "asc" },
  })
  return raw.map(toFolderItem)
}

// ── Mutations ─────────────────────────────────────────────────────────────

export async function createFolder(name: string, parentId?: string | null): Promise<ActionResult<FolderItem>> {
  const session = await auth()
  if (!session?.user) return { success: false, error: "Yetkisiz erişim" }
  try {
    const folder = await prisma.mediaFolder.create({
      data: { name: name.trim(), parentId: parentId ?? null },
      include: { _count: { select: { media: true, children: true } } },
    })
    revalidatePath("/panel/medya")
    return { success: true, data: toFolderItem(folder) }
  } catch (e: unknown) {
    return { success: false, error: (e as Error).message }
  }
}

export async function renameFolder(id: string, name: string): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user) return { success: false, error: "Yetkisiz erişim" }
  try {
    await prisma.mediaFolder.update({ where: { id }, data: { name: name.trim() } })
    revalidatePath("/panel/medya")
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteFolder(id: string): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") return { success: false, error: "Yetkisiz erişim" }
  try {
    await prisma.media.updateMany({ where: { folderId: id }, data: { folderId: null } })
    await prisma.mediaFolder.delete({ where: { id } })
    revalidatePath("/panel/medya")
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: (e as Error).message }
  }
}

export async function updateMedia(id: string, data: { alt?: string | null; title?: string | null; description?: string | null }): Promise<ActionResult<MediaItem>> {
  const session = await auth()
  if (!session?.user) return { success: false, error: "Yetkisiz erişim" }
  try {
    const media = await prisma.media.update({
      where: { id },
      data: { alt: data.alt?.trim() || null, title: data.title?.trim() || null, description: data.description?.trim() || null },
    })
    revalidatePath("/panel/medya")
    return { success: true, data: toMediaItem(media) }
  } catch (e: unknown) {
    return { success: false, error: (e as Error).message }
  }
}

export async function moveMediaToFolder(ids: string[], folderId: string | null): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user) return { success: false, error: "Yetkisiz erişim" }
  try {
    await prisma.media.updateMany({ where: { id: { in: ids } }, data: { folderId } })
    revalidatePath("/panel/medya")
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteMedia(ids: string[]): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user) return { success: false, error: "Yetkisiz erişim" }
  try {
    const items = await prisma.media.findMany({ where: { id: { in: ids } }, select: { url: true, webpUrl: true, thumbnailUrl: true } })
    const paths = items.flatMap((item) => [item.url, item.webpUrl, item.thumbnailUrl]
      .filter(Boolean)
      .map((u) => extractStoragePath(u!))
    )
    if (paths.length) await supabaseAdmin.storage.from(MEDIA_BUCKET).remove(paths)
    await prisma.media.deleteMany({ where: { id: { in: ids } } })
    revalidatePath("/panel/medya")
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: (e as Error).message }
  }
}
