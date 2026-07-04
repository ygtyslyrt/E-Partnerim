"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getIcon } from "@/lib/icon-map";
import type { SolutionsSectionConfig } from "@prisma/client";

type FeaturedSolution = {
  id: string;
  title: string;
  slug: string;
  icon: string | null;
  color: string | null;
  shortDesc: string | null;
  category: string | null;
};

interface Props {
  config: SolutionsSectionConfig;
  items: FeaturedSolution[];
}

export default function SolutionsPreview({ config, items }: Props) {
  if (items.length === 0) return null;

  return (
    <section className="bg-[#FAFCFC] py-24">
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
              Çözümler
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
            href="/cozumler"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[#00D084] hover:underline underline-offset-4 flex-shrink-0"
          >
            Tümünü Gör
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((s, i) => {
            const Icon = getIcon(s.icon);
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.06, ease: "easeOut" }}
              >
                <Link href="/cozumler" className="group block h-full">
                  <div className="flex h-full flex-col rounded-2xl border border-[#E8EEF0] bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#00D084]/25 hover:shadow-md">
                    <div
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl mb-4"
                      style={{ backgroundColor: `${s.color ?? "#3730A3"}1A` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: s.color ?? "#3730A3" }} />
                    </div>
                    <h3 className="text-sm font-bold text-[#0F172A] group-hover:text-[#00D084] transition-colors">{s.title}</h3>
                    {s.shortDesc && (
                      <p className="mt-2 text-sm leading-relaxed text-[#64748B] line-clamp-3">{s.shortDesc}</p>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
