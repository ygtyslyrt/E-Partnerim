"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import type { ActionResult } from "@/types/cms"

export async function getSectionsOverview() {
  const page = await prisma.page.findUnique({
    where: { slug: "/" },
    include: { sections: { orderBy: { order: "asc" }, select: { id: true, sectionType: true, order: true, visible: true } } },
  })
  return page?.sections ?? []
}

export async function reorderSections(orderedIds: string[]): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user || session.user.role === "VIEWER") return { success: false, error: "Yetkisiz erişim" }
  try {
    await Promise.all(
      orderedIds.map((id, i) => prisma.pageSectionMeta.update({ where: { id }, data: { order: i } }))
    )
    revalidatePath("/")
    revalidatePath("/panel/icerik")
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: (e as Error).message }
  }
}

export async function toggleSectionVisibility(id: string, visible: boolean): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user || session.user.role === "VIEWER") return { success: false, error: "Yetkisiz erişim" }
  try {
    await prisma.pageSectionMeta.update({ where: { id }, data: { visible } })
    revalidatePath("/")
    revalidatePath("/panel/icerik")
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: (e as Error).message }
  }
}
