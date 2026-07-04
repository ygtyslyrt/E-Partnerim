"use client";

import Image from "next/image";
import type { SocialProofSectionContent, SocialProofLogo, SocialProofStat, Testimonial } from "@prisma/client";

interface Props {
  content: SocialProofSectionContent & {
    logos: SocialProofLogo[];
    stats: SocialProofStat[];
    testimonials: Testimonial[];
  };
}

export default function SocialProof({ content }: Props) {
  // Marquee için listeyi iki kez tekrar et
  const marqueeItems = [...content.logos, ...content.logos];

  return (
    <section className="bg-white py-16 border-t border-[#E8EEF0]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Üst Başlık */}
        {content.title && (
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#94A3B8]">
            {content.title}
          </p>
        )}
        {content.subtitle && (
          <p className="mt-2 text-center text-sm text-[#64748B]">
            {content.subtitle}
          </p>
        )}

        {/* Marquee */}
        {content.logos.length > 0 && (
          <div className="relative mt-10 overflow-hidden">
            {/* Sol gradient maskesi */}
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-white to-transparent" />
            {/* Sağ gradient maskesi */}
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-white to-transparent" />

            <div className="animate-marquee flex items-center gap-10 w-max">
              {marqueeItems.map((partner, i) =>
                partner.logo ? (
                  <span key={`${partner.id}-${i}`} className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={partner.logo} alt={partner.name} className="h-7 w-auto object-contain" />
                  </span>
                ) : (
                  <span
                    key={`${partner.id}-${i}`}
                    className="flex-shrink-0 text-base font-bold tracking-tight cursor-default select-none transition-opacity duration-200 hover:opacity-80"
                    style={{ color: partner.color ?? "#0F172A", opacity: 0.65 }}
                  >
                    {partner.name}
                  </span>
                )
              )}
            </div>
          </div>
        )}

        {/* İstatistik Şeridi */}
        {content.stats.length > 0 && (
          <div className="mt-14 flex flex-col sm:flex-row items-center justify-center divide-y sm:divide-y-0 sm:divide-x divide-[#E8EEF0]">
            {content.stats.map((stat) => (
              <div key={stat.id} className="flex flex-col items-center px-10 py-4 sm:py-0">
                <span className="text-3xl font-extrabold tracking-tight text-[#0F172A]">
                  {stat.value}
                </span>
                <span className="mt-1 text-sm text-[#64748B]">{stat.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Referanslar */}
        {content.testimonials.length > 0 && (
          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {content.testimonials.map((t) => (
              <div key={t.id} className="rounded-2xl border border-[#E8EEF0] bg-[#FAFCFC] p-6">
                <p className="text-sm leading-relaxed text-[#334155]">&ldquo;{t.content}&rdquo;</p>
                <div className="mt-4 flex items-center gap-3">
                  {t.avatar ? (
                    <Image src={t.avatar} alt={t.name} width={36} height={36} className="rounded-full object-cover" />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00D084]/10 text-sm font-bold text-[#00D084]">
                      {t.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold text-[#0F172A]">{t.name}</p>
                    {(t.role || t.company) && (
                      <p className="text-xs text-[#94A3B8]">{[t.role, t.company].filter(Boolean).join(" · ")}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
