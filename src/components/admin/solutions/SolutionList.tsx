"use client"

import { useState, useCallback, useRef } from "react"
import { Reorder, useDragControls } from "framer-motion"
import Link from "next/link"
import { GripVertical, Pencil, Eye, EyeOff, Trash2, Star, PlusCircle } from "lucide-react"
import type { Solution } from "@prisma/client"
import { reorderSolutions, toggleSolutionStatus, deleteSolution } from "@/lib/actions/solutions"
import Toast, { type ToastState } from "@/components/admin/shared/Toast"

function SolutionRow({ solution, onToggle, onDelete }: {
  solution: Solution
  onToggle: () => void
  onDelete: () => void
}) {
  const controls = useDragControls()
  const [confirmDel, setConfirmDel] = useState(false)
  const published = solution.status === "PUBLISHED"
  const color = solution.color || "#3730A3"

  return (
    <Reorder.Item
      value={solution}
      dragListener={false}
      dragControls={controls}
      className="flex items-center gap-3 rounded-xl border border-[#E4EAF5] bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md"
      whileDrag={{ scale: 1.02, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
    >
      <button
        type="button"
        onPointerDown={(e) => controls.start(e)}
        className="touch-none cursor-grab text-slate-300 hover:text-slate-500 active:cursor-grabbing"
      >
        <GripVertical size={18} />
      </button>

      {/* İkon */}
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-black text-white"
        style={{ backgroundColor: color }}
      >
        {solution.icon ? solution.icon[0]?.toUpperCase() : solution.title[0]?.toUpperCase()}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-semibold text-slate-800">{solution.title}</span>
          {solution.featured && <Star size={13} className="shrink-0 fill-amber-400 text-amber-400" />}
        </div>
        {solution.category && (
          <span className="text-xs text-slate-400">{solution.category}</span>
        )}
      </div>

      <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        published ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
      }`}>
        {published ? "Yayında" : "Taslak"}
      </span>

      <div className="flex shrink-0 items-center gap-1">
        <Link
          href={`/panel/cozumler/${solution.slug}`}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          title="Düzenle"
        >
          <Pencil size={15} />
        </Link>
        <button
          type="button"
          onClick={onToggle}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          title={published ? "Taslağa al" : "Yayınla"}
        >
          {published ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
        {confirmDel ? (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => { onDelete(); setConfirmDel(false) }}
              className="rounded-lg bg-red-50 px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
            >
              Sil
            </button>
            <button
              type="button"
              onClick={() => setConfirmDel(false)}
              className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
            >
              İptal
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmDel(true)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
            title="Sil"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>
    </Reorder.Item>
  )
}

export default function SolutionList({ initialSolutions }: { initialSolutions: Solution[] }) {
  const [solutions, setSolutions] = useState<Solution[]>(initialSolutions)
  const [toast, setToast] = useState<ToastState | null>(null)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleReorder = useCallback((reordered: Solution[]) => {
    setSolutions(reordered)
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      const result = await reorderSolutions(reordered.map((s) => s.id))
      if (!result.success) setToast({ message: result.error ?? "Sıralama kaydedilemedi", type: "error" })
    }, 800)
  }, [])

  async function handleToggle(solution: Solution) {
    const nextStatus = solution.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED"
    setSolutions((prev) => prev.map((s) => (s.id === solution.id ? { ...s, status: nextStatus } : s)))
    const result = await toggleSolutionStatus(solution.id, solution.status)
    if (!result.success) {
      setSolutions((prev) => prev.map((s) => (s.id === solution.id ? { ...s, status: solution.status } : s)))
      setToast({ message: result.error ?? "Durum değiştirilemedi", type: "error" })
    } else {
      setToast({ message: nextStatus === "PUBLISHED" ? "Çözüm yayınlandı" : "Çözüm taslağa alındı", type: "success" })
    }
  }

  async function handleDelete(id: string) {
    const removed = solutions.find((s) => s.id === id)
    setSolutions((prev) => prev.filter((s) => s.id !== id))
    const result = await deleteSolution(id)
    if (!result.success) {
      if (removed) setSolutions((prev) => [...prev, removed].sort((a, b) => a.order - b.order))
      setToast({ message: result.error ?? "Çözüm silinemedi", type: "error" })
    } else {
      setToast({ message: "Çözüm silindi", type: "success" })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Çözümler</h1>
          <p className="mt-1 text-sm text-slate-500">
            {solutions.length} çözüm · Sürükleyerek sıralayın
          </p>
        </div>
        <Link
          href="/panel/cozumler/yeni"
          className="flex items-center gap-2 rounded-xl bg-[#3730A3] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#312E8A] transition"
        >
          <PlusCircle size={16} />
          Yeni Çözüm
        </Link>
      </div>

      {solutions.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[#E4EAF5] py-20 text-center">
          <p className="text-sm text-slate-400">Henüz çözüm eklenmedi.</p>
          <Link
            href="/panel/cozumler/yeni"
            className="text-sm font-medium text-[#3730A3] hover:underline"
          >
            İlk çözümü ekle
          </Link>
        </div>
      ) : (
        <Reorder.Group axis="y" values={solutions} onReorder={handleReorder} className="space-y-2">
          {solutions.map((solution) => (
            <SolutionRow
              key={solution.id}
              solution={solution}
              onToggle={() => handleToggle(solution)}
              onDelete={() => handleDelete(solution.id)}
            />
          ))}
        </Reorder.Group>
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
