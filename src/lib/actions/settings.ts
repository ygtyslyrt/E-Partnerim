"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import type { ActionResult } from "@/types/cms"

export async function getSiteSettings() {
  const settings = await prisma.siteSettings.findMany({ orderBy: { group: "asc" } })
  return Object.fromEntries(settings.map((s) => [s.key, s.value]))
}

export async function updateSiteSettings(data: Record<string, string>): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return { success: false, error: "Sadece adminler ayar değiştirebilir" }
  }

  try {
    await Promise.all(
      Object.entries(data).map(([key, value]) =>
        prisma.siteSettings.update({ where: { key }, data: { value } })
      )
    )
    revalidatePath("/panel/ayarlar")
    revalidatePath("/")
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
