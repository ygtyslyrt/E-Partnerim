"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Save } from "lucide-react"
import { createLead } from "@/lib/actions/leads"
import { LEAD_STATUSES, PRIORITY_META, SOURCE_META } from "@/lib/constants/crm"
import type { AssignableUser } from "@/types/cms"

const INPUT = "w-full rounded-xl border border-[#E4EAF5] bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition"
const LABEL = "mb-1.5 block text-sm font-medium text-slate-600"

export default function NewLeadForm({ users }: { users: AssignableUser[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: "", email: "", phone: "", company: "", website: "",
    status: "NEW", priority: "MEDIUM", source: "MANUAL",
    sector: "", budget: "", timeline: "", assignedToId: "", nextFollowUp: "",
  })

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) {
      setError("İsim zorunludur")
      return
    }
    setError(null)
    startTransition(async () => {
      const result = await createLead({ ...form, nextFollowUp: form.nextFollowUp || null })
      if (result.success && result.data) {
        router.push(`/panel/crm/${result.data.id}`)
      } else {
        setError(result.error ?? "Lead oluşturulamadı")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5 rounded-2xl border border-[#E4EAF5] bg-white p-6">
      {error && <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL}>Ad Soyad *</label>
          <input value={form.name} onChange={(e) => set("name", e.target.value)} className={INPUT} placeholder="Adı Soyadı" />
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
          <label className={LABEL}>Kaynak</label>
          <select value={form.source} onChange={(e) => set("source", e.target.value)} className={INPUT}>
            {Object.entries(SOURCE_META).map(([value, meta]) => <option key={value} value={value}>{meta.label}</option>)}
          </select>
        </div>
        <div>
          <label className={LABEL}>Durum</label>
          <select value={form.status} onChange={(e) => set("status", e.target.value)} className={INPUT}>
            {LEAD_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div>
          <label className={LABEL}>Öncelik</label>
          <select value={form.priority} onChange={(e) => set("priority", e.target.value)} className={INPUT}>
            {Object.entries(PRIORITY_META).map(([value, meta]) => <option key={value} value={value}>{meta.label}</option>)}
          </select>
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
          <label className={LABEL}>Atanan Kişi</label>
          <select value={form.assignedToId} onChange={(e) => set("assignedToId", e.target.value)} className={INPUT}>
            <option value="">Atanmamış</option>
            {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
        <div>
          <label className={LABEL}>Sonraki Takip Tarihi</label>
          <input type="date" value={form.nextFollowUp} onChange={(e) => set("nextFollowUp", e.target.value)} className={INPUT} />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3730A3] px-6 py-3 text-sm font-semibold text-white hover:bg-[#312E8A] transition disabled:opacity-60 sm:w-auto"
      >
        {isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
        {isPending ? "Kaydediliyor..." : "Lead Oluştur"}
      </button>
    </form>
  )
}
