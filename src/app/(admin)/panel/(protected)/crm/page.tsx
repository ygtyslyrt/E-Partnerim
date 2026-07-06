import Link from "next/link"
import { PlusCircle, Users2 } from "lucide-react"
import { getLeads, getLeadsKanban, getAssignableUsers } from "@/lib/actions/leads"
import CrmFilterBar from "@/components/admin/crm/CrmFilterBar"
import LeadsTable from "@/components/admin/crm/LeadsTable"
import LeadsKanban from "@/components/admin/crm/LeadsKanban"
import type { Metadata } from "next"
import type { LeadStatusType, PriorityType, LeadSourceType } from "@/types/cms"

export const metadata: Metadata = { title: "CRM / Leads" }

interface CrmSearchParams {
  q?: string
  status?: string
  priority?: string
  source?: string
  assigned?: string
  view?: string
  page?: string
}

export default async function CrmPage({
  searchParams,
}: {
  searchParams: Promise<CrmSearchParams>
}) {
  const params = await searchParams
  const view = params.view === "kanban" ? "kanban" : "list"
  const page = Number(params.page ?? 1)

  const filters = {
    search: params.q || undefined,
    status: (params.status as LeadStatusType) || undefined,
    priority: (params.priority as PriorityType) || undefined,
    source: (params.source as LeadSourceType) || undefined,
    assignedToId: params.assigned || undefined,
  }

  const [users, listResult, kanbanColumns] = await Promise.all([
    getAssignableUsers(),
    view === "list" ? getLeads({ ...filters, page, pageSize: 20 }) : Promise.resolve(null),
    view === "kanban" ? getLeadsKanban(filters) : Promise.resolve(null),
  ])

  function pageHref(p: number) {
    const sp = new URLSearchParams()
    if (params.q) sp.set("q", params.q)
    if (params.status) sp.set("status", params.status)
    if (params.priority) sp.set("priority", params.priority)
    if (params.source) sp.set("source", params.source)
    if (params.assigned) sp.set("assigned", params.assigned)
    if (params.view) sp.set("view", params.view)
    sp.set("page", String(p))
    return `?${sp.toString()}`
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">CRM / Leads</h1>
          <p className="mt-1 text-sm text-slate-500">
            {view === "list" && listResult ? `${listResult.total} lead` : "Pipeline görünümü"}
          </p>
        </div>
        <Link
          href="/panel/crm/yeni"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#3730A3] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#312E8A] transition"
        >
          <PlusCircle size={16} />
          Yeni Lead
        </Link>
      </div>

      <CrmFilterBar users={users} view={view} />

      {view === "list" && listResult ? (
        listResult.data.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[#E4EAF5] py-20 text-center">
            <Users2 size={32} className="text-slate-300" />
            <p className="text-sm text-slate-500">Henüz lead bulunamadı.</p>
            <Link href="/panel/crm/yeni" className="text-sm font-medium text-[#3730A3] hover:underline">
              İlk lead&apos;i manuel ekle
            </Link>
          </div>
        ) : (
          <>
            <LeadsTable leads={listResult.data} users={users} />
            {listResult.totalPages > 1 && (
              <div className="flex items-center justify-between px-1">
                <span className="text-xs text-slate-400">Sayfa {page} / {listResult.totalPages}</span>
                <div className="flex gap-2">
                  {page > 1 && (
                    <Link href={pageHref(page - 1)} className="rounded-lg border border-[#E4EAF5] bg-white px-3 py-1 text-xs text-slate-600 hover:bg-slate-50">
                      ← Önceki
                    </Link>
                  )}
                  {page < listResult.totalPages && (
                    <Link href={pageHref(page + 1)} className="rounded-lg border border-[#E4EAF5] bg-white px-3 py-1 text-xs text-slate-600 hover:bg-slate-50">
                      Sonraki →
                    </Link>
                  )}
                </div>
              </div>
            )}
          </>
        )
      ) : kanbanColumns ? (
        <LeadsKanban columns={kanbanColumns} />
      ) : null}
    </div>
  )
}
