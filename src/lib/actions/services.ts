"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import type { ActionResult } from "@/types/cms"

export async function getServicesContent() {
  const page = await prisma.page.findUnique({
    where: { slug: "/" },
    include: {
      sections: {
        where: { sectionType: "services" },
        include: { servicesContent: { include: { items: { orderBy: { order: "asc" } } } } },
      },
    },
  })
  return page?.sections[0]?.servicesContent ?? null
}

export interface ServiceItemInput {
  title: string
  description: string
  icon: string
  color: string
  link?: string | null
  highlighted?: boolean
  statValue?: string | null
  statLabel?: string | null
}

export async function updateServicesContent(data: {
  title?: string
  subtitle?: string
  ctaLabel?: string
  ctaUrl?: string
  items: ServiceItemInput[]
}): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user || session.user.role === "VIEWER") {
    return { success: false, error: "Yetkisiz erişim" }
  }

  try {
    const page = await prisma.page.findUnique({
      where: { slug: "/" },
      include: { sections: { where: { sectionType: "services" } } },
    })
    if (!page) return { success: false, error: "Ana sayfa bulunamadı" }

    const sectionId = page.sections[0]?.id
    if (!sectionId) return { success: false, error: "Hizmetler bölümü bulunamadı" }

    await prisma.$transaction(async (tx) => {
      const content = await tx.servicesSectionContent.update({
        where: { sectionId },
        data: { title: data.title, subtitle: data.subtitle, ctaLabel: data.ctaLabel, ctaUrl: data.ctaUrl },
      })

      await tx.serviceItem.deleteMany({ where: { servicesId: content.id } })
      if (data.items.length) {
        await tx.serviceItem.createMany({
          data: data.items.map((item, i) => ({ ...item, order: i, servicesId: content.id })),
        })
      }
    })

    revalidatePath("/")
    revalidatePath("/panel/icerik")
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
