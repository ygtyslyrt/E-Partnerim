"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { findOrCreateLeadFromSubmission } from "@/lib/actions/leads"
import type { ActionResult } from "@/types/cms"

function n(v?: string | null) {
  return v?.trim() || null
}

export interface ContactFormInput {
  name: string
  email: string
  phone?: string
  company?: string
  message: string
}

// Herkese açık — auth gerektirmez
export async function createContactForm(data: ContactFormInput): Promise<ActionResult> {
  if (!data.name?.trim() || !data.email?.trim() || !data.message?.trim()) {
    return { success: false, error: "İsim, e-posta ve mesaj zorunludur" }
  }
  try {
    const leadId = await findOrCreateLeadFromSubmission({
      name: data.name, email: data.email, phone: data.phone, company: data.company,
      source: "CONTACT_FORM",
      activityTitle: "İletişim formu gönderildi",
      activityDetail: data.message.trim().slice(0, 200),
    })

    await prisma.contactForm.create({
      data: {
        name: data.name.trim(), email: data.email.trim(), phone: n(data.phone),
        company: n(data.company), message: data.message.trim(), leadId,
      },
    })

    revalidatePath("/panel/formlar")
    revalidatePath("/panel/crm")
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export interface ConsultingFormInput {
  name: string
  email: string
  phone?: string
  company?: string
  website?: string
  budget?: string
  timeline?: string
  services?: string[]
  message?: string
}

// Herkese açık — auth gerektirmez
export async function createConsultingForm(data: ConsultingFormInput): Promise<ActionResult> {
  if (!data.name?.trim() || !data.email?.trim()) {
    return { success: false, error: "İsim ve e-posta zorunludur" }
  }
  try {
    const leadId = await findOrCreateLeadFromSubmission({
      name: data.name, email: data.email, phone: data.phone, company: data.company,
      budget: data.budget, timeline: data.timeline,
      source: "CONSULTING",
      activityTitle: "Danışmanlık talebi gönderildi",
      activityDetail: data.message?.trim().slice(0, 200) || null,
    })

    await prisma.consultingForm.create({
      data: {
        name: data.name.trim(), email: data.email.trim(), phone: n(data.phone),
        company: n(data.company), website: n(data.website), budget: n(data.budget),
        timeline: n(data.timeline), services: data.services?.length ? data.services : undefined,
        message: n(data.message), leadId,
      },
    })

    revalidatePath("/panel/formlar")
    revalidatePath("/panel/crm")
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function getContactForms(page = 1, pageSize = 20) {
  const [data, total] = await Promise.all([
    prisma.contactForm.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.contactForm.count(),
  ])
  return { data, total }
}

export async function getConsultingForms(page = 1, pageSize = 20) {
  const [data, total] = await Promise.all([
    prisma.consultingForm.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.consultingForm.count(),
  ])
  return { data, total }
}

export async function markFormRead(
  type: "contact" | "consulting",
  id: string
): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user) return { success: false, error: "Yetkisiz" }

  try {
    if (type === "contact") {
      await prisma.contactForm.update({ where: { id }, data: { status: "READ" } })
    } else {
      await prisma.consultingForm.update({ where: { id }, data: { status: "READ" } })
    }
    revalidatePath("/panel/formlar")
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function getNewsletterSubscribers() {
  return prisma.newsletterSubscriber.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  })
}
