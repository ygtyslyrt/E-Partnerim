"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { syncMediaUsage } from "@/lib/media-usage"
import type { ActionResult } from "@/types/cms"
import type { Prisma } from "@prisma/client"

type Tx = Prisma.TransactionClient

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

async function upsertLogos(tx: Tx, sectionId: string, logos: SocialProofLogoInput[]) {
  const existing = await tx.socialProofLogo.findMany({ where: { sectionId }, select: { id: true } })
  const existingIds = new Set(existing.map((l) => l.id))
  const keptIds = new Set(logos.filter((l) => l.id).map((l) => l.id!))

  const toDelete = [...existingIds].filter((id) => !keptIds.has(id))
  if (toDelete.length) {
    await tx.socialProofLogo.deleteMany({ where: { id: { in: toDelete } } })
    await tx.mediaUsage.deleteMany({ where: { entityType: "social-proof-logo", entityId: { in: toDelete } } })
  }

  const rows: { id: string; name: string; logo: string | null }[] = []
  for (let i = 0; i < logos.length; i++) {
    const l = logos[i]
    const data = { name: l.name, logo: l.logo || null, color: l.color || null, url: l.url || null, order: i }
    const row =
      l.id && existingIds.has(l.id)
        ? await tx.socialProofLogo.update({ where: { id: l.id }, data })
        : await tx.socialProofLogo.create({ data: { ...data, sectionId } })
    rows.push(row)
  }
  return rows
}

async function upsertTestimonials(tx: Tx, sectionId: string, testimonials: TestimonialInput[]) {
  const existing = await tx.testimonial.findMany({ where: { sectionId }, select: { id: true } })
  const existingIds = new Set(existing.map((t) => t.id))
  const keptIds = new Set(testimonials.filter((t) => t.id).map((t) => t.id!))

  const toDelete = [...existingIds].filter((id) => !keptIds.has(id))
  if (toDelete.length) {
    await tx.testimonial.deleteMany({ where: { id: { in: toDelete } } })
    await tx.mediaUsage.deleteMany({ where: { entityType: "testimonial", entityId: { in: toDelete } } })
  }

  const rows: { id: string; name: string; avatar: string | null }[] = []
  for (let i = 0; i < testimonials.length; i++) {
    const t = testimonials[i]
    const data = {
      name: t.name, company: t.company || null, role: t.role || null,
      avatar: t.avatar || null, content: t.content, rating: t.rating ?? null, order: i,
    }
    const row =
      t.id && existingIds.has(t.id)
        ? await tx.testimonial.update({ where: { id: t.id }, data })
        : await tx.testimonial.create({ data: { ...data, sectionId } })
    rows.push(row)
  }
  return rows
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

    const { logoRows, testimonialRows } = await prisma.$transaction(async (tx) => {
      const content = await tx.socialProofSectionContent.update({
        where: { sectionId },
        data: { title: data.title, subtitle: data.subtitle },
      })

      await tx.socialProofStat.deleteMany({ where: { sectionId: content.id } })
      if (data.stats.length) {
        await tx.socialProofStat.createMany({
          data: data.stats.map((s, i) => ({ ...s, order: i, sectionId: content.id })),
        })
      }

      const logoRows = await upsertLogos(tx, content.id, data.logos)
      const testimonialRows = await upsertTestimonials(tx, content.id, data.testimonials)
      return { logoRows, testimonialRows }
    })

    for (const row of logoRows) {
      await syncMediaUsage("social-proof-logo", row.id, row.name, "/", { logo: row.logo })
    }
    for (const row of testimonialRows) {
      await syncMediaUsage("testimonial", row.id, row.name, "/", { avatar: row.avatar })
    }

    revalidatePath("/")
    revalidatePath("/panel/icerik")
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
