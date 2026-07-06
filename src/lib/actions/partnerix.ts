"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { findOrCreateLeadFromSubmission } from "@/lib/actions/leads"
import type { ActionResult } from "@/types/cms"

export interface PartnerixCompletionInput {
  name: string
  phone: string
  email?: string
  sector?: string
  orderVolume?: string
  support?: string
  platform?: string
  budget?: string
  timeline?: string
  answers?: Record<string, string>
}

// Herkese açık — ana sayfadaki Partnerix sohbeti tamamlandığında çağrılır
export async function completePartnerixSession(input: PartnerixCompletionInput): Promise<ActionResult> {
  if (!input.name?.trim() || !input.phone?.trim()) {
    return { success: false, error: "İsim ve telefon zorunludur" }
  }
  try {
    const flow = await prisma.partnerixFlow.findFirst({ orderBy: { createdAt: "asc" }, select: { id: true } })
    if (!flow) return { success: false, error: "Partnerix akışı bulunamadı" }

    const leadId = await findOrCreateLeadFromSubmission({
      name: input.name, phone: input.phone, email: input.email,
      sector: input.sector, budget: input.budget, timeline: input.timeline,
      source: "PARTNERIX",
      activityType: "PARTNERIX_COMPLETED",
      activityTitle: "Partnerix sohbeti tamamlandı",
      activityDetail: [input.sector, input.support, input.platform].filter(Boolean).join(" · ") || null,
    })

    const partnerixSession = await prisma.partnerixSession.create({
      data: {
        flowId: flow.id,
        completedAt: new Date(),
        answers: input.answers ?? undefined,
        converted: true,
        leadId,
      },
    })

    await prisma.partnerixForm.create({
      data: {
        flowId: flow.id, sessionId: partnerixSession.id,
        sector: input.sector ?? null, orderVolume: input.orderVolume ?? null,
        support: input.support ?? null, platform: input.platform ?? null,
        budget: input.budget ?? null, timeline: input.timeline ?? null,
        name: input.name.trim(), email: input.email ?? null, phone: input.phone.trim(),
        leadId,
      },
    })

    revalidatePath("/panel/formlar")
    revalidatePath("/panel/crm")
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function getPartnerixFlow() {
  return prisma.partnerixFlow.findFirst({
    orderBy: { createdAt: "asc" },
    include: {
      bubbles: { orderBy: { order: "asc" } },
      steps: {
        orderBy: { order: "asc" },
        include: {
          options: {
            orderBy: { order: "asc" },
            include: {
              platformScores: { include: { platform: { select: { id: true, name: true } } } },
              solutionScores: { include: { solution: { select: { id: true, title: true } } } },
            },
          },
        },
      },
      results: {
        include: {
          recommendedPlatforms: { include: { platform: { select: { id: true, name: true } } } },
          recommendedSolutions: { include: { solution: { select: { id: true, title: true } } } },
          recommendedPartners: { include: { partner: { select: { id: true, name: true } } } },
        },
      },
    },
  })
}

export type PartnerixFlowFull = Awaited<ReturnType<typeof getPartnerixFlow>>

export interface BubbleInput {
  text: string
  delay: number
}

export interface OptionInput {
  label: string
  value: string
  icon?: string | null
  color?: string | null
  resultKey?: string | null
  platformScores: { platformId: string; score: number }[]
  solutionScores: { solutionId: string; score: number }[]
}

export interface StepInput {
  question: string
  options: OptionInput[]
}

export interface ResultInput {
  _key: string
  title: string
  message?: string | null
  ctaText?: string | null
  ctaHref?: string | null
  ctaType?: string
  platformIds: string[]
  solutionIds: string[]
  partnerIds: string[]
}

export interface PartnerixFlowInput {
  name: string
  slug: string
  welcomeMsg?: string | null
  robotImage?: string | null
  active: boolean
  status: string
  bubbles: BubbleInput[]
  steps: StepInput[]
  results: ResultInput[]
}

export async function updatePartnerixFlow(data: PartnerixFlowInput): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user || session.user.role === "VIEWER") return { success: false, error: "Yetkisiz erişim" }

  try {
    const flow = await prisma.partnerixFlow.findFirst({ orderBy: { createdAt: "asc" } })
    if (!flow) return { success: false, error: "Akış bulunamadı" }

    // 1. Seçeneklerin Sonuçlara olan referanslarını temizlemek için önce Adımları (ve Seçenekleri) sil
    await prisma.partnerixStep.deleteMany({ where: { flowId: flow.id } })

    // 2. Artık güvenle Sonuçları silip yeniden oluşturabiliriz
    await prisma.partnerixResult.deleteMany({ where: { flowId: flow.id } })

    const resultKeyToId: Record<string, string> = {}
    for (const r of data.results) {
      const created = await prisma.partnerixResult.create({
        data: {
          flowId: flow.id,
          title: r.title,
          message: r.message?.trim() || null,
          ctaText: r.ctaText?.trim() || null,
          ctaHref: r.ctaHref?.trim() || null,
          ctaType: r.ctaType || "whatsapp",
          recommendedPlatforms: r.platformIds.length ? { create: r.platformIds.map((platformId) => ({ platformId })) } : undefined,
          recommendedSolutions: r.solutionIds.length ? { create: r.solutionIds.map((solutionId) => ({ solutionId })) } : undefined,
          recommendedPartners: r.partnerIds.length ? { create: r.partnerIds.map((partnerId) => ({ partnerId })) } : undefined,
        },
      })
      resultKeyToId[r._key] = created.id
    }

    for (let i = 0; i < data.steps.length; i++) {
      const step = data.steps[i]
      await prisma.partnerixStep.create({
        data: {
          flowId: flow.id,
          question: step.question,
          order: i,
          options: {
            create: step.options.map((o, j) => ({
              label: o.label,
              value: o.value,
              icon: o.icon || null,
              color: o.color || null,
              order: j,
              resultId: o.resultKey ? resultKeyToId[o.resultKey] ?? null : null,
              platformScores: o.platformScores.length
                ? { create: o.platformScores.map((ps) => ({ platformId: ps.platformId, score: ps.score })) }
                : undefined,
              solutionScores: o.solutionScores.length
                ? { create: o.solutionScores.map((ss) => ({ solutionId: ss.solutionId, score: ss.score })) }
                : undefined,
            })),
          },
        },
      })
    }

    await prisma.partnerixBubble.deleteMany({ where: { flowId: flow.id } })
    if (data.bubbles.length) {
      await prisma.partnerixBubble.createMany({
        data: data.bubbles.map((b, i) => ({ flowId: flow.id, text: b.text, delay: b.delay, order: i })),
      })
    }

    await prisma.partnerixFlow.update({
      where: { id: flow.id },
      data: {
        name: data.name,
        slug: data.slug,
        welcomeMsg: data.welcomeMsg?.trim() || null,
        robotImage: data.robotImage?.trim() || null,
        active: data.active,
        status: data.status as "DRAFT" | "PUBLISHED" | "SCHEDULED" | "ARCHIVED",
      },
    })

    revalidatePath("/panel/partnerix")
    return { success: true }
  } catch (e: unknown) {
    return { success: false, error: (e as Error).message }
  }
}
