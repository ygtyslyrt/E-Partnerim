"use client"

import { useState, useTransition } from "react"
import { Loader2, Save, CheckCircle } from "lucide-react"
import { updateWhyUsContent } from "@/lib/actions/why-us"
import ListItemEditor from "@/components/admin/shared/ListItemEditor"
import { ICON_OPTIONS } from "@/lib/icon-map"
import type { WhyUsSectionContent, WhyUsFeature } from "@prisma/client"

interface Props {
  initialData: (WhyUsSectionContent & { features: WhyUsFeature[] }) | null
}

type FeatureState = { _key: string; title: string; description: string; icon: string }

const inputCls = "w-full rounded-xl border border-[#E4EAF5] bg-[#F8FAFC] px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition"
const labelCls = "mb-1.5 block text-sm font-medium text-slate-700"
const smallInputCls = "w-full rounded-lg border border-[#E4EAF5] bg-white px-3 py-1.5 text-sm text-slate-800 outline-none focus:border-[#3730A3] transition"

export default function WhyUsEditor({ initialData }: Props) {
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [title, setTitle] = useState(initialData?.title ?? "")
  const [description, setDescription] = useState(initialData?.description ?? "")
  const [stat1Value, setStat1Value] = useState(initialData?.stat1Value ?? "")
  const [stat1Label, setStat1Label] = useState(initialData?.stat1Label ?? "")
  const [stat2Value, setStat2Value] = useState(initialData?.stat2Value ?? "")
  const [stat2Label, setStat2Label] = useState(initialData?.stat2Label ?? "")
  const [ctaLabel, setCtaLabel] = useState(initialData?.ctaLabel ?? "")
  const [features, setFeatures] = useState<FeatureState[]>(
    (initialData?.features ?? []).map((f) => ({ _key: f.id, title: f.title, description: f.description, icon: f.icon ?? "Star" }))
  )

  function handleSave() {
    setError(null)
    startTransition(async () => {
      const result = await updateWhyUsContent({
        title, description, stat1Value, stat1Label, stat2Value, stat2Label, ctaLabel,
        features: features.map((f) => ({ title: f.title, description: f.description, icon: f.icon })),
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

      <div>
        <label className={labelCls}>Başlık</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Açıklama</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={`${inputCls} resize-none`} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={labelCls}>İstatistik 1 Değer</label>
            <input value={stat1Value} onChange={(e) => setStat1Value(e.target.value)} placeholder="%95" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>İstatistik 1 Etiket</label>
            <input value={stat1Label} onChange={(e) => setStat1Label(e.target.value)} className={inputCls} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className={labelCls}>İstatistik 2 Değer</label>
            <input value={stat2Value} onChange={(e) => setStat2Value(e.target.value)} placeholder="10+" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>İstatistik 2 Etiket</label>
            <input value={stat2Label} onChange={(e) => setStat2Label(e.target.value)} className={inputCls} />
          </div>
        </div>
      </div>

      <div>
        <label className={labelCls}>CTA Metni</label>
        <input value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} placeholder="Ücretsiz Danışmanlık Al" className={inputCls} />
        <p className="mt-1 text-xs text-slate-400">Bağlantı Ayarlar'daki WhatsApp numarasını kullanır.</p>
      </div>

      <div>
        <label className={labelCls}>Özellikler</label>
        <ListItemEditor
          items={features}
          onChange={setFeatures}
          addLabel="Özellik Ekle"
          emptyLabel="Henüz özellik eklenmedi"
          onAdd={() => ({ _key: `new-${Date.now()}`, title: "", description: "", icon: "Star" })}
          renderItem={(feature, update) => (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input value={feature.title} onChange={(e) => update({ title: e.target.value })} placeholder="Başlık" className={smallInputCls} />
                <select value={feature.icon} onChange={(e) => update({ icon: e.target.value })} className={smallInputCls}>
                  {ICON_OPTIONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                </select>
              </div>
              <textarea value={feature.description} onChange={(e) => update({ description: e.target.value })} placeholder="Açıklama" rows={2} className={`${smallInputCls} resize-none`} />
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
