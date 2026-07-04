"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import type { ActionResult } from "@/types/cms"

export async function getHowItWorksContent() {
  const page = await prisma.page.findUnique({
    where: { slug: "/" },
    include: {
      sections: {
        where: { sectionType: "how-it-works" },
        include: { howItWorksContent: { include: { steps: { orderBy: { order: "asc" } } } } },
      },
    },
  })
  return page?.sections[0]?.howItWorksContent ?? null
}

export interface HowItWorksStepInput {
  stepNo: number
  title: string
  description: string
  icon?: string | null
  highlighted?: boolean
}

export async function updateHowItWorksContent(data: {
  title?: string
  subtitle?: string
  steps: HowItWorksStepInput[]
}): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user || session.user.role === "VIEWER") {
    return { success: false, error: "Yetkisiz erişim" }
  }

  try {
    const page = await prisma.page.findUnique({
      where: { slug: "/" },
      include: { sections: { where: { sectionType: "how-it-works" } } },
    })
    if (!page) return { success: false, error: "Ana sayfa bulunamadı" }

    const sectionId = page.sections[0]?.id
    if (!sectionId) return { success: false, error: "Nasıl Çalışır bölümü bulunamadı" }

    const content = await prisma.howItWorksSectionContent.update({
      where: { sectionId },
      data: { title: data.title, subtitle: data.subtitle },
    })

    await prisma.howItWorksStep.deleteMany({ where: { sectionId: content.id } })
    if (data.steps.length) {
      await prisma.howItWorksStep.createMany({
        data: data.steps.map((step, i) => ({ ...step, order: i, sectionId: content.id })),
      })
    }

    revalidatePath("/")
    revalidatePath("/panel/icerik")
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
