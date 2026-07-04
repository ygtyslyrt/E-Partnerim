"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import type { ActionResult } from "@/types/cms"

export async function getSolutionsSectionConfig() {
  const page = await prisma.page.findUnique({
    where: { slug: "/" },
    include: { sections: { where: { sectionType: "solutions" }, include: { solutionsContent: true } } },
  })
  return page?.sections[0]?.solutionsContent ?? null
}

export async function updateSolutionsSectionConfig(data: {
  title?: string
  subtitle?: string
  showCount: number
}): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user || session.user.role === "VIEWER") {
    return { success: false, error: "Yetkisiz erişim" }
  }

  try {
    const page = await prisma.page.findUnique({
      where: { slug: "/" },
      include: { sections: { where: { sectionType: "solutions" } } },
    })
    if (!page) return { success: false, error: "Ana sayfa bulunamadı" }

    const sectionId = page.sections[0]?.id
    if (!sectionId) return { success: false, error: "Çözümler bölümü bulunamadı" }

    await prisma.solutionsSectionConfig.update({
      where: { sectionId },
      data: { title: data.title, subtitle: data.subtitle, showCount: data.showCount },
    })

    revalidatePath("/")
    revalidatePath("/panel/icerik")
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
