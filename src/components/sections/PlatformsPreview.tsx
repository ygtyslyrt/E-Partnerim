"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Store } from "lucide-react";
import type { PlatformsSectionConfig } from "@prisma/client";

type FeaturedPlatform = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  logoColor: string | null;
  shortDesc: string | null;
  category: string | null;
};

interface Props {
  config: PlatformsSectionConfig;
  items: FeaturedPlatform[];
}

export default function PlatformsPreview({ config, items }: Props) {
  if (items.length === 0) return null;

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-12 flex items-end justify-between gap-4"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00D084]">
              Platformlar
            </p>
            {config.title && (
              <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-[#0F172A] sm:text-5xl">
                {config.title}
              </h2>
            )}
            {config.subtitle && (
              <p className="mt-4 max-w-xl text-lg text-[#64748B]">{config.subtitle}</p>
            )}
          </div>
          <Link
            href="/platformlar"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[#00D084] hover:underline underline-offset-4 flex-shrink-0"
          >
            Tümünü Gör
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: "easeOut" }}
            >
              <Link href="/platformlar" className="group block h-full">
                <div className="flex h-full flex-col rounded-2xl border border-[#E8EEF0] bg-[#FAFCFC] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#00D084]/25 hover:shadow-md">
                  <div className="flex items-center gap-3">
                    {p.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.logo} alt={p.name} className="h-9 w-9 rounded-lg object-contain" />
                    ) : (
                      <div
                        className="flex h-9 w-9 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${p.logoColor ?? "#00D084"}1A` }}
                      >
                        <Store className="h-4.5 w-4.5" style={{ color: p.logoColor ?? "#00D084" }} />
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-bold text-[#0F172A] group-hover:text-[#00D084] transition-colors">{p.name}</h3>
                      {p.category && <span className="text-xs text-[#94A3B8]">{p.category}</span>}
                    </div>
                  </div>
                  {p.shortDesc && (
                    <p className="mt-3 text-sm leading-relaxed text-[#64748B] line-clamp-2">{p.shortDesc}</p>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
