import { CheckCircle2, XCircle, ExternalLink, Globe } from "lucide-react"
import type { FeatureItem } from "@/components/admin/shared/FeatureEditor"

export interface PreviewData {
  name: string
  logo?: string
  logoColor?: string
  category?: string
  shortDesc?: string
  pricing?: string
  ctaLabel?: string
  ctaLabel2?: string
  status?: string
  featured?: boolean
  features: FeatureItem[]
}

export default function PlatformPreview({ data }: { data: PreviewData }) {
  const advs = data.features.filter((f) => f.type === "ADVANTAGE").slice(0, 4)
  const disadvs = data.features.filter((f) => f.type === "DISADVANTAGE").slice(0, 2)
  const color = data.logoColor || "#3730A3"
  const initial = (data.name || "?")[0]?.toUpperCase()

  return (
    <div className="rounded-2xl border border-[#E4EAF5] bg-white overflow-hidden shadow-sm">
      {/* Card header */}
      <div className="p-4" style={{ background: `${color}14` }}>
        <div className="flex items-start gap-3">
          <div className="shrink-0">
            {data.logo ? (
              <div className="h-12 w-12 overflow-hidden rounded-xl bg-white shadow-sm flex items-center justify-center p-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={data.logo} alt={data.name} className="h-full w-full object-contain" />
              </div>
            ) : (
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl text-lg font-bold text-white shadow-sm"
                style={{ backgroundColor: color }}
              >
                {initial}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="truncate font-bold text-slate-800">
                {data.name || <span className="text-slate-300">Platform Adı</span>}
              </h4>
              {data.featured && (
                <span className="rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600">
                  ⭐ Öne Çıkan
                </span>
              )}
            </div>
            {data.category && (
              <span
                className="mt-0.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium"
                style={{ backgroundColor: `${color}1A`, color }}
              >
                {data.category}
              </span>
            )}
          </div>

          {data.pricing && (
            <span className="shrink-0 rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-slate-600 shadow-sm">
              {data.pricing}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="space-y-3 p-4">
        {data.shortDesc ? (
          <p className="text-xs leading-relaxed text-slate-600 line-clamp-3">{data.shortDesc}</p>
        ) : (
          <p className="text-xs text-slate-300">Kısa açıklama buraya gelecek...</p>
        )}

        {(advs.length > 0 || disadvs.length > 0) && (
          <div className="space-y-1.5 border-t border-[#F1F5F9] pt-3">
            {advs.map((f, i) => (
              <div key={i} className="flex items-start gap-1.5">
                <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-emerald-500" />
                <span className="text-xs text-slate-700 line-clamp-1">
                  {f.text || <span className="text-slate-300">Avantaj</span>}
                </span>
              </div>
            ))}
            {disadvs.map((f, i) => (
              <div key={i} className="flex items-start gap-1.5">
                <XCircle size={13} className="mt-0.5 shrink-0 text-rose-400" />
                <span className="text-xs text-slate-400 line-clamp-1">
                  {f.text || <span className="text-slate-300">Dezavantaj</span>}
                </span>
              </div>
            ))}
          </div>
        )}

        {data.ctaLabel && (
          <button
            type="button"
            className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold text-white transition"
            style={{ backgroundColor: color }}
          >
            {data.ctaLabel}
            <ExternalLink size={11} />
          </button>
        )}
        {data.ctaLabel2 && (
          <button
            type="button"
            className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#E4EAF5] py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            <Globe size={11} />
            {data.ctaLabel2}
          </button>
        )}

        <div className="flex items-center justify-between border-t border-[#F1F5F9] pt-2">
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
            data.status === "PUBLISHED"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-slate-100 text-slate-500"
          }`}>
            {data.status === "PUBLISHED" ? "Yayında" : "Taslak"}
          </span>
          <span className="text-[10px] text-slate-400">Canlı Önizleme</span>
        </div>
      </div>
    </div>
  )
}
