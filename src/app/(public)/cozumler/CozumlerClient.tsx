"use client"

import PageHero from "@/components/layout/PageHero"
import CTASection from "@/components/sections/CTASection"
import { CheckCircle2, ArrowRight, MessageSquare, Store, ShieldCheck, Megaphone, Star, Package, Zap, Target, Globe, BookOpen, BarChart2, Settings, Users, TrendingUp, Award, Lightbulb, Rocket, Briefcase, Search } from "lucide-react"
import Link from "next/link"
import type { SolutionWithFeatures } from "@/lib/actions/solutions"

const WHATSAPP_URL = "https://wa.me/905451416118"

const ICON_MAP: Record<string, React.ElementType> = {
  MessageSquare, Store, ShieldCheck, Megaphone, Star, Package, Zap, Target,
  Globe, BookOpen, BarChart2, Settings, Users, TrendingUp, Award,
  Lightbulb, Rocket, Briefcase, Search,
}

function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function SolutionCard({ solution, index }: { solution: SolutionWithFeatures; index: number }) {
  const color = solution.color || "#3730A3"
  const IconComponent = solution.icon ? ICON_MAP[solution.icon] : null
  const advantages = solution.features.filter((f) => f.type === "ADVANTAGE")
  const isWhatsapp = solution.ctaUrl?.includes("wa.me")
  const isWhatsapp2 = solution.ctaUrl2?.includes("wa.me")

  return (
    <div className="flex flex-col rounded-2xl border border-[#E8EEF0] bg-white overflow-hidden transition-all hover:shadow-md hover:border-opacity-50"
      style={{ borderTopColor: color, borderTopWidth: 3 }}
    >
      <div className="flex flex-col flex-1 p-7">
        {/* Header */}
        <div className="flex items-start gap-4 mb-5">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
            style={{ backgroundColor: hexToRgba(color, 0.1) }}
          >
            {IconComponent ? (
              <IconComponent size={28} style={{ color }} />
            ) : (
              <span className="text-xl font-black" style={{ color }}>{solution.title[0]}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-xs font-bold tracking-[0.15em] uppercase" style={{ color }}>
                {String(index + 1).padStart(2, "0")}
              </span>
              {solution.category && (
                <span
                  className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                  style={{ backgroundColor: hexToRgba(color, 0.09), color }}
                >
                  {solution.category}
                </span>
              )}
            </div>
            <h3 className="text-xl font-extrabold tracking-tight text-[#0F172A]">{solution.title}</h3>
          </div>
        </div>

        {solution.shortDesc && (
          <p className="text-sm leading-relaxed text-[#64748B] mb-5">{solution.shortDesc}</p>
        )}

        {advantages.length > 0 && (
          <ul className="mb-6 space-y-2 flex-1">
            {advantages.map((f) => (
              <li key={f.id} className="flex items-start gap-2.5 text-sm text-[#374151]">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#00D084]" />
                {f.text}
              </li>
            ))}
          </ul>
        )}

        {/* CTAs */}
        {(solution.ctaLabel || solution.ctaLabel2) && (
          <div className="mt-auto flex flex-col gap-2 pt-4 border-t border-[#F1F5F9]">
            {solution.ctaLabel && solution.ctaUrl && (
              <Link
                href={solution.ctaUrl}
                target={isWhatsapp ? "_blank" : undefined}
                rel={isWhatsapp ? "noopener noreferrer" : undefined}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
                style={{ backgroundColor: color }}
              >
                {isWhatsapp && <WhatsAppIcon className="h-4 w-4" />}
                {solution.ctaLabel}
                {!isWhatsapp && <ArrowRight className="h-4 w-4" />}
              </Link>
            )}
            {solution.ctaLabel2 && solution.ctaUrl2 && (
              <Link
                href={solution.ctaUrl2}
                target={isWhatsapp2 ? "_blank" : undefined}
                rel={isWhatsapp2 ? "noopener noreferrer" : undefined}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E8EEF0] px-5 py-2.5 text-sm font-medium text-[#64748B] transition-all hover:bg-[#F8FAFC] hover:text-[#0F172A]"
              >
                {solution.ctaLabel2}
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function CozumlerClient({ solutions }: { solutions: SolutionWithFeatures[] }) {
  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Ana Sayfa", href: "/" }, { label: "Çözümler" }]}
        badge={`${solutions.length} Çözüm Alanı`}
        title="Çözümler"
        subtitle="Ne arıyorsunuz bilmiyorsanız bile — ihtiyacınızı birlikte bulur, doğru partnere ücretsiz yönlendiririz."
      />

      <div className="bg-[#FAFCFC] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {solutions.map((solution, i) => (
              <SolutionCard key={solution.id} solution={solution} index={i} />
            ))}
          </div>
        </div>
      </div>

      {/* Karar destek CTA */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-[#0F172A] p-8 sm:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#00D084]">Nereden başlayacağınızı bilemiyor musunuz?</p>
                <h3 className="mt-2 text-2xl font-extrabold text-white leading-snug">
                  Hangi çözümün size uygun
                  <br className="hidden sm:block" /> olduğundan emin değil misiniz?
                </h3>
                <p className="mt-3 text-sm text-white/60 max-w-md">
                  İşletmenizin durumunu paylaşın, ihtiyaçlarınızı birlikte belirleyelim ve sizi doğru çözüm ortağıyla ücretsiz buluşturalım.
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
