"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, Check, X, Loader2 } from "lucide-react"
import { approvePartnerApplication, rejectPartnerApplication } from "@/lib/actions/partner-applications"
import type { PartnerApplication } from "@prisma/client"
import Toast, { type ToastState } from "@/components/admin/shared/Toast"

const TABS = [
  { value: "PENDING", label: "Bekleyen" },
  { value: "APPROVED", label: "Onaylanan" },
  { value: "REJECTED", label: "Reddedilen" },
] as const

type TabValue = (typeof TABS)[number]["value"]

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("tr-TR", { dateStyle: "medium" })
}

export default function ApplicationsQueue({ initialApplications }: { initialApplications: PartnerApplication[] }) {
  const router = useRouter()
  const [applications, setApplications] = useState(initialApplications)
  const [tab, setTab] = useState<TabValue>("PENDING")
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [note, setNote] = useState("")
  const [toast, setToast] = useState<ToastState | null>(null)

  const filtered = applications.filter((a) => a.status === tab)

  function handleApprove(id: string) {
    startTransition(async () => {
      const result = await approvePartnerApplication(id)
      if (result.success) {
        setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status: "APPROVED" } : a)))
        setToast({ message: "Başvuru onaylandı, partner oluşturuldu", type: "success" })
        if (result.data?.slug) router.push(`/panel/partnerler/${result.data.slug}`)
      } else {
        setToast({ message: result.error ?? "Onaylanamadı", type: "error" })
      }
    })
  }

  function handleReject(id: string) {
    startTransition(async () => {
      const result = await rejectPartnerApplication(id, note)
      if (result.success) {
        setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status: "REJECTED", reviewNote: note || null } : a)))
        setRejectingId(null)
        setNote("")
        setToast({ message: "Başvuru reddedildi", type: "success" })
      } else {
        setToast({ message: result.error ?? "Reddedilemedi", type: "error" })
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => { setTab(t.value); setExpandedId(null) }}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              tab === t.value ? "bg-[#0F172A] text-white" : "border border-[#E4EAF5] bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {t.label}{" "}
            <span className="ml-1 text-xs opacity-70">{applications.filter((a) => a.status === t.value).length}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E4EAF5] py-16 text-center text-sm text-slate-400">
          Bu durumda başvuru yok.
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((app) => (
            <div key={app.id} className="rounded-xl border border-[#E4EAF5] bg-white">
              <button
                onClick={() => setExpandedId((id) => (id === app.id ? null : app.id))}
                className="flex w-full items-center gap-3 px-4 py-3 text-left"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-800">{app.companyName}</p>
                  <p className="text-xs text-slate-400">{app.contactName} · {app.email}</p>
                </div>
                <span className="shrink-0 text-xs text-slate-400">{formatDate(app.createdAt)}</span>
                <ChevronDown size={16} className={`shrink-0 text-slate-400 transition-transform ${expandedId === app.id ? "rotate-180" : ""}`} />
              </button>

              {expandedId === app.id && (
                <div className="space-y-2 border-t border-[#F0F4F8] p-4 text-sm">
                  {app.phone && <p><span className="text-slate-400">Telefon:</span> {app.phone}</p>}
                  {app.website && <p><span className="text-slate-400">Web:</span> {app.website}</p>}
                  {app.category && <p><span className="text-slate-400">Kategori:</span> {app.category}</p>}
                  {app.shortDesc && <p><span className="text-slate-400">Kısa açıklama:</span> {app.shortDesc}</p>}
                  {app.message && <p className="whitespace-pre-line"><span className="text-slate-400">Mesaj:</span> {app.message}</p>}
                  {app.reviewNote && <p className="text-red-600"><span className="text-slate-400">Red notu:</span> {app.reviewNote}</p>}

                  {app.status === "PENDING" && (
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => handleApprove(app.id)}
                        disabled={isPending}
                        className="flex items-center gap-1.5 rounded-lg bg-[#00D084] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#00bb76] transition disabled:opacity-60"
                      >
                        {isPending ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
                        Onayla
                      </button>
                      {rejectingId === app.id ? (
                        <div className="flex flex-1 items-center gap-2">
                          <input
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Red nedeni (opsiyonel)"
                            className="flex-1 rounded-lg border border-[#E4EAF5] px-3 py-1.5 text-xs outline-none focus:border-[#3730A3]"
                          />
                          <button onClick={() => handleReject(app.id)} disabled={isPending} className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 transition disabled:opacity-60">
                            Reddet
                          </button>
                          <button onClick={() => setRejectingId(null)} className="text-xs text-slate-400 hover:text-slate-600">İptal</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setRejectingId(app.id)}
                          className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                        >
                          <X size={13} /> Reddet
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
