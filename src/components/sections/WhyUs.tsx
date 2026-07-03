"use client";

import { motion } from "framer-motion";
import {
  Link2,
  Award,
  Layers,
  BarChart2,
  ShieldCheck,
  MessageCircle,
  ArrowRight,
} from "lucide-react";

const WHATSAPP_URL = "https://wa.me/905451416118";

const points = [
  {
    icon: Link2,
    title: "Güçlü Partner Ağı",
    description:
      "T-Soft, İkas, Meta ve Google gibi lider platformlarla ortaklığımız sayesinde en uygun bağlantıyı kuruyoruz.",
  },
  {
    icon: Award,
    title: "Tarafsız Rehberlik",
    description:
      "Size hiçbir şey satmıyoruz. Hangi çözümün doğru olduğunu tarafsız biçimde değerlendiriyoruz.",
  },
  {
    icon: Layers,
    title: "Mevcut Yapıya Uyum",
    description:
      "Sıfırdan başlamak zorunda değilsiniz. Mevcut altyapınıza en uygun çözümü birlikte buluyoruz.",
  },
  {
    icon: BarChart2,
    title: "Veriye Dayalı Yönlendirme",
    description:
      "Sektör verilerine dayanan rehberlik ile tahmin değil, gerçek içgörüyle karar veriyorsunuz.",
  },
  {
    icon: ShieldCheck,
    title: "Güvenilir Süreç",
    description:
      "10+ yıllık deneyim ve onlarca işletmeyle oluşturduğumuz kanıtlanmış yönlendirme süreci.",
  },
  {
    icon: MessageCircle,
    title: "Anında Erişim",
    description:
      "WhatsApp, telefon veya e-posta — sorularınızı hemen yanıtlıyor, sizi doğru yere bağlıyoruz.",
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function WhyUs() {
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
              style={{
                background: "radial-gradient(circle, #00D084 0%, transparent 70%)",
              }}
            />
            <div
              className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full opacity-10"
              style={{
                background: "radial-gradient(circle, #18AFC1 0%, transparent 70%)",
              }}
            />

            <div className="relative z-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00D084]">
                Neden E-Partnerim?
              </p>
              <h2 className="mt-4 text-3xl font-extrabold leading-snug tracking-tight text-white sm:text-4xl">
                Satmıyoruz. En Doğru Çözümü Birlikte Buluyoruz.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-white/60">
                Tarafsız danışmanlık anlayışımızla önce ihtiyacınızı anlarız, sonra size en uygun platformu veya partneri ücretsiz olarak yönlendiririz.
              </p>
            </div>

            {/* İstatistikler */}
            <div className="relative z-10 mt-8 flex items-center divide-x divide-white/10">
              <div className="flex flex-col pr-8">
                <span className="text-4xl font-black text-white">%95</span>
                <span className="mt-1 text-xs text-white/50">Müşteri Başarı Oranı</span>
              </div>
              <div className="flex flex-col pl-8">
                <span className="text-4xl font-black text-white">10+</span>
                <span className="mt-1 text-xs text-white/50">Yıllık Deneyim</span>
              </div>
            </div>

            {/* CTA */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-10 mt-8 inline-flex items-center gap-2 rounded-xl bg-[#0F172A] px-6 py-3 text-sm font-semibold text-white shadow-[0_4px_20px_rgba(15,23,42,0.18)] transition-all hover:bg-[#1E293B] active:scale-[0.98] self-start"
            >
              Ücretsiz Danışmanlık Al
              <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>

          {/* ── Sağ: 6 Nokta Grid ──────────────────────── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-3 content-start"
          >
            {points.map((point) => {
              const Icon = point.icon;
              return (
                <motion.div
                  key={point.title}
                  variants={itemVariants}
                  className="group flex gap-4 rounded-2xl border border-[#E8EEF0] bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#00D084]/25 hover:shadow-sm"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#00D084]/10 group-hover:bg-[#00D084]/15 transition-colors">
                    <Icon className="h-4.5 w-4.5 text-[#00D084]" style={{ width: "1.125rem", height: "1.125rem" }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0F172A]">{point.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[#64748B]">
                      {point.description}
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
