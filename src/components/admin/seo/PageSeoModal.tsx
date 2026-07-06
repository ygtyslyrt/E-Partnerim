"use client"

import { useState, useTransition } from "react"
import { X, Loader2, Save } from "lucide-react"
import type { Page } from "@prisma/client"
import MediaPickerButton from "@/components/admin/media/MediaPickerButton"
import { updatePageSeo, type PageSeoInput } from "@/lib/actions/seo"

interface Props {
  page: Page | null
  onClose: () => void
  onSaved: (page: Page) => void
}

const ROBOTS_OPTIONS = [
  { value: "index,follow", label: "Index, Follow (varsayılan)" },
  { value: "noindex,follow", label: "Noindex, Follow" },
  { value: "index,nofollow", label: "Index, Nofollow" },
  { value: "noindex,nofollow", label: "Noindex, Nofollow" },
]

export default function PageSeoModal({ page, onClose, onSaved }: Props) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<PageSeoInput>(() => ({
    title: page?.title ?? "",
    slug: page?.slug ?? "",
    seoTitle: page?.seoTitle ?? "",
    seoDesc: page?.seoDesc ?? "",
    seoKeywords: page?.seoKeywords ?? "",
    ogTitle: page?.ogTitle ?? "",
    ogDescription: page?.ogDescription ?? "",
    ogImage: page?.ogImage ?? "",
    twitterCard: page?.twitterCard ?? "summary_large_image",
    canonical: page?.canonical ?? "",
    robots: page?.robots ?? "index,follow",
  }))

  if (!page) return null

  const inputCls =
    "w-full rounded-xl border border-[#E4EAF5] bg-[#F8FAFC] px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition"
  const labelCls = "mb-1.5 flex items-center justify-between text-sm font-medium text-slate-700"

  function set<K extends keyof PageSeoInput>(key: K, val: PageSeoInput[K]) {
    setData((prev) => ({ ...prev, [key]: val }))
  }

  function handleSubmit() {
    setError(null)
    startTransition(async () => {
      const result = await updatePageSeo(page!.id, data)
      if (result.success) {
        onSaved({ ...page!, ...data } as Page)
        onClose()
      } else {
        setError(result.error ?? "Kayıt hatası")
      }
    })
  }

  const titleLen = (data.seoTitle ?? "").length
  const descLen = (data.seoDesc ?? "").length

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="flex max-h-[90vh] w-[min(640px,95vw)] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center gap-3 border-b border-[#E4EAF5] px-5 py-4">
          <h2 className="flex-1 text-base font-bold text-slate-800">{page.title} — SEO</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto p-5">
          {error && <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

          <div className="rounded-xl border border-[#E4EAF5] bg-white p-4">
            <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Google Arama Önizlemesi</p>
            <div className="space-y-0.5">
              <p className="truncate text-sm font-medium text-blue-700">{data.seoTitle || page.title}</p>
              <p className="text-xs text-[#006621]">e-partnerim.com{page.slug === "/" ? "" : page.slug}</p>
              <p className="line-clamp-2 text-xs text-slate-500">{data.seoDesc || "Meta açıklama girilmedi..."}</p>
            </div>
          </div>

          <div>
            <label className={labelCls}>
              <span>SEO Başlığı</span>
              <span className={`text-xs ${titleLen > 60 ? "text-red-500" : "text-slate-400"}`}>{titleLen}/60</span>
            </label>
            <input type="text" value={data.seoTitle ?? ""} onChange={(e) => set("seoTitle", e.target.value)} placeholder={page.title} className={inputCls} />
          </div>

          <div>
            <label className={labelCls}>
              <span>Meta Açıklama</span>
              <span className={`text-xs ${descLen > 160 ? "text-red-500" : "text-slate-400"}`}>{descLen}/160</span>
            </label>
            <textarea value={data.seoDesc ?? ""} onChange={(e) => set("seoDesc", e.target.value)} rows={3} className={`${inputCls} resize-none`} />
          </div>

          <div>
            <label className={labelCls}><span>Anahtar Kelimeler</span></label>
            <input type="text" value={data.seoKeywords ?? ""} onChange={(e) => set("seoKeywords", e.target.value)} placeholder="virgülle ayırın" className={inputCls} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}><span>Canonical URL</span></label>
              <input type="text" value={data.canonical ?? ""} onChange={(e) => set("canonical", e.target.value)} placeholder="https://..." className={inputCls} />
            </div>
            <div>
              <label className={labelCls}><span>Robots</span></label>
              <select value={data.robots} onChange={(e) => set("robots", e.target.value)} className={inputCls}>
                {ROBOTS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          <div className="border-t border-[#E4EAF5] pt-4">
            <p className="mb-3 text-sm font-semibold text-slate-700">Open Graph / Sosyal Paylaşım</p>
            <div className="space-y-4">
              <div>
                <label className={labelCls}><span>OG Başlık</span></label>
                <input type="text" value={data.ogTitle ?? ""} onChange={(e) => set("ogTitle", e.target.value)} placeholder={data.seoTitle || page.title} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}><span>OG Açıklama</span></label>
                <textarea value={data.ogDescription ?? ""} onChange={(e) => set("ogDescription", e.target.value)} rows={2} className={`${inputCls} resize-none`} />
              </div>
              <MediaPickerButton value={data.ogImage ?? ""} onChange={(url) => set("ogImage", url)} label="OG Görseli" hint="1200×630 px önerilir" />
              <div>
                <label className={labelCls}><span>Twitter Kart Tipi</span></label>
                <select value={data.twitterCard} onChange={(e) => set("twitterCard", e.target.value)} className={inputCls}>
                  <option value="summary_large_image">Büyük Görsel</option>
                  <option value="summary">Özet</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[#E4EAF5] bg-[#F8FAFC] px-5 py-3">
          <button onClick={onClose} className="rounded-xl border border-[#E4EAF5] px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition">İptal</button>
          <button onClick={handleSubmit} disabled={isPending} className="flex items-center gap-2 rounded-xl bg-[#3730A3] px-5 py-2 text-sm font-semibold text-white hover:bg-[#312E8A] disabled:opacity-60 transition">
            {isPending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {isPending ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </div>
    </div>
  )
}
