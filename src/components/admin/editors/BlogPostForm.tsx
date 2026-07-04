"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Save, Eye } from "lucide-react"
import MediaPickerButton from "@/components/admin/media/MediaPickerButton"
import SeoPanel, { type SeoData } from "@/components/admin/shared/SeoPanel"
import type { BlogCategory } from "@prisma/client"
import type { ActionResult } from "@/types/cms"

interface Props {
  categories: BlogCategory[]
  action: (formData: FormData) => Promise<ActionResult<{ slug: string }>>
  initialData?: {
    id: string
    title: string
    slug: string
    excerpt: string | null
    content: string
    categoryId: string | null
    status: string
    coverImage: string | null
    ogImage: string | null
    seoTitle: string | null
    seoDesc: string | null
  }
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export default function BlogPostForm({ categories, action, initialData }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [title, setTitle] = useState(initialData?.title ?? "")
  const [slug, setSlug] = useState(initialData?.slug ?? "")
  const [slugManual, setSlugManual] = useState(!!initialData?.slug)
  const [coverImage, setCoverImage] = useState(initialData?.coverImage ?? "")
  const [seo, setSeo] = useState<SeoData>({
    seoTitle: initialData?.seoTitle ?? "",
    seoDesc: initialData?.seoDesc ?? "",
    ogImage: initialData?.ogImage ?? "",
  })

  const inputCls =
    "w-full rounded-xl border border-[#E4EAF5] bg-[#F8FAFC] px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#3730A3] focus:ring-2 focus:ring-[#3730A3]/10 transition"
  const labelCls = "mb-1.5 block text-sm font-medium text-slate-700"

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setTitle(val)
    if (!slugManual) setSlug(slugify(val))
  }

  function handleSubmit(status: "DRAFT" | "PUBLISHED") {
    setError(null)
    startTransition(async () => {
      const formData = new FormData()
      formData.set("title", title)
      formData.set("slug", slug)
      formData.set("status", status)

      const excerpt = (document.getElementById("excerpt") as HTMLTextAreaElement)?.value
      const content = (document.getElementById("content") as HTMLTextAreaElement)?.value
      const categoryId = (document.getElementById("categoryId") as HTMLSelectElement)?.value

      formData.set("excerpt", excerpt)
      formData.set("content", content)
      if (categoryId) formData.set("categoryId", categoryId)
      if (initialData?.id) formData.set("id", initialData.id)
      formData.set("coverImage", coverImage)
      formData.set("ogImage", seo.ogImage)
      formData.set("seoTitle", seo.seoTitle)
      formData.set("seoDesc", seo.seoDesc)

      const result = await action(formData)
      if (result.success && result.data) {
        router.push(`/panel/blog/${result.data.slug}`)
      } else {
        setError(result.error ?? "Kayıt hatası")
      }
    })
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-[#E4EAF5] bg-white p-6 space-y-4">
        <div>
          <label className={labelCls}>Başlık *</label>
          <input
            value={title}
            onChange={handleTitleChange}
            required
            placeholder="Blog yazısı başlığı"
            className={inputCls}
          />
        </div>

        <div>
          <label className={labelCls}>Slug (URL)</label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">/blog/</span>
            <input
              value={slug}
              onChange={(e) => { setSlug(e.target.value); setSlugManual(true) }}
              placeholder="otomatik-olusturulur"
              className={inputCls}
            />
          </div>
        </div>

        <div>
          <label htmlFor="excerpt" className={labelCls}>Özet</label>
          <textarea
            id="excerpt"
            defaultValue={initialData?.excerpt ?? ""}
            rows={2}
            placeholder="Kısa açıklama (liste ve SEO için)"
            className={inputCls}
          />
        </div>

        <div>
          <label htmlFor="categoryId" className={labelCls}>Kategori</label>
          <select
            id="categoryId"
            defaultValue={initialData?.categoryId ?? ""}
            className={inputCls}
          >
            <option value="">Kategori seçin</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <MediaPickerButton
          value={coverImage}
          onChange={setCoverImage}
          label="Kapak Görseli"
          hint="Blog listesinde ve yazı üstünde gösterilir"
        />
      </div>

      <div className="rounded-2xl border border-[#E4EAF5] bg-white p-6">
        <label htmlFor="content" className={labelCls}>İçerik (Markdown / HTML) *</label>
        <textarea
          id="content"
          defaultValue={initialData?.content ?? ""}
          rows={20}
          placeholder="# Başlık&#10;&#10;İçeriğinizi buraya yazın..."
          className={`${inputCls} font-mono text-xs`}
          required
        />
        <p className="mt-1.5 text-xs text-slate-400">
          Markdown veya HTML kullanabilirsiniz. TipTap editörü yakında eklenecek.
        </p>
      </div>

      <div className="rounded-2xl border border-[#E4EAF5] bg-white p-6">
        <label className={labelCls}>SEO</label>
        <SeoPanel data={seo} onChange={setSeo} defaultTitle={title} />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => handleSubmit("DRAFT")}
          disabled={isPending}
          className="flex items-center gap-2 rounded-xl border border-[#E4EAF5] bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60 transition"
        >
          {isPending && <Loader2 size={15} className="animate-spin" />}
          <Save size={15} />
          Taslak Kaydet
        </button>
        <button
          onClick={() => handleSubmit("PUBLISHED")}
          disabled={isPending}
          className="flex items-center gap-2 rounded-xl bg-[#3730A3] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#312E8A] disabled:opacity-60 transition"
        >
          {isPending ? <Loader2 size={15} className="animate-spin" /> : <Eye size={15} />}
          Yayınla
        </button>
      </div>
    </div>
  )
}
