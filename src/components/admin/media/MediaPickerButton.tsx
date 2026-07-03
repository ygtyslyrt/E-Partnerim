"use client"

import { useState } from "react"
import { Images, X, Upload, Loader2 } from "lucide-react"
import MediaPickerModal from "./MediaPickerModal"
import type { MediaItem } from "@/lib/actions/media"

interface Props {
  value: string
  onChange: (url: string) => void
  label?: string
  hint?: string
  mimePrefix?: string
}

export default function MediaPickerButton({ value, onChange, label = "Görsel", hint, mimePrefix = "image/" }: Props) {
  const [open, setOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleSelect(item: MediaItem) {
    onChange(item.webpUrl || item.url)
    setError(null)
  }

  async function handleDirectUpload(file: File) {
    setUploading(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/upload/media", { method: "POST", body: fd })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Yükleme başarısız")
      onChange(json.webpUrl || json.url)
    } catch (e: unknown) {
      setError((e as Error).message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700">{label}</label>

        {value ? (
          <div className="group relative overflow-hidden rounded-xl border border-[#E4EAF5] bg-slate-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt={label} className="max-h-44 w-full object-contain" />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onClick={() => setOpen(true)}
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
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleDirectUpload(f) }}
            className="rounded-xl border-2 border-dashed border-[#E4EAF5] bg-[#F8FAFC] p-6"
          >
            <div className="flex flex-col items-center gap-3">
              {uploading ? (
                <Loader2 size={28} className="animate-spin text-[#4F46E5]" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
                  <Upload size={20} className="text-slate-300" />
                </div>
              )}
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#4F46E5] px-4 py-2 text-xs font-semibold text-white hover:bg-[#4338CA] transition"
                >
                  <Images size={13} />
                  Medyadan Seç
                </button>
                <p className="mt-2 text-xs text-slate-400">veya sürükle bırak</p>
              </div>
            </div>
          </div>
        )}

        {!value && (
          <>
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
              className="w-full rounded-xl border border-[#E4EAF5] bg-[#F8FAFC] px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition"
            />
          </>
        )}

        {error && <p className="text-xs text-red-500">{error}</p>}
        {hint && <p className="text-xs text-slate-400">{hint}</p>}
      </div>

      <MediaPickerModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSelect={handleSelect}
        mimePrefix={mimePrefix}
        title={`${label} Seç`}
      />
    </>
  )
}
