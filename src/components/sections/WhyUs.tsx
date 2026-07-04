"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getIcon } from "@/lib/icon-map";
import type { WhyUsSectionContent, WhyUsFeature } from "@prisma/client";

const containerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

interface Props {
  content: WhyUsSectionContent & { features: WhyUsFeature[] };
  whatsappUrl: string;
}

export default function WhyUs({ content, whatsappUrl }: Props) {
  return (
    <section className="bg-[#FAFCFC] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">

          {/* ── Sol: Koyu Kart ─────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative overflow-hidden rounded-2xl bg-[#0F172A] p-8 lg:col-span-2 flex flex-col justify-between min-h-[420px]"
          >
            {/* Dekor blob */}
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-20"
              style={{ background: "radial-gradient(circle, #00D084 0%, transparent 70%)" }}
            />
            <div
              className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full opacity-10"
              style={{ background: "radial-gradient(circle, #18AFC1 0%, transparent 70%)" }}
            />

            <div className="relative z-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00D084]">
                Neden E-Partnerim?
              </p>
              {content.title && (
                <h2 className="mt-4 text-3xl font-extrabold leading-snug tracking-tight text-white sm:text-4xl">
                  {content.title}
                </h2>
              )}
              {content.description && (
                <p className="mt-4 text-sm leading-relaxed text-white/60">
                  {content.description}
                </p>
              )}
            </div>

            {/* İstatistikler */}
            {(content.stat1Value || content.stat2Value) && (
              <div className="relative z-10 mt-8 flex items-center divide-x divide-white/10">
                {content.stat1Value && (
                  <div className="flex flex-col pr-8">
                    <span className="text-4xl font-black text-white">{content.stat1Value}</span>
                    <span className="mt-1 text-xs text-white/50">{content.stat1Label}</span>
                  </div>
                )}
                {content.stat2Value && (
                  <div className="flex flex-col pl-8">
                    <span className="text-4xl font-black text-white">{content.stat2Value}</span>
                    <span className="mt-1 text-xs text-white/50">{content.stat2Label}</span>
                  </div>
                )}
              </div>
            )}

            {/* CTA */}
            {content.ctaLabel && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 mt-8 inline-flex items-center gap-2 rounded-xl bg-[#0F172A] px-6 py-3 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(15,23,42,0.18)] transition-all hover:bg-[#1E293B] active:scale-[0.98] self-start"
              >
                {content.ctaLabel}
                <ArrowRight className="h-4 w-4" />
              </a>
            )}
          </motion.div>

          {/* ── Sağ: Nokta Grid ──────────────────────── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-3 content-start"
          >
            {content.features.map((feature) => {
              const Icon = getIcon(feature.icon);
              return (
                <motion.div
                  key={feature.id}
                  variants={itemVariants}
                  className="group flex gap-4 rounded-2xl border border-[#E8EEF0] bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#00D084]/25 hover:shadow-sm"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#00D084]/10 group-hover:bg-[#00D084]/15 transition-colors">
                    <Icon className="h-4.5 w-4.5 text-[#00D084]" style={{ width: "1.125rem", height: "1.125rem" }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">{feature.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#64748B]">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
