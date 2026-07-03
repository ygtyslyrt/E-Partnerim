"use client"

import { useState } from "react"
import { Loader2, Save, Trash2, Eye, EyeOff, Star, CheckCircle } from "lucide-react"

interface Props {
  status: string
  featured: boolean
  isSaving: boolean
  saved: boolean
  onStatusChange: (s: string) => void
  onFeaturedChange: (f: boolean) => void
  onSave: () => void
  onDelete?: () => void
  isDeleting?: boolean
}

export default function PublishPanel({
  status, featured, isSaving, saved,
  onStatusChange, onFeaturedChange, onSave, onDelete, isDeleting,
}: Props) {
  const [confirmDel, setConfirmDel] = useState(false)
  const published = status === "PUBLISHED"

  return (
    <div className="rounded-2xl border border-[#E4EAF5] bg-white p-4 space-y-3">
      <h3 className="text-sm font-semibold text-slate-700">Yayın</h3>

      {/* Status toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-600">Durum</span>
        <button
          type="button"
          onClick={() => onStatusChange(published ? "DRAFT" : "PUBLISHED")}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition ${
            published ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          {published ? <Eye size={11} /> : <EyeOff size={11} />}
          {published ? "Yayında" : "Taslak"}
        </button>
      </div>

      {/* Featured toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-600">Öne Çıkar</span>
        <button
          type="button"
          onClick={() => onFeaturedChange(!featured)}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition ${
            featured ? "bg-amber-50 text-amber-600 hover:bg-amber-100" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
          }`}
        >
          <Star size={11} className={featured ? "fill-amber-400 text-amber-400" : ""} />
          {featured ? "Öne Çıkarıldı" : "Normal"}
        </button>
      </div>

      {/* Save */}
      <button
        type="button"
        onClick={onSave}
        disabled={isSaving}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3730A3] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#312E8A] disabled:opacity-60 transition"
      >
        {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
        {isSaving ? "Kaydediliyor..." : "Kaydet"}
      </button>

      {saved && (
        <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600">
          <CheckCircle size={13} />
          Kaydedildi
        </div>
      )}

      {/* Delete */}
      {onDelete && (
        <div className="border-t border-[#E4EAF5] pt-3">
          {confirmDel ? (
            <div className="space-y-2">
              <p className="text-center text-xs font-medium text-red-600">Bu işlem geri alınamaz!</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { onDelete(); setConfirmDel(false) }}
                  disabled={isDeleting}
                  className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-red-500 py-1.5 text-xs font-semibold text-white hover:bg-red-600 disabled:opacity-60 transition"
                >
                  {isDeleting && <Loader2 size={12} className="animate-spin" />}
                  Sil
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDel(false)}
                  className="flex-1 rounded-lg bg-slate-100 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
                >
                  İptal
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDel(true)}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs text-slate-400 hover:text-red-500 transition"
            >
              <Trash2 size={12} />
              Sil
            </button>
          )}
        </div>
      )}
    </div>
  )
}
