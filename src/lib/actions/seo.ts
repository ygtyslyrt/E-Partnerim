"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import type { ActionResult } from "@/types/cms"
import type { Page, Redirect, NotFoundLog, BrokenLinkCheck } from "@prisma/client"

function n(v?: string | null) {
  return v?.trim() || null
}

function normalizePath(p: string) {
  const trimmed = p.trim()
  if (!trimmed) return ""
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`
}

// ── Sayfa bazlı SEO ─────────────────────────────────────────────────────────

export async function getManagedPages(): Promise<Page[]> {
  return prisma.page.findMany({ orderBy: { createdAt: "asc" } })
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  return prisma.page.findUnique({ where: { slug } })
}

export interface PageSeoInput {
  title: string
  slug: string
  seoTitle?: string | null
  seoDesc?: string | null
  seoKeywords?: string | null
  ogTitle?: string | null
  ogDescription?: string | null
  ogImage?: string | null
  twitterCard?: string
  canonical?: string | null
  robots?: string
}

export async function updatePageSeo(id: string, data: PageSeoInput): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user || session.user.role === "VIEWER") return { success: false, error: "Yetkisiz erişim" }
  if (!data.title.trim() || !data.slug.trim()) return { success: false, error: "Başlık ve slug zorunludur" }

  try {
    const page = await prisma.page.update({
      where: { id },
      data: {
        title: data.title.trim(),
        slug: normalizePath(data.slug),
        seoTitle: n(data.seoTitle), seoDesc: n(data.seoDesc), seoKeywords: n(data.seoKeywords),
        ogTitle: n(data.ogTitle), ogDescription: n(data.ogDescription), ogImage: n(data.ogImage),
        twitterCard: data.twitterCard || "summary_large_image",
        canonical: n(data.canonical), robots: data.robots || "index,follow",
      },
    })
    revalidatePath("/panel/seo/sayfalar")
    revalidatePath(page.slug)
    return { success: true }
  } catch (e) {
    if ((e as { code?: string }).code === "P2002") return { success: false, error: "Bu slug zaten kullanımda" }
    return { success: false, error: (e as Error).message }
  }
}

// ── Redirect Manager ──────────────────────────────────────────────────────

export async function getRedirects(): Promise<Redirect[]> {
  return prisma.redirect.findMany({ orderBy: { createdAt: "desc" } })
}

// proxy.ts içinden çağrılır — auth kontrolü yok, salt okunur ve hızlı
export async function findActiveRedirect(pathname: string): Promise<Redirect | null> {
  return prisma.redirect.findFirst({ where: { fromPath: pathname, enabled: true } })
}

export async function incrementRedirectHit(id: string): Promise<void> {
  try {
    await prisma.redirect.update({ where: { id }, data: { hitCount: { increment: 1 } } })
  } catch {
    // sayaç güncellenemezse yönlendirmeyi engellemez
  }
}

export interface RedirectInput {
  fromPath: string
  toPath: string
  type: number
  enabled?: boolean
}

export async function createRedirect(data: RedirectInput): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user || session.user.role === "VIEWER") return { success: false, error: "Yetkisiz erişim" }

  const fromPath = normalizePath(data.fromPath)
  const toPath = normalizePath(data.toPath)
  if (!fromPath || !toPath) return { success: false, error: "Kaynak ve hedef adres zorunludur" }
  if (fromPath === toPath) return { success: false, error: "Kaynak ve hedef adres aynı olamaz" }

  try {
    await prisma.redirect.create({
      data: { fromPath, toPath, type: data.type === 302 ? 302 : 301, enabled: data.enabled ?? true },
    })
    revalidatePath("/panel/seo/yonlendirmeler")
    return { success: true }
  } catch (e) {
    if ((e as { code?: string }).code === "P2002") return { success: false, error: "Bu kaynak adres için zaten bir yönlendirme var" }
    return { success: false, error: (e as Error).message }
  }
}

export async function updateRedirect(id: string, data: RedirectInput): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user || session.user.role === "VIEWER") return { success: false, error: "Yetkisiz erişim" }

  const fromPath = normalizePath(data.fromPath)
  const toPath = normalizePath(data.toPath)
  if (!fromPath || !toPath) return { success: false, error: "Kaynak ve hedef adres zorunludur" }
  if (fromPath === toPath) return { success: false, error: "Kaynak ve hedef adres aynı olamaz" }

  try {
    await prisma.redirect.update({
      where: { id },
      data: { fromPath, toPath, type: data.type === 302 ? 302 : 301, enabled: data.enabled ?? true },
    })
    revalidatePath("/panel/seo/yonlendirmeler")
    return { success: true }
  } catch (e) {
    if ((e as { code?: string }).code === "P2002") return { success: false, error: "Bu kaynak adres için zaten bir yönlendirme var" }
    return { success: false, error: (e as Error).message }
  }
}

export async function toggleRedirect(id: string, current: boolean): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user || session.user.role === "VIEWER") return { success: false, error: "Yetkisiz erişim" }
  try {
    await prisma.redirect.update({ where: { id }, data: { enabled: !current } })
    revalidatePath("/panel/seo/yonlendirmeler")
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteRedirect(id: string): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user || session.user.role !== "ADMIN") return { success: false, error: "Yetkisiz erişim" }
  try {
    await prisma.redirect.delete({ where: { id } })
    revalidatePath("/panel/seo/yonlendirmeler")
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

// ── 404 Kayıtları ─────────────────────────────────────────────────────────

// not-found.tsx içinden çağrılır — auth kontrolü yok
export async function logNotFound(path: string, referer?: string | null): Promise<void> {
  if (!path || path.startsWith("/panel") || path.startsWith("/api")) return
  try {
    await prisma.notFoundLog.upsert({
      where: { path },
      update: { hitCount: { increment: 1 }, referer: referer ?? undefined, resolved: false },
      create: { path, referer: referer ?? null },
    })
  } catch {
    // loglama başarısız olursa 404 sayfasının render'ını engellemez
  }
}

export async function getNotFoundLogs(): Promise<NotFoundLog[]> {
  const session = await auth()
  if (!session?.user) return []
  return prisma.notFoundLog.findMany({ orderBy: [{ resolved: "asc" }, { lastSeen: "desc" }] })
}

export async function resolveNotFoundLog(id: string, resolved: boolean): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user) return { success: false, error: "Yetkisiz erişim" }
  try {
    await prisma.notFoundLog.update({ where: { id }, data: { resolved } })
    revalidatePath("/panel/seo/404")
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function deleteNotFoundLog(id: string): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user) return { success: false, error: "Yetkisiz erişim" }
  try {
    await prisma.notFoundLog.delete({ where: { id } })
    revalidatePath("/panel/seo/404")
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

// ── Kırık Link Raporu ─────────────────────────────────────────────────────

function extractInternalLinks(html: string, baseUrl: string): string[] {
  const hrefRegex = /href="([^"]+)"/g
  const found = new Set<string>()
  let match: RegExpExecArray | null
  while ((match = hrefRegex.exec(html))) {
    const href = match[1]
    let path: string | null = null
    if (href.startsWith("/") && !href.startsWith("//")) path = href
    else if (href.startsWith(baseUrl)) path = href.slice(baseUrl.length) || "/"
    if (!path) continue
    path = path.split("#")[0].split("?")[0]
    if (!path || path.startsWith("/api") || path.startsWith("/_next") || path.startsWith("/panel")) continue
    found.add(path)
  }
  return [...found]
}

export async function runBrokenLinkScan(): Promise<ActionResult<{ pagesScanned: number; linksChecked: number; broken: number }>> {
  const session = await auth()
  if (!session?.user || session.user.role === "VIEWER") return { success: false, error: "Yetkisiz erişim" }

  try {
    const setting = await prisma.siteSettings.findUnique({ where: { key: "site_url" } })
    const baseUrl = (process.env.NEXTAUTH_URL || setting?.value || "http://localhost:3000").replace(/\/$/, "")

    const pages = await prisma.page.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, title: true } })

    const linkMap = new Map<string, { sourceUrl: string; sourceLabel: string; targetUrl: string }>()

    for (const src of pages) {
      try {
        const res = await fetch(`${baseUrl}${src.slug}`, { cache: "no-store" })
        if (!res.ok) continue
        const html = await res.text()
        for (const link of extractInternalLinks(html, baseUrl)) {
          const key = `${src.slug}::${link}`
          if (!linkMap.has(key)) linkMap.set(key, { sourceUrl: src.slug, sourceLabel: src.title, targetUrl: link })
        }
      } catch {
        // sayfa getirilemedi, atla
      }
    }

    let broken = 0
    for (const { sourceUrl, sourceLabel, targetUrl } of linkMap.values()) {
      let statusCode: number | null = null
      let ok = false
      try {
        const res = await fetch(`${baseUrl}${targetUrl}`, { method: "GET", redirect: "manual", cache: "no-store" })
        statusCode = res.status
        ok = res.status < 400
      } catch {
        ok = false
      }
      if (!ok) broken++
      await prisma.brokenLinkCheck.upsert({
        where: { sourceUrl_targetUrl: { sourceUrl, targetUrl } },
        update: { sourceLabel, statusCode, ok, lastCheckedAt: new Date() },
        create: { sourceUrl, sourceLabel, targetUrl, statusCode, ok },
      })
    }

    revalidatePath("/panel/seo/kirik-linkler")
    return { success: true, data: { pagesScanned: pages.length, linksChecked: linkMap.size, broken } }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}

export async function getBrokenLinkChecks(): Promise<BrokenLinkCheck[]> {
  const session = await auth()
  if (!session?.user) return []
  return prisma.brokenLinkCheck.findMany({ orderBy: [{ ok: "asc" }, { lastCheckedAt: "desc" }] })
}

export async function deleteBrokenLinkChecks(): Promise<ActionResult> {
  const session = await auth()
  if (!session?.user) return { success: false, error: "Yetkisiz erişim" }
  try {
    await prisma.brokenLinkCheck.deleteMany({})
    revalidatePath("/panel/seo/kirik-linkler")
    return { success: true }
  } catch (e) {
    return { success: false, error: (e as Error).message }
  }
}
