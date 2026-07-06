"use client"

import { useState, useTransition } from "react"
import { Plus, Pencil, Trash2, Loader2, Check, X } from "lucide-react"
import type { Redirect } from "@prisma/client"
import { createRedirect, updateRedirect, toggleRedirect, deleteRedirect, type RedirectInput } from "@/lib/actions/seo"

const EMPTY: RedirectInput = { fromPath: "", toPath: "", type: 301, enabled: true }

function RedirectRow({ redirect, onUpdate, onDelete }: {
  redirect: Redirect
  onUpdate: (r: Redirect) => void
  onDelete: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [confirmDel, setConfirmDel] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [draft, setDraft] = useState<RedirectInput>({ fromPath: redirect.fromPath, toPath: redirect.toPath, type: redirect.type, enabled: redirect.enabled })

  function save() {
    setError(null)
    startTransition(async () => {
      const result = await updateRedirect(redirect.id, draft)
      if (result.success) {
        onUpdate({ ...redirect, ...draft })
        setEditing(false)
      } else {
        setError(result.error ?? "Kayıt hatası")
      }
    })
  }

  function toggle() {
    onUpdate({ ...redirect, enabled: !redirect.enabled })
    startTransition(() => { toggleRedirect(redirect.id, redirect.enabled) })
  }

  const inputCls = "w-full rounded-lg border border-[#E4EAF5] bg-[#F8FAFC] px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition"

  if (editing) {
    return (
      <tr className="bg-[#F8FAFC]">
        <td className="px-4 py-2.5" colSpan={5}>
          {error && <p className="mb-2 text-xs text-red-500">{error}</p>}
          <div className="flex items-center gap-2">
            <input value={draft.fromPath} onChange={(e) => setDraft({ ...draft, fromPath: e.target.value })} placeholder="/eski-adres" className={inputCls} />
            <span className="text-slate-300">→</span>
            <input value={draft.toPath} onChange={(e) => setDraft({ ...draft, toPath: e.target.value })} placeholder="/yeni-adres" className={inputCls} />
            <select value={draft.type} onChange={(e) => setDraft({ ...draft, type: Number(e.target.value) })} className={`${inputCls} w-20 shrink-0`}>
              <option value={301}>301</option>
              <option value={302}>302</option>
            </select>
            <button type="button" onClick={save} disabled={isPending} className="shrink-0 rounded-lg bg-[#3730A3] p-1.5 text-white hover:bg-[#312E8A] transition disabled:opacity-60">
              {isPending ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
            </button>
            <button type="button" onClick={() => setEditing(false)} className="shrink-0 rounded-lg bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200 transition">
              <X size={13} />
            </button>
          </div>
        </td>
      </tr>
    )
  }

  return (
    <tr className="transition-colors hover:bg-[#F8FAFC]">
      <td className="px-4 py-3 font-mono text-xs text-slate-700">{redirect.fromPath}</td>
      <td className="px-4 py-3 font-mono text-xs text-slate-500">{redirect.toPath}</td>
      <td className="px-4 py-3">
        <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600">{redirect.type}</span>
      </td>
      <td className="px-4 py-3">
        <button type="button" onClick={toggle} className={`relative h-5 w-9 rounded-full transition-colors ${redirect.enabled ? "bg-[#00D084]" : "bg-slate-200"}`}>
          <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${redirect.enabled ? "translate-x-4" : "translate-x-0.5"}`} />
        </button>
      </td>
      <td className="px-4 py-3 text-xs text-slate-400">{redirect.hitCount}</td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          <button type="button" onClick={() => setEditing(true)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition" title="Düzenle">
            <Pencil size={14} />
          </button>
          {confirmDel ? (
            <div className="flex items-center gap-1">
              <button type="button" onClick={onDelete} className="rounded-lg bg-red-50 px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 transition">Sil</button>
              <button type="button" onClick={() => setConfirmDel(false)} className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition">İptal</button>
            </div>
          ) : (
            <button type="button" onClick={() => setConfirmDel(true)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition" title="Sil">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </td>
    </tr>
  )
}

export default function RedirectManager({ initialRedirects }: { initialRedirects: Redirect[] }) {
  const [redirects, setRedirects] = useState<Redirect[]>(initialRedirects)
  const [showAdd, setShowAdd] = useState(false)
  const [draft, setDraft] = useState<RedirectInput>(EMPTY)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const inputCls = "w-full rounded-lg border border-[#E4EAF5] bg-white px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition"

  function handleAdd() {
    setError(null)
    startTransition(async () => {
      const result = await createRedirect(draft)
      if (result.success) {
        setRedirects((prev) => [{ id: crypto.randomUUID(), fromPath: draft.fromPath, toPath: draft.toPath, type: draft.type, enabled: draft.enabled ?? true, hitCount: 0, createdAt: new Date(), updatedAt: new Date() }, ...prev])
        setDraft(EMPTY)
        setShowAdd(false)
      } else {
        setError(result.error ?? "Kayıt hatası")
      }
    })
  }

  async function handleDelete(id: string) {
    setRedirects((prev) => prev.filter((r) => r.id !== id))
    await deleteRedirect(id)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{redirects.length} yönlendirme</p>
        <button type="button" onClick={() => setShowAdd((v) => !v)} className="flex items-center gap-1.5 rounded-xl bg-[#3730A3] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#312E8A] transition">
          <Plus size={14} />
          Yeni Yönlendirme
        </button>
      </div>

      {showAdd && (
        <div className="rounded-xl border border-[#E4EAF5] bg-[#F8FAFC] p-4">
          {error && <p className="mb-2 text-xs text-red-500">{error}</p>}
          <div className="flex items-center gap-2">
            <input value={draft.fromPath} onChange={(e) => setDraft({ ...draft, fromPath: e.target.value })} placeholder="/eski-adres" className={inputCls} />
            <span className="text-slate-300">→</span>
            <input value={draft.toPath} onChange={(e) => setDraft({ ...draft, toPath: e.target.value })} placeholder="/yeni-adres" className={inputCls} />
            <select value={draft.type} onChange={(e) => setDraft({ ...draft, type: Number(e.target.value) })} className={`${inputCls} w-20 shrink-0`}>
              <option value={301}>301</option>
              <option value={302}>302</option>
            </select>
            <button type="button" onClick={handleAdd} disabled={isPending || !draft.fromPath || !draft.toPath} className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#3730A3] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#312E8A] disabled:opacity-50 transition">
              {isPending ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
              Ekle
            </button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-[#E4EAF5] bg-white">
        {redirects.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-slate-400">Henüz yönlendirme eklenmedi.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E4EAF5] bg-[#F8FAFC]">
                <th className="px-4 py-3 text-left font-medium text-slate-500">Kaynak</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Hedef</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Tip</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Aktif</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Tıklama</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {redirects.map((r) => (
                <RedirectRow
                  key={r.id}
                  redirect={r}
                  onUpdate={(updated) => setRedirects((prev) => prev.map((x) => (x.id === updated.id ? updated : x)))}
                  onDelete={() => handleDelete(r.id)}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
