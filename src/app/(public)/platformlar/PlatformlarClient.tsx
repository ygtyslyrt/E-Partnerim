"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import PageHero from "@/components/layout/PageHero"
import CTASection from "@/components/sections/CTASection"
import { CheckCircle2, ArrowRight } from "lucide-react"
import type { PlatformWithFeatures } from "@/lib/actions/platforms"

const WHATSAPP_URL = "https://wa.me/905451416118"

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

function PlatformCard({ platform }: { platform: PlatformWithFeatures }) {
  const color = platform.logoColor || "#3730A3"
  const advantages = platform.features.filter((f) => f.type === "ADVANTAGE")

  return (
    <Link
      href={`/platformlar/${platform.slug}`}
      className="flex flex-col rounded-2xl border border-[#E8EEF0] bg-white p-6 transition-all hover:border-[#00D084]/25 hover:shadow-sm"
    >
      <div
        className="mb-4 inline-flex w-fit items-center rounded-xl px-4 py-2"
        style={{ backgroundColor: hexToRgba(color, 0.09) }}
      >
        {platform.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={platform.logo} alt={platform.name} className="h-6 object-contain" />
        ) : (
          <span className="text-lg font-black" style={{ color }}>
            {platform.name}
          </span>
        )}
      </div>

      {platform.shortDesc && (
        <p className="text-sm leading-relaxed text-[#64748B] flex-1">{platform.shortDesc}</p>
      )}

      {advantages.length > 0 && (
        <ul className="mt-4 space-y-1.5">
          {advantages.map((f) => (
            <li key={f.id} className="flex items-start gap-2 text-sm text-[#374151]">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[#00D084]" />
              {f.text}
            </li>
          ))}
        </ul>
      )}

      {platform.description && (
        <div className="mt-4 rounded-xl border border-[#E8EEF0] bg-[#FAFCFC] px-3.5 py-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-0.5">
            Kimler için uygun?
          </p>
          <p className="text-xs font-medium text-[#374151]">{platform.description}</p>
        </div>
      )}
    </Link>
  )
}

export type CategoryGroup = {
  id: string
  label: string
  platforms: PlatformWithFeatures[]
}

export default function PlatformlarClient({ categories }: { categories: CategoryGroup[] }) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? "")
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    categories.forEach(({ id }) => {
      const el = sectionRefs.current[id]
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveId(id) },
        { rootMargin: "-40% 0px -55% 0px" }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [categories])

  function scrollTo(id: string) {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Ana Sayfa", href: "/" }, { label: "Platformlar" }]}
        badge="Partner Ekosistemi"
        title="Platformlar"
        subtitle="Türkiye'nin önde gelen e-ticaret altyapılarını, entegrasyon araçlarını ve iş yazılımlarını tarafsız biçimde değerlendiriyoruz."
      />

      {/* Sticky tab bar */}
      <div className="sticky top-16 z-40 border-b border-[#E8EEF0] bg-white/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {categories.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`flex-shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                  activeId === id
                    ? "bg-[#00D084]/10 text-[#00D084]"
                    : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category sections */}
      <div className="bg-[#FAFCFC]">
        {categories.map(({ id, label, platforms }, i) => (
          <section
            key={id}
            id={id}
            ref={(el) => { sectionRefs.current[id] = el }}
            className={`scroll-mt-32 py-16 ${i % 2 === 0 ? "bg-[#FAFCFC]" : "bg-white"}`}
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <h2 className="text-2xl font-extrabold tracking-tight text-[#0F172A]">{label}</h2>
                <div className="mt-2 h-0.5 w-10 rounded-full bg-[#00D084]" />
              </div>
              <div className={`grid grid-cols-1 gap-4 ${platforms.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4"}`}>
                {platforms.map((p) => (
                  <PlatformCard key={p.id} platform={p} />
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Decision support CTA */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-[#0F172A] p-8 sm:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#00D084]">Kararsız mısınız?</p>
                <h3 className="mt-2 text-2xl font-extrabold text-white leading-snug">
                  Hangi platform size uygun
                  <br className="hidden sm:block" /> olduğundan emin değil misiniz?
                </h3>
                <p className="mt-3 text-sm text-white/60 max-w-md">
                  İşletmenizin ihtiyaçlarını paylaşın — hangi altyapının, ödeme sisteminin veya yazılımın size uyduğunu tarafsız biçimde değerlendirelim.
                </p>
              </div>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 inline-flex items-center gap-2.5 rounded-xl bg-[#00D084] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(0,208,132,0.35)] transition-all hover:bg-[#00bb76] active:scale-[0.98]"
              >
                <WhatsAppIcon className="h-[1.125rem] w-[1.125rem]" />
                Ücretsiz Danışmanlık Al
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}
