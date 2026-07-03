"use client"

import { useState } from "react"
import { Folder, FolderOpen, Plus, Pencil, Trash2, Check, X, ChevronRight, Image as ImageIcon } from "lucide-react"
import { createFolder, renameFolder, deleteFolder } from "@/lib/actions/media"
import type { FolderItem } from "@/lib/actions/media"

interface Props {
  folders: FolderItem[]
  activeFolderId: string | null
  onFolderSelect: (id: string | null) => void
  onFoldersChange: (folders: FolderItem[]) => void
  totalCount: number
}

export default function FolderSidebar({ folders, activeFolderId, onFolderSelect, onFoldersChange, totalCount }: Props) {
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleCreate() {
    if (!newName.trim()) return
    setLoading(true)
    const res = await createFolder(newName.trim())
    setLoading(false)
    if (res.success && res.data) {
      onFoldersChange([...folders, res.data])
      setNewName("")
      setCreating(false)
    }
  }

  async function handleRename(id: string) {
    if (!editName.trim()) return
    setLoading(true)
    const res = await renameFolder(id, editName.trim())
    setLoading(false)
    if (res.success) {
      onFoldersChange(folders.map((f) => (f.id === id ? { ...f, name: editName.trim() } : f)))
      setEditingId(null)
    }
  }

  async function handleDelete(id: string) {
    setLoading(true)
    const res = await deleteFolder(id)
    setLoading(false)
    if (res.success) {
      onFoldersChange(folders.filter((f) => f.id !== id))
      if (activeFolderId === id) onFolderSelect(null)
      setDeleteId(null)
    }
  }

  const btn = "flex items-center justify-center rounded-lg w-7 h-7 hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"

  return (
    <div className="flex flex-col h-full select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#E4EAF5]">
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Klasörler</span>
        <button onClick={() => { setCreating(true); setNewName("") }} className={btn} title="Yeni klasör">
          <Plus size={15} />
        </button>
      </div>

      {/* Tüm Medya */}
      <button
        onClick={() => onFolderSelect(null)}
        className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition w-full text-left ${
          activeFolderId === null ? "bg-[#EEF2FF] text-[#4F46E5] font-semibold" : "text-slate-600 hover:bg-slate-50"
        }`}
      >
        <ImageIcon size={15} className="shrink-0" />
        <span className="flex-1 truncate">Tüm Medya</span>
        <span className="text-[11px] text-slate-400 tabular-nums">{totalCount}</span>
      </button>

      {/* Folder list */}
      <div className="flex-1 overflow-y-auto py-1">
        {folders.map((folder) => (
          <div key={folder.id} className="group relative">
            {editingId === folder.id ? (
              <div className="flex items-center gap-1 px-3 py-1.5">
                <Folder size={15} className="shrink-0 text-[#4F46E5]" />
                <input
                  autoFocus
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleRename(folder.id); if (e.key === "Escape") setEditingId(null) }}
                  className="flex-1 min-w-0 rounded border border-[#4F46E5] px-1.5 py-0.5 text-xs outline-none"
                />
                <button onClick={() => handleRename(folder.id)} disabled={loading} className="text-[#4F46E5] hover:text-[#3730A3]"><Check size={13} /></button>
                <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-slate-600"><X size={13} /></button>
              </div>
            ) : deleteId === folder.id ? (
              <div className="flex items-center gap-2 px-3 py-2">
                <span className="flex-1 text-xs text-red-600 font-medium">Silinsin mi?</span>
                <button onClick={() => handleDelete(folder.id)} disabled={loading} className="text-xs font-semibold text-red-600 hover:text-red-800">Evet</button>
                <button onClick={() => setDeleteId(null)} className="text-xs text-slate-400 hover:text-slate-600">Hayır</button>
              </div>
            ) : (
              <button
                onClick={() => onFolderSelect(folder.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition w-full text-left ${
                  activeFolderId === folder.id ? "bg-[#EEF2FF] text-[#4F46E5] font-semibold" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {activeFolderId === folder.id ? <FolderOpen size={15} className="shrink-0" /> : <Folder size={15} className="shrink-0" />}
                <ChevronRight size={12} className="shrink-0 text-slate-300" />
                <span className="flex-1 truncate">{folder.name}</span>
                <span className="text-[11px] text-slate-400 tabular-nums">{folder._count.media}</span>
                {/* Actions */}
                <div className="invisible group-hover:visible flex items-center gap-0.5 ml-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); setEditingId(folder.id); setEditName(folder.name) }}
                    className="rounded p-0.5 hover:bg-slate-200 text-slate-400 hover:text-slate-700"
                  >
                    <Pencil size={11} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteId(folder.id) }}
                    className="rounded p-0.5 hover:bg-red-100 text-slate-400 hover:text-red-600"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Create folder input */}
      {creating && (
        <div className="border-t border-[#E4EAF5] p-3 space-y-2">
          <input
            autoFocus
            placeholder="Klasör adı..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); if (e.key === "Escape") setCreating(false) }}
            className="w-full rounded-lg border border-[#E4EAF5] bg-[#F8FAFC] px-3 py-2 text-sm outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 transition"
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              disabled={loading || !newName.trim()}
              className="flex-1 rounded-lg bg-[#4F46E5] py-1.5 text-xs font-semibold text-white hover:bg-[#4338CA] disabled:opacity-50 transition"
            >
              Oluştur
            </button>
            <button
              onClick={() => setCreating(false)}
              className="flex-1 rounded-lg border border-[#E4EAF5] py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
            >
              İptal
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
