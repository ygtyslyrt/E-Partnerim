import { getHeroContent } from "@/lib/actions/hero"
import HeroEditor from "@/components/admin/editors/HeroEditor"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "İçerik Yönetimi" }

export default async function IcerikPage() {
  const hero = await getHeroContent()

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">İçerik Yönetimi</h1>
        <p className="mt-1 text-sm text-slate-500">Ana sayfa bölümlerini buradan düzenleyin.</p>
      </div>

      <div className="space-y-6">
        <section className="rounded-2xl border border-[#E4EAF5] bg-white p-6">
          <h2 className="mb-4 text-base font-semibold text-slate-700">Hero Bölümü</h2>
          <HeroEditor initialData={hero} />
        </section>
      </div>
    </div>
  )
}
