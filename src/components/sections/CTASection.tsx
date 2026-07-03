"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/905451416118";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-[#0F172A] py-24">
      {/* Arka plan dekor */}
      <div
        className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #00D084 0%, transparent 70%)", filter: "blur(60px)" }}
      />
      <div
        className="pointer-events-none absolute -right-40 -bottom-40 h-96 w-96 rounded-full opacity-15"
        style={{ background: "radial-gradient(circle, #18AFC1 0%, transparent 70%)", filter: "blur(60px)" }}
      />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Üst etiket */}
          <span className="inline-flex items-center gap-2 rounded-full border border-[#00D084]/30 bg-[#00D084]/10 px-4 py-1.5 text-sm font-semibold text-[#00D084]">
            Ücretsiz · Tarafsız · Bağlayıcı Değil
          </span>

          {/* Başlık */}
          <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-[56px] leading-[1.1]">
            Dijital Yol Haritanızı
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, #00D084 0%, #18AFC1 100%)" }}
            >
              Birlikte Oluşturalım.
            </span>
          </h2>

          {/* Alt metin */}
          <p className="mt-6 text-lg text-white/60 max-w-xl mx-auto leading-relaxed">
            Hangi altyapıyı seçmeli, hangi adımdan başlamalısınız? Bunu birlikte buluyoruz — ücretsiz, tarafsız, sonuç odaklı.
          </p>

          {/* CTA Butonları */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center gap-3 rounded-xl bg-[#00D084] px-8 text-[15px] font-semibold text-white shadow-[0_4px_24px_rgba(0,208,132,0.4)] transition-all hover:bg-[#00bb76] hover:shadow-[0_4px_32px_rgba(0,208,132,0.5)] active:scale-[0.98]"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Ücretsiz Danışmanlık Al
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="mailto:info@e-partnerim.com"
              className="inline-flex h-14 items-center gap-2 rounded-xl bg-white px-8 text-[15px] font-semibold text-[#0F172A] shadow-[0_4px_20px_rgba(255,255,255,0.12)] transition-all hover:bg-white/90 active:scale-[0.98]"
            >
              <Mail className="h-4 w-4" />
              info@e-partnerim.com
            </a>
          </div>

          {/* Telefon */}
          <p className="mt-6 text-sm text-white/40">
            veya arayın:{" "}
            <a
              href="tel:+905451416118"
              className="font-semibold text-white/60 hover:text-white transition-colors"
            >
              +90 545 141 61 18
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
