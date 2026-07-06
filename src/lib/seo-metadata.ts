import type { Metadata } from "next"
import type { Page } from "@prisma/client"

// Page modelinden gelen SEO alanlarını Next.js Metadata nesnesine çevirir.
// Sayfa kaydı yoksa veya alan boşsa, çağıran route'un verdiği fallback kullanılır.
export function buildPageMetadata(page: Page | null, fallbackTitle: string, fallbackDesc: string): Metadata {
  const title = page?.seoTitle || fallbackTitle
  const description = page?.seoDesc || fallbackDesc
  const ogTitle = page?.ogTitle || title
  const ogDescription = page?.ogDescription || description

  const robotsValue = page?.robots || "index,follow"
  const parts = robotsValue.split(",").map((s) => s.trim().toLowerCase())

  return {
    title,
    description,
    keywords: page?.seoKeywords
      ? page.seoKeywords.split(",").map((k) => k.trim()).filter(Boolean)
      : undefined,
    alternates: page?.canonical ? { canonical: page.canonical } : undefined,
    robots: {
      index: !parts.includes("noindex"),
      follow: !parts.includes("nofollow"),
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      images: page?.ogImage ? [{ url: page.ogImage }] : undefined,
    },
    twitter: {
      card: page?.twitterCard === "summary" ? "summary" : "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: page?.ogImage ? [page.ogImage] : undefined,
    },
  }
}
