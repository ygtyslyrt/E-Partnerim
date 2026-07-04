"use client"

import { useState, useTransition } from "react"
import { Loader2, Save, CheckCircle } from "lucide-react"
import { updatePlatformsSectionConfig } from "@/lib/actions/platforms-section"
import type { PlatformsSectionConfig } from "@prisma/client"

interface Props {
  initialData: PlatformsSectionConfig | null
}

const inputCls = "w-full rounded-xl border border-[#E4EAF5] bg-[#F8FAFC] px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition"
const labelCls = "mb-1.5 block text-sm font-medium text-slate-700"

export default function PlatformsSectionEditor({ initialData }: Props) {
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [title, setTitle] = useState(initialData?.title ?? "")
  const [subtitle, setSubtitle] = useState(initialData?.subtitle ?? "")
  const [showCount, setShowCount] = useState(initialData?.showCount ?? 6)

  function handleSave() {
    setError(null)
    startTransition(async () => {
      const result = await updatePlatformsSectionConfig({ title, subtitle, showCount })
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

      <div>
        <label className={labelCls}>Başlık</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Alt Başlık</label>
        <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Gösterilecek Platform Sayısı</label>
        <input type="number" min={1} max={12} value={showCount} onChange={(e) => setShowCount(Number(e.target.value))} className={inputCls} />
        <p className="mt-1.5 text-xs text-slate-400">
          Platformlar modülünde &quot;Öne Çıkar&quot; işaretli kayıtlar gösterilir.
        </p>
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
