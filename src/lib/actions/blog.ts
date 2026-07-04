"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { syncMediaUsage } from "@/lib/media-usage"
import type { ActionResult, PaginatedResult } from "@/types/cms"
import type { BlogPost, BlogCategory } from "@prisma/client"

function n(v: FormDataEntryValue | null): string | null {
  const s = v?.toString().trim()
  return s || null
}

export async function getBlogPosts(
  page = 1,
  pageSize = 20,
  search = ""
): Promise<PaginatedResult<BlogPost & { author: { name: string }; category: BlogCategory | null }>> {
  const where = search
    ? { OR: [{ title: { contains: search, mode: "insensitive" as const } }] }
    : {}

  const [data, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      include: { author: { select: { name: true } }, category: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.blogPost.count({ where }),
  ])

  return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
}

export async function getBlogPost(slug: string) {
  return prisma.blogPost.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, name: true } },
      category: true,
      tags: { include: { tag: true } },
    },
  })
}

export async function createBlogPost(formData: FormData): Promise<ActionResult<{ slug: string }>> {
  const session = await auth()
  if (!session?.user || session.user.role === "VIEWER") {
    return { success: false, error: "Yetkisiz erişim" }
  }

  const title = formData.get("title") as string
  const slug = formData.get("slug") as string
  const content = formData.get("content") as string
  const excerpt = formData.get("excerpt") as string
  const categoryId = formData.get("categoryId") as string | null
  const status = (formData.get("status") as string) || "DRAFT"
  const coverImage = n(formData.get("coverImage"))
  const ogImage = n(formData.get("ogImage"))
  const seoTitle = n(formData.get("seoTitle"))
  const seoDesc = n(formData.get("seoDesc"))

  if (!title || !slug || !content) {
    return { success: false, error: "Başlık, slug ve içerik zorunludur" }
  }

  try {
    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        categoryId: categoryId || null,
        status: status as "DRAFT" | "PUBLISHED",
        publishedAt: status === "PUBLISHED" ? new Date() : null,
        authorId: session.user.id,
        readTime: Math.ceil(content.split(/\s+/).length / 200),
        coverImage, ogImage, seoTitle, seoDesc,
      },
    })

    await syncMediaUsage("blog_post", post.id, post.title, `/blog/${post.slug}`, { coverImage, ogImage })

    revalidatePath("/panel/blog")
    revalidatePath("/blog")
    return { success: true, data: { slug: post.slug } }
  } catch (e: unknown) {
    if ((e as { code?: string }).code === "P2002") {
      return { success: false, error: "Bu slug zaten kullanımda" }
    }
    return { success: false, error: (e as Error).message }
  }
}

export async function updateBlogPost(
  id: string,
  formData: FormData
): Promise<ActionResult<{ slug: string }>> {
  const session = await auth()
  if (!session?.user || session.user.role === "VIEWER") {
    return { success: false, error: "Yetkisiz erişim" }
  }

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const excerpt = formData.get("excerpt") as string
  const categoryId = formData.get("categoryId") as string | null
  const status = formData.get("status") as string
  const coverImage = n(formData.get("coverImage"))
  const ogImage = n(formData.get("ogImage"))
  const seoTitle = n(formData.get("seoTitle"))
  const seoDesc = n(formData.get("seoDesc"))

  try {
    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        content,
        excerpt: excerpt || null,
        categoryId: categoryId || null,
        status: status as "DRAFT" | "PUBLISHED",
        publishedAt: status === "PUBLISHED" ? new Date() : undefined,
        readTime: Math.ceil(content.split(/\s+/).length / 200),
        coverImage, ogImage, seoTitle, seoDesc,
      },
    })

    await syncMediaUsage("blog_post", post.id, post.title, `/blog/${post.slug}`, { coverImage, ogImage })

    revalidatePath("/panel/blog")
    revalidatePath("/blog")
    return { success: true, data: { slug: post.slug } }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteBlogPost(id: string): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") {
    return { success: false, error: "Yetkisiz erişim" }
  }

  try {
    await prisma.blogPost.delete({ where: { id } })
    await prisma.mediaUsage.deleteMany({ where: { entityType: "blog_post", entityId: id } })
    revalidatePath("/panel/blog")
    revalidatePath("/blog")
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function toggleBlogStatus(id: string, currentStatus: string): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user || session.user.role === "VIEWER") {
    return { success: false, error: "Yetkisiz erişim" }
  }

  const newStatus = currentStatus === "PUBLISHED" ? "DRAFT" : "PUBLISHED"
  try {
    await prisma.blogPost.update({
      where: { id },
      data: {
        status: newStatus,
        publishedAt: newStatus === "PUBLISHED" ? new Date() : null,
      },
    })
    revalidatePath("/panel/blog")
    revalidatePath("/blog")
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function getPublishedBlogPosts(limit: number, categorySlug?: string | null) {
  return prisma.blogPost.findMany({
    where: {
      status: "PUBLISHED",
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    },
    include: { category: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
  })
}

export async function getCategories() {
  return prisma.blogCategory.findMany({ orderBy: { name: "asc" } })
}

export async function redirectToBlogEdit(slug: string) {
  redirect(`/panel/blog/${slug}`)
}
