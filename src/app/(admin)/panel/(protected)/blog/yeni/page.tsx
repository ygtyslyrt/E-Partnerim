import { getCategories, createBlogPost } from "@/lib/actions/blog"
import BlogPostForm from "@/components/admin/editors/BlogPostForm"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "Yeni Blog Yazısı" }

export default async function YeniBlogPage() {
  const categories = await getCategories()

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Yeni Blog Yazısı</h1>
      </div>
      <BlogPostForm categories={categories} action={createBlogPost} />
    </div>
  )
}
