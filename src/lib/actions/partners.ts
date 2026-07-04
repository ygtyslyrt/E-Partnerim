"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { syncMediaUsage } from "@/lib/media-usage"
import type { ActionResult, PaginatedResult } from "@/types/cms"
import type { Partner, PartnerPackage, PartnerReference, PartnerMedia, Prisma } from "@prisma/client"

export type PartnerWithRelations = Partner & {
  packages: PartnerPackage[]
  references: PartnerReference[]
  media: PartnerMedia[]
  platforms: { platformId: string; platform: { id: string; name: string; slug: string } }[]
  solutions: { solutionId: string; solution: { id: string; title: string; slug: string } }[]
}

export interface PartnerPackageInput {
  name: string
  description?: string | null
  price?: string | null
  features?: string[]
}

export interface PartnerReferenceInput {
  id?: string
  name: string
  role?: string | null
  company?: string | null
  content: string
  avatar?: string | null
  rating?: number | null
}

export interface PartnerMediaInput {
  id?: string
  url: string
  caption?: string | null
}

export interface PartnerInput {
  name: string
  slug: string
  tagline?: string | null
  shortDesc?: string | null
  description?: string | null
  logo?: string | null
  coverImage?: string | null
  website?: string | null
  email?: string | null
  phone?: string | null
  whatsapp?: string | null
  city?: string | null
  category?: string | null
  featured?: boolean
  verified?: boolean
  status?: string
  seoTitle?: string | null
  seoDesc?: string | null
  ogImage?: string | null
  packages?: PartnerPackageInput[]
  references?: PartnerReferenceInput[]
  media?: PartnerMediaInput[]
  platformIds?: string[]
  solutionIds?: string[]
}

function n(v?: string | null) {
  return v?.trim() || null
}

async function upsertReferences(partnerId: string, references: PartnerReferenceInput[], partnerName: string, partnerHref: string) {
  const existing = await prisma.partnerReference.findMany({ where: { partnerId }, select: { id: true } })
  const existingIds = new Set(existing.map((r) => r.id))
  const keptIds = new Set(references.filter((r) => r.id).map((r) => r.id!))

  const toDelete = [...existingIds].filter((id) => !keptIds.has(id))
  if (toDelete.length) {
    await prisma.partnerReference.deleteMany({ where: { id: { in: toDelete } } })
    await prisma.mediaUsage.deleteMany({ where: { entityType: "partner-reference", entityId: { in: toDelete } } })
  }

  for (let i = 0; i < references.length; i++) {
    const r = references[i]
    const data = {
      name: r.name, role: n(r.role), company: n(r.company), content: r.content,
      avatar: n(r.avatar), rating: r.rating ?? null, order: i,
    }
    const row =
      r.id && existingIds.has(r.id)
        ? await prisma.partnerReference.update({ where: { id: r.id }, data })
        : await prisma.partnerReference.create({ data: { ...data, partnerId } })
    await syncMediaUsage("partner-reference", row.id, `${partnerName} — ${row.name}`, partnerHref, { avatar: row.avatar })
  }
}

async function upsertMedia(partnerId: string, media: PartnerMediaInput[], partnerName: string, partnerHref: string) {
  const existing = await prisma.partnerMedia.findMany({ where: { partnerId }, select: { id: true } })
  const existingIds = new Set(existing.map((m) => m.id))
  const keptIds = new Set(media.filter((m) => m.id).map((m) => m.id!))

  const toDelete = [...existingIds].filter((id) => !keptIds.has(id))
  if (toDelete.length) {
    await prisma.partnerMedia.deleteMany({ where: { id: { in: toDelete } } })
    await prisma.mediaUsage.deleteMany({ where: { entityType: "partner-media", entityId: { in: toDelete } } })
  }

  for (let i = 0; i < media.length; i++) {
    const m = media[i]
    const data = { url: m.url, caption: n(m.caption), order: i }
    const row =
      m.id && existingIds.has(m.id)
        ? await prisma.partnerMedia.update({ where: { id: m.id }, data })
        : await prisma.partnerMedia.create({ data: { ...data, partnerId } })
    await syncMediaUsage("partner-media", row.id, `${partnerName} — Galeri`, partnerHref, { url: row.url })
  }
}

// ── Queries ───────────────────────────────────────────────────────────────

export async function getPartners(page = 1, pageSize = 20, search = ""): Promise<PaginatedResult<Partner>> {
  const where: Prisma.PartnerWhereInput = search ? { name: { contains: search, mode: "insensitive" } } : {}
  const [data, total] = await Promise.all([
    prisma.partner.findMany({ where, orderBy: { order: "asc" }, skip: (page - 1) * pageSize, take: pageSize }),
    prisma.partner.count({ where }),
  ])
  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
}

export async function getPartner(slug: string): Promise<PartnerWithRelations | null> {
  return prisma.partner.findUnique({
    where: { slug },
    include: {
      packages: { orderBy: { order: "asc" } },
      references: { orderBy: { order: "asc" } },
      media: { orderBy: { order: "asc" } },
      platforms: { include: { platform: { select: { id: true, name: true, slug: true } } } },
      solutions: { include: { solution: { select: { id: true, title: true, slug: true } } } },
    },
  })
}

export interface PartnerFilter {
  search?: string
  platformId?: string
  solutionId?: string
  category?: string
  featuredOnly?: boolean
  page?: number
  pageSize?: number
}

export async function getPublishedPartners(filters: PartnerFilter = {}) {
  const { search = "", platformId, solutionId, category, featuredOnly = false, page = 1, pageSize = 100 } = filters
  const where: Prisma.PartnerWhereInput = { status: "PUBLISHED" }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { shortDesc: { contains: search, mode: "insensitive" } },
    ]
  }
  if (category) where.category = category
  if (featuredOnly) where.featured = true
  if (platformId) where.platforms = { some: { platformId } }
  if (solutionId) where.solutions = { some: { solutionId } }

  const [data, total] = await Promise.all([
    prisma.partner.findMany({
      where,
      orderBy: [{ featured: "desc" }, { order: "asc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        platforms: { include: { platform: { select: { id: true, name: true, slug: true } } } },
        solutions: { include: { solution: { select: { id: true, title: true, slug: true } } } },
      },
    }),
    prisma.partner.count({ where }),
  ])
  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
}

// ── Mutations ─────────────────────────────────────────────────────────────

export async function createPartner(data: PartnerInput): Promise<ActionResult<{ slug: string }>> {
  const session = await auth()
  if (!session?.user || session.user.role === "VIEWER") return { success: false, error: "Yetkisiz erişim" }

  try {
    const agg = await prisma.partner.aggregate({ _max: { order: true } })
    const partner = await prisma.partner.create({
      data: {
        name: data.name,
        slug: data.slug,
        tagline: n(data.tagline),
        shortDesc: n(data.shortDesc),
        description: n(data.description),
        logo: n(data.logo),
        coverImage: n(data.coverImage),
        website: n(data.website),
        email: n(data.email),
        phone: n(data.phone),
        whatsapp: n(data.whatsapp),
        city: n(data.city),
        category: n(data.category),
        featured: data.featured ?? false,
        verified: data.verified ?? false,
        status: (data.status ?? "DRAFT") as "DRAFT" | "PUBLISHED" | "SCHEDULED" | "ARCHIVED",
        seoTitle: n(data.seoTitle),
        seoDesc: n(data.seoDesc),
        ogImage: n(data.ogImage),
        order: (agg._max.order ?? 0) + 1,
        packages: data.packages?.length
          ? { create: data.packages.map((p, i) => ({ name: p.name, description: n(p.description), price: n(p.price), features: p.features?.length ? p.features : undefined, order: i })) }
          : undefined,
        platforms: data.platformIds?.length ? { create: data.platformIds.map((platformId) => ({ platformId })) } : undefined,
        solutions: data.solutionIds?.length ? { create: data.solutionIds.map((solutionId) => ({ solutionId })) } : undefined,
      },
    })

    const href = `/partnerler/${partner.slug}`
    await upsertReferences(partner.id, data.references ?? [], partner.name, href)
    await upsertMedia(partner.id, data.media ?? [], partner.name, href)
    await syncMediaUsage("partner", partner.id, partner.name, href, { logo: partner.logo, coverImage: partner.coverImage, ogImage: partner.ogImage })

    revalidatePath("/panel/partnerler")
    revalidatePath("/partnerler")
    return { success: true, data: { slug: partner.slug } }
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2002") return { success: false, error: "Bu slug zaten kullanımda" }
    return { success: false, error: (e as Error).message }
  }
}

export async function updatePartner(id: string, data: PartnerInput): Promise<ActionResult<{ slug: string }>> {
  const session = await auth()
  if (!session?.user || session.user.role === "VIEWER") return { success: false, error: "Yetkisiz erişim" }

  try {
    await prisma.partnerPackage.deleteMany({ where: { partnerId: id } })
    await prisma.partnerPlatform.deleteMany({ where: { partnerId: id } })
    await prisma.partnerSolution.deleteMany({ where: { partnerId: id } })

    const partner = await prisma.partner.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        tagline: n(data.tagline),
        shortDesc: n(data.shortDesc),
        description: n(data.description),
        logo: n(data.logo),
        coverImage: n(data.coverImage),
        website: n(data.website),
        email: n(data.email),
        phone: n(data.phone),
        whatsapp: n(data.whatsapp),
        city: n(data.city),
        category: n(data.category),
        featured: data.featured ?? false,
        verified: data.verified ?? false,
        status: (data.status ?? "DRAFT") as "DRAFT" | "PUBLISHED" | "SCHEDULED" | "ARCHIVED",
        seoTitle: n(data.seoTitle),
        seoDesc: n(data.seoDesc),
        ogImage: n(data.ogImage),
        packages: data.packages?.length
          ? { create: data.packages.map((p, i) => ({ name: p.name, description: n(p.description), price: n(p.price), features: p.features?.length ? p.features : undefined, order: i })) }
          : undefined,
        platforms: data.platformIds?.length ? { create: data.platformIds.map((platformId) => ({ platformId })) } : undefined,
        solutions: data.solutionIds?.length ? { create: data.solutionIds.map((solutionId) => ({ solutionId })) } : undefined,
      },
    })

    const href = `/partnerler/${partner.slug}`
    await upsertReferences(partner.id, data.references ?? [], partner.name, href)
    await upsertMedia(partner.id, data.media ?? [], partner.name, href)
    await syncMediaUsage("partner", partner.id, partner.name, href, { logo: partner.logo, coverImage: partner.coverImage, ogImage: partner.ogImage })

    revalidatePath("/panel/partnerler")
    revalidatePath(`/panel/partnerler/${partner.slug}`)
    revalidatePath("/partnerler")
    revalidatePath(href)
    return { success: true, data: { slug: partner.slug } }
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2002") return { success: false, error: "Bu slug zaten kullanımda" }
    return { success: false, error: (e as Error).message }
  }
}

export async function deletePartner(id: string): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") return { success: false, error: "Yetkisiz erişim" }
  try {
    const partner = await prisma.partner.findUnique({ where: { id }, include: { references: true, media: true } })
    if (partner) {
      const refIds = partner.references.map((r) => r.id)
      const mediaIds = partner.media.map((m) => m.id)
      await prisma.mediaUsage.deleteMany({
        where: {
          OR: [
            { entityType: "partner", entityId: id },
            { entityType: "partner-reference", entityId: { in: refIds } },
            { entityType: "partner-media", entityId: { in: mediaIds } },
          ],
        },
      })
    }
    await prisma.partner.delete({ where: { id } })
    revalidatePath("/panel/partnerler")
    revalidatePath("/partnerler")
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: (e as Error).message }
  }
}

export async function reorderPartners(orderedIds: string[]): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user || session.user.role === "VIEWER") return { success: false, error: "Yetkisiz erişim" }
  try {
    await Promise.all(orderedIds.map((id, i) => prisma.partner.update({ where: { id }, data: { order: i } })))
    revalidatePath("/panel/partnerler")
    revalidatePath("/partnerler")
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: (e as Error).message }
  }
}

export async function togglePartnerStatus(id: string, current: string): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user || session.user.role === "VIEWER") return { success: false, error: "Yetkisiz erişim" }
  try {
    await prisma.partner.update({ where: { id }, data: { status: current === "PUBLISHED" ? "DRAFT" : "PUBLISHED" } })
    revalidatePath("/panel/partnerler")
    revalidatePath("/partnerler")
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: (e as Error).message }
  }
}

export async function toggleVerified(id: string, current: boolean): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user || session.user.role === "VIEWER") return { success: false, error: "Yetkisiz erişim" }
  try {
    await prisma.partner.update({ where: { id }, data: { verified: !current } })
    revalidatePath("/panel/partnerler")
    revalidatePath("/partnerler")
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: (e as Error).message }
  }
}
