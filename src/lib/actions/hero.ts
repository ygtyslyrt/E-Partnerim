"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import type { ActionResult } from "@/types/cms"

export async function getHeroContent() {
  const page = await prisma.page.findUnique({
    where: { slug: "/" },
    include: {
      sections: {
        where: { sectionType: "hero" },
        include: { heroContent: true },
      },
    },
  })
  return page?.sections[0]?.heroContent ?? null
}

export async function updateHeroContent(
  data: {
    badge?: string
    title1: string
    title2: string
    gradient?: string
    subtitle?: string
    dotPattern: boolean
  }
): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user || session.user.role === "VIEWER") {
    return { success: false, error: "Yetkisiz erişim" }
  }

  try {
    const page = await prisma.page.findUnique({
      where: { slug: "/" },
      include: { sections: { where: { sectionType: "hero" } } },
    })
    if (!page) return { success: false, error: "Ana sayfa bulunamadı" }

    const sectionId = page.sections[0]?.id
    if (!sectionId) return { success: false, error: "Hero bölümü bulunamadı" }

    await prisma.heroSectionContent.update({
      where: { sectionId },
      data,
    })

    revalidatePath("/")
    revalidatePath("/panel/icerik")
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
