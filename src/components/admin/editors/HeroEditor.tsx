"use client"

import { useState, useTransition } from "react"
import { updateHeroContent } from "@/lib/actions/hero"
import { Loader2, Save, CheckCircle } from "lucide-react"
import type { HeroSectionContent } from "@prisma/client"

interface Props {
  initialData: HeroSectionContent | null
}

export default function HeroEditor({ initialData }: Props) {
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    badge: initialData?.badge ?? "",
    title1: initialData?.title1 ?? "",
    title2: initialData?.title2 ?? "",
    subtitle: initialData?.subtitle ?? "",
    dotPattern: initialData?.dotPattern ?? true,
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSaved(false)

    startTransition(async () => {
      const result = await updateHeroContent({
        badge: form.badge || undefined,
        title1: form.title1,
        title2: form.title2,
        subtitle: form.subtitle || undefined,
        dotPattern: form.dotPattern,
      })

      if (result.success) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        setError(result.error ?? "Bilinmeyen hata")
      }
    })
  }

  const inputCls =
    "w-full rounded-xl border border-[#E4EAF5] bg-[#F8FAFC] px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition"
  const labelCls = "mb-1.5 block text-sm font-medium text-slate-700"

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div>
        <label className={labelCls}>Rozet metni</label>
        <input
          name="badge"
          value={form.badge}
          onChange={handleChange}
          placeholder="⚡ 10+ Yıllık Deneyim · %95 Başarı Oranı"
          className={inputCls}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Başlık 1. satır</label>
          <input
            name="title1"
            value={form.title1}
            onChange={handleChange}
            required
            placeholder="İşletmenizin"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Başlık 2. satır</label>
          <input
            name="title2"
            value={form.title2}
            onChange={handleChange}
            required
            placeholder="Dijital Yol Arkadaşı."
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label className={labelCls}>Alt başlık</label>
        <textarea
          name="subtitle"
          value={form.subtitle}
          onChange={handleChange}
          rows={3}
          placeholder="Partnerix işletmenizi analiz eder..."
          className={inputCls}
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="dotPattern"
          name="dotPattern"
          checked={form.dotPattern}
          onChange={handleChange}
          className="h-4 w-4 rounded border-slate-300 text-[#3730A3]"
        />
        <label htmlFor="dotPattern" className="text-sm text-slate-700">
          Nokta desen arka planı göster
        </label>
      </div>

      <div className="flex items-center gap-3 pt-2">
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
