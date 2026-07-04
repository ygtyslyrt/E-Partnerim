"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { syncMediaUsage } from "@/lib/media-usage"
import type { ActionResult, PaginatedResult } from "@/types/cms"
import type { Platform, PlatformFeature } from "@prisma/client"

export type PlatformWithFeatures = Platform & { features: PlatformFeature[] }

type FeatureInput = { type: "ADVANTAGE" | "DISADVANTAGE"; text: string; order: number }
type PlatformInput = {
  name: string
  slug: string
  url?: string | null
  category?: string | null
  shortDesc?: string | null
  description?: string | null
  logo?: string | null
  logoColor?: string | null
  pricing?: string | null
  featured?: boolean
  status?: string
  ctaLabel?: string | null
  ctaUrl?: string | null
  ctaLabel2?: string | null
  ctaUrl2?: string | null
  ogImage?: string | null
  seoTitle?: string | null
  seoDesc?: string | null
  features?: FeatureInput[]
}

function n(v?: string | null) { return v?.trim() || null }

export async function getPlatforms(
  page = 1, pageSize = 50, search = ""
): Promise<PaginatedResult<Platform>> {
  const where = search ? { name: { contains: search, mode: "insensitive" as const } } : {}
  const [data, total] = await Promise.all([
    prisma.platform.findMany({ where, orderBy: { order: "asc" }, skip: (page - 1) * pageSize, take: pageSize }),
    prisma.platform.count({ where }),
  ])
  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
}

export async function getPlatform(slug: string): Promise<PlatformWithFeatures | null> {
  return prisma.platform.findUnique({
    where: { slug },
    include: { features: { orderBy: { order: "asc" } } },
  })
}

export async function createPlatform(data: PlatformInput): Promise<ActionResult<{ slug: string }>> {
  const session = await auth()
  if (!session?.user || session.user.role === "VIEWER") return { success: false, error: "Yetkisiz erişim" }

  try {
    const agg = await prisma.platform.aggregate({ _max: { order: true } })
    const platform = await prisma.platform.create({
      data: {
        name: data.name,
        slug: data.slug,
        url: n(data.url),
        category: n(data.category),
        shortDesc: n(data.shortDesc),
        description: n(data.description),
        logo: n(data.logo),
        logoColor: n(data.logoColor),
        pricing: n(data.pricing),
        featured: data.featured ?? false,
        status: (data.status ?? "DRAFT") as "DRAFT" | "PUBLISHED",
        ctaLabel: n(data.ctaLabel), ctaUrl: n(data.ctaUrl),
        ctaLabel2: n(data.ctaLabel2), ctaUrl2: n(data.ctaUrl2),
        ogImage: n(data.ogImage),
        seoTitle: n(data.seoTitle), seoDesc: n(data.seoDesc),
        order: (agg._max.order ?? 0) + 1,
        ...(data.features?.length && {
          features: { create: data.features.filter(f => f.text.trim()).map((f, i) => ({ type: f.type, text: f.text, order: i })) },
        }),
      },
    })
    await syncMediaUsage("platform", platform.id, platform.name, `/platformlar/${platform.slug}`, {
      logo: platform.logo, ogImage: platform.ogImage,
    })
    revalidatePath("/panel/platformlar")
    revalidatePath("/platformlar")
    return { success: true, data: { slug: platform.slug } }
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2002") return { success: false, error: "Bu slug zaten kullanımda" }
    return { success: false, error: (e as Error).message }
  }
}

export async function updatePlatform(id: string, data: PlatformInput): Promise<ActionResult<{ slug: string }>> {
  const session = await auth()
  if (!session?.user || session.user.role === "VIEWER") return { success: false, error: "Yetkisiz erişim" }

  try {
    await prisma.platformFeature.deleteMany({ where: { platformId: id } })
    const platform = await prisma.platform.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        url: n(data.url),
        category: n(data.category),
        shortDesc: n(data.shortDesc),
        description: n(data.description),
        logo: n(data.logo),
        logoColor: n(data.logoColor),
        pricing: n(data.pricing),
        featured: data.featured ?? false,
        status: (data.status ?? "DRAFT") as "DRAFT" | "PUBLISHED",
        ctaLabel: n(data.ctaLabel), ctaUrl: n(data.ctaUrl),
        ctaLabel2: n(data.ctaLabel2), ctaUrl2: n(data.ctaUrl2),
        ogImage: n(data.ogImage),
        seoTitle: n(data.seoTitle), seoDesc: n(data.seoDesc),
        ...(data.features?.length && {
          features: { create: data.features.filter(f => f.text.trim()).map((f, i) => ({ type: f.type, text: f.text, order: i })) },
        }),
      },
    })
    await syncMediaUsage("platform", platform.id, platform.name, `/platformlar/${platform.slug}`, {
      logo: platform.logo, ogImage: platform.ogImage,
    })
    revalidatePath("/panel/platformlar")
    revalidatePath(`/panel/platformlar/${platform.slug}`)
    revalidatePath("/platformlar")
    return { success: true, data: { slug: platform.slug } }
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2002") return { success: false, error: "Bu slug zaten kullanımda" }
    return { success: false, error: (e as Error).message }
  }
}

export async function deletePlatform(id: string): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") return { success: false, error: "Yetkisiz erişim" }
  try {
    await prisma.platform.delete({ where: { id } })
    await prisma.mediaUsage.deleteMany({ where: { entityType: "platform", entityId: id } })
    revalidatePath("/panel/platformlar")
    revalidatePath("/platformlar")
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: (e as Error).message }
  }
}

export async function reorderPlatforms(orderedIds: string[]): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user || session.user.role === "VIEWER") return { success: false, error: "Yetkisiz erişim" }
  try {
    await Promise.all(orderedIds.map((id, i) => prisma.platform.update({ where: { id }, data: { order: i } })))
    revalidatePath("/panel/platformlar")
    revalidatePath("/platformlar")
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: (e as Error).message }
  }
}

export async function getPublishedPlatforms(): Promise<PlatformWithFeatures[]> {
  return prisma.platform.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { order: "asc" },
    include: { features: { orderBy: { order: "asc" } } },
  })
}

export async function togglePlatformStatus(id: string, current: string): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user || session.user.role === "VIEWER") return { success: false, error: "Yetkisiz erişim" }
  try {
    await prisma.platform.update({
      where: { id },
      data: { status: current === "PUBLISHED" ? "DRAFT" : "PUBLISHED" },
    })
    revalidatePath("/panel/platformlar")
    revalidatePath("/platformlar")
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: (e as Error).message }
  }
}
