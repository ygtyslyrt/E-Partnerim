"use client"

import { useState, useTransition } from "react"
import { Loader2, Save, CheckCircle } from "lucide-react"
import { updateHowItWorksContent } from "@/lib/actions/how-it-works"
import ListItemEditor from "@/components/admin/shared/ListItemEditor"
import { ICON_OPTIONS } from "@/lib/icon-map"
import type { HowItWorksSectionContent, HowItWorksStep } from "@prisma/client"

interface Props {
  initialData: (HowItWorksSectionContent & { steps: HowItWorksStep[] }) | null
}

type StepState = { _key: string; title: string; description: string; icon: string; highlighted: boolean }

const inputCls = "w-full rounded-xl border border-[#E4EAF5] bg-[#F8FAFC] px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition"
const labelCls = "mb-1.5 block text-sm font-medium text-slate-700"
const smallInputCls = "w-full rounded-lg border border-[#E4EAF5] bg-white px-3 py-1.5 text-sm text-slate-800 outline-none focus:border-[#3730A3] transition"

export default function HowItWorksEditor({ initialData }: Props) {
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [title, setTitle] = useState(initialData?.title ?? "")
  const [subtitle, setSubtitle] = useState(initialData?.subtitle ?? "")
  const [steps, setSteps] = useState<StepState[]>(
    (initialData?.steps ?? []).map((s) => ({
      _key: s.id, title: s.title, description: s.description, icon: s.icon ?? "MessageSquare", highlighted: s.highlighted,
    }))
  )

  function handleSave() {
    setError(null)
    startTransition(async () => {
      const result = await updateHowItWorksContent({
        title, subtitle,
        steps: steps.map((s, i) => ({ stepNo: i + 1, title: s.title, description: s.description, icon: s.icon, highlighted: s.highlighted })),
      })
      if (result.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        setError(result.error ?? "Bilinmeyen hata")
      }
    })
  }

  return (
    <div className="space-y-4">
      {error && <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">{error}</div>}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Başlık</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Alt Başlık</label>
          <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className={inputCls} />
        </div>
      </div>

      <div>
        <label className={labelCls}>Adımlar</label>
        <ListItemEditor
          items={steps}
          onChange={setSteps}
          addLabel="Adım Ekle"
          emptyLabel="Henüz adım eklenmedi"
          onAdd={() => ({ _key: `new-${Date.now()}`, title: "", description: "", icon: "MessageSquare", highlighted: false })}
          renderItem={(step, update) => (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input value={step.title} onChange={(e) => update({ title: e.target.value })} placeholder="Adım başlığı" className={smallInputCls} />
                <select value={step.icon} onChange={(e) => update({ icon: e.target.value })} className={smallInputCls}>
                  {ICON_OPTIONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                </select>
              </div>
              <textarea value={step.description} onChange={(e) => update({ description: e.target.value })} placeholder="Açıklama" rows={2} className={`${smallInputCls} resize-none`} />
              <label className="flex items-center gap-2 text-xs text-slate-600">
                <input type="checkbox" checked={step.highlighted} onChange={(e) => update({ highlighted: e.target.checked })} className="h-3.5 w-3.5 rounded border-slate-300" />
                Vurgulu (yeşil accent)
              </label>
            </div>
          )}
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="flex items-center gap-2 rounded-xl bg-[#3730A3] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#312E8A] disabled:opacity-60 transition"
        >
          {isPending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {isPending ? "Kaydediliyor..." : "Kaydet"}
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-emerald-600">
            <CheckCircle size={15} /> Kaydedildi
          </span>
        )}
      </div>
    </div>
  )
}
