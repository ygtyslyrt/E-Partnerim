"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { leadStatusMeta, LEAD_STATUSES } from "@/lib/constants/crm"
import type {
  ActionResult, PaginatedResult, LeadFilters, LeadListItem,
  LeadKanbanColumn, LeadCard, AssignableUser, LeadDetail,
} from "@/types/cms"
import type { Prisma, LeadStatus, Priority, LeadSource, ActivityType } from "@prisma/client"

function n(v?: string | null) {
  return v?.trim() || null
}

async function logActivity(leadId: string, type: ActivityType, title: string, detail?: string | null) {
  await prisma.leadActivity.create({ data: { leadId, type, title, detail: detail ?? null } })
}

function buildWhere(filters: Omit<LeadFilters, "page" | "pageSize">): Prisma.LeadWhereInput {
  const { search, status, priority, source, assignedToId } = filters
  const where: Prisma.LeadWhereInput = {}
  if (search?.trim()) {
    where.OR = [
      { name: { contains: search.trim(), mode: "insensitive" } },
      { email: { contains: search.trim(), mode: "insensitive" } },
      { phone: { contains: search.trim(), mode: "insensitive" } },
      { company: { contains: search.trim(), mode: "insensitive" } },
    ]
  }
  if (status) where.status = status as LeadStatus
  if (priority) where.priority = priority as Priority
  if (source) where.source = source as LeadSource
  if (assignedToId === "unassigned") where.assignedToId = null
  else if (assignedToId) where.assignedToId = assignedToId
  return where
}

const listSelect = {
  id: true, name: true, email: true, phone: true, company: true,
  status: true, priority: true, source: true, sector: true,
  nextFollowUp: true, createdAt: true, updatedAt: true,
  assignedTo: { select: { id: true, name: true, avatar: true } },
  tags: { select: { id: true, name: true, color: true } },
  _count: { select: { tasks: { where: { completed: false } } } },
}

// ── Sorgular ──────────────────────────────────────────────────────────────

export async function getLeads(filters: LeadFilters = {}): Promise<PaginatedResult<LeadListItem>> {
  const { page = 1, pageSize = 20 } = filters
  const where = buildWhere(filters)

  const [rows, total] = await Promise.all([
    prisma.lead.findMany({
      where, select: listSelect,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize, take: pageSize,
    }),
    prisma.lead.count({ where }),
  ])

  const data: LeadListItem[] = rows.map((r) => ({
    id: r.id, name: r.name, email: r.email, phone: r.phone, company: r.company,
    status: r.status, priority: r.priority, source: r.source, sector: r.sector,
    nextFollowUp: r.nextFollowUp, createdAt: r.createdAt, updatedAt: r.updatedAt,
    assignedTo: r.assignedTo, tags: r.tags, openTaskCount: r._count.tasks,
  }))

  return { data, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) }
}

export async function getLeadsKanban(
  filters: Omit<LeadFilters, "status" | "page" | "pageSize"> = {}
): Promise<LeadKanbanColumn[]> {
  const where = buildWhere(filters)

  const leads = await prisma.lead.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true, name: true, company: true, source: true, priority: true,
      sector: true, budget: true, createdAt: true, status: true,
      assignedTo: { select: { id: true, name: true, avatar: true } },
      tags: { select: { id: true, name: true, color: true } },
    },
  })

  return LEAD_STATUSES.map((s) => {
    const columnLeads: LeadCard[] = leads
      .filter((l) => l.status === s.value)
      .map((l) => ({
        id: l.id, name: l.name, company: l.company, source: l.source, priority: l.priority,
        sector: l.sector, budget: l.budget, createdAt: l.createdAt,
        assignedTo: l.assignedTo, tags: l.tags,
      }))
    return { status: s.value, label: s.label, color: s.color, dot: s.dot, leads: columnLeads }
  })
}

export async function getLead(id: string): Promise<LeadDetail | null> {
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      assignedTo: { select: { id: true, name: true, avatar: true } },
      tags: { select: { id: true, name: true, color: true } },
      notes: { orderBy: { createdAt: "desc" }, include: { author: { select: { id: true, name: true, avatar: true } } } },
      activities: { orderBy: { createdAt: "desc" } },
      tasks: {
        orderBy: [{ completed: "asc" }, { dueDate: "asc" }],
        include: { assignedTo: { select: { id: true, name: true, avatar: true } } },
      },
      contactForms: { select: { id: true, message: true, createdAt: true }, orderBy: { createdAt: "desc" } },
      consultingForms: { select: { id: true, message: true, createdAt: true }, orderBy: { createdAt: "desc" } },
      partnerixForms: { select: { id: true, sector: true, budget: true, createdAt: true }, orderBy: { createdAt: "desc" } },
      _count: { select: { tasks: { where: { completed: false } } } },
    },
  })
  if (!lead) return null

  return {
    id: lead.id, name: lead.name, email: lead.email, phone: lead.phone, company: lead.company,
    status: lead.status, priority: lead.priority, source: lead.source, sector: lead.sector,
    nextFollowUp: lead.nextFollowUp, createdAt: lead.createdAt, updatedAt: lead.updatedAt,
    assignedTo: lead.assignedTo, tags: lead.tags, openTaskCount: lead._count.tasks,
    website: lead.website, budget: lead.budget, timeline: lead.timeline, services: lead.services,
    notes: lead.notes, activities: lead.activities, tasks: lead.tasks,
    contactForms: lead.contactForms, consultingForms: lead.consultingForms, partnerixForms: lead.partnerixForms,
  }
}

export async function getAssignableUsers(): Promise<AssignableUser[]> {
  return prisma.user.findMany({
    where: { active: true },
    select: { id: true, name: true, email: true, avatar: true, role: true },
    orderBy: { name: "asc" },
  })
}

export async function getUpcomingLeadTasks(limit = 8) {
  return prisma.leadTask.findMany({
    where: { completed: false, dueDate: { not: null } },
    orderBy: { dueDate: "asc" },
    take: limit,
    include: {
      lead: { select: { id: true, name: true, company: true } },
      assignedTo: { select: { id: true, name: true, avatar: true } },
    },
  })
}

// ── Lead mutasyonları ─────────────────────────────────────────────────────

export interface LeadInput {
  name: string
  email?: string | null
  phone?: string | null
  company?: string | null
  website?: string | null
  status?: string
  priority?: string
  source?: string
  sector?: string | null
  budget?: string | null
  timeline?: string | null
  assignedToId?: string | null
  nextFollowUp?: string | null
}

export async function createLead(data: LeadInput): Promise<ActionResult<{ id: string }>> {
  const session = await auth()
  if (!session?.user || session.user.role === "VIEWER") return { success: false, error: "Yetkisiz erişim" }
  if (!data.name?.trim()) return { success: false, error: "İsim zorunludur" }

  try {
    const lead = await prisma.lead.create({
      data: {
        name: data.name.trim(),
        email: n(data.email), phone: n(data.phone), company: n(data.company), website: n(data.website),
        status: (data.status as LeadStatus) ?? "NEW",
        priority: (data.priority as Priority) ?? "MEDIUM",
        source: (data.source as LeadSource) ?? "MANUAL",
        sector: n(data.sector), budget: n(data.budget), timeline: n(data.timeline),
        assignedToId: data.assignedToId || null,
        nextFollowUp: data.nextFollowUp ? new Date(data.nextFollowUp) : null,
      },
    })
    await logActivity(lead.id, "CREATED", "Lead manuel olarak oluşturuldu")
    revalidatePath("/panel/crm")
    return { success: true, data: { id: lead.id } }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function updateLead(id: string, data: LeadInput): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user || session.user.role === "VIEWER") return { success: false, error: "Yetkisiz erişim" }
  if (!data.name?.trim()) return { success: false, error: "İsim zorunludur" }

  try {
    await prisma.lead.update({
      where: { id },
      data: {
        name: data.name.trim(),
        email: n(data.email), phone: n(data.phone), company: n(data.company), website: n(data.website),
        sector: n(data.sector), budget: n(data.budget), timeline: n(data.timeline),
        nextFollowUp: data.nextFollowUp ? new Date(data.nextFollowUp) : null,
      },
    })
    revalidatePath("/panel/crm")
    revalidatePath(`/panel/crm/${id}`)
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function updateLeadStatus(id: string, status: string): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user || session.user.role === "VIEWER") return { success: false, error: "Yetkisiz erişim" }

  try {
    const prev = await prisma.lead.findUnique({ where: { id }, select: { status: true } })
    if (!prev) return { success: false, error: "Lead bulunamadı" }

    if (prev.status !== status) {
      await prisma.lead.update({ where: { id }, data: { status: status as LeadStatus } })
      await logActivity(
        id, "STATUS_CHANGED", "Durum değiştirildi",
        `${leadStatusMeta(prev.status).label} → ${leadStatusMeta(status).label}`
      )
    }
    revalidatePath("/panel/crm")
    revalidatePath(`/panel/crm/${id}`)
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function updateLeadPriority(id: string, priority: string): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user || session.user.role === "VIEWER") return { success: false, error: "Yetkisiz erişim" }
  try {
    await prisma.lead.update({ where: { id }, data: { priority: priority as Priority } })
    revalidatePath("/panel/crm")
    revalidatePath(`/panel/crm/${id}`)
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function assignLead(id: string, userId: string | null): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user || session.user.role === "VIEWER") return { success: false, error: "Yetkisiz erişim" }

  try {
    await prisma.lead.update({ where: { id }, data: { assignedToId: userId } })
    let detail = "Atama kaldırıldı"
    if (userId) {
      const u = await prisma.user.findUnique({ where: { id: userId }, select: { name: true } })
      detail = u ? `${u.name} kişisine atandı` : detail
    }
    await logActivity(id, "ASSIGNED", "Atama güncellendi", detail)
    revalidatePath("/panel/crm")
    revalidatePath(`/panel/crm/${id}`)
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteLead(id: string): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") return { success: false, error: "Yetkisiz erişim" }
  try {
    await prisma.lead.delete({ where: { id } })
    revalidatePath("/panel/crm")
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

// ── Notlar ────────────────────────────────────────────────────────────────

export async function addLeadNote(leadId: string, content: string): Promise<ActionResult<{ id: string }>> {
  const session = await auth()
  if (!session?.user) return { success: false, error: "Yetkisiz erişim" }
  if (!content.trim()) return { success: false, error: "Not boş olamaz" }

  try {
    const note = await prisma.leadNote.create({ data: { leadId, content: content.trim(), authorId: session.user.id } })
    await logActivity(leadId, "NOTE_ADDED", "Not eklendi")
    revalidatePath(`/panel/crm/${leadId}`)
    return { success: true, data: { id: note.id } }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteLeadNote(id: string, leadId: string): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user) return { success: false, error: "Yetkisiz erişim" }

  try {
    const note = await prisma.leadNote.findUnique({ where: { id } })
    if (!note) return { success: false, error: "Not bulunamadı" }
    if (note.authorId !== session.user.id && session.user.role !== "ADMIN") {
      return { success: false, error: "Sadece kendi notunuzu silebilirsiniz" }
    }
    await prisma.leadNote.delete({ where: { id } })
    revalidatePath(`/panel/crm/${leadId}`)
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

// ── Görevler & Hatırlatmalar ──────────────────────────────────────────────

export interface LeadTaskInput {
  title: string
  description?: string | null
  dueDate?: string | null
  assignedToId?: string | null
}

export async function createLeadTask(leadId: string, data: LeadTaskInput): Promise<ActionResult<{ id: string }>> {
  const session = await auth()
  if (!session?.user) return { success: false, error: "Yetkisiz erişim" }
  if (!data.title?.trim()) return { success: false, error: "Başlık zorunludur" }

  try {
    const task = await prisma.leadTask.create({
      data: {
        leadId, title: data.title.trim(), description: n(data.description),
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        assignedToId: data.assignedToId || null,
      },
    })
    await logActivity(leadId, "TASK_CREATED", `Görev oluşturuldu: ${data.title.trim()}`)
    revalidatePath(`/panel/crm/${leadId}`)
    revalidatePath("/panel/crm")
    return { success: true, data: { id: task.id } }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function toggleLeadTask(id: string, leadId: string, completed: boolean): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user) return { success: false, error: "Yetkisiz erişim" }

  try {
    const task = await prisma.leadTask.update({
      where: { id },
      data: { completed, completedAt: completed ? new Date() : null },
    })
    if (completed) await logActivity(leadId, "TASK_COMPLETED", `Görev tamamlandı: ${task.title}`)
    revalidatePath(`/panel/crm/${leadId}`)
    revalidatePath("/panel/crm")
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteLeadTask(id: string, leadId: string): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user) return { success: false, error: "Yetkisiz erişim" }
  try {
    await prisma.leadTask.delete({ where: { id } })
    revalidatePath(`/panel/crm/${leadId}`)
    revalidatePath("/panel/crm")
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

// ── Etiketler ─────────────────────────────────────────────────────────────

export async function addLeadTag(leadId: string, name: string, color = "#6366F1"): Promise<ActionResult<{ id: string }>> {
  const session = await auth()
  if (!session?.user) return { success: false, error: "Yetkisiz erişim" }
  if (!name.trim()) return { success: false, error: "Etiket adı boş olamaz" }

  try {
    const tag = await prisma.leadTag.create({ data: { leadId, name: name.trim(), color } })
    revalidatePath(`/panel/crm/${leadId}`)
    revalidatePath("/panel/crm")
    return { success: true, data: { id: tag.id } }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function removeLeadTag(id: string, leadId: string): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user) return { success: false, error: "Yetkisiz erişim" }
  try {
    await prisma.leadTag.delete({ where: { id } })
    revalidatePath(`/panel/crm/${leadId}`)
    revalidatePath("/panel/crm")
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

// ── Dış kaynaklardan otomatik lead oluşturma (form/partnerix action'ları kullanır) ──

export interface LeadSubmissionInput {
  name: string
  email?: string | null
  phone?: string | null
  company?: string | null
  source: LeadSource
  sector?: string | null
  budget?: string | null
  timeline?: string | null
  activityType?: ActivityType
  activityTitle: string
  activityDetail?: string | null
}

/**
 * Aynı e-posta/telefona sahip açık bir lead varsa onu günceller, yoksa yeni lead oluşturur.
 * WON/LOST kapanmış lead'lerle eşleştirmez — yeni bir fırsat olarak yeni lead açar.
 */
export async function findOrCreateLeadFromSubmission(input: LeadSubmissionInput): Promise<string> {
  const email = n(input.email)
  const phone = n(input.phone)

  let existing = null
  if (email || phone) {
    existing = await prisma.lead.findFirst({
      where: {
        status: { notIn: ["WON", "LOST"] },
        OR: [
          ...(email ? [{ email }] : []),
          ...(phone ? [{ phone }] : []),
        ],
      },
      orderBy: { createdAt: "desc" },
    })
  }

  if (existing) {
    await prisma.lead.update({
      where: { id: existing.id },
      data: {
        company: existing.company ?? n(input.company),
        sector: existing.sector ?? n(input.sector),
        budget: existing.budget ?? n(input.budget),
        timeline: existing.timeline ?? n(input.timeline),
      },
    })
    await logActivity(existing.id, input.activityType ?? "FORM_SUBMITTED", input.activityTitle, input.activityDetail)
    return existing.id
  }

  const lead = await prisma.lead.create({
    data: {
      name: input.name.trim(),
      email, phone, company: n(input.company),
      source: input.source,
      sector: n(input.sector), budget: n(input.budget), timeline: n(input.timeline),
    },
  })
  await logActivity(lead.id, "CREATED", "Lead otomatik oluşturuldu")
  await logActivity(lead.id, input.activityType ?? "FORM_SUBMITTED", input.activityTitle, input.activityDetail)
  return lead.id
}
