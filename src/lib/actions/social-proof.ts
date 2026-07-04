"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { syncMediaUsage } from "@/lib/media-usage"
import type { ActionResult } from "@/types/cms"

export async function getSocialProofContent() {
  const page = await prisma.page.findUnique({
    where: { slug: "/" },
    include: {
      sections: {
        where: { sectionType: "social-proof" },
        include: {
          socialProofContent: {
            include: {
              logos: { orderBy: { order: "asc" } },
              stats: { orderBy: { order: "asc" } },
              testimonials: { orderBy: { order: "asc" } },
            },
          },
        },
      },
    },
  })
  return page?.sections[0]?.socialProofContent ?? null
}

export interface SocialProofLogoInput {
  id?: string
  name: string
  logo?: string | null
  color?: string | null
  url?: string | null
}

export interface SocialProofStatInput {
  value: string
  label: string
}

export interface TestimonialInput {
  id?: string
  name: string
  company?: string | null
  role?: string | null
  avatar?: string | null
  content: string
  rating?: number | null
}

async function upsertLogos(sectionId: string, logos: SocialProofLogoInput[]) {
  const existing = await prisma.socialProofLogo.findMany({ where: { sectionId }, select: { id: true } })
  const existingIds = new Set(existing.map((l) => l.id))
  const keptIds = new Set(logos.filter((l) => l.id).map((l) => l.id!))

  const toDelete = [...existingIds].filter((id) => !keptIds.has(id))
  if (toDelete.length) {
    await prisma.socialProofLogo.deleteMany({ where: { id: { in: toDelete } } })
    await prisma.mediaUsage.deleteMany({ where: { entityType: "social-proof-logo", entityId: { in: toDelete } } })
  }

  for (let i = 0; i < logos.length; i++) {
    const l = logos[i]
    const data = { name: l.name, logo: l.logo || null, color: l.color || null, url: l.url || null, order: i }
    const row =
      l.id && existingIds.has(l.id)
        ? await prisma.socialProofLogo.update({ where: { id: l.id }, data })
        : await prisma.socialProofLogo.create({ data: { ...data, sectionId } })
    await syncMediaUsage("social-proof-logo", row.id, row.name, "/", { logo: row.logo })
  }
}

async function upsertTestimonials(sectionId: string, testimonials: TestimonialInput[]) {
  const existing = await prisma.testimonial.findMany({ where: { sectionId }, select: { id: true } })
  const existingIds = new Set(existing.map((t) => t.id))
  const keptIds = new Set(testimonials.filter((t) => t.id).map((t) => t.id!))

  const toDelete = [...existingIds].filter((id) => !keptIds.has(id))
  if (toDelete.length) {
    await prisma.testimonial.deleteMany({ where: { id: { in: toDelete } } })
    await prisma.mediaUsage.deleteMany({ where: { entityType: "testimonial", entityId: { in: toDelete } } })
  }

  for (let i = 0; i < testimonials.length; i++) {
    const t = testimonials[i]
    const data = {
      name: t.name, company: t.company || null, role: t.role || null,
      avatar: t.avatar || null, content: t.content, rating: t.rating ?? null, order: i,
    }
    const row =
      t.id && existingIds.has(t.id)
        ? await prisma.testimonial.update({ where: { id: t.id }, data })
        : await prisma.testimonial.create({ data: { ...data, sectionId } })
    await syncMediaUsage("testimonial", row.id, row.name, "/", { avatar: row.avatar })
  }
}

export async function updateSocialProofContent(data: {
  title?: string
  subtitle?: string
  logos: SocialProofLogoInput[]
  stats: SocialProofStatInput[]
  testimonials: TestimonialInput[]
}): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user || session.user.role === "VIEWER") {
    return { success: false, error: "Yetkisiz erişim" }
  }

  try {
    const page = await prisma.page.findUnique({
      where: { slug: "/" },
      include: { sections: { where: { sectionType: "social-proof" } } },
    })
    if (!page) return { success: false, error: "Ana sayfa bulunamadı" }

    const sectionId = page.sections[0]?.id
    if (!sectionId) return { success: false, error: "Referanslar bölümü bulunamadı" }

    const content = await prisma.socialProofSectionContent.update({
      where: { sectionId },
      data: { title: data.title, subtitle: data.subtitle },
    })

    await prisma.socialProofStat.deleteMany({ where: { sectionId: content.id } })
    if (data.stats.length) {
      await prisma.socialProofStat.createMany({
        data: data.stats.map((s, i) => ({ ...s, order: i, sectionId: content.id })),
      })
    }

    await upsertLogos(content.id, data.logos)
    await upsertTestimonials(content.id, data.testimonials)

    revalidatePath("/")
    revalidatePath("/panel/icerik")
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
