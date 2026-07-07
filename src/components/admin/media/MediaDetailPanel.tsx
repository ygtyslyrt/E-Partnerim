"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { X, Copy, Check, Trash2, ExternalLink, FileText, File, Link2, Loader2 } from "lucide-react"
import { updateMedia, getMediaUsage } from "@/lib/actions/media"
import type { MediaItem, MediaUsageItem } from "@/lib/actions/media"
import Toast, { type ToastState } from "@/components/admin/shared/Toast"

interface Props {
  item: MediaItem
  onUpdate: (item: MediaItem) => void
  onDelete: (id: string) => void
  onClose: () => void
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", { dateStyle: "long" })
}

export default function MediaDetailPanel({ item, onUpdate, onDelete, onClose }: Props) {
  const [alt, setAlt] = useState(item.alt ?? "")
  const [title, setTitle] = useState(item.title ?? "")
  const [desc, setDesc] = useState(item.description ?? "")
  const [filename, setFilename] = useState(item.originalName)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [usage, setUsage] = useState<MediaUsageItem[]>([])
  const [loadingUsage, setLoadingUsage] = useState(true)
  const [toast, setToast] = useState<ToastState | null>(null)

  const isImage = item.mimeType.startsWith("image/")
  const isSvg = item.mimeType === "image/svg+xml"
  const displayUrl = item.webpUrl || item.url

  useEffect(() => {
    setAlt(item.alt ?? "")
    setTitle(item.title ?? "")
    setDesc(item.description ?? "")
    setFilename(item.originalName)
    setConfirmDelete(false)
  }, [item.id, item.alt, item.title, item.description, item.originalName])

  useEffect(() => {
    setLoadingUsage(true)
    getMediaUsage(item.id).then((rows) => {
      setUsage(rows)
      setLoadingUsage(false)
    })
  }, [item.id])

  async function handleSave() {
    setSaving(true)
    const res = await updateMedia(item.id, { alt, title, description: desc, originalName: filename })
    setSaving(false)
    if (res.success && res.data) {
      onUpdate(res.data)
      setToast({ message: "Kaydedildi", type: "success" })
    } else {
      setToast({ message: res.error ?? "Kayıt hatası", type: "error" })
    }
  }

  async function copyUrl() {
    await navigator.clipboard.writeText(displayUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const inputCls = "w-full rounded-xl border border-[#E4EAF5] bg-[#F8FAFC] px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 transition"

  return (
    <div className="flex flex-col h-full border-l border-[#E4EAF5] bg-white w-72 shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#E4EAF5]">
        <span className="text-sm font-semibold text-slate-700">Dosya Detayı</span>
        <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Preview */}
        <div className="border-b border-[#E4EAF5] bg-[#F8FAFC] flex items-center justify-center p-4" style={{ minHeight: 180 }}>
          {isImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={isSvg ? item.url : (item.thumbnailUrl || item.url)}
              alt={item.alt ?? item.originalName}
              className="max-h-40 max-w-full object-contain rounded-lg"
            />
          ) : item.mimeType === "application/pdf" ? (
            <div className="flex flex-col items-center gap-3 text-slate-400">
              <FileText size={52} className="text-red-300" />
              <span className="text-xs font-bold uppercase tracking-widest text-red-400">PDF</span>
            </div>
          ) : (
            <File size={52} className="text-slate-200" />
          )}
        </div>

        <div className="px-4 py-4 space-y-4">
          {/* File info */}
          <div className="rounded-xl bg-[#F8FAFC] border border-[#E4EAF5] divide-y divide-[#E4EAF5]">
            <Row label="Dosya" value={item.originalName} truncate />
            <Row label="Tür" value={item.mimeType} />
            <Row label="Boyut" value={formatBytes(item.size)} />
            {item.width && item.height && <Row label="Boyutlar" value={`${item.width} × ${item.height} px`} />}
            <Row label="Tarih" value={formatDate(item.createdAt)} />
          </div>

          {/* Copy URL */}
          <button
            onClick={copyUrl}
            className="flex w-full items-center gap-2 rounded-xl border border-[#E4EAF5] px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition"
          >
            {copied ? <Check size={15} className="text-green-500" /> : <Copy size={15} />}
            <span className="flex-1 text-left truncate text-xs">{copied ? "Kopyalandı!" : displayUrl}</span>
          </button>

          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#E4EAF5] px-3 py-2 text-xs text-slate-500 hover:bg-slate-50 transition"
          >
            <ExternalLink size={13} />
            Yeni sekmede aç
          </a>

          {/* Usage info */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <Link2 size={12} />
              Kullanıldığı Yerler
            </label>
            {loadingUsage ? (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Loader2 size={13} className="animate-spin" />
                Yükleniyor...
              </div>
            ) : usage.length === 0 ? (
              <p className="text-xs text-slate-400">Bu dosya herhangi bir içerikte kullanılmıyor.</p>
            ) : (
              <ul className="space-y-1.5">
                {usage.map((u) => (
                  <li key={u.id}>
                    <Link
                      href={u.entityHref}
                      target="_blank"
                      className="flex items-center justify-between gap-2 rounded-lg border border-[#E4EAF5] bg-[#F8FAFC] px-2.5 py-1.5 text-xs text-slate-600 hover:border-[#4F46E5]/30 hover:bg-[#EEF2FF] transition"
                    >
                      <span className="truncate">{u.entityLabel}</span>
                      <span className="shrink-0 rounded-full bg-white border border-[#E4EAF5] px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
                        {u.fieldName}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Alt text */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Dosya Adı</label>
              <input type="text" value={filename} onChange={(e) => setFilename(e.target.value)} placeholder="Dosya adı..." className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Alt Metin</label>
              <input type="text" value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Görsel açıklaması..." className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Başlık</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Başlık..." className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Açıklama</label>
              <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Açıklama..." rows={3} className={`${inputCls} resize-none`} />
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full rounded-xl bg-[#4F46E5] py-2.5 text-sm font-semibold text-white hover:bg-[#4338CA] disabled:opacity-60 transition"
            >
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </div>
      </div>

      {/* Delete */}
      <div className="border-t border-[#E4EAF5] p-4">
        {confirmDelete ? (
          <div className="flex gap-2">
            <button
              onClick={() => onDelete(item.id)}
              className="flex-1 rounded-xl bg-red-600 py-2 text-xs font-semibold text-white hover:bg-red-700 transition"
            >
              Sil
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="flex-1 rounded-xl border border-[#E4EAF5] py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              İptal
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 py-2 text-xs font-medium text-red-500 hover:bg-red-50 hover:border-red-300 transition"
          >
            <Trash2 size={13} />
            Dosyayı Sil
          </button>
        )}
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}

function Row({ label, value, truncate }: { label: string; value: string; truncate?: boolean }) {
  return (
    <div className="flex items-start gap-2 px-3 py-2">
      <span className="text-[11px] text-slate-400 shrink-0 w-16">{label}</span>
      <span className={`text-[11px] text-slate-700 font-medium ${truncate ? "truncate" : "break-all"}`}>{value}</span>
    </div>
  )
}
