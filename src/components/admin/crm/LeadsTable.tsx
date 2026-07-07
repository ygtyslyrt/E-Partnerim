"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { ClipboardList, ChevronRight } from "lucide-react"
import { updateLeadStatus, assignLead } from "@/lib/actions/leads"
import { LEAD_STATUSES, PRIORITY_META, SOURCE_META, leadStatusMeta } from "@/lib/constants/crm"
import { AssigneeAvatar } from "./LeadCardMini"
import Toast, { type ToastState } from "@/components/admin/shared/Toast"
import type { LeadListItem, AssignableUser } from "@/types/cms"

const SELECT_SM = "rounded-lg border border-transparent bg-transparent px-1.5 py-1 text-xs font-semibold outline-none hover:border-[#E4EAF5] focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition cursor-pointer"

function fmtDate(d: Date | string) {
  return new Date(d).toLocaleDateString("tr-TR", { day: "2-digit", month: "short" })
}

export default function LeadsTable({ leads: initialLeads, users }: { leads: LeadListItem[]; users: AssignableUser[] }) {
  const [leads, setLeads] = useState(initialLeads)
  const [, startTransition] = useTransition()
  const [toast, setToast] = useState<ToastState | null>(null)

  function handleStatusChange(id: string, status: string) {
    const prevLead = leads.find((l) => l.id === id)
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: status as LeadListItem["status"] } : l)))
    startTransition(async () => {
      const result = await updateLeadStatus(id, status)
      if (!result.success) {
        if (prevLead) setLeads((prev) => prev.map((l) => (l.id === id ? prevLead : l)))
        setToast({ message: result.error ?? "Durum güncellenemedi", type: "error" })
      }
    })
  }

  function handleAssignChange(id: string, userId: string) {
    const prevLead = leads.find((l) => l.id === id)
    const user = users.find((u) => u.id === userId) ?? null
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, assignedTo: user } : l)))
    startTransition(async () => {
      const result = await assignLead(id, userId || null)
      if (!result.success) {
        if (prevLead) setLeads((prev) => prev.map((l) => (l.id === id ? prevLead : l)))
        setToast({ message: result.error ?? "Atama güncellenemedi", type: "error" })
      }
    })
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E4EAF5] bg-white">
      {/* Masaüstü tablo */}
      <table className="hidden w-full text-sm md:table">
        <thead>
          <tr className="border-b border-[#E4EAF5] bg-[#F8FAFC]">
            <th className="px-4 py-3 text-left font-medium text-slate-500">Lead</th>
            <th className="px-4 py-3 text-left font-medium text-slate-500">İletişim</th>
            <th className="px-4 py-3 text-left font-medium text-slate-500">Durum</th>
            <th className="px-4 py-3 text-left font-medium text-slate-500">Öncelik</th>
            <th className="px-4 py-3 text-left font-medium text-slate-500">Kaynak</th>
            <th className="px-4 py-3 text-left font-medium text-slate-500">Atanan</th>
            <th className="px-4 py-3 text-left font-medium text-slate-500">Görevler</th>
            <th className="px-4 py-3 text-left font-medium text-slate-500">Tarih</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F1F5F9]">
          {leads.map((lead) => {
            const meta = leadStatusMeta(lead.status)
            return (
              <tr key={lead.id} className="hover:bg-[#F8FAFC] transition-colors">
                <td className="px-4 py-3">
                  <Link href={`/panel/crm/${lead.id}`} className="font-medium text-slate-800 hover:text-[#3730A3]">
                    {lead.name}
                  </Link>
                  {lead.company && <p className="text-xs text-slate-400">{lead.company}</p>}
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  {lead.email && <p className="truncate max-w-[160px]">{lead.email}</p>}
                  {lead.phone && <p className="text-slate-400">{lead.phone}</p>}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={lead.status}
                    onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                    className={`${SELECT_SM} ${meta.color}`}
                  >
                    {LEAD_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${PRIORITY_META[lead.priority].color}`}>
                    {PRIORITY_META[lead.priority].label}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">{SOURCE_META[lead.source].label}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <AssigneeAvatar user={lead.assignedTo} size={20} />
                    <select
                      value={lead.assignedTo?.id ?? ""}
                      onChange={(e) => handleAssignChange(lead.id, e.target.value)}
                      className={`${SELECT_SM} text-slate-600`}
                    >
                      <option value="">Atanmamış</option>
                      {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {lead.openTaskCount > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                      <ClipboardList size={11} />
                      {lead.openTaskCount}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-slate-400">{fmtDate(lead.createdAt)}</td>
                <td className="px-4 py-3">
                  <Link href={`/panel/crm/${lead.id}`} className="flex items-center justify-end text-slate-300 hover:text-slate-600">
                    <ChevronRight size={16} />
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Mobil kart listesi */}
      <div className="divide-y divide-[#F1F5F9] md:hidden">
        {leads.map((lead) => {
          const meta = leadStatusMeta(lead.status)
          return (
            <Link key={lead.id} href={`/panel/crm/${lead.id}`} className="block p-4 hover:bg-[#F8FAFC]">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-800">{lead.name}</p>
                  {lead.company && <p className="truncate text-xs text-slate-400">{lead.company}</p>}
                </div>
                <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${meta.color}`}>
                  {meta.label}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                <span>{SOURCE_META[lead.source].label} · {fmtDate(lead.createdAt)}</span>
                <AssigneeAvatar user={lead.assignedTo} size={20} />
              </div>
            </Link>
          )
        })}
      </div>

      {leads.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <p className="text-sm text-slate-400">Sonuç bulunamadı.</p>
        </div>
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
