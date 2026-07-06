import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { getLead, getAssignableUsers } from "@/lib/actions/leads"
import { auth } from "@/lib/auth"
import LeadDetailHeader from "@/components/admin/crm/LeadDetailHeader"
import LeadInfoForm from "@/components/admin/crm/LeadInfoForm"
import LeadNotes from "@/components/admin/crm/LeadNotes"
import LeadActivityTimeline from "@/components/admin/crm/LeadActivityTimeline"
import LeadTasksPanel from "@/components/admin/crm/LeadTasksPanel"
import LeadTagsPanel from "@/components/admin/crm/LeadTagsPanel"
import LeadSourcePanel from "@/components/admin/crm/LeadSourcePanel"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const lead = await getLead(id)
  return { title: lead ? lead.name : "Lead Bulunamadı" }
}

export default async function LeadDetailPage({ params }: Props) {
  const { id } = await params
  const [lead, users, session] = await Promise.all([getLead(id), getAssignableUsers(), auth()])
  if (!lead) notFound()

  const currentUserId = session!.user.id
  const isAdmin = session!.user.role === "ADMIN"

  return (
    <div className="max-w-6xl space-y-5">
      <Link href="/panel/crm" className="flex w-fit items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition">
        <ChevronLeft size={16} />
        CRM / Leads
      </Link>

      <LeadDetailHeader lead={lead} users={users} canDelete={isAdmin} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <LeadInfoForm lead={lead} />
          <LeadNotes leadId={lead.id} initialNotes={lead.notes} currentUserId={currentUserId} isAdmin={isAdmin} />
          <LeadActivityTimeline activities={lead.activities} />
        </div>
        <div className="space-y-5">
          <LeadTagsPanel leadId={lead.id} initialTags={lead.tags} />
          <LeadTasksPanel leadId={lead.id} initialTasks={lead.tasks} users={users} />
          <LeadSourcePanel lead={lead} />
        </div>
      </div>
    </div>
  )
}
