"use client"

import { useState } from "react"
import Link from "next/link"
import { Pencil, Eye, EyeOff, Trash2 } from "lucide-react"
import type { BlogPost, BlogCategory } from "@prisma/client"
import { toggleBlogStatus, deleteBlogPost } from "@/lib/actions/blog"
import Toast, { type ToastState } from "@/components/admin/shared/Toast"

type PostRow = BlogPost & { author: { name: string }; category: BlogCategory | null }

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  PUBLISHED: { label: "Yayında",   cls: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  DRAFT:     { label: "Taslak",    cls: "bg-slate-50  text-slate-600  border-slate-200"    },
  SCHEDULED: { label: "Zamanlandı",cls: "bg-amber-50  text-amber-700  border-amber-100"    },
  ARCHIVED:  { label: "Arşiv",     cls: "bg-rose-50   text-rose-700   border-rose-100"     },
}

function BlogRow({ post, onToggle, onDelete }: {
  post: PostRow
  onToggle: () => void
  onDelete: () => void
}) {
  const [confirmDel, setConfirmDel] = useState(false)
  const badge = STATUS_LABEL[post.status] ?? STATUS_LABEL.DRAFT

  return (
    <tr className="hover:bg-[#F8FAFC] transition-colors">
      <td className="px-4 py-3">
        <span className="font-medium text-slate-800">{post.title}</span>
        <span className="ml-2 text-xs text-slate-400">/{post.slug}</span>
      </td>
      <td className="px-4 py-3">
        <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${badge.cls}`}>
          {badge.label}
        </span>
      </td>
      <td className="px-4 py-3 text-slate-500">{post.author.name}</td>
      <td className="px-4 py-3 text-slate-400">
        {new Date(post.createdAt).toLocaleDateString("tr-TR")}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-1">
          <Link
            href={`/panel/blog/${post.slug}`}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            title="Düzenle"
          >
            <Pencil size={15} />
          </Link>
          <button
            type="button"
            onClick={onToggle}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            title={post.status === "PUBLISHED" ? "Taslağa al" : "Yayınla"}
          >
            {post.status === "PUBLISHED" ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
          {confirmDel ? (
            <div className="flex items-center gap-1">
              <button type="button" onClick={onDelete} className="rounded-lg bg-red-50 px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 transition">Sil</button>
              <button type="button" onClick={() => setConfirmDel(false)} className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition">İptal</button>
            </div>
          ) : (
            <button type="button" onClick={() => setConfirmDel(true)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition" title="Sil">
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </td>
    </tr>
  )
}

export default function BlogList({ initialPosts }: { initialPosts: PostRow[] }) {
  const [posts, setPosts] = useState<PostRow[]>(initialPosts)
  const [toast, setToast] = useState<ToastState | null>(null)

  async function handleToggle(post: PostRow) {
    const nextStatus = post.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED"
    setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, status: nextStatus } : p)))
    const result = await toggleBlogStatus(post.id, post.status)
    if (!result.success) {
      setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, status: post.status } : p)))
      setToast({ message: result.error ?? "Durum değiştirilemedi", type: "error" })
    } else {
      setToast({ message: nextStatus === "PUBLISHED" ? "Yazı yayınlandı" : "Yazı taslağa alındı", type: "success" })
    }
  }

  async function handleDelete(post: PostRow) {
    setPosts((prev) => prev.filter((p) => p.id !== post.id))
    const result = await deleteBlogPost(post.id)
    if (!result.success) {
      setPosts((prev) => [...prev, post].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()))
      setToast({ message: result.error ?? "Yazı silinemedi", type: "error" })
    } else {
      setToast({ message: "Yazı silindi", type: "success" })
    }
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-[#E4EAF5] bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#E4EAF5] bg-[#F8FAFC]">
              <th className="px-4 py-3 text-left font-medium text-slate-500">Başlık</th>
              <th className="px-4 py-3 text-left font-medium text-slate-500">Durum</th>
              <th className="px-4 py-3 text-left font-medium text-slate-500">Yazar</th>
              <th className="px-4 py-3 text-left font-medium text-slate-500">Tarih</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9]">
            {posts.map((post) => (
              <BlogRow
                key={post.id}
                post={post}
                onToggle={() => handleToggle(post)}
                onDelete={() => handleDelete(post)}
              />
            ))}
          </tbody>
        </table>
      </div>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </>
  )
}
