"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import type { ActionResult, PaginatedResult } from "@/types/cms"
import type { Solution, SolutionFeature } from "@prisma/client"

export type SolutionWithFeatures = Solution & { features: SolutionFeature[] }

type FeatureInput = { type: "ADVANTAGE" | "DISADVANTAGE"; text: string; order: number }
type SolutionInput = {
  title: string
  slug: string
  icon?: string | null
  color?: string | null
  category?: string | null
  shortDesc?: string | null
  content?: string | null
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

export async function getSolutions(
  page = 1, pageSize = 50, search = ""
): Promise<PaginatedResult<Solution>> {
  const where = search ? { title: { contains: search, mode: "insensitive" as const } } : {}
  const [data, total] = await Promise.all([
    prisma.solution.findMany({ where, orderBy: { order: "asc" }, skip: (page - 1) * pageSize, take: pageSize }),
    prisma.solution.count({ where }),
  ])
  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
}

export async function getSolution(slug: string): Promise<SolutionWithFeatures | null> {
  return prisma.solution.findUnique({
    where: { slug },
    include: { features: { orderBy: { order: "asc" } } },
  })
}

export async function getPublishedSolutions(): Promise<SolutionWithFeatures[]> {
  return prisma.solution.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { order: "asc" },
    include: { features: { orderBy: { order: "asc" } } },
  })
}

export async function createSolution(data: SolutionInput): Promise<ActionResult<{ slug: string }>> {
  const session = await auth()
  if (!session?.user || session.user.role === "VIEWER") return { success: false, error: "Yetkisiz erişim" }
  try {
    const agg = await prisma.solution.aggregate({ _max: { order: true } })
    const solution = await prisma.solution.create({
      data: {
        title: data.title,
        slug: data.slug,
        icon: n(data.icon),
        color: n(data.color),
        category: n(data.category),
        shortDesc: n(data.shortDesc),
        content: n(data.content),
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
    revalidatePath("/panel/cozumler")
    revalidatePath("/cozumler")
    return { success: true, data: { slug: solution.slug } }
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2002") return { success: false, error: "Bu slug zaten kullanımda" }
    return { success: false, error: (e as Error).message }
  }
}

export async function updateSolution(id: string, data: SolutionInput): Promise<ActionResult<{ slug: string }>> {
  const session = await auth()
  if (!session?.user || session.user.role === "VIEWER") return { success: false, error: "Yetkisiz erişim" }
  try {
    await prisma.solutionFeature.deleteMany({ where: { solutionId: id } })
    const solution = await prisma.solution.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        icon: n(data.icon),
        color: n(data.color),
        category: n(data.category),
        shortDesc: n(data.shortDesc),
        content: n(data.content),
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
    revalidatePath("/panel/cozumler")
    revalidatePath(`/panel/cozumler/${solution.slug}`)
    revalidatePath("/cozumler")
    return { success: true, data: { slug: solution.slug } }
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2002") return { success: false, error: "Bu slug zaten kullanımda" }
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteSolution(id: string): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") return { success: false, error: "Yetkisiz erişim" }
  try {
    await prisma.solution.delete({ where: { id } })
    revalidatePath("/panel/cozumler")
    revalidatePath("/cozumler")
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: (e as Error).message }
  }
}

export async function reorderSolutions(orderedIds: string[]): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user || session.user.role === "VIEWER") return { success: false, error: "Yetkisiz erişim" }
  try {
    await Promise.all(orderedIds.map((id, i) => prisma.solution.update({ where: { id }, data: { order: i } })))
    revalidatePath("/panel/cozumler")
    revalidatePath("/cozumler")
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: (e as Error).message }
  }
}

export async function toggleSolutionStatus(id: string, current: string): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user || session.user.role === "VIEWER") return { success: false, error: "Yetkisiz erişim" }
  try {
    await prisma.solution.update({
      where: { id },
      data: { status: current === "PUBLISHED" ? "DRAFT" : "PUBLISHED" },
    })
    revalidatePath("/panel/cozumler")
    revalidatePath("/cozumler")
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: (e as Error).message }
  }
}
