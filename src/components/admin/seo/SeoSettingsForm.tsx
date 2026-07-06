"use client"

import { useState, useTransition } from "react"
import { Loader2, Save, CheckCircle } from "lucide-react"
import type { ActionResult } from "@/types/cms"

interface Props {
  initialSettings: Record<string, string>
  action: (data: Record<string, string>) => Promise<ActionResult>
}

const GROUPS = [
  {
    label: "Genel SEO",
    keys: [
      { key: "seo_site_title", label: "Site Başlığı", type: "text" },
      { key: "seo_meta_description", label: "Meta Açıklama", type: "textarea" },
      { key: "seo_meta_keywords", label: "Anahtar Kelimeler", type: "text" },
      { key: "seo_canonical_url", label: "Canonical URL", type: "url" },
      { key: "seo_robots", label: "Varsayılan Robots Meta", type: "text" },
    ],
  },
  {
    label: "Arama Motoru Doğrulama",
    keys: [
      { key: "search_console", label: "Google Search Console Kodu", type: "text" },
      { key: "seo_bing_verification", label: "Bing Doğrulama Kodu", type: "text" },
      { key: "seo_yandex_verification", label: "Yandex Doğrulama Kodu", type: "text" },
    ],
  },
  {
    label: "Yapılandırılmış Veri & Robots.txt",
    keys: [
      { key: "seo_json_ld_organization", label: "JSON-LD Organization Schema", type: "textarea" },
      { key: "seo_robots_txt", label: "Robots.txt (özel içerik, boşsa otomatik oluşturulur)", type: "textarea" },
    ],
  },
  {
    label: "Analitik",
    keys: [
      { key: "ga_id", label: "Google Analytics ID (G-XXXXXX)", type: "text" },
      { key: "meta_pixel_id", label: "Meta Pixel ID", type: "text" },
      { key: "gtm_id", label: "Google Tag Manager ID", type: "text" },
    ],
  },
] as const

export default function SeoSettingsForm({ initialSettings, action }: Props) {
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [values, setValues] = useState<Record<string, string>>(initialSettings)

  const inputCls =
    "w-full rounded-xl border border-[#E4EAF5] bg-[#F8FAFC] px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition"
  const labelCls = "mb-1.5 block text-sm font-medium text-slate-700"

  function handleChange(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaved(false)
    startTransition(async () => {
      const result = await action(values)
      if (result.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        setError(result.error ?? "Kayıt hatası")
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {GROUPS.map((group) => (
        <div key={group.label} className="rounded-2xl border border-[#E4EAF5] bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-slate-700">{group.label}</h2>
          <div className="space-y-4">
            {group.keys.map(({ key, label, type }) => (
              <div key={key}>
                <label className={labelCls}>{label}</label>
                {type === "textarea" ? (
                  <textarea
                    value={values[key] ?? ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                    rows={key.includes("json_ld") ? 6 : 3}
                    className={`${inputCls} font-mono text-xs resize-y`}
                  />
                ) : (
                  <input
                    type={type}
                    value={values[key] ?? ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className={inputCls}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 rounded-xl bg-[#3730A3] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#312E8A] disabled:opacity-60 transition"
        >
          {isPending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {isPending ? "Kaydediliyor..." : "Kaydet"}
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm text-emerald-600">
            <CheckCircle size={15} />
            Kaydedildi
          </span>
        )}
      </div>
    </form>
  )
}
