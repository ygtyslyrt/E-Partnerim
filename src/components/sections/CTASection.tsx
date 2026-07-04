"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail, Phone } from "lucide-react";

interface CtaButton {
  label: string;
  type: "whatsapp" | "mail" | "phone";
}

type CtaContent = {
  eyebrow: string | null;
  title: string;
  subtitle: string | null;
  buttons: unknown;
};

interface Props {
  content?: CtaContent;
  settings?: Record<string, string>;
}

// Bağımsız sayfalarda (hakkımızda, platformlar, çözümler, blog detay) prop'suz
// kullanılıyor — ana sayfadaki DB içeriği olmadığında bu varsayılanlar gösterilir.
const DEFAULT_CONTENT: CtaContent = {
  eyebrow: "Ücretsiz · Tarafsız · Bağlayıcı Değil",
  title: "Dijital Yol Haritanızı Birlikte Oluşturalım.",
  subtitle: "Hangi altyapıyı seçmeli, hangi adımdan başlamalısınız? Bunu birlikte buluyoruz — ücretsiz, tarafsız, sonuç odaklı.",
  buttons: [
    { label: "Ücretsiz Danışmanlık Al", type: "whatsapp" },
    { label: "info@e-partnerim.com", type: "mail" },
  ],
};

const DEFAULT_SETTINGS: Record<string, string> = {
  whatsapp: "905451416118",
  email: "info@e-partnerim.com",
  phone: "+90 545 141 61 18",
};

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function buttonHref(type: CtaButton["type"], settings: Record<string, string>): string {
  if (type === "whatsapp") return `https://wa.me/${settings.whatsapp ?? ""}`
  if (type === "mail") return `mailto:${settings.email ?? ""}`
  return `tel:${(settings.phone ?? "").replace(/\s+/g, "")}`
}

function ButtonIcon({ type }: { type: CtaButton["type"] }) {
  if (type === "whatsapp") return <WhatsAppIcon className="h-5 w-5" />
  if (type === "mail") return <Mail className="h-4 w-4" />
  return <Phone className="h-4 w-4" />
}

export default function CTASection({ content = DEFAULT_CONTENT, settings = DEFAULT_SETTINGS }: Props) {
  const buttons = (Array.isArray(content.buttons) ? content.buttons : []) as unknown as CtaButton[];

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
          {content.eyebrow && (
            <span className="inline-flex items-center gap-2 rounded-full border border-[#00D084]/30 bg-[#00D084]/10 px-4 py-1.5 text-sm font-semibold text-[#00D084]">
              {content.eyebrow}
            </span>
          )}

          {/* Başlık */}
          <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-[56px] leading-[1.1]">
            {content.title}
          </h2>

          {/* Alt metin */}
          {content.subtitle && (
            <p className="mt-6 text-lg text-white/60 max-w-xl mx-auto leading-relaxed">
              {content.subtitle}
            </p>
          )}

          {/* CTA Butonları */}
          {buttons.length > 0 && (
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              {buttons.map((btn, i) => (
                <a
                  key={i}
                  href={buttonHref(btn.type, settings)}
                  target={btn.type === "whatsapp" ? "_blank" : undefined}
                  rel={btn.type === "whatsapp" ? "noopener noreferrer" : undefined}
                  className={
                    i === 0
                      ? "inline-flex h-14 items-center gap-3 rounded-xl bg-[#00D084] px-8 text-[15px] font-semibold text-white shadow-[0_4px_24px_rgba(0,208,132,0.4)] transition-all hover:bg-[#00bb76] hover:shadow-[0_4px_32px_rgba(0,208,132,0.5)] active:scale-[0.98]"
                      : "inline-flex h-14 items-center gap-2 rounded-xl bg-white px-8 text-[15px] font-semibold text-[#0F172A] shadow-[0_4px_20px_rgba(255,255,255,0.12)] transition-all hover:bg-white/90 active:scale-[0.98]"
                  }
                >
                  <ButtonIcon type={btn.type} />
                  {btn.label}
                  {i === 0 && <ArrowRight className="h-4 w-4" />}
                </a>
              ))}
            </div>
          )}

          {/* Telefon */}
          {settings.phone && (
            <p className="mt-6 text-sm text-white/40">
              veya arayın:{" "}
              <a
                href={`tel:${settings.phone.replace(/\s+/g, "")}`}
                className="font-semibold text-white/60 hover:text-white transition-colors"
              >
                {settings.phone}
              </a>
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
