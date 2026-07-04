"use client"

import { FileText, File, Star } from "lucide-react"
import type { MediaItem } from "@/lib/actions/media"

interface Props {
  item: MediaItem
  selected: boolean
  active: boolean
  onSelect: (id: string, multi: boolean) => void
  onOpen: (item: MediaItem) => void
  onToggleFavorite: (id: string) => void
  onDragStart: (e: React.DragEvent, item: MediaItem) => void
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("tr-TR", { dateStyle: "medium" })
}

export default function MediaListRow({ item, selected, active, onSelect, onOpen, onToggleFavorite, onDragStart }: Props) {
  const isImage = item.mimeType.startsWith("image/")
  const isSvg = item.mimeType === "image/svg+xml"
  const thumb = item.thumbnailUrl || (isImage ? item.url : null)

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, item)}
      onClick={(e) => { onSelect(item.id, e.ctrlKey || e.metaKey); if (!e.ctrlKey && !e.metaKey) onOpen(item) }}
      className={`group flex cursor-pointer items-center gap-3 px-3 py-2 transition-colors ${
        active ? "bg-[#EEF2FF]" : selected ? "bg-[#EEF2FF]/40" : "hover:bg-slate-50"
      }`}
    >
      {/* Checkbox */}
      <div
        onClick={(e) => { e.stopPropagation(); onSelect(item.id, true) }}
        className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
          selected ? "bg-[#4F46E5] border-[#4F46E5]" : "bg-white border-[#D1D9E6] opacity-0 group-hover:opacity-100"
        }`}
      >
        {selected && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      {/* Thumbnail */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#F8FAFC]">
        {isImage && thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={isSvg ? item.url : thumb} alt={item.alt ?? item.originalName} className="h-full w-full object-cover" loading="lazy" />
        ) : item.mimeType === "application/pdf" ? (
          <FileText size={18} className="text-red-400" />
        ) : (
          <File size={18} className="text-slate-300" />
        )}
      </div>

      {/* Name */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-700">{item.originalName}</p>
      </div>

      {/* Type */}
      <span className="hidden w-32 shrink-0 truncate text-xs text-slate-400 sm:block">{item.mimeType}</span>

      {/* Size */}
      <span className="w-16 shrink-0 text-right text-xs text-slate-400">{formatBytes(item.size)}</span>

      {/* Date */}
      <span className="hidden w-28 shrink-0 text-right text-xs text-slate-400 md:block">{formatDate(item.createdAt)}</span>

      {/* Favorite star */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggleFavorite(item.id) }}
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md transition-all ${
          item.isFavorite ? "text-amber-400" : "text-slate-300 opacity-0 group-hover:opacity-100 hover:text-amber-400"
        }`}
        title={item.isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
      >
        <Star size={15} fill={item.isFavorite ? "currentColor" : "none"} />
      </button>
    </div>
  )
}
