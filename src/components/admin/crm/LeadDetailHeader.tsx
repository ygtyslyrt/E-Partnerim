"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Trash2, Building2 } from "lucide-react"
import { updateLeadStatus, updateLeadPriority, assignLead, deleteLead } from "@/lib/actions/leads"
import { LEAD_STATUSES, PRIORITY_META, SOURCE_META, leadStatusMeta } from "@/lib/constants/crm"
import { AssigneeAvatar } from "./LeadCardMini"
import Toast, { type ToastState } from "@/components/admin/shared/Toast"
import type { LeadDetail, AssignableUser } from "@/types/cms"

const SELECT = "rounded-xl border px-3 py-2 text-sm font-semibold outline-none focus:ring-2 transition cursor-pointer"

export default function LeadDetailHeader({
  lead, users, canDelete,
}: {
  lead: LeadDetail
  users: AssignableUser[]
  canDelete: boolean
}) {
  const router = useRouter()
  const [status, setStatus] = useState(lead.status)
  const [priority, setPriority] = useState(lead.priority)
  const [assignedTo, setAssignedTo] = useState(lead.assignedTo)
  const [confirmDel, setConfirmDel] = useState(false)
  const [, startTransition] = useTransition()
  const [toast, setToast] = useState<ToastState | null>(null)

  const meta = leadStatusMeta(status)

  function handleStatus(v: string) {
    const prev = status
    setStatus(v as typeof status)
    startTransition(async () => {
      const result = await updateLeadStatus(lead.id, v)
      if (!result.success) {
        setStatus(prev)
        setToast({ message: result.error ?? "Durum güncellenemedi", type: "error" })
      }
    })
  }

  function handlePriority(v: string) {
    const prev = priority
    setPriority(v as typeof priority)
    startTransition(async () => {
      const result = await updateLeadPriority(lead.id, v)
      if (!result.success) {
        setPriority(prev)
        setToast({ message: result.error ?? "Öncelik güncellenemedi", type: "error" })
      }
    })
  }

  function handleAssign(userId: string) {
    const prev = assignedTo
    setAssignedTo(users.find((u) => u.id === userId) ?? null)
    startTransition(async () => {
      const result = await assignLead(lead.id, userId || null)
      if (!result.success) {
        setAssignedTo(prev)
        setToast({ message: result.error ?? "Atama güncellenemedi", type: "error" })
      }
    })
  }

  async function handleDelete() {
    const result = await deleteLead(lead.id)
    if (result.success) {
      router.push("/panel/crm")
    } else {
      setConfirmDel(false)
      setToast({ message: result.error ?? "Lead silinemedi", type: "error" })
    }
  }

  return (
    <div className="rounded-2xl border border-[#E4EAF5] bg-white p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold text-slate-800">{lead.name}</h1>
          {lead.company && (
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
              <Building2 size={14} />
              {lead.company}
            </p>
          )}
          <p className="mt-1 text-xs text-slate-400">
            {SOURCE_META[lead.source].label} · {new Date(lead.createdAt).toLocaleDateString("tr-TR")} tarihinde oluşturuldu
          </p>
        </div>

        {canDelete && (
          confirmDel ? (
            <div className="flex shrink-0 items-center gap-2">
              <button onClick={handleDelete} className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition">
                Kalıcı Olarak Sil
              </button>
              <button onClick={() => setConfirmDel(false)} className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition">
                İptal
              </button>
            </div>
          ) : (
            <button onClick={() => setConfirmDel(true)} className="shrink-0 flex items-center gap-1.5 rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 transition" title="Lead'i sil">
              <Trash2 size={16} />
            </button>
          )
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div>
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Durum</label>
          <select value={status} onChange={(e) => handleStatus(e.target.value)} className={`${SELECT} w-full ${meta.color}`}>
            {LEAD_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Öncelik</label>
          <select value={priority} onChange={(e) => handlePriority(e.target.value)} className={`${SELECT} w-full ${PRIORITY_META[priority].color}`}>
            {Object.entries(PRIORITY_META).map(([value, m]) => <option key={value} value={value}>{m.label}</option>)}
          </select>
        </div>
        <div className="col-span-2">
          <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Atanan Kişi</label>
          <div className="flex items-center gap-2">
            <AssigneeAvatar user={assignedTo} size={28} />
            <select
              value={assignedTo?.id ?? ""}
              onChange={(e) => handleAssign(e.target.value)}
              className={`${SELECT} w-full border-[#E4EAF5] text-slate-700`}
            >
              <option value="">Atanmamış</option>
              {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
