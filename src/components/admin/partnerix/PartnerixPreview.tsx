"use client"

import { useState } from "react"
import { X, RotateCcw, ArrowRight } from "lucide-react"
import { getIcon } from "@/lib/icon-map"
import type { BubbleState } from "./PartnerixFlowEditor"
import type { StepState } from "./StepEditor"
import type { ResultState } from "./ResultEditor"

interface Props {
  welcomeMsg: string
  bubbles: BubbleState[]
  steps: StepState[]
  results: ResultState[]
  onClose: () => void
}

export default function PartnerixPreview({ welcomeMsg, bubbles, steps, results, onClose }: Props) {
  const [stepIndex, setStepIndex] = useState(0)
  const [resultKey, setResultKey] = useState<string | null>(null)
  const [noMatch, setNoMatch] = useState(false)

  const bubbleTexts = welcomeMsg ? [welcomeMsg, ...bubbles.slice(1).map((b) => b.text)] : bubbles.map((b) => b.text)
  const currentStep = steps[stepIndex]
  const matchedResult = resultKey ? results.find((r) => r._key === resultKey) : null

  function selectOption(optionResultKey: string) {
    if (optionResultKey) {
      setResultKey(optionResultKey)
      return
    }
    if (stepIndex < steps.length - 1) {
      setStepIndex((i) => i + 1)
    } else {
      setNoMatch(true)
    }
  }

  function reset() {
    setStepIndex(0)
    setResultKey(null)
    setNoMatch(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#E4EAF5] px-5 py-3.5">
          <span className="text-sm font-semibold text-slate-700">Önizleme</span>
          <div className="flex items-center gap-2">
            <button onClick={reset} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition" title="Baştan başlat">
              <RotateCcw size={15} />
            </button>
            <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {bubbleTexts.length > 0 && (
            <div className="mb-5 space-y-1.5">
              {bubbleTexts.map((text, i) => (
                <div key={i} className="w-fit rounded-2xl border border-[#E4EAF5] bg-[#F8FAFC] px-4 py-2">
                  <p className="text-xs text-slate-700">{text}</p>
                </div>
              ))}
            </div>
          )}

          {matchedResult ? (
            <div className="rounded-2xl border border-[#00D084]/20 bg-[#F0FDF9] p-6 text-center">
              <h3 className="text-lg font-bold text-slate-800">{matchedResult.title || "(başlıksız sonuç)"}</h3>
              {matchedResult.message && <p className="mt-2 text-sm text-slate-600">{matchedResult.message}</p>}
              {matchedResult.ctaText && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#00D084] px-4 py-2 text-sm font-semibold text-white">
                  {matchedResult.ctaText} <ArrowRight size={14} />
                </div>
              )}
            </div>
          ) : noMatch ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center text-sm text-amber-700">
              Bu yol için hiçbir seçenek bir Sonuca bağlanmamış. Seçeneklere "Bağlı Sonuç" atayın.
            </div>
          ) : currentStep ? (
            <div>
              <p className="mb-1.5 text-xs text-slate-400">Adım {stepIndex + 1} / {steps.length}</p>
              <h3 className="mb-4 text-base font-bold text-slate-800">{currentStep.question || "(soru boş)"}</h3>
              <div className="grid grid-cols-2 gap-2">
                {currentStep.options.map((opt) => {
                  const Icon = getIcon(opt.icon)
                  return (
                    <button
                      key={opt._key}
                      onClick={() => selectOption(opt.resultKey)}
                      className="flex items-center gap-2 rounded-xl border border-[#E4EAF5] bg-white px-3 py-2.5 text-left text-sm text-slate-700 hover:border-[#4F46E5]/40 hover:bg-[#EEF2FF] transition"
                    >
                      <Icon size={15} className="shrink-0 text-[#4F46E5]" />
                      {opt.label || "(etiketsiz)"}
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400">Henüz adım eklenmedi.</p>
          )}
        </div>
      </div>
    </div>
  )
}
