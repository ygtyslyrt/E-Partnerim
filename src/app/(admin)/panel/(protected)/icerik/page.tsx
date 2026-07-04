import { getSectionsOverview } from "@/lib/actions/sections"
import { getHeroContent } from "@/lib/actions/hero"
import { getPlatformsSectionConfig } from "@/lib/actions/platforms-section"
import { getSolutionsSectionConfig } from "@/lib/actions/solutions-section"
import { getServicesContent } from "@/lib/actions/services"
import { getHowItWorksContent } from "@/lib/actions/how-it-works"
import { getWhyUsContent } from "@/lib/actions/why-us"
import { getSocialProofContent } from "@/lib/actions/social-proof"
import { getBlogSectionConfig } from "@/lib/actions/blog-section"
import { getCtaContent } from "@/lib/actions/cta"
import { getCategories } from "@/lib/actions/blog"
import SectionsManager from "@/components/admin/editors/SectionsManager"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "İçerik Yönetimi" }

export default async function IcerikPage() {
  const [
    sections, hero, platforms, solutions, services,
    howItWorks, whyUs, socialProof, blog, cta, categories,
  ] = await Promise.all([
    getSectionsOverview(),
    getHeroContent(),
    getPlatformsSectionConfig(),
    getSolutionsSectionConfig(),
    getServicesContent(),
    getHowItWorksContent(),
    getWhyUsContent(),
    getSocialProofContent(),
    getBlogSectionConfig(),
    getCtaContent(),
    getCategories(),
  ])

  const contentMap: Record<string, unknown> = {
    hero, platforms, solutions, services,
    "how-it-works": howItWorks, "why-us": whyUs, "social-proof": socialProof,
    blog, cta,
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">İçerik Yönetimi</h1>
        <p className="mt-1 text-sm text-slate-500">
          Ana sayfa bölümlerini buradan düzenleyin, sürükleyerek sıralayın, gizleyin/gösterin.
        </p>
      </div>

      <SectionsManager initialSections={sections} contentMap={contentMap} categories={categories} />
    </div>
  )
}
