"use client"

import MediaPickerButton from "@/components/admin/media/MediaPickerButton"

export interface SeoData {
  seoTitle: string
  seoDesc: string
  ogImage: string
}

interface Props {
  data: SeoData
  onChange: (data: SeoData) => void
  defaultTitle?: string
  defaultDesc?: string
}

export default function SeoPanel({ data, onChange, defaultTitle = "", defaultDesc = "" }: Props) {
  const titleLen = data.seoTitle.length
  const descLen = data.seoDesc.length

  const cls = {
    input:
      "w-full rounded-xl border border-[#E4EAF5] bg-[#F8FAFC] px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition",
    label: "mb-1.5 flex items-center justify-between text-sm font-medium text-slate-700",
  }

  function set<K extends keyof SeoData>(key: K, val: SeoData[K]) {
    onChange({ ...data, [key]: val })
  }

  const previewTitle = data.seoTitle || defaultTitle || "Sayfa Başlığı"
  const previewDesc = data.seoDesc || defaultDesc || "Meta açıklama buraya gelecek..."

  return (
    <div className="space-y-4">
      {/* Google preview */}
      <div className="rounded-xl border border-[#E4EAF5] bg-white p-4">
        <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          Google Arama Önizlemesi
        </p>
        <div className="space-y-0.5">
          <p className="truncate text-sm font-medium text-blue-700">{previewTitle}</p>
          <p className="text-xs text-[#006621]">https://e-partnerim.com › ...</p>
          <p className="line-clamp-2 text-xs text-slate-500">{previewDesc}</p>
        </div>
      </div>

      <div>
        <label className={cls.label}>
          <span>SEO Başlığı</span>
          <span className={`text-xs ${titleLen > 60 ? "text-red-500" : "text-slate-400"}`}>
            {titleLen}/60
          </span>
        </label>
        <input
          type="text"
          value={data.seoTitle}
          onChange={(e) => set("seoTitle", e.target.value)}
          placeholder={defaultTitle || "Sayfa başlığı..."}
          className={cls.input}
        />
      </div>

      <div>
        <label className={cls.label}>
          <span>Meta Açıklama</span>
          <span className={`text-xs ${descLen > 160 ? "text-red-500" : "text-slate-400"}`}>
            {descLen}/160
          </span>
        </label>
        <textarea
          value={data.seoDesc}
          onChange={(e) => set("seoDesc", e.target.value)}
          rows={3}
          placeholder={defaultDesc || "Sayfayı açıklayan 1-2 cümle..."}
          className={`${cls.input} resize-none`}
        />
      </div>

      <MediaPickerButton
        value={data.ogImage}
        onChange={(url) => set("ogImage", url)}
        label="OG Görseli"
        hint="1200×630 px önerilir"
      />
    </div>
  )
}
