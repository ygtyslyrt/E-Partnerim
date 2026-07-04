"use client"

export interface ResultState {
  _key: string
  id?: string
  title: string
  message: string
  ctaText: string
  ctaHref: string
  ctaType: string
  conversions?: number
  platformIds: string[]
  solutionIds: string[]
  partnerIds: string[]
}

interface Props {
  result: ResultState
  onChange: (result: ResultState) => void
  allPlatforms: { id: string; name: string }[]
  allSolutions: { id: string; title: string }[]
  allPartners: { id: string; name: string }[]
}

const INPUT = "w-full rounded-xl border border-[#E4EAF5] bg-[#F8FAFC] px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition"
const LABEL = "mb-1.5 block text-sm font-medium text-slate-700"

const CTA_TYPES = ["whatsapp", "mail", "phone", "link"]

export default function ResultEditor({ result, onChange, allPlatforms, allSolutions, allPartners }: Props) {
  function toggle(list: string[], key: "platformIds" | "solutionIds" | "partnerIds", id: string) {
    onChange({ ...result, [key]: list.includes(id) ? list.filter((x) => x !== id) : [...list, id] })
  }

  return (
    <div className="space-y-4">
      {result.conversions !== undefined && (
        <p className="text-xs text-slate-400">Dönüşüm sayısı: <span className="font-semibold text-slate-600">{result.conversions}</span></p>
      )}

      <div>
        <label className={LABEL}>Sonuç Başlığı *</label>
        <input value={result.title} onChange={(e) => onChange({ ...result, title: e.target.value })} className={INPUT} placeholder="Analiz Tamamlandı! 🎉" />
      </div>
      <div>
        <label className={LABEL}>Mesaj</label>
        <textarea value={result.message} onChange={(e) => onChange({ ...result, message: e.target.value })} rows={3} className={`${INPUT} resize-none`} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className={LABEL}>CTA Metni</label>
          <input value={result.ctaText} onChange={(e) => onChange({ ...result, ctaText: e.target.value })} className={INPUT} placeholder="WhatsApp'ta Danışmanlık Al" />
        </div>
        <div>
          <label className={LABEL}>CTA Bağlantısı</label>
          <input value={result.ctaHref} onChange={(e) => onChange({ ...result, ctaHref: e.target.value })} className={INPUT} placeholder="https://wa.me/..." />
        </div>
        <div>
          <label className={LABEL}>CTA Türü</label>
          <select value={result.ctaType} onChange={(e) => onChange({ ...result, ctaType: e.target.value })} className={INPUT}>
            {CTA_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Önerilen Platformlar</p>
        <div className="flex flex-wrap gap-2">
          {allPlatforms.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => toggle(result.platformIds, "platformIds", p.id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${result.platformIds.includes(p.id) ? "border-[#00D084] bg-[#F0FDF9] text-[#00D084]" : "border-[#E4EAF5] text-slate-600 hover:bg-slate-50"}`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Önerilen Çözümler</p>
        <div className="flex flex-wrap gap-2">
          {allSolutions.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => toggle(result.solutionIds, "solutionIds", s.id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${result.solutionIds.includes(s.id) ? "border-[#4F46E5] bg-[#EEF2FF] text-[#4F46E5]" : "border-[#E4EAF5] text-slate-600 hover:bg-slate-50"}`}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Önerilen Partnerler</p>
        <div className="flex flex-wrap gap-2">
          {allPartners.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => toggle(result.partnerIds, "partnerIds", p.id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${result.partnerIds.includes(p.id) ? "border-[#3730A3] bg-[#EEF2FF] text-[#3730A3]" : "border-[#E4EAF5] text-slate-600 hover:bg-slate-50"}`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
