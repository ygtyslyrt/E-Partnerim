"use client"

import { useState, useTransition } from "react"
import { Plus, X } from "lucide-react"
import { addLeadTag, removeLeadTag } from "@/lib/actions/leads"
import Toast, { type ToastState } from "@/components/admin/shared/Toast"
import type { LeadDetail } from "@/types/cms"

const COLORS = ["#6366F1", "#00D084", "#F59E0B", "#EF4444", "#0EA5E9", "#8B5CF6"]

export default function LeadTagsPanel({ leadId, initialTags }: { leadId: string; initialTags: LeadDetail["tags"] }) {
  const [tags, setTags] = useState(initialTags)
  const [name, setName] = useState("")
  const [color, setColor] = useState(COLORS[0])
  const [showForm, setShowForm] = useState(false)
  const [, startTransition] = useTransition()
  const [toast, setToast] = useState<ToastState | null>(null)

  function handleAdd() {
    if (!name.trim()) return
    const label = name.trim()
    setName(""); setShowForm(false)
    startTransition(async () => {
      const result = await addLeadTag(leadId, label, color)
      if (result.success && result.data) {
        const tagId = result.data.id
        setTags((prev) => [...prev, { id: tagId, name: label, color }])
      } else {
        setToast({ message: result.error ?? "Etiket eklenemedi", type: "error" })
      }
    })
  }

  function handleRemove(id: string) {
    const removed = tags.find((t) => t.id === id)
    setTags((prev) => prev.filter((t) => t.id !== id))
    startTransition(async () => {
      const result = await removeLeadTag(id, leadId)
      if (!result.success) {
        if (removed) setTags((prev) => [...prev, removed])
        setToast({ message: result.error ?? "Etiket kaldırılamadı", type: "error" })
      }
    })
  }

  return (
    <div className="rounded-2xl border border-[#E4EAF5] bg-white p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700">Etiketler</h2>
        <button onClick={() => setShowForm((v) => !v)} className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-[#3730A3] hover:bg-[#EEF2FF] transition">
          <Plus size={13} />
          Ekle
        </button>
      </div>

      {showForm && (
        <div className="mb-3 space-y-2 rounded-xl bg-[#F8FAFC] p-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Etiket adı..."
            className="w-full rounded-lg border border-[#E4EAF5] bg-white px-3 py-1.5 text-sm outline-none focus:border-[#3730A3]"
          />
          <div className="flex items-center gap-1.5">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`h-5 w-5 rounded-full transition ${color === c ? "ring-2 ring-offset-1" : ""}`}
                style={{ background: c }}
              />
            ))}
            <button onClick={handleAdd} className="ml-auto rounded-lg bg-[#3730A3] px-3 py-1 text-xs font-semibold text-white hover:bg-[#312E8A] transition">
              Ekle
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-1.5">
        {tags.length === 0 && <p className="text-sm text-slate-400">Etiket yok.</p>}
        {tags.map((t) => (
          <span key={t.id} className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium" style={{ background: `${t.color}1A`, color: t.color }}>
            {t.name}
            <button onClick={() => handleRemove(t.id)} className="hover:opacity-60">
              <X size={11} />
            </button>
          </span>
        ))}
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
