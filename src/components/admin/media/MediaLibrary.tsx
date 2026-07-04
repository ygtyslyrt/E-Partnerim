"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Search, Upload, Trash2, Grid3X3, LayoutList, X, Loader2, Filter, FolderInput, Star } from "lucide-react"
import { getMedia, deleteMedia, moveMediaToFolder, getFolders, toggleMediaFavorite } from "@/lib/actions/media"
import MediaCard from "./MediaCard"
import MediaListRow from "./MediaListRow"
import FolderSidebar from "./FolderSidebar"
import MediaDetailPanel from "./MediaDetailPanel"
import type { MediaItem, FolderItem, MediaSortBy } from "@/lib/actions/media"

const MIME_FILTERS = [
  { label: "Tümü", value: "" },
  { label: "Görseller", value: "image/" },
  { label: "PDF", value: "application/pdf" },
  { label: "SVG", value: "image/svg+xml" },
]

const SORT_OPTIONS: { label: string; value: MediaSortBy }[] = [
  { label: "En Yeni", value: "date_desc" },
  { label: "En Eski", value: "date_asc" },
  { label: "İsim (A-Z)", value: "name_asc" },
  { label: "İsim (Z-A)", value: "name_desc" },
  { label: "Boyut (Büyük)", value: "size_desc" },
  { label: "Boyut (Küçük)", value: "size_asc" },
]

interface Props {
  initialFolders: FolderItem[]
}

export default function MediaLibrary({ initialFolders }: Props) {
  const [files, setFiles] = useState<MediaItem[]>([])
  const [totalFiles, setTotalFiles] = useState(0)
  const [folders, setFolders] = useState<FolderItem[]>(initialFolders)
  const [activeFolderId, setActiveFolderId] = useState<string | null | undefined>(undefined)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [activeFile, setActiveFile] = useState<MediaItem | null>(null)
  const [search, setSearch] = useState("")
  const [mimeFilter, setMimeFilter] = useState("")
  const [sortBy, setSortBy] = useState<MediaSortBy>("date_desc")
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadCount, setUploadCount] = useState(0)
  const [uploadDone, setUploadDone] = useState(0)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [draggingOver, setDraggingOver] = useState(false)
  const [deletingSelected, setDeletingSelected] = useState(false)
  const [moveTarget, setMoveTarget] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const loadFiles = useCallback(async (s: string, mime: string, fid: string | null | undefined, p: number, sort: MediaSortBy, favOnly: boolean) => {
    setLoading(true)
    const res = await getMedia({ search: s, mimePrefix: mime, folderId: fid, page: p, pageSize: 48, sortBy: sort, favoritesOnly: favOnly })
    setFiles(res.data)
    setTotalFiles(res.total)
    setTotalPages(res.totalPages)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadFiles(search, mimeFilter, activeFolderId, page, sortBy, favoritesOnly)
  }, [activeFolderId, mimeFilter, page, sortBy, favoritesOnly, loadFiles, search])

  function handleSearch(value: string) {
    setSearch(value)
    setPage(1)
    if (searchTimer.current) clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => loadFiles(value, mimeFilter, activeFolderId, 1, sortBy, favoritesOnly), 350)
  }

  function handleFolderSelect(id: string | null) {
    setActiveFolderId(id)
    setPage(1)
    setSelectedIds(new Set())
    setActiveFile(null)
  }

  function handleMimeFilter(value: string) {
    setMimeFilter(value)
    setPage(1)
    setSelectedIds(new Set())
  }

  function handleSortChange(value: MediaSortBy) {
    setSortBy(value)
    setPage(1)
  }

  function handleFavoritesToggle() {
    setFavoritesOnly((prev) => !prev)
    setPage(1)
    setSelectedIds(new Set())
  }

  async function handleToggleFavorite(id: string) {
    const res = await toggleMediaFavorite(id)
    if (res.success && res.data) {
      setFiles((prev) => prev.map((f) => (f.id === id ? res.data! : f)))
      if (activeFile?.id === id) setActiveFile(res.data)
    }
  }

  function handleSelect(id: string, multi: boolean) {
    setSelectedIds((prev) => {
      const next = new Set(multi ? prev : new Set<string>())
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  function handleOpen(item: MediaItem) {
    setActiveFile(item)
  }

  function handleDetailUpdate(updated: MediaItem) {
    setFiles((prev) => prev.map((f) => (f.id === updated.id ? updated : f)))
    setActiveFile(updated)
  }

  async function handleDetailDelete(id: string) {
    const res = await deleteMedia([id])
    if (res.success) {
      setFiles((prev) => prev.filter((f) => f.id !== id))
      setTotalFiles((t) => t - 1)
      setActiveFile(null)
      await reloadFolderCounts()
    }
  }

  async function handleDeleteSelected() {
    const ids = Array.from(selectedIds)
    setDeletingSelected(true)
    const res = await deleteMedia(ids)
    setDeletingSelected(false)
    if (res.success) {
      setFiles((prev) => prev.filter((f) => !selectedIds.has(f.id)))
      setTotalFiles((t) => t - ids.length)
      setSelectedIds(new Set())
      if (activeFile && selectedIds.has(activeFile.id)) setActiveFile(null)
      await reloadFolderCounts()
    }
  }

  async function handleMoveSelected(folderId: string | null) {
    const ids = Array.from(selectedIds)
    const res = await moveMediaToFolder(ids, folderId)
    if (res.success) {
      setFiles((prev) => prev.filter((f) => !selectedIds.has(f.id)))
      setTotalFiles((t) => t - ids.length)
      setSelectedIds(new Set())
      setMoveTarget(null)
      await reloadFolderCounts()
    }
  }

  function handleCardDragStart(e: React.DragEvent, item: MediaItem) {
    const ids = selectedIds.has(item.id) && selectedIds.size > 1 ? Array.from(selectedIds) : [item.id]
    e.dataTransfer.setData("application/json", JSON.stringify(ids))
    e.dataTransfer.effectAllowed = "move"
  }

  async function handleDropMedia(ids: string[], folderId: string | null) {
    if (folderId === activeFolderId) return
    const res = await moveMediaToFolder(ids, folderId)
    if (res.success) {
      setFiles((prev) => prev.filter((f) => !ids.includes(f.id)))
      setTotalFiles((t) => t - ids.length)
      setSelectedIds((prev) => {
        const next = new Set(prev)
        ids.forEach((id) => next.delete(id))
        return next
      })
      if (activeFile && ids.includes(activeFile.id)) setActiveFile(null)
      await reloadFolderCounts()
    }
  }

  async function reloadFolderCounts() {
    const updated = await getFolders(null)
    setFolders(updated)
  }

  async function uploadFile(file: File) {
    const fd = new FormData()
    fd.append("file", file)
    if (activeFolderId) fd.append("folderId", activeFolderId)
    const res = await fetch("/api/upload/media", { method: "POST", body: fd })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || "Yükleme başarısız")
    return json as MediaItem
  }

  async function handleFiles(fileList: FileList | File[]) {
    const arr = Array.from(fileList)
    if (!arr.length) return
    setUploading(true)
    setUploadCount(arr.length)
    setUploadDone(0)
    setUploadError(null)
    const added: MediaItem[] = []
    for (const file of arr) {
      try {
        const item = await uploadFile(file)
        added.push(item)
        setUploadDone((n) => n + 1)
      } catch (e: unknown) {
        setUploadError((e as Error).message)
      }
    }
    setFiles((prev) => [...added, ...prev])
    setTotalFiles((t) => t + added.length)
    setUploading(false)
    await reloadFolderCounts()
  }

  const totalCount = files.length

  return (
    <div
      className="flex h-full rounded-2xl border border-[#E4EAF5] bg-white overflow-hidden"
      onDragOver={(e) => { e.preventDefault(); setDraggingOver(true) }}
      onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDraggingOver(false) }}
      onDrop={(e) => { e.preventDefault(); setDraggingOver(false); handleFiles(e.dataTransfer.files) }}
    >
      {/* Drag overlay */}
      {draggingOver && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#EEF2FF]/95 rounded-2xl border-4 border-dashed border-[#4F46E5] gap-4 pointer-events-none">
          <Upload size={40} className="text-[#4F46E5]" />
          <p className="text-lg font-bold text-[#4F46E5]">Dosyaları buraya bırak</p>
        </div>
      )}

      {/* Folder sidebar */}
      <div className="w-52 shrink-0 border-r border-[#E4EAF5]">
        <FolderSidebar
          folders={folders}
          activeFolderId={activeFolderId ?? null}
          onFolderSelect={handleFolderSelect}
          onFoldersChange={setFolders}
          totalCount={totalFiles}
          onDropMedia={handleDropMedia}
        />
      </div>

      {/* Main area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[#E4EAF5] flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-44">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Ara..."
              className="w-full rounded-xl border border-[#E4EAF5] bg-[#F8FAFC] pl-8 pr-3 py-2 text-sm outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 transition"
            />
            {search && (
              <button onClick={() => handleSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={13} />
              </button>
            )}
          </div>

          {/* Mime filter */}
          <div className="flex items-center gap-1">
            <Filter size={13} className="text-slate-400" />
            <div className="flex rounded-xl border border-[#E4EAF5] overflow-hidden">
              {MIME_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => handleMimeFilter(f.value)}
                  className={`px-3 py-1.5 text-xs font-medium transition ${
                    mimeFilter === f.value ? "bg-[#4F46E5] text-white" : "bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Favorites filter */}
          <button
            onClick={handleFavoritesToggle}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition ${
              favoritesOnly
                ? "border-amber-300 bg-amber-50 text-amber-600"
                : "border-[#E4EAF5] bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Star size={13} fill={favoritesOnly ? "currentColor" : "none"} />
            Favoriler
          </button>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value as MediaSortBy)}
            className="rounded-xl border border-[#E4EAF5] bg-white px-2.5 py-2 text-xs font-medium text-slate-600 outline-none focus:border-[#4F46E5] transition"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* View mode */}
          <div className="flex rounded-xl border border-[#E4EAF5] overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center justify-center px-2.5 py-2 transition ${
                viewMode === "grid" ? "bg-[#4F46E5] text-white" : "bg-white text-slate-500 hover:bg-slate-50"
              }`}
              title="Izgara görünümü"
            >
              <Grid3X3 size={14} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center justify-center px-2.5 py-2 transition ${
                viewMode === "list" ? "bg-[#4F46E5] text-white" : "bg-white text-slate-500 hover:bg-slate-50"
              }`}
              title="Liste görünümü"
            >
              <LayoutList size={14} />
            </button>
          </div>

          {/* Upload button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 rounded-xl bg-[#4F46E5] px-4 py-2 text-xs font-semibold text-white hover:bg-[#4338CA] transition"
          >
            <Upload size={13} />
            Yükle
          </button>
        </div>

        {/* Selection toolbar */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-3 px-4 py-2 bg-[#EEF2FF] border-b border-[#4F46E5]/20">
            <span className="text-sm font-semibold text-[#4F46E5]">{selectedIds.size} seçili</span>
            <div className="flex items-center gap-1 flex-1 flex-wrap">
              {/* Move to folder */}
              <div className="relative">
                <button
                  onClick={() => setMoveTarget(moveTarget ? null : "picker")}
                  className="flex items-center gap-1.5 rounded-lg border border-[#4F46E5]/30 bg-white px-3 py-1.5 text-xs font-medium text-[#4F46E5] hover:bg-[#EEF2FF] transition"
                >
                  <FolderInput size={13} />
                  Taşı
                </button>
                {moveTarget === "picker" && (
                  <div className="absolute left-0 top-full z-20 mt-1 min-w-40 rounded-xl border border-[#E4EAF5] bg-white shadow-lg overflow-hidden">
                    <button
                      onClick={() => handleMoveSelected(null)}
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 border-b border-[#F0F4F8]"
                    >
                      Ana Klasör
                    </button>
                    {folders.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => handleMoveSelected(f.id)}
                        className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
                      >
                        {f.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Delete */}
              <button
                onClick={handleDeleteSelected}
                disabled={deletingSelected}
                className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition disabled:opacity-60"
              >
                {deletingSelected ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                Sil
              </button>
            </div>
            <button onClick={() => setSelectedIds(new Set())} className="text-slate-400 hover:text-slate-600">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Upload progress */}
        {uploading && (
          <div className="flex items-center gap-3 px-4 py-2 bg-[#EEF2FF] border-b border-[#4F46E5]/20">
            <Loader2 size={14} className="animate-spin text-[#4F46E5]" />
            <span className="text-sm text-[#4F46E5]">
              Yükleniyor {uploadDone}/{uploadCount}...
            </span>
          </div>
        )}
        {uploadError && (
          <div className="px-4 py-2 bg-red-50 border-b border-red-200 text-sm text-red-600">{uploadError}</div>
        )}

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 size={28} className="animate-spin text-[#4F46E5]" />
            </div>
          ) : files.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-4 text-slate-400">
              <Grid3X3 size={36} className="text-slate-200" />
              <p className="text-sm">Bu klasörde dosya yok</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 rounded-xl bg-[#4F46E5] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4338CA] transition"
              >
                <Upload size={14} />
                İlk dosyayı yükle
              </button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3">
              {files.map((file) => (
                <MediaCard
                  key={file.id}
                  item={file}
                  selected={selectedIds.has(file.id)}
                  active={activeFile?.id === file.id}
                  onSelect={handleSelect}
                  onOpen={handleOpen}
                  onToggleFavorite={handleToggleFavorite}
                  onDragStart={handleCardDragStart}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-[#F0F4F8] rounded-xl border border-[#E4EAF5] bg-white overflow-hidden">
              {files.map((file) => (
                <MediaListRow
                  key={file.id}
                  item={file}
                  selected={selectedIds.has(file.id)}
                  active={activeFile?.id === file.id}
                  onSelect={handleSelect}
                  onOpen={handleOpen}
                  onToggleFavorite={handleToggleFavorite}
                  onDragStart={handleCardDragStart}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[#E4EAF5]">
            <span className="text-xs text-slate-500">{totalFiles} dosya · Sayfa {page}/{totalPages}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-[#E4EAF5] px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition"
              >
                Önceki
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-lg border border-[#E4EAF5] px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition"
              >
                Sonraki
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail panel */}
      {activeFile && (
        <MediaDetailPanel
          item={activeFile}
          onUpdate={handleDetailUpdate}
          onDelete={handleDetailDelete}
          onClose={() => setActiveFile(null)}
        />
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,image/svg+xml,application/pdf"
        onChange={(e) => { if (e.target.files) handleFiles(e.target.files); e.target.value = "" }}
        className="hidden"
      />
    </div>
  )
}
