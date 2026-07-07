import { getBlogPosts } from "@/lib/actions/blog"
import Link from "next/link"
import { PlusCircle, FileText, Tags } from "lucide-react"
import BlogList from "@/components/admin/editors/BlogList"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Blog" }

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
        <div className="space-y-4">
          <BlogList initialPosts={posts} />

          {/* Sayfalama */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between rounded-2xl border border-[#E4EAF5] bg-white px-4 py-3">
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
