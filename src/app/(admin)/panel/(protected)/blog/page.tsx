import { getBlogPosts, toggleBlogStatus, deleteBlogPost } from "@/lib/actions/blog"
import Link from "next/link"
import { PlusCircle, Pencil, Eye, EyeOff, Trash2, FileText, Tags } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Blog" }

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  PUBLISHED: { label: "Yayında",   cls: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  DRAFT:     { label: "Taslak",    cls: "bg-slate-50  text-slate-600  border-slate-200"    },
  SCHEDULED: { label: "Zamanlandı",cls: "bg-amber-50  text-amber-700  border-amber-100"    },
  ARCHIVED:  { label: "Arşiv",     cls: "bg-rose-50   text-rose-700   border-rose-100"     },
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>
}) {
  const params = await searchParams
  const page = Number(params.page ?? 1)
  const q = params.q ?? ""
  const { data: posts, total, totalPages } = await getBlogPosts(page, 20, q)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Blog</h1>
          <p className="mt-1 text-sm text-slate-500">{total} yazı</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/panel/blog/kategoriler"
            className="flex items-center gap-2 rounded-xl border border-[#E4EAF5] bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <Tags size={16} />
            Kategoriler
          </Link>
          <Link
            href="/panel/blog/yeni"
            className="flex items-center gap-2 rounded-xl bg-[#3730A3] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#312E8A] transition"
          >
            <PlusCircle size={16} />
            Yeni Yazı
          </Link>
        </div>
      </div>

      {/* Arama */}
      <form className="mb-4">
        <input
          name="q"
          defaultValue={q}
          placeholder="Yazı ara..."
          className="w-full max-w-sm rounded-xl border border-[#E4EAF5] bg-white px-4 py-2 text-sm outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10"
        />
      </form>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[#E4EAF5] py-16 text-center">
          <FileText size={32} className="text-slate-300" />
          <p className="text-sm text-slate-500">Henüz yazı yok.</p>
          <Link href="/panel/blog/yeni" className="text-sm font-medium text-[#3730A3] hover:underline">
            İlk yazıyı oluştur
          </Link>
        </div>
      ) : (
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
              {posts.map((post) => {
                const badge = STATUS_LABEL[post.status] ?? STATUS_LABEL.DRAFT
                return (
                  <tr key={post.id} className="hover:bg-[#F8FAFC] transition-colors">
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
                        <form
                          action={async () => {
                            "use server"
                            await toggleBlogStatus(post.id, post.status)
                          }}
                        >
                          <button
                            type="submit"
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                            title={post.status === "PUBLISHED" ? "Taslağa al" : "Yayınla"}
                          >
                            {post.status === "PUBLISHED" ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </form>
                        <form
                          action={async () => {
                            "use server"
                            await deleteBlogPost(post.id)
                          }}
                        >
                          <button
                            type="submit"
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                            title="Sil"
                          >
                            <Trash2 size={15} />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {/* Sayfalama */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-[#E4EAF5] px-4 py-3">
              <span className="text-xs text-slate-400">Sayfa {page} / {totalPages}</span>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link
                    href={`?page=${page - 1}${q ? `&q=${q}` : ""}`}
                    className="rounded-lg border border-[#E4EAF5] px-3 py-1 text-xs text-slate-600 hover:bg-slate-50"
                  >
                    ← Önceki
                  </Link>
                )}
                {page < totalPages && (
                  <Link
                    href={`?page=${page + 1}${q ? `&q=${q}` : ""}`}
                    className="rounded-lg border border-[#E4EAF5] px-3 py-1 text-xs text-slate-600 hover:bg-slate-50"
                  >
                    Sonraki →
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
