"use client"

import { useState, useTransition } from "react"
import { Check, Loader2 } from "lucide-react"
import { updateLead } from "@/lib/actions/leads"
import type { LeadDetail } from "@/types/cms"

const INPUT = "w-full rounded-xl border border-[#E4EAF5] bg-white px-3.5 py-2 text-sm text-slate-800 outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition"
const LABEL = "mb-1 block text-xs font-medium text-slate-500"

function toDateInput(d: Date | string | null) {
  if (!d) return ""
  return new Date(d).toISOString().slice(0, 10)
}

export default function LeadInfoForm({ lead }: { lead: LeadDetail }) {
  const [form, setForm] = useState({
    name: lead.name,
    email: lead.email ?? "",
    phone: lead.phone ?? "",
    company: lead.company ?? "",
    website: lead.website ?? "",
    sector: lead.sector ?? "",
    budget: lead.budget ?? "",
    timeline: lead.timeline ?? "",
    nextFollowUp: toDateInput(lead.nextFollowUp),
  })
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  function handleSave() {
    if (!form.name.trim()) {
      setError("İsim zorunludur")
      return
    }
    setError(null)
    startTransition(async () => {
      const result = await updateLead(lead.id, {
        ...form,
        nextFollowUp: form.nextFollowUp || null,
      })
      if (result.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      } else {
        setError(result.error ?? "Kaydedilemedi")
      }
    })
  }

  return (
    <div className="rounded-2xl border border-[#E4EAF5] bg-white p-5">
      <h2 className="mb-4 text-sm font-semibold text-slate-700">İletişim Bilgileri</h2>
      {error && <div className="mb-3 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-600">{error}</div>}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className={LABEL}>Ad Soyad *</label>
          <input value={form.name} onChange={(e) => set("name", e.target.value)} className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>Firma</label>
          <input value={form.company} onChange={(e) => set("company", e.target.value)} className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>E-posta</label>
          <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>Telefon</label>
          <input value={form.phone} onChange={(e) => set("phone", e.target.value)} className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>Web Sitesi</label>
          <input value={form.website} onChange={(e) => set("website", e.target.value)} className={INPUT} placeholder="https://..." />
        </div>
        <div>
          <label className={LABEL}>Sektör</label>
          <input value={form.sector} onChange={(e) => set("sector", e.target.value)} className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>Bütçe</label>
          <input value={form.budget} onChange={(e) => set("budget", e.target.value)} className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>Zaman Çizelgesi</label>
          <input value={form.timeline} onChange={(e) => set("timeline", e.target.value)} className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>Sonraki Takip Tarihi</label>
          <input type="date" value={form.nextFollowUp} onChange={(e) => set("nextFollowUp", e.target.value)} className={INPUT} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center gap-2 rounded-xl bg-[#3730A3] px-4 py-2 text-sm font-semibold text-white hover:bg-[#312E8A] transition disabled:opacity-60"
        >
          {isPending ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
          Kaydet
        </button>
        {saved && <span className="text-xs font-medium text-emerald-600">Kaydedildi</span>}
      </div>
    </div>
  )
}
