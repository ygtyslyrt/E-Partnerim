"use client"

import { useState, useTransition } from "react"
import { Plus, Pencil, Trash2, Loader2, Check, X } from "lucide-react"
import type { BlogCategory } from "@prisma/client"
import { createCategory, updateCategory, deleteCategory, type BlogCategoryInput } from "@/lib/actions/blog"

type CategoryWithCount = BlogCategory & { _count: { posts: number } }

const EMPTY: BlogCategoryInput = { name: "", slug: "", description: "" }

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function CategoryRow({ category, onUpdate, onDelete }: {
  category: CategoryWithCount
  onUpdate: (c: CategoryWithCount) => void
  onDelete: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [confirmDel, setConfirmDel] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [draft, setDraft] = useState<BlogCategoryInput>({ name: category.name, slug: category.slug, description: category.description ?? "" })

  function save() {
    setError(null)
    startTransition(async () => {
      const result = await updateCategory(category.id, draft)
      if (result.success) {
        onUpdate({ ...category, ...draft, description: draft.description || null })
        setEditing(false)
      } else {
        setError(result.error ?? "Kayıt hatası")
      }
    })
  }

  const inputCls = "w-full rounded-lg border border-[#E4EAF5] bg-[#F8FAFC] px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition"

  if (editing) {
    return (
      <tr className="bg-[#F8FAFC]">
        <td className="px-4 py-2.5" colSpan={4}>
          {error && <p className="mb-2 text-xs text-red-500">{error}</p>}
          <div className="flex items-center gap-2">
            <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Ad" className={inputCls} />
            <input value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} placeholder="slug" className={`${inputCls} font-mono`} />
            <input value={draft.description ?? ""} onChange={(e) => setDraft({ ...draft, description: e.target.value })} placeholder="Açıklama (opsiyonel)" className={inputCls} />
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
      <td className="px-4 py-3 font-medium text-slate-800">{category.name}</td>
      <td className="px-4 py-3 font-mono text-xs text-slate-500">{category.slug}</td>
      <td className="px-4 py-3 text-xs text-slate-500">{category._count.posts}</td>
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

export default function BlogCategoryManager({ initialCategories }: { initialCategories: CategoryWithCount[] }) {
  const [categories, setCategories] = useState<CategoryWithCount[]>(initialCategories)
  const [showAdd, setShowAdd] = useState(false)
  const [draft, setDraft] = useState<BlogCategoryInput>(EMPTY)
  const [slugManual, setSlugManual] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const inputCls = "w-full rounded-lg border border-[#E4EAF5] bg-white px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition"

  function handleNameChange(name: string) {
    setDraft((prev) => ({ ...prev, name, slug: slugManual ? prev.slug : slugify(name) }))
  }

  function handleAdd() {
    setError(null)
    startTransition(async () => {
      const result = await createCategory(draft)
      if (result.success && result.data) {
        setCategories((prev) => [...prev, { ...result.data!, _count: { posts: 0 } }].sort((a, b) => a.name.localeCompare(b.name)))
        setDraft(EMPTY)
        setSlugManual(false)
        setShowAdd(false)
      } else {
        setError(result.error ?? "Kayıt hatası")
      }
    })
  }

  async function handleDelete(id: string) {
    setCategories((prev) => prev.filter((c) => c.id !== id))
    await deleteCategory(id)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{categories.length} kategori</p>
        <button type="button" onClick={() => setShowAdd((v) => !v)} className="flex items-center gap-1.5 rounded-xl bg-[#3730A3] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#312E8A] transition">
          <Plus size={14} />
          Yeni Kategori
        </button>
      </div>

      {showAdd && (
        <div className="rounded-xl border border-[#E4EAF5] bg-[#F8FAFC] p-4">
          {error && <p className="mb-2 text-xs text-red-500">{error}</p>}
          <div className="flex items-center gap-2">
            <input value={draft.name} onChange={(e) => handleNameChange(e.target.value)} placeholder="Ad" className={inputCls} />
            <input
              value={draft.slug}
              onChange={(e) => { setSlugManual(true); setDraft({ ...draft, slug: e.target.value }) }}
              placeholder="slug"
              className={`${inputCls} font-mono`}
            />
            <input value={draft.description ?? ""} onChange={(e) => setDraft({ ...draft, description: e.target.value })} placeholder="Açıklama (opsiyonel)" className={inputCls} />
            <button type="button" onClick={handleAdd} disabled={isPending || !draft.name || !draft.slug} className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#3730A3] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#312E8A] disabled:opacity-50 transition">
              {isPending ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
              Ekle
            </button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-[#E4EAF5] bg-white">
        {categories.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-slate-400">Henüz kategori eklenmedi.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E4EAF5] bg-[#F8FAFC]">
                <th className="px-4 py-3 text-left font-medium text-slate-500">Ad</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Slug</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">Yazı Sayısı</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {categories.map((c) => (
                <CategoryRow
                  key={c.id}
                  category={c}
                  onUpdate={(updated) => setCategories((prev) => prev.map((x) => (x.id === updated.id ? updated : x)).sort((a, b) => a.name.localeCompare(b.name)))}
                  onDelete={() => handleDelete(c.id)}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
