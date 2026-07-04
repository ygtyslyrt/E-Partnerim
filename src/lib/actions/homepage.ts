"use server"

import { prisma } from "@/lib/prisma"
import { getSiteSettings } from "@/lib/actions/settings"
import { getPublishedBlogPosts } from "@/lib/actions/blog"
import { getPartnerixCharacter } from "@/lib/actions/partnerix-character"

// Ana sayfa — herkese açık, auth gerektirmez. Tüm bölümleri tek sorguda,
// görünürlük ve sıraya göre getirir. Platformlar/Çözümler bölümleri için
// "featured" kayıtları ayrıca çeker.
export async function getHomepageSections() {
  const [page, settings] = await Promise.all([
    prisma.page.findUnique({
      where: { slug: "/" },
      include: {
        sections: {
          where: { visible: true },
          orderBy: { order: "asc" },
          include: {
            heroContent: true,
            platformsContent: true,
            solutionsContent: true,
            socialProofContent: {
              include: {
                logos: { orderBy: { order: "asc" } },
                stats: { orderBy: { order: "asc" } },
                testimonials: { orderBy: { order: "asc" } },
              },
            },
            servicesContent: { include: { items: { orderBy: { order: "asc" } } } },
            howItWorksContent: { include: { steps: { orderBy: { order: "asc" } } } },
            whyUsContent: { include: { features: { orderBy: { order: "asc" } } } },
            ctaContent: true,
            blogContent: true,
          },
        },
      },
    }),
    getSiteSettings(),
  ])

  const sections = page?.sections ?? []

  const needsPlatforms = sections.some((s) => s.sectionType === "platforms")
  const needsSolutions = sections.some((s) => s.sectionType === "solutions")
  const blogSection = sections.find((s) => s.sectionType === "blog")
  const heroSection = sections.find((s) => s.sectionType === "hero")

  const [featuredPlatforms, featuredSolutions, blogPosts, partnerixCharacter] = await Promise.all([
    needsPlatforms
      ? prisma.platform.findMany({
          where: { status: "PUBLISHED", featured: true },
          orderBy: { order: "asc" },
          take: sections.find((s) => s.sectionType === "platforms")?.platformsContent?.showCount ?? 6,
          select: { id: true, name: true, slug: true, logo: true, logoColor: true, shortDesc: true, category: true },
        })
      : Promise.resolve([]),
    needsSolutions
      ? prisma.solution.findMany({
          where: { status: "PUBLISHED", featured: true },
          orderBy: { order: "asc" },
          take: sections.find((s) => s.sectionType === "solutions")?.solutionsContent?.showCount ?? 6,
          select: { id: true, title: true, slug: true, icon: true, color: true, shortDesc: true, category: true },
        })
      : Promise.resolve([]),
    blogSection
      ? getPublishedBlogPosts(blogSection.blogContent?.showCount ?? 4, blogSection.blogContent?.categoryFilter)
      : Promise.resolve([]),
    heroSection?.heroContent?.showPartnerixDemo ? getPartnerixCharacter() : Promise.resolve(null),
  ])

  return { sections, featuredPlatforms, featuredSolutions, blogPosts, partnerixCharacter, settings }
}

export type HomepageSections = Awaited<ReturnType<typeof getHomepageSections>>
export type HomepageSection = HomepageSections["sections"][number]
