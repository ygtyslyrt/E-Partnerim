"use client"

import { CheckCircle2, XCircle } from "lucide-react"
import type { FeatureItem } from "@/components/admin/shared/FeatureEditor"

export type SolutionPreviewData = {
  title: string
  icon: string
  color: string
  category: string
  shortDesc: string
  ctaLabel: string
  ctaLabel2: string
  status: string
  featured: boolean
  features: FeatureItem[]
}

const ICON_BG = (color: string) => {
  const r = parseInt(color.slice(1, 3), 16)
  const g = parseInt(color.slice(3, 5), 16)
  const b = parseInt(color.slice(5, 7), 16)
  return `rgba(${r},${g},${b},0.12)`
}

export default function SolutionPreview({ data }: { data: SolutionPreviewData }) {
  const color = data.color || "#3730A3"
  const advantages = data.features.filter((f) => f.type === "ADVANTAGE")
  const disadvantages = data.features.filter((f) => f.type === "DISADVANTAGE")

  return (
    <div className="rounded-2xl border border-[#E4EAF5] bg-white overflow-hidden">
      {/* Renk şeridi */}
      <div className="h-1.5 w-full" style={{ backgroundColor: color }} />

      <div className="p-5">
        {/* İkon + başlık */}
        <div className="flex items-start gap-3 mb-4">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg font-black"
            style={{ backgroundColor: ICON_BG(color), color }}
          >
            {data.icon ? data.icon[0]?.toUpperCase() : data.title[0]?.toUpperCase() || "?"}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              {data.featured && (
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-600">
                  Öne Çıkan
                </span>
              )}
              {data.category && (
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                  style={{ backgroundColor: ICON_BG(color), color }}
                >
                  {data.category}
                </span>
              )}
            </div>
            <p className="mt-0.5 font-bold text-slate-800 leading-tight">
              {data.title || <span className="text-slate-300 font-normal">Başlık...</span>}
            </p>
          </div>
        </div>

        {data.shortDesc && (
          <p className="text-xs leading-relaxed text-slate-500 mb-3">{data.shortDesc}</p>
        )}

        {advantages.slice(0, 4).map((f) => (
          <div key={f._key} className="flex items-start gap-1.5 mb-1">
            <CheckCircle2 size={12} className="mt-0.5 shrink-0 text-emerald-500" />
            <span className="text-xs text-slate-600">{f.text}</span>
          </div>
        ))}
        {disadvantages.slice(0, 2).map((f) => (
          <div key={f._key} className="flex items-start gap-1.5 mb-1">
            <XCircle size={12} className="mt-0.5 shrink-0 text-red-400" />
            <span className="text-xs text-slate-500">{f.text}</span>
          </div>
        ))}

        {(data.ctaLabel || data.ctaLabel2) && (
          <div className="mt-4 flex gap-2">
            {data.ctaLabel && (
              <div
                className="flex-1 rounded-lg py-1.5 text-center text-xs font-semibold text-white"
                style={{ backgroundColor: color }}
              >
                {data.ctaLabel}
              </div>
            )}
            {data.ctaLabel2 && (
              <div className="flex-1 rounded-lg border border-[#E4EAF5] py-1.5 text-center text-xs font-semibold text-slate-600">
                {data.ctaLabel2}
              </div>
            )}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between">
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
            data.status === "PUBLISHED" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
          }`}>
            {data.status === "PUBLISHED" ? "Yayında" : "Taslak"}
          </span>
        </div>
      </div>
    </div>
  )
}
