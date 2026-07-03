"use client";

import { motion } from "framer-motion";
import { MessageCircle, Cpu, ShieldCheck, BarChart2, ArrowRight } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/905451416118";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.4, 0.25, 1] } },
};

/* Dijital Pazarlama kartı için mini bar grafik */
function MiniBarChart() {
  const bars = [40, 58, 45, 72, 62, 88, 78];
  return (
    <div className="flex items-end gap-1.5 h-14">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm"
          style={{
            height: `${h}%`,
            background: i === 5
              ? "linear-gradient(180deg, #00D084 0%, #18AFC1 100%)"
              : i === 6
              ? "rgba(0,208,132,0.5)"
              : "rgba(0,208,132,0.15)",
          }}
        />
      ))}
    </div>
  );
}

export default function Services() {
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
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-[#0F172A] sm:text-5xl">
            E-Ticaretinizin Her Adımında
            <br className="hidden sm:block" /> Yanınızdayız
          </h2>
          <p className="mt-4 max-w-xl text-lg text-[#64748B]">
            Danışmanlıktan kuruluma, pazarlamadan marka tesciline — tek çatı altında.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          {/* ── Üst Satır ─────────────────────────────── */}

          {/* 1 — Ücretsiz Danışmanlık (Büyük, Koyu) */}
          <motion.div
            variants={fadeUp}
            className="group relative overflow-hidden rounded-2xl bg-[#0F172A] p-8 md:col-span-2 flex flex-col justify-between min-h-[280px] cursor-pointer"
          >
            {/* Arka plan dekor */}
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-20"
              style={{ background: "radial-gradient(circle, #00D084 0%, transparent 70%)" }}
            />
            <div>
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#00D084]/15 mb-5">
                <MessageCircle className="h-5 w-5 text-[#00D084]" />
              </div>
              <h3 className="text-xl font-bold text-white leading-snug">
                Ne yapmanız gerektiğini <br className="hidden sm:block" />net bir şekilde görün
              </h3>
              <p className="mt-3 text-sm text-white/60 leading-relaxed max-w-sm">
                İhtiyacınızı analiz ediyor, size en uygun çözümü ücretsiz belirliyoruz. Bağlayıcı sözleşme yok.
              </p>
            </div>
            <div className="mt-8 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#00D084]/15 px-4 py-1.5 text-sm font-semibold text-[#00D084]">
                %85 — 2 haftada net yön belirleme
              </span>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#0F172A] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(15,23,42,0.18)] transition-all hover:bg-[#1E293B] active:scale-[0.97]"
              >
                Şimdi Danışın
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>

          {/* 2 — Kurulum & Teknik Destek (Küçük, Beyaz) */}
          <motion.div
            variants={fadeUp}
            className="group relative overflow-hidden rounded-2xl border border-[#E8EEF0] bg-white p-8 flex flex-col justify-between min-h-[280px] transition-all duration-300 hover:-translate-y-1 hover:border-[#00D084]/30 hover:shadow-md cursor-pointer"
          >
            <div>
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#00D084]/10 mb-5">
                <Cpu className="h-5 w-5 text-[#00D084]" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] leading-snug">
                Kurulum & Teknik Destek
              </h3>
              <p className="mt-3 text-sm text-[#64748B] leading-relaxed">
                Teknik bilgi gerektirmeden sisteminizi kurun. Yayına hazır olana kadar her adımda yanınızdayız.
              </p>
            </div>
            <div className="mt-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#E8EEF0] px-3 py-1 text-xs font-semibold text-[#0F172A]">
                <span className="text-[#00D084] font-extrabold">%90</span>
                30 gün içinde teknik aksaksız
              </div>
            </div>
          </motion.div>

          {/* ── Alt Satır ─────────────────────────────── */}

          {/* 3 — Marka Tescil (Küçük, Açık Yeşil) */}
          <motion.div
            variants={fadeUp}
            className="group relative overflow-hidden rounded-2xl bg-[#F0FDF9] border border-[#00D084]/15 p-8 flex flex-col justify-between min-h-[260px] transition-all duration-300 hover:-translate-y-1 hover:border-[#00D084]/35 hover:shadow-md cursor-pointer"
          >
            <div>
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm mb-5">
                <ShieldCheck className="h-5 w-5 text-[#00D084]" />
              </div>
              <h3 className="text-lg font-bold text-[#0F172A] leading-snug">
                Marka Tescil
              </h3>
              <p className="mt-3 text-sm text-[#64748B] leading-relaxed">
                Markanızı koruyun, rakiplerden önce tescil ettirin. Marka haklarınız güvende.
              </p>
            </div>
            <div className="mt-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#00D084]/20 bg-white px-3 py-1 text-xs font-semibold text-[#0F172A]">
                <span className="text-[#00D084] font-extrabold">%75</span>
                tescil sonrası güven artışı
              </div>
            </div>
          </motion.div>

          {/* 4 — Dijital Pazarlama (Büyük, Beyaz) */}
          <motion.div
            variants={fadeUp}
            className="group relative overflow-hidden rounded-2xl border border-[#E8EEF0] bg-white p-8 md:col-span-2 flex flex-col justify-between min-h-[260px] transition-all duration-300 hover:-translate-y-1 hover:border-[#00D084]/30 hover:shadow-md cursor-pointer"
          >
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#00D084]/10 mb-5">
                  <BarChart2 className="h-5 w-5 text-[#00D084]" />
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] leading-snug">
                  Dijital Pazarlama
                </h3>
                <p className="mt-3 text-sm text-[#64748B] leading-relaxed max-w-sm">
                  Verilerinizi anlamlı sonuçlara dönüştürüyoruz. Veri odaklı kampanyalar ve analizlerle satış stratejinizi güçlendiriyoruz.
                </p>
              </div>
              {/* Mini grafik */}
              <div className="hidden sm:block w-32 flex-shrink-0 mt-2">
                <p className="text-[10px] font-semibold text-[#94A3B8] mb-2 uppercase tracking-wide">Satış Artışı</p>
                <MiniBarChart />
              </div>
            </div>
            <div className="mt-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#E8EEF0] px-3 py-1 text-xs font-semibold text-[#0F172A]">
                <span className="text-[#00D084] font-extrabold">%88</span>
                ölçülebilir satış artışı
              </div>
            </div>
          </motion.div>

        </motion.div>

        {/* Alt CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#00D084] hover:underline underline-offset-4"
          >
            Tüm hizmetlerimiz hakkında bilgi alın
            <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>

      </div>
    </section>
  );
}
