"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Search, X, Upload, Check, Loader2 } from "lucide-react"
import { getMedia } from "@/lib/actions/media"
import type { MediaItem } from "@/lib/actions/media"

interface Props {
  isOpen: boolean
  onClose: () => void
  onSelect: (item: MediaItem) => void
  mimePrefix?: string
  title?: string
}

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export default function MediaPickerModal({ isOpen, onClose, onSelect, mimePrefix = "", title = "Medyadan Seç" }: Props) {
  const [files, setFiles] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedFile, setSelectedFile] = useState<MediaItem | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const load = useCallback(async (s: string) => {
    setLoading(true)
    const res = await getMedia({ search: s, mimePrefix, pageSize: 60 })
    setFiles(res.data)
    setLoading(false)
  }, [mimePrefix])

  useEffect(() => {
    if (!isOpen) return
    setSelectedFile(null)
    setSearch("")
    setUploadError(null)
    load("")
  }, [isOpen, load])

  function handleSearch(value: string) {
    setSearch(value)
    if (searchTimer.current) clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => load(value), 350)
  }

  async function handleUpload(file: File) {
    setUploading(true)
    setUploadError(null)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/upload/media", { method: "POST", body: fd })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Yükleme başarısız")
      const newItem: MediaItem = json
      setFiles((prev) => [newItem, ...prev])
      setSelectedFile(newItem)
    } catch (e: unknown) {
      setUploadError((e as Error).message)
    } finally {
      setUploading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="flex flex-col bg-white rounded-2xl shadow-2xl w-[min(900px,95vw)] h-[min(640px,90vh)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E4EAF5]">
          <h2 className="flex-1 text-base font-bold text-slate-800">{title}</h2>

          {/* Upload button */}
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 rounded-xl border border-[#E4EAF5] bg-[#F8FAFC] px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
          >
            {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
            Dosya Yükle
          </button>

          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Ara..."
              className="rounded-xl border border-[#E4EAF5] bg-[#F8FAFC] pl-8 pr-3 py-2 text-sm outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 transition w-44"
            />
          </div>

          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {uploadError && (
            <div className="mb-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">{uploadError}</div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 size={28} className="animate-spin text-[#4F46E5]" />
            </div>
          ) : files.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-slate-400 gap-3">
              <p className="text-sm">Medya bulunamadı</p>
              <button
                onClick={() => inputRef.current?.click()}
                className="text-xs font-semibold text-[#4F46E5] hover:underline"
              >
                İlk dosyayı yükle
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {files.map((file) => {
                const isImg = file.mimeType.startsWith("image/")
                const thumb = file.thumbnailUrl || (isImg ? file.url : null)
                const isSelected = selectedFile?.id === file.id
                return (
                  <div
                    key={file.id}
                    onClick={() => setSelectedFile(isSelected ? null : file)}
                    className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                      isSelected ? "border-[#4F46E5] ring-2 ring-[#4F46E5]/20" : "border-[#E4EAF5] hover:border-[#C7D0E8]"
                    } bg-white`}
                  >
                    <div className="aspect-square flex items-center justify-center bg-[#F8FAFC] overflow-hidden">
                      {thumb ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={file.mimeType === "image/svg+xml" ? file.url : thumb} alt={file.alt ?? file.originalName} className="h-full w-full object-cover" loading="lazy" />
                      ) : (
                        <span className="text-2xl text-slate-300">📄</span>
                      )}
                    </div>
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#4F46E5]">
                        <Check size={11} className="text-white" />
                      </div>
                    )}
                    <div className="px-1.5 py-1 border-t border-[#F0F4F8]">
                      <p className="truncate text-[10px] text-slate-500">{file.originalName}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 justify-between px-5 py-3 border-t border-[#E4EAF5] bg-[#F8FAFC]">
          <span className="text-xs text-slate-500">
            {selectedFile ? (
              <>
                <span className="font-semibold text-slate-700">{selectedFile.originalName}</span>
                {" · "}{formatBytes(selectedFile.size)}
                {selectedFile.width && selectedFile.height && ` · ${selectedFile.width}×${selectedFile.height}px`}
              </>
            ) : "Bir dosya seçin"}
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-xl border border-[#E4EAF5] px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition"
            >
              İptal
            </button>
            <button
              onClick={() => { if (selectedFile) { onSelect(selectedFile); onClose() } }}
              disabled={!selectedFile}
              className="rounded-xl bg-[#4F46E5] px-5 py-2 text-sm font-semibold text-white hover:bg-[#4338CA] disabled:opacity-40 transition"
            >
              Seç
            </button>
          </div>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={mimePrefix ? `${mimePrefix}*` : "image/*,application/pdf"}
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); e.target.value = "" }}
        className="hidden"
      />
    </div>
  )
}
