"use client";

import { motion } from "framer-motion";
import { MessageSquare, ScanSearch, Handshake } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/905451416118";

const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Anlat",
    description:
      "İşletmenizin mevcut durumunu, hedeflerinizi ve dijital ihtiyaçlarınızı bizimle paylaşın. Hiçbir teknik bilgiye gerek yok.",
    accent: false,
  },
  {
    number: "02",
    icon: ScanSearch,
    title: "Analiz Et",
    description:
      "İhtiyaçlarınızı birlikte değerlendiriyoruz. Hangi çözümün, hangi altyapının, hangi partnerin size uygun olduğunu belirliyoruz.",
    accent: false,
  },
  {
    number: "03",
    icon: Handshake,
    title: "Yönlendir",
    description:
      "Size en uygun partner firmayı veya platformu tarafsız biçimde öneriyor, sizi doğrudan bağlantıya geçiriyoruz. Ücretsiz.",
    accent: true,
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Başlık */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00D084]">
            Nasıl Çalışır?
          </p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-[#0F172A] sm:text-5xl">
            3 Adımda Doğru Çözüme
          </h2>
          <p className="mt-4 max-w-xl text-lg text-[#64748B]">
            Sizi satmaya değil, doğru kararı vermeye yönlendiriyoruz. Ücretsiz, tarafsız, sonuç odaklı.
          </p>
        </motion.div>

        {/* Adımlar */}
        <div className="relative">
          {/* Desktop bağlantı çizgisi */}
          <div
            className="absolute top-9 left-[calc(16.66%+1rem)] right-[calc(16.66%+1rem)] hidden h-px lg:block"
            style={{
              background: "linear-gradient(90deg, #E8EEF0 0%, #00D084 50%, #18AFC1 100%)",
            }}
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.12, ease: "easeOut" }}
                  className={`relative flex flex-col rounded-2xl p-6 pt-8 ${
                    step.accent
                      ? "bg-[#F0FDF9] border border-[#00D084]/20"
                      : "bg-[#FAFCFC] border border-[#E8EEF0]"
                  }`}
                >
                  {/* Dekoratif numara */}
                  <span
                    className="absolute -top-3 left-5 text-6xl font-black leading-none select-none pointer-events-none"
                    style={{
                      color: step.accent ? "rgba(0,208,132,0.12)" : "rgba(15,23,42,0.06)",
                    }}
                    aria-hidden="true"
                  >
                    {step.number}
                  </span>

                  {/* İkon */}
                  <div
                    className={`relative z-10 mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl ${
                      step.accent
                        ? "bg-[#00D084] shadow-[0_4px_14px_rgba(0,208,132,0.3)]"
                        : "bg-white border border-[#E8EEF0] shadow-sm"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${step.accent ? "text-white" : "text-[#00D084]"}`}
                    />
                  </div>

                  <h3 className="relative z-10 text-lg font-bold text-[#0F172A]">
                    {step.title}
                  </h3>
                  <p className="relative z-10 mt-2 text-sm leading-relaxed text-[#64748B]">
                    {step.description}
                  </p>

                  {/* Mobil ayırıcı */}
                  {i < steps.length - 1 && (
                    <div className="mt-6 flex items-center gap-2 sm:hidden" aria-hidden="true">
                      <div className="h-px flex-1 bg-[#E8EEF0]" />
                      <span className="text-xs font-semibold text-[#CBD5E1]">↓</span>
                      <div className="h-px flex-1 bg-[#E8EEF0]" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Alt not */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          className="mt-10 flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-center"
        >
          <span className="text-sm text-[#64748B]">
            Tüm bu süreç sizin için tamamen ücretsizdir.
          </span>
          <span className="hidden sm:block text-[#CBD5E1]">·</span>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-[#00D084] hover:underline underline-offset-4"
          >
            WhatsApp ile başlayın →
          </a>
        </motion.div>

      </div>
    </section>
  );
}
