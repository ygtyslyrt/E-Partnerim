"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import type { ActionResult } from "@/types/cms"
import type { PartnerApplication } from "@prisma/client"

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

async function uniquePartnerSlug(base: string): Promise<string> {
  const root = slugify(base) || "partner"
  let slug = root
  let i = 1
  while (await prisma.partner.findUnique({ where: { slug } })) {
    i++
    slug = `${root}-${i}`
  }
  return slug
}

export interface PartnerApplicationInput {
  companyName: string
  contactName: string
  email: string
  phone?: string
  website?: string
  category?: string
  shortDesc?: string
  message?: string
  interestedPlatformIds?: string[]
  interestedSolutionIds?: string[]
}

// Herkese açık — auth gerektirmez
export async function createPartnerApplication(data: PartnerApplicationInput): Promise<ActionResult<{ id: string }>> {
  if (!data.companyName?.trim() || !data.contactName?.trim() || !data.email?.trim()) {
    return { success: false, error: "Firma adı, iletişim kişisi ve e-posta zorunludur" }
  }
  try {
    const lead = await prisma.lead.create({
      data: {
        name: data.contactName.trim(),
        email: data.email.trim(),
        phone: data.phone?.trim() || null,
        company: data.companyName.trim(),
        website: data.website?.trim() || null,
        source: "PARTNER_APPLICATION",
        sector: data.category?.trim() || null,
      },
    })

    const application = await prisma.partnerApplication.create({
      data: {
        companyName: data.companyName.trim(),
        contactName: data.contactName.trim(),
        email: data.email.trim(),
        phone: data.phone?.trim() || null,
        website: data.website?.trim() || null,
        category: data.category?.trim() || null,
        shortDesc: data.shortDesc?.trim() || null,
        message: data.message?.trim() || null,
        interestedPlatforms: data.interestedPlatformIds?.length ? data.interestedPlatformIds : undefined,
        interestedSolutions: data.interestedSolutionIds?.length ? data.interestedSolutionIds : undefined,
        leadId: lead.id,
      },
    })

    revalidatePath("/panel/partnerler/basvurular")
    return { success: true, data: { id: application.id } }
  } catch (e: unknown) {
    return { success: false, error: (e as Error).message }
  }
}

export async function getPartnerApplications(status?: "PENDING" | "APPROVED" | "REJECTED"): Promise<PartnerApplication[]> {
  const session = await auth()
  if (!session?.user) return []
  return prisma.partnerApplication.findMany({
    where: status ? { status } : {},
    orderBy: { createdAt: "desc" },
  })
}

export async function approvePartnerApplication(id: string): Promise<ActionResult<{ slug: string }>> {
  const session = await auth()
  if (!session?.user || session.user.role === "VIEWER") return { success: false, error: "Yetkisiz erişim" }

  try {
    const app = await prisma.partnerApplication.findUnique({ where: { id } })
    if (!app) return { success: false, error: "Başvuru bulunamadı" }
    if (app.status !== "PENDING") return { success: false, error: "Bu başvuru zaten işlendi" }

    const slug = await uniquePartnerSlug(app.companyName)
    const platformIds = Array.isArray(app.interestedPlatforms) ? (app.interestedPlatforms as string[]) : []
    const solutionIds = Array.isArray(app.interestedSolutions) ? (app.interestedSolutions as string[]) : []
    const agg = await prisma.partner.aggregate({ _max: { order: true } })

    const partner = await prisma.partner.create({
      data: {
        name: app.companyName,
        slug,
        shortDesc: app.shortDesc,
        description: app.message,
        website: app.website,
        email: app.email,
        phone: app.phone,
        category: app.category,
        status: "DRAFT",
        order: (agg._max.order ?? 0) + 1,
        platforms: platformIds.length ? { create: platformIds.map((platformId) => ({ platformId })) } : undefined,
        solutions: solutionIds.length ? { create: solutionIds.map((solutionId) => ({ solutionId })) } : undefined,
      },
    })

    await prisma.partnerApplication.update({
      where: { id },
      data: { status: "APPROVED", reviewedAt: new Date(), reviewedById: session.user.id },
    })

    revalidatePath("/panel/partnerler")
    revalidatePath("/panel/partnerler/basvurular")
    return { success: true, data: { slug: partner.slug } }
  } catch (e: unknown) {
    return { success: false, error: (e as Error).message }
  }
}

export async function rejectPartnerApplication(id: string, note?: string): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user || session.user.role === "VIEWER") return { success: false, error: "Yetkisiz erişim" }
  try {
    await prisma.partnerApplication.update({
      where: { id },
      data: { status: "REJECTED", reviewNote: note?.trim() || null, reviewedAt: new Date(), reviewedById: session.user.id },
    })
    revalidatePath("/panel/partnerler/basvurular")
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: (e as Error).message }
  }
}
