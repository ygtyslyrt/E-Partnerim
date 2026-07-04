"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getIcon } from "@/lib/icon-map";
import type { ServicesSectionContent, ServiceItem } from "@prisma/client";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.4, 0.25, 1] } },
};

interface Props {
  content: ServicesSectionContent & { items: ServiceItem[] };
}

export default function Services({ content }: Props) {
  return (
    <section className="bg-[#FAFCFC] py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Başlık */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
          className="mb-12"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00D084]">
            Hizmetlerimiz
          </p>
          {content.title && (
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-[#0F172A] sm:text-5xl">
              {content.title}
            </h2>
          )}
          {content.subtitle && (
            <p className="mt-4 max-w-xl text-lg text-[#64748B]">
              {content.subtitle}
            </p>
          )}
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          {content.items.map((item) => {
            const Icon = getIcon(item.icon);
            return (
              <motion.div
                key={item.id}
                variants={fadeUp}
                className={`group relative overflow-hidden rounded-2xl p-8 flex flex-col justify-between min-h-[260px] transition-all duration-300 cursor-pointer ${
                  item.highlighted
                    ? "bg-[#0F172A] md:col-span-2"
                    : "border border-[#E8EEF0] bg-white hover:-translate-y-1 hover:border-[#00D084]/30 hover:shadow-md"
                }`}
              >
                {item.highlighted && (
                  <div
                    className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-20"
                    style={{ background: `radial-gradient(circle, ${item.color} 0%, transparent 70%)` }}
                  />
                )}
                <div>
                  <div
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl mb-5"
                    style={{ backgroundColor: item.highlighted ? `${item.color}26` : `${item.color}1A` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: item.color }} />
                  </div>
                  <h3 className={`text-lg font-bold leading-snug ${item.highlighted ? "text-white text-xl" : "text-[#0F172A]"}`}>
                    {item.title}
                  </h3>
                  <p className={`mt-3 text-sm leading-relaxed max-w-sm ${item.highlighted ? "text-white/60" : "text-[#64748B]"}`}>
                    {item.description}
                  </p>
                </div>
                {item.statValue && (
                  <div className="mt-6 flex items-center justify-between">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold ${
                        item.highlighted ? "bg-white/10 text-[#00D084]" : "border border-[#E8EEF0] text-[#0F172A]"
                      }`}
                    >
                      <span className="font-extrabold" style={{ color: item.highlighted ? undefined : item.color }}>
                        {item.statValue}
                      </span>
                      {item.statLabel}
                    </span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Alt CTA */}
        {content.ctaLabel && content.ctaUrl && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 text-center"
          >
            <a
              href={content.ctaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#00D084] hover:underline underline-offset-4"
            >
              {content.ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        )}

      </div>
    </section>
  );
}
