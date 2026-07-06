import type { MetadataRoute } from "next"
import { prisma } from "@/lib/prisma"
import { getSiteSettings } from "@/lib/actions/settings"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSiteSettings()
  const baseUrl = (settings.seo_canonical_url || settings.site_url || "https://e-partnerim.com").replace(/\/$/, "")

  const [pages, posts, platforms, solutions, partners] = await Promise.all([
    // /partnerix'in henüz canlı bir route'u yok, sitemap'te 404 vermemesi için hariç tutulur
    prisma.page.findMany({ where: { status: "PUBLISHED", slug: { not: "/partnerix" } }, select: { slug: true, updatedAt: true, robots: true } }),
    prisma.blogPost.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    prisma.platform.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    prisma.solution.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    prisma.partner.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
  ])

  const entries: MetadataRoute.Sitemap = []

  for (const p of pages) {
    if (p.robots.toLowerCase().includes("noindex")) continue
    entries.push({
      url: `${baseUrl}${p.slug === "/" ? "" : p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: p.slug === "/" ? "weekly" : "monthly",
      priority: p.slug === "/" ? 1 : 0.7,
    })
  }
  for (const post of posts) {
    entries.push({ url: `${baseUrl}/blog/${post.slug}`, lastModified: post.updatedAt, changeFrequency: "monthly", priority: 0.6 })
  }
  for (const pl of platforms) {
    entries.push({ url: `${baseUrl}/platformlar/${pl.slug}`, lastModified: pl.updatedAt, changeFrequency: "monthly", priority: 0.6 })
  }
  for (const s of solutions) {
    entries.push({ url: `${baseUrl}/cozumler/${s.slug}`, lastModified: s.updatedAt, changeFrequency: "monthly", priority: 0.6 })
  }
  for (const pt of partners) {
    entries.push({ url: `${baseUrl}/partnerler/${pt.slug}`, lastModified: pt.updatedAt, changeFrequency: "monthly", priority: 0.5 })
  }

  return entries
}
