"use client"

import { useState, useTransition } from "react"
import { Reorder, useDragControls } from "framer-motion"
import { GripVertical, ChevronDown, Save, Loader2, CheckCircle, Eye, MessageSquareText, ListChecks, Award, Settings2 } from "lucide-react"
import ListItemEditor from "@/components/admin/shared/ListItemEditor"
import StepEditor, { type StepState } from "./StepEditor"
import ResultEditor, { type ResultState } from "./ResultEditor"
import PartnerixPreview from "./PartnerixPreview"
import { updatePartnerixFlow } from "@/lib/actions/partnerix"
import type { PartnerixFlowFull } from "@/lib/actions/partnerix"

export interface BubbleState { _key: string; text: string; delay: number }

interface Props {
  initialData: PartnerixFlowFull
  allPlatforms: { id: string; name: string }[]
  allSolutions: { id: string; title: string }[]
  allPartners: { id: string; name: string }[]
}

const INPUT = "w-full rounded-xl border border-[#E4EAF5] bg-[#F8FAFC] px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition"
const LABEL = "mb-1.5 block text-sm font-medium text-slate-700"
const SMALL_INPUT = "w-full rounded-lg border border-[#E4EAF5] bg-white px-3 py-1.5 text-sm text-slate-800 outline-none focus:border-[#3730A3] transition"

function Section({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#E4EAF5] bg-white p-6">
      <div className="mb-5 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EEF2FF]">
          <Icon size={15} className="text-[#4F46E5]" />
        </div>
        <h2 className="text-sm font-semibold text-slate-700">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function StepRow({ step, onChange, onDelete, expanded, onExpand, ...editorProps }: {
  step: StepState
  onChange: (s: StepState) => void
  onDelete: () => void
  expanded: boolean
  onExpand: () => void
  allPlatforms: { id: string; name: string }[]
  allSolutions: { id: string; title: string }[]
  resultChoices: { _key: string; title: string }[]
}) {
  const controls = useDragControls()
  return (
    <Reorder.Item value={step} dragListener={false} dragControls={controls} className="rounded-2xl border border-[#E4EAF5] bg-white">
      <div className="flex items-center gap-3 px-4 py-3">
        <button type="button" onPointerDown={(e) => controls.start(e)} className="touch-none cursor-grab text-slate-300 hover:text-slate-500 active:cursor-grabbing">
          <GripVertical size={17} />
        </button>
        <button type="button" onClick={onExpand} className="flex-1 truncate text-left text-sm font-medium text-slate-700">
          {step.question || "(soru boş)"}
          <span className="ml-2 text-xs text-slate-400">{step.options.length} seçenek</span>
        </button>
        <button type="button" onClick={onExpand} className={`rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition ${expanded ? "rotate-180" : ""}`}>
          <ChevronDown size={16} />
        </button>
      </div>
      {expanded && (
        <div className="border-t border-[#F0F4F8] p-5">
          <StepEditor step={step} onChange={onChange} {...editorProps} />
          <button type="button" onClick={onDelete} className="mt-4 text-xs font-medium text-red-500 hover:underline">
            Bu adımı sil
          </button>
        </div>
      )}
    </Reorder.Item>
  )
}

function ResultRow({ result, onChange, onDelete, expanded, onExpand, ...editorProps }: {
  result: ResultState
  onChange: (r: ResultState) => void
  onDelete: () => void
  expanded: boolean
  onExpand: () => void
  allPlatforms: { id: string; name: string }[]
  allSolutions: { id: string; title: string }[]
  allPartners: { id: string; name: string }[]
}) {
  const controls = useDragControls()
  return (
    <Reorder.Item value={result} dragListener={false} dragControls={controls} className="rounded-2xl border border-[#E4EAF5] bg-white">
      <div className="flex items-center gap-3 px-4 py-3">
        <button type="button" onPointerDown={(e) => controls.start(e)} className="touch-none cursor-grab text-slate-300 hover:text-slate-500 active:cursor-grabbing">
          <GripVertical size={17} />
        </button>
        <button type="button" onClick={onExpand} className="flex-1 truncate text-left text-sm font-medium text-slate-700">
          {result.title || "(başlıksız sonuç)"}
        </button>
        <button type="button" onClick={onExpand} className={`rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition ${expanded ? "rotate-180" : ""}`}>
          <ChevronDown size={16} />
        </button>
      </div>
      {expanded && (
        <div className="border-t border-[#F0F4F8] p-5">
          <ResultEditor result={result} onChange={onChange} {...editorProps} />
          <button type="button" onClick={onDelete} className="mt-4 text-xs font-medium text-red-500 hover:underline">
            Bu sonucu sil
          </button>
        </div>
      )}
    </Reorder.Item>
  )
}

export default function PartnerixFlowEditor({ initialData, allPlatforms, allSolutions, allPartners }: Props) {
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  const [name, setName] = useState(initialData?.name ?? "Varsayılan Akış")
  const [slug, setSlug] = useState(initialData?.slug ?? "default")
  const [welcomeMsg, setWelcomeMsg] = useState(initialData?.welcomeMsg ?? "")
  const [robotImage, setRobotImage] = useState(initialData?.robotImage ?? "")
  const [active, setActive] = useState(initialData?.active ?? true)
  const [status, setStatus] = useState<string>(initialData?.status ?? "DRAFT")

  const [bubbles, setBubbles] = useState<BubbleState[]>(
    (initialData?.bubbles ?? []).map((b) => ({ _key: b.id, text: b.text, delay: b.delay }))
  )
  const [results, setResults] = useState<ResultState[]>(
    (initialData?.results ?? []).map((r) => ({
      _key: r.id, id: r.id, title: r.title, message: r.message ?? "", ctaText: r.ctaText ?? "",
      ctaHref: r.ctaHref ?? "", ctaType: r.ctaType, conversions: r.conversions,
      platformIds: r.recommendedPlatforms.map((p) => p.platformId),
      solutionIds: r.recommendedSolutions.map((s) => s.solutionId),
      partnerIds: r.recommendedPartners.map((p) => p.partnerId),
    }))
  )
  const [steps, setSteps] = useState<StepState[]>(
    (initialData?.steps ?? []).map((s) => ({
      _key: s.id,
      question: s.question,
      options: s.options.map((o) => ({
        _key: o.id, label: o.label, value: o.value, icon: o.icon ?? "Star", color: o.color ?? "",
        resultKey: o.resultId ?? "",
        platformScores: o.platformScores.map((ps) => ({ platformId: ps.platformId, score: ps.score })),
        solutionScores: o.solutionScores.map((ss) => ({ solutionId: ss.solutionId, score: ss.score })),
      })),
    }))
  )

  const [expandedStepKey, setExpandedStepKey] = useState<string | null>(null)
  const [expandedResultKey, setExpandedResultKey] = useState<string | null>(null)

  const resultChoices = results.map((r) => ({ _key: r._key, title: r.title }))

  function handleSave() {
    setError(null)
    startTransition(async () => {
      const result = await updatePartnerixFlow({
        name, slug, welcomeMsg: welcomeMsg || null, robotImage: robotImage || null, active, status,
        bubbles: bubbles.map((b) => ({ text: b.text, delay: b.delay })),
        steps: steps.map((s) => ({
          question: s.question,
          options: s.options.map((o) => ({
            label: o.label, value: o.value, icon: o.icon || null, color: o.color || null,
            resultKey: o.resultKey || null,
            platformScores: o.platformScores, solutionScores: o.solutionScores,
          })),
        })),
        results: results.map((r) => ({
          _key: r._key, title: r.title, message: r.message || null, ctaText: r.ctaText || null,
          ctaHref: r.ctaHref || null, ctaType: r.ctaType,
          platformIds: r.platformIds, solutionIds: r.solutionIds, partnerIds: r.partnerIds,
        })),
      })
      if (result.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        setError(result.error ?? "Kayıt hatası")
      }
    })
  }

  return (
    <div className="space-y-5">
      {error && <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Partnerix Flow Editörü</h1>
          <p className="mt-1 text-sm text-slate-500">Hero'daki soru-cevap eşleştirme sihirbazını yönetin</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-emerald-600">
              <CheckCircle size={15} /> Kaydedildi
            </span>
          )}
          <button type="button" onClick={() => setPreviewOpen(true)} className="flex items-center gap-2 rounded-xl border border-[#E4EAF5] bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
            <Eye size={15} /> Önizleme
          </button>
          <button type="button" onClick={handleSave} disabled={isPending} className="flex items-center gap-2 rounded-xl bg-[#3730A3] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#312E8A] disabled:opacity-60 transition">
            {isPending ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {isPending ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </div>

      <Section title="Ayarlar" icon={Settings2}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Akış Adı</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Slug</label>
              <input value={slug} onChange={(e) => setSlug(e.target.value)} className={INPUT} />
            </div>
          </div>
          <div>
            <label className={LABEL}>Karşılama Mesajı</label>
            <input value={welcomeMsg} onChange={(e) => setWelcomeMsg(e.target.value)} className={INPUT} placeholder="Merhaba! 👋 Ben Partnerix." />
          </div>
          <div>
            <label className={LABEL}>Robot Görseli URL</label>
            <input value={robotImage} onChange={(e) => setRobotImage(e.target.value)} className={INPUT} placeholder="https://..." />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-[#3730A3]" />
              Aktif akış (sitede gösterilen)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-700">Durum:</span>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-[#E4EAF5] bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 outline-none focus:border-[#3730A3]">
                <option value="DRAFT">Taslak</option>
                <option value="PUBLISHED">Yayında</option>
              </select>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Konuşma Balonları" icon={MessageSquareText}>
        <ListItemEditor
          items={bubbles}
          onChange={setBubbles}
          addLabel="Balon Ekle"
          emptyLabel="Henüz balon eklenmedi"
          onAdd={() => ({ _key: `new-${Date.now()}`, text: "", delay: 0.3 })}
          renderItem={(bubble, update) => (
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <input value={bubble.text} onChange={(e) => update({ text: e.target.value })} placeholder="Balon metni" className={SMALL_INPUT} />
              <input type="number" step="0.1" value={bubble.delay} onChange={(e) => update({ delay: Number(e.target.value) })} className="w-20 rounded-lg border border-[#E4EAF5] bg-white px-2 py-1.5 text-sm outline-none focus:border-[#3730A3]" />
            </div>
          )}
        />
      </Section>

      <Section title="Adımlar" icon={ListChecks}>
        {steps.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 py-6 text-center text-xs text-slate-400">Henüz adım eklenmedi</div>
        ) : (
          <Reorder.Group axis="y" values={steps} onReorder={setSteps} className="space-y-2">
            {steps.map((step) => (
              <StepRow
                key={step._key}
                step={step}
                onChange={(s) => setSteps((prev) => prev.map((p) => (p._key === s._key ? s : p)))}
                onDelete={() => setSteps((prev) => prev.filter((p) => p._key !== step._key))}
                expanded={expandedStepKey === step._key}
                onExpand={() => setExpandedStepKey((k) => (k === step._key ? null : step._key))}
                allPlatforms={allPlatforms}
                allSolutions={allSolutions}
                resultChoices={resultChoices}
              />
            ))}
          </Reorder.Group>
        )}
        <button
          type="button"
          onClick={() => setSteps((prev) => [...prev, { _key: `new-${Date.now()}`, question: "", options: [] }])}
          className="mt-3 flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#4F46E5] hover:bg-[#EEF2FF] transition"
        >
          + Adım Ekle
        </button>
      </Section>

      <Section title="Sonuçlar" icon={Award}>
        {results.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 py-6 text-center text-xs text-slate-400">Henüz sonuç eklenmedi</div>
        ) : (
          <Reorder.Group axis="y" values={results} onReorder={setResults} className="space-y-2">
            {results.map((result) => (
              <ResultRow
                key={result._key}
                result={result}
                onChange={(r) => setResults((prev) => prev.map((p) => (p._key === r._key ? r : p)))}
                onDelete={() => setResults((prev) => prev.filter((p) => p._key !== result._key))}
                expanded={expandedResultKey === result._key}
                onExpand={() => setExpandedResultKey((k) => (k === result._key ? null : result._key))}
                allPlatforms={allPlatforms}
                allSolutions={allSolutions}
                allPartners={allPartners}
              />
            ))}
          </Reorder.Group>
        )}
        <button
          type="button"
          onClick={() => setResults((prev) => [...prev, { _key: `new-${Date.now()}`, title: "", message: "", ctaText: "", ctaHref: "", ctaType: "whatsapp", platformIds: [], solutionIds: [], partnerIds: [] }])}
          className="mt-3 flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#4F46E5] hover:bg-[#EEF2FF] transition"
        >
          + Sonuç Ekle
        </button>
      </Section>

      {previewOpen && (
        <PartnerixPreview welcomeMsg={welcomeMsg} bubbles={bubbles} steps={steps} results={results} onClose={() => setPreviewOpen(false)} />
      )}
    </div>
  )
}
