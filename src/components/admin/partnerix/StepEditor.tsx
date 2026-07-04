"use client"

import { X } from "lucide-react"
import ListItemEditor from "@/components/admin/shared/ListItemEditor"
import { ICON_OPTIONS } from "@/lib/icon-map"

export interface OptionState {
  _key: string
  label: string
  value: string
  icon: string
  color: string
  resultKey: string
  platformScores: { platformId: string; score: number }[]
  solutionScores: { solutionId: string; score: number }[]
}

export interface StepState {
  _key: string
  question: string
  options: OptionState[]
}

interface Props {
  step: StepState
  onChange: (step: StepState) => void
  allPlatforms: { id: string; name: string }[]
  allSolutions: { id: string; title: string }[]
  resultChoices: { _key: string; title: string }[]
}

const INPUT = "w-full rounded-xl border border-[#E4EAF5] bg-[#F8FAFC] px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition"
const LABEL = "mb-1.5 block text-sm font-medium text-slate-700"
const SMALL_INPUT = "w-full rounded-lg border border-[#E4EAF5] bg-white px-3 py-1.5 text-sm text-slate-800 outline-none focus:border-[#3730A3] transition"

function ScoreRow({
  label, items, options, onAdd, onChangeScore, onRemove, placeholder,
}: {
  label: string
  items: { id: string; score: number }[]
  options: { id: string; label: string }[]
  onAdd: (id: string) => void
  onChangeScore: (id: string, score: number) => void
  onRemove: (id: string) => void
  placeholder: string
}) {
  const available = options.filter((o) => !items.some((i) => i.id === o.id))
  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <div className="space-y-1.5">
        {items.map((item) => {
          const opt = options.find((o) => o.id === item.id)
          return (
            <div key={item.id} className="flex items-center gap-2 rounded-lg border border-[#E4EAF5] bg-white px-2.5 py-1.5">
              <span className="flex-1 truncate text-xs text-slate-600">{opt?.label ?? item.id}</span>
              <input
                type="number"
                value={item.score}
                onChange={(e) => onChangeScore(item.id, Number(e.target.value))}
                className="w-14 rounded border border-[#E4EAF5] px-1.5 py-0.5 text-xs outline-none focus:border-[#3730A3]"
              />
              <button type="button" onClick={() => onRemove(item.id)} className="text-slate-300 hover:text-red-500">
                <X size={13} />
              </button>
            </div>
          )
        })}
        {available.length > 0 && (
          <select
            value=""
            onChange={(e) => { if (e.target.value) onAdd(e.target.value) }}
            className={SMALL_INPUT}
          >
            <option value="">{placeholder}</option>
            {available.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
        )}
      </div>
    </div>
  )
}

export default function StepEditor({ step, onChange, allPlatforms, allSolutions, resultChoices }: Props) {
  function updateOption(key: string, patch: Partial<OptionState>) {
    onChange({ ...step, options: step.options.map((o) => (o._key === key ? { ...o, ...patch } : o)) })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className={LABEL}>Soru Metni</label>
        <input value={step.question} onChange={(e) => onChange({ ...step, question: e.target.value })} className={INPUT} placeholder="İşletmenizin faaliyet alanı nedir?" />
      </div>

      <div>
        <label className={LABEL}>Seçenekler</label>
        <ListItemEditor
          items={step.options}
          onChange={(options) => onChange({ ...step, options: options as OptionState[] })}
          addLabel="Seçenek Ekle"
          emptyLabel="Henüz seçenek eklenmedi"
          onAdd={() => ({
            _key: `new-${Date.now()}`, label: "", value: "", icon: "Star", color: "bg-[#EEF2FF] text-[#4F46E5]",
            resultKey: "", platformScores: [], solutionScores: [],
          })}
          renderItem={(option) => (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <input value={option.label} onChange={(e) => updateOption(option._key, { label: e.target.value })} placeholder="Etiket (ör. E-Ticaret)" className={SMALL_INPUT} />
                <input value={option.value} onChange={(e) => updateOption(option._key, { value: e.target.value })} placeholder="Değer (ör. eticaret)" className={SMALL_INPUT} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select value={option.icon} onChange={(e) => updateOption(option._key, { icon: e.target.value })} className={SMALL_INPUT}>
                  {ICON_OPTIONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                </select>
                <input value={option.color} onChange={(e) => updateOption(option._key, { color: e.target.value })} placeholder="Tailwind renk sınıfı" className={SMALL_INPUT} />
              </div>

              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">Bağlı Sonuç</p>
                <select value={option.resultKey} onChange={(e) => updateOption(option._key, { resultKey: e.target.value })} className={SMALL_INPUT}>
                  <option value="">Sonuç yok</option>
                  {resultChoices.map((r) => <option key={r._key} value={r._key}>{r.title || "(başlıksız sonuç)"}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <ScoreRow
                  label="Platform Puanları"
                  items={option.platformScores.map((s) => ({ id: s.platformId, score: s.score }))}
                  options={allPlatforms.map((p) => ({ id: p.id, label: p.name }))}
                  placeholder="Platform ekle..."
                  onAdd={(id) => updateOption(option._key, { platformScores: [...option.platformScores, { platformId: id, score: 1 }] })}
                  onChangeScore={(id, score) => updateOption(option._key, { platformScores: option.platformScores.map((s) => (s.platformId === id ? { ...s, score } : s)) })}
                  onRemove={(id) => updateOption(option._key, { platformScores: option.platformScores.filter((s) => s.platformId !== id) })}
                />
                <ScoreRow
                  label="Çözüm Puanları"
                  items={option.solutionScores.map((s) => ({ id: s.solutionId, score: s.score }))}
                  options={allSolutions.map((s) => ({ id: s.id, label: s.title }))}
                  placeholder="Çözüm ekle..."
                  onAdd={(id) => updateOption(option._key, { solutionScores: [...option.solutionScores, { solutionId: id, score: 1 }] })}
                  onChangeScore={(id, score) => updateOption(option._key, { solutionScores: option.solutionScores.map((s) => (s.solutionId === id ? { ...s, score } : s)) })}
                  onRemove={(id) => updateOption(option._key, { solutionScores: option.solutionScores.filter((s) => s.solutionId !== id) })}
                />
              </div>
            </div>
          )}
        />
      </div>
    </div>
  )
}
