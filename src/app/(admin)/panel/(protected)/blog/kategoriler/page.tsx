import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { getCategoriesWithCount } from "@/lib/actions/blog"
import BlogCategoryManager from "@/components/admin/editors/BlogCategoryManager"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Blog Kategorileri" }

export default async function BlogCategoriesPage() {
  const categories = await getCategoriesWithCount()

  return (
    <div className="max-w-3xl">
      <Link href="/panel/blog" className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition">
        <ArrowLeft size={14} />
        Blog'a dön
      </Link>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Blog Kategorileri</h1>
        <p className="mt-1 text-sm text-slate-500">Blog yazısı oluştururken seçilen ve public tarafta filtre olarak kullanılan kategoriler.</p>
      </div>
      <BlogCategoryManager initialCategories={categories} />
    </div>
  )
}
