import { getBlogPost, getCategories, updateBlogPost, deleteBlogPost } from "@/lib/actions/blog"
import BlogPostForm from "@/components/admin/editors/BlogPostForm"
import Link from "next/link"
import { ChevronLeft, Trash2 } from "lucide-react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)
  return { title: post ? `${post.title} — Düzenle` : "Yazı Bulunamadı" }
}

export default async function BlogEditPage({ params }: Props) {
  const { slug } = await params
  const [post, categories] = await Promise.all([getBlogPost(slug), getCategories()])
  if (!post) notFound()

  async function save(formData: FormData) {
    "use server"
    return updateBlogPost(post!.id, formData)
  }

  async function remove() {
    "use server"
    await deleteBlogPost(post!.id)
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/panel/blog"
            className="flex items-center gap-1 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <ChevronLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{post.title}</h1>
            <p className="mt-0.5 text-sm text-slate-500">
              Son güncelleme: {new Date(post.updatedAt).toLocaleDateString("tr-TR", { dateStyle: "long" })}
            </p>
          </div>
        </div>
        <form action={remove}>
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 hover:border-red-300 transition"
          >
            <Trash2 size={15} />
            Sil
          </button>
        </form>
      </div>

      <BlogPostForm
        categories={categories}
        action={save}
        initialData={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          categoryId: post.categoryId,
          status: post.status,
          coverImage: post.coverImage,
          ogImage: post.ogImage,
          seoTitle: post.seoTitle,
          seoDesc: post.seoDesc,
        }}
      />
    </div>
  )
}
