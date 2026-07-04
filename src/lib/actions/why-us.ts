"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import type { ActionResult } from "@/types/cms"

export async function getWhyUsContent() {
  const page = await prisma.page.findUnique({
    where: { slug: "/" },
    include: {
      sections: {
        where: { sectionType: "why-us" },
        include: { whyUsContent: { include: { features: { orderBy: { order: "asc" } } } } },
      },
    },
  })
  return page?.sections[0]?.whyUsContent ?? null
}

export interface WhyUsFeatureInput {
  title: string
  description: string
  icon?: string | null
}

export async function updateWhyUsContent(data: {
  title?: string
  subtitle?: string
  description?: string
  stat1Value?: string
  stat1Label?: string
  stat2Value?: string
  stat2Label?: string
  ctaLabel?: string
  features: WhyUsFeatureInput[]
}): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user || session.user.role === "VIEWER") {
    return { success: false, error: "Yetkisiz erişim" }
  }

  try {
    const page = await prisma.page.findUnique({
      where: { slug: "/" },
      include: { sections: { where: { sectionType: "why-us" } } },
    })
    if (!page) return { success: false, error: "Ana sayfa bulunamadı" }

    const sectionId = page.sections[0]?.id
    if (!sectionId) return { success: false, error: "Neden Biz bölümü bulunamadı" }

    const content = await prisma.whyUsSectionContent.update({
      where: { sectionId },
      data: {
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        stat1Value: data.stat1Value,
        stat1Label: data.stat1Label,
        stat2Value: data.stat2Value,
        stat2Label: data.stat2Label,
        ctaLabel: data.ctaLabel,
      },
    })

    await prisma.whyUsFeature.deleteMany({ where: { sectionId: content.id } })
    if (data.features.length) {
      await prisma.whyUsFeature.createMany({
        data: data.features.map((f, i) => ({ ...f, order: i, sectionId: content.id })),
      })
    }

    revalidatePath("/")
    revalidatePath("/panel/icerik")
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
