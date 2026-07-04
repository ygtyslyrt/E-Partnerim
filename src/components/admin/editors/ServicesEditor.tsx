"use client"

import { useState, useTransition } from "react"
import { Loader2, Save, CheckCircle } from "lucide-react"
import { updateServicesContent } from "@/lib/actions/services"
import ListItemEditor from "@/components/admin/shared/ListItemEditor"
import { ICON_OPTIONS } from "@/lib/icon-map"
import type { ServicesSectionContent, ServiceItem } from "@prisma/client"

interface Props {
  initialData: (ServicesSectionContent & { items: ServiceItem[] }) | null
}

type ItemState = {
  _key: string
  title: string
  description: string
  icon: string
  color: string
  link: string | null
  highlighted: boolean
  statValue: string
  statLabel: string
}

const inputCls = "w-full rounded-xl border border-[#E4EAF5] bg-[#F8FAFC] px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition"
const labelCls = "mb-1.5 block text-sm font-medium text-slate-700"
const smallInputCls = "w-full rounded-lg border border-[#E4EAF5] bg-white px-3 py-1.5 text-sm text-slate-800 outline-none focus:border-[#3730A3] transition"

export default function ServicesEditor({ initialData }: Props) {
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [title, setTitle] = useState(initialData?.title ?? "")
  const [subtitle, setSubtitle] = useState(initialData?.subtitle ?? "")
  const [ctaLabel, setCtaLabel] = useState(initialData?.ctaLabel ?? "")
  const [ctaUrl, setCtaUrl] = useState(initialData?.ctaUrl ?? "")
  const [items, setItems] = useState<ItemState[]>(
    (initialData?.items ?? []).map((it, i) => ({
      _key: it.id, title: it.title, description: it.description, icon: it.icon, color: it.color,
      link: it.link, highlighted: it.highlighted, statValue: it.statValue ?? "", statLabel: it.statLabel ?? "",
    }))
  )

  function handleSave() {
    setError(null)
    startTransition(async () => {
      const result = await updateServicesContent({
        title, subtitle, ctaLabel, ctaUrl,
        items: items.map((it) => ({
          title: it.title, description: it.description, icon: it.icon, color: it.color,
          link: it.link || null, highlighted: it.highlighted,
          statValue: it.statValue || null, statLabel: it.statLabel || null,
        })),
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Alt CTA Metni</label>
          <input value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} placeholder="Tüm hizmetlerimiz hakkında bilgi alın" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Alt CTA URL</label>
          <input value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} placeholder="https://wa.me/..." className={inputCls} />
        </div>
      </div>

      <div>
        <label className={labelCls}>Kartlar</label>
        <ListItemEditor
          items={items}
          onChange={setItems}
          addLabel="Kart Ekle"
          emptyLabel="Henüz kart eklenmedi"
          onAdd={() => ({
            _key: `new-${Date.now()}`, title: "", description: "", icon: "Star", color: "#00D084",
            link: null, highlighted: false, statValue: "", statLabel: "",
          })}
          renderItem={(item, update) => (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <input value={item.title} onChange={(e) => update({ title: e.target.value })} placeholder="Başlık" className={smallInputCls} />
                <div className="flex items-center gap-2">
                  <select value={item.icon} onChange={(e) => update({ icon: e.target.value })} className={smallInputCls}>
                    {ICON_OPTIONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                  </select>
                  <input type="color" value={item.color} onChange={(e) => update({ color: e.target.value })} className="h-8 w-10 shrink-0 cursor-pointer rounded border border-[#E4EAF5]" />
                </div>
              </div>
              <textarea value={item.description} onChange={(e) => update({ description: e.target.value })} placeholder="Açıklama" rows={2} className={`${smallInputCls} resize-none`} />
              <div className="grid grid-cols-2 gap-2">
                <input value={item.statValue} onChange={(e) => update({ statValue: e.target.value })} placeholder="Rozet değeri (ör. %85)" className={smallInputCls} />
                <input value={item.statLabel} onChange={(e) => update({ statLabel: e.target.value })} placeholder="Rozet metni" className={smallInputCls} />
              </div>
              <label className="flex items-center gap-2 text-xs text-slate-600">
                <input type="checkbox" checked={item.highlighted} onChange={(e) => update({ highlighted: e.target.checked })} className="h-3.5 w-3.5 rounded border-slate-300" />
                Öne çıkan (büyük, koyu kart)
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
