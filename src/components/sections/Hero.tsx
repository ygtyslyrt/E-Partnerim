"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import PartnerixScene from "./PartnerixScene";
import type { HeroSectionContent } from "@prisma/client";

/* ── Animasyon varyantları ─────────────────────────── */
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const TRUST_SIGNALS = ["Ücretsiz danışmanlık", "Tarafsız öneriler", "Bağlayıcı sözleşme yok", "Uzman ekip desteği"];

interface Props {
  content: HeroSectionContent;
}

/* ── Hero ──────────────────────────────────────────── */
export default function Hero({ content }: Props) {
  const gradient = content.gradient || "linear-gradient(90deg, #00D084 0%, #18AFC1 100%)";
  const bgColor = content.bgColor || "#F3F4FB";

  return (
    <section
      className="relative overflow-hidden pb-10 pt-10"
      style={{
        backgroundColor: bgColor,
        backgroundImage: content.bgImage ? `url(${content.bgImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >

      {/* Arka plan dekor */}
      <div className="pointer-events-none absolute inset-0 select-none">
        {content.dotPattern && (
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
        )}
        <div
          className="absolute right-0 top-0 h-[700px] w-[700px]"
          style={{
            background: "radial-gradient(circle, rgba(79,70,229,0.07) 0%, rgba(0,208,132,0.03) 40%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[420px_1fr] lg:gap-10">

          {/* ── Sol: Metin ──────────────────────────── */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col pb-0"
          >
            {/* Badge */}
            {content.badge && (
              <motion.div variants={fadeUp}>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#E4E9F2] bg-white px-4 py-1.5 text-[11.5px] font-semibold text-[#64748B] shadow-sm">
                  <Sparkles className="h-3.5 w-3.5 text-[#4F46E5]" />
                  {content.badge}
                </span>
              </motion.div>
            )}

            {/* H1 */}
            <motion.h1
              variants={fadeUp}
              className="mt-4 text-[42px] font-extrabold leading-[1.07] tracking-tight text-[#0F172A] sm:text-5xl"
            >
              {content.title1}
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: gradient }}
              >
                {content.title2}
              </span>
            </motion.h1>

            {/* Subtitle */}
            {content.subtitle && (
              <motion.p
                variants={fadeUp}
                className="mt-4 max-w-[380px] text-[14.5px] leading-relaxed text-[#64748B]"
              >
                {content.subtitle}
              </motion.p>
            )}

            {/* CTA */}
            <motion.div variants={fadeUp} className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="#partnerix"
                className="inline-flex h-12 items-center gap-2.5 rounded-xl bg-[#3730A3] px-6 text-[13px] font-semibold text-white shadow-[0_4px_16px_rgba(55,48,163,0.35)] transition-all hover:bg-[#312e81] hover:shadow-[0_6px_20px_rgba(55,48,163,0.4)] active:scale-[0.98]"
              >
                <Sparkles className="h-4 w-4" />
                <span className="flex flex-col items-start leading-tight">
                  <span>Partnerix ile Başla</span>
                  <span className="text-[9.5px] font-normal text-white/55">Ücretsiz Yol Haritanı Oluştur</span>
                </span>
              </a>
              <a
                href="/cozumler"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-[#E4E9F2] bg-white px-6 text-[13px] font-semibold text-[#0F172A] shadow-sm transition-all hover:border-[#C7D2FE] hover:shadow-md active:scale-[0.98]"
              >
                Çözümleri Keşfet
                <ArrowRight className="h-4 w-4" />
              </a>
            </motion.div>

            {/* Trust sinyalleri */}
            <motion.div variants={fadeUp} className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
              {TRUST_SIGNALS.map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-[12px] text-[#64748B]">
                  <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-[#00D084]" />
                  {t}
                </span>
              ))}
            </motion.div>

          </motion.div>

          {/* ── Sağ: Partnerix ürün demosu ──────────── */}
          {content.showPartnerixDemo && (
            <div className="hidden lg:flex lg:justify-center">
              <PartnerixScene welcomeMessage={content.partnerixMessage ?? undefined} />
            </div>
          )}

        </div>
      </div>


    </section>
  );
}
