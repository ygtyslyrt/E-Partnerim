"use client"

import { FileText, File, Star, Box, Music } from "lucide-react"
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

export default function MediaCard({ item, selected, active, onSelect, onOpen, onToggleFavorite, onDragStart }: Props) {
  const isImage = item.mimeType.startsWith("image/")
  const isSvg = item.mimeType === "image/svg+xml"
  const thumb = item.thumbnailUrl || (isImage ? item.url : null)

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, item)}
      onClick={(e) => { onSelect(item.id, e.ctrlKey || e.metaKey); if (!e.ctrlKey && !e.metaKey) onOpen(item) }}
      className={`group relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
        active
          ? "border-[#4F46E5] shadow-[0_0_0_3px_rgba(79,70,229,0.15)]"
          : selected
          ? "border-[#4F46E5]/50 bg-[#EEF2FF]/40"
          : "border-[#E4EAF5] hover:border-[#C7D0E8] hover:shadow-sm"
      } bg-white`}
    >
      {/* Thumbnail */}
      <div className="aspect-square flex items-center justify-center bg-[#F8FAFC] overflow-hidden">
        {isImage && thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={isSvg ? item.url : thumb}
            alt={item.alt ?? item.originalName}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : item.mimeType === "application/pdf" ? (
          <div className="flex flex-col items-center gap-2">
            <FileText size={36} className="text-red-400" />
            <span className="text-[10px] font-bold text-red-400 tracking-widest">PDF</span>
          </div>
        ) : item.mimeType.startsWith("model/") ? (
          <div className="flex flex-col items-center gap-2">
            <Box size={36} className="text-[#4F46E5]" />
            <span className="text-[10px] font-bold text-[#4F46E5] tracking-widest">3D</span>
          </div>
        ) : item.mimeType.startsWith("audio/") ? (
          <div className="flex flex-col items-center gap-2">
            <Music size={36} className="text-[#00D084]" />
            <span className="text-[10px] font-bold text-[#00D084] tracking-widest">SES</span>
          </div>
        ) : (
          <File size={36} className="text-slate-300" />
        )}
      </div>

      {/* Checkbox (visible on hover or when selected) */}
      <div
        onClick={(e) => { e.stopPropagation(); onSelect(item.id, true) }}
        className={`absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded-md border-2 transition-all ${
          selected
            ? "bg-[#4F46E5] border-[#4F46E5]"
            : "bg-white border-[#D1D9E6] opacity-0 group-hover:opacity-100"
        }`}
      >
        {selected && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>

      {/* Favorite star */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggleFavorite(item.id) }}
        className={`absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-md transition-all ${
          item.isFavorite
            ? "text-amber-400 opacity-100"
            : "text-white opacity-0 group-hover:opacity-100 drop-shadow"
        }`}
        title={item.isFavorite ? "Favorilerden çıkar" : "Favorilere ekle"}
      >
        <Star size={15} fill={item.isFavorite ? "currentColor" : "none"} />
      </button>

      {/* Footer */}
      <div className="px-2 py-1.5 border-t border-[#F0F4F8]">
        <p className="truncate text-[11px] font-medium text-slate-600">{item.originalName}</p>
        <p className="text-[10px] text-slate-400">{formatBytes(item.size)}</p>
      </div>
    </div>
  )
}
