"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import type { ActionResult } from "@/types/cms"
import type { Prisma } from "@prisma/client"

export async function getCtaContent() {
  const page = await prisma.page.findUnique({
    where: { slug: "/" },
    include: { sections: { where: { sectionType: "cta" }, include: { ctaContent: true } } },
  })
  return page?.sections[0]?.ctaContent ?? null
}

export async function updateCtaContent(data: {
  eyebrow?: string
  title: string
  subtitle?: string
  buttons: Prisma.InputJsonValue
  style?: string
}): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user || session.user.role === "VIEWER") {
    return { success: false, error: "Yetkisiz erişim" }
  }

  try {
    const page = await prisma.page.findUnique({
      where: { slug: "/" },
      include: { sections: { where: { sectionType: "cta" } } },
    })
    if (!page) return { success: false, error: "Ana sayfa bulunamadı" }

    const sectionId = page.sections[0]?.id
    if (!sectionId) return { success: false, error: "CTA bölümü bulunamadı" }

    await prisma.ctaSectionContent.update({
      where: { sectionId },
      data: {
        eyebrow: data.eyebrow, title: data.title, subtitle: data.subtitle,
        buttons: data.buttons, style: data.style,
      },
    })

    revalidatePath("/")
    revalidatePath("/panel/icerik")
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
