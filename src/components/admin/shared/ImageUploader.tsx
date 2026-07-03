"use client"

import { useRef, useState } from "react"
import { Upload, X, Loader2, Images } from "lucide-react"
import dynamic from "next/dynamic"
import type { MediaItem } from "@/lib/actions/media"

const MediaPickerModal = dynamic(() => import("@/components/admin/media/MediaPickerModal"), { ssr: false })

interface Props {
  value: string
  onChange: (url: string) => void
  /** @deprecated unused — uploads go to media library */
  path?: string
  /** @deprecated unused — handled by API */
  maxWidth?: number
  label?: string
  hint?: string
}

export default function ImageUploader({
  value,
  onChange,
  label = "Görsel",
  hint,
}: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function upload(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Sadece görsel dosyaları kabul edilir")
      return
    }
    setUploading(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/upload/media", { method: "POST", body: fd })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Yükleme başarısız")
      onChange(json.webpUrl || json.url)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setUploading(false)
    }
  }

  function handleSelect(item: MediaItem) {
    onChange(item.webpUrl || item.url)
    setError(null)
  }

  const inputCls =
    "w-full rounded-xl border border-[#E4EAF5] bg-[#F8FAFC] px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition"

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700">{label}</label>

      {value ? (
        <div className="group relative overflow-hidden rounded-xl border border-[#E4EAF5] bg-slate-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt={label} className="max-h-44 w-full object-contain" />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              Değiştir
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="flex items-center justify-center rounded-lg bg-white p-2 text-red-500 hover:bg-red-50 transition"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) upload(f) }}
          className={`rounded-xl border-2 border-dashed px-6 py-8 transition-colors ${
            dragging ? "border-[#4F46E5] bg-[#EEF2FF]" : "border-[#E4EAF5] bg-[#F8FAFC]"
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            {uploading ? (
              <Loader2 size={28} className="animate-spin text-[#4F46E5]" />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                {dragging ? <Upload size={22} className="text-[#4F46E5]" /> : <Upload size={22} className="text-slate-300" />}
              </div>
            )}
            <div className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-[#4F46E5] px-4 py-2 text-xs font-semibold text-white hover:bg-[#4338CA] transition"
              >
                <Images size={13} />
                Medyadan Seç
              </button>
              <button
                type="button"
                onClick={() => !uploading && inputRef.current?.click()}
                className="text-xs text-slate-400 hover:text-slate-600 transition"
              >
                {uploading ? "Yükleniyor..." : "veya dosya yükle"}
              </button>
            </div>
            <p className="text-xs text-slate-400">PNG, JPG, WebP, SVG</p>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = "" }}
        className="hidden"
      />

      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-[#E4EAF5]" />
        <span className="text-[11px] text-slate-400">veya URL gir</span>
        <div className="h-px flex-1 bg-[#E4EAF5]" />
      </div>
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://..."
        className={inputCls}
      />
      {hint && <p className="text-xs text-slate-400">{hint}</p>}

      <MediaPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={handleSelect}
        mimePrefix="image/"
        title={`${label} Seç`}
      />
    </div>
  )
}
