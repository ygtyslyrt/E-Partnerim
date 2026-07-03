"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import type { ActionResult } from "@/types/cms"

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
