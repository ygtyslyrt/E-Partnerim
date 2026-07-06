import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import LeadContactForm from "./LeadContactForm";
import { getPageBySlug } from "@/lib/actions/seo";
import { buildPageMetadata } from "@/lib/seo-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("/iletisim");
  return buildPageMetadata(
    page,
    "İletişim — E-Partnerim",
    "E-Partnerim ile iletişime geçin. WhatsApp, telefon veya e-posta ile ulaşabilirsiniz."
  );
}

const WHATSAPP_URL = "https://wa.me/905451416118";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

const contactItems = [
  {
    icon: Phone,
    label: "Telefon",
    value: "+90 545 141 61 18",
    href: "tel:+905451416118",
  },
  {
    icon: Mail,
    label: "E-posta",
    value: "info@e-partnerim.com",
    href: "mailto:info@e-partnerim.com",
  },
  {
    icon: MapPin,
    label: "Adres",
    value: "Merkez mah. Marmara cad. Bekir Aşçı İş Merkezi No:10, Avcılar / İstanbul",
    href: undefined,
  },
];

export default function IletisimPage() {
  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Ana Sayfa", href: "/" }, { label: "İletişim" }]}
        title="İletişim"
        subtitle="Ücretsiz danışmanlık almak veya bir konuda destek istemek için bize ulaşın."
      />

      <section className="bg-white py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

          {/* WhatsApp ana CTA */}
          <div className="rounded-2xl bg-[#0F172A] p-8 text-center mb-10">
            <p className="text-sm font-semibold text-[#00D084] mb-2">En Hızlı Yol</p>
            <h2 className="text-2xl font-extrabold text-white mb-4">WhatsApp ile Hemen Yazın</h2>
            <p className="text-white/60 text-sm mb-6 max-w-md mx-auto">
              Mesajınızı aldığımızda en kısa sürede geri dönüyoruz.
              İlk görüşme tamamen ücretsiz.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-xl bg-[#00D084] px-8 py-3.5 text-[15px] font-semibold text-white shadow-[0_4px_24px_rgba(0,208,132,0.4)] transition-all hover:bg-[#00bb76] active:scale-[0.98]"
            >
              <WhatsAppIcon className="h-5 w-5" />
              Ücretsiz Danışmanlık Al
            </a>
          </div>

          {/* İletişim bilgileri */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {contactItems.map((item) => {
              const Icon = item.icon;
              const inner = (
                <div className="flex items-start gap-4 rounded-2xl border border-[#E8EEF0] bg-[#FAFCFC] p-5 h-full transition-all hover:border-[#00D084]/25 hover:shadow-sm">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#00D084]/10">
                    <Icon className="h-5 w-5 text-[#00D084]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm font-medium text-[#0F172A] leading-snug">
                      {item.value}
                    </p>
                  </div>
                </div>
              );
              return item.href ? (
                <a key={item.label} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                  {inner}
                </a>
              ) : (
                <div key={item.label}>{inner}</div>
              );
            })}
          </div>

          {/* Form */}
          <div className="mx-auto mt-12 max-w-2xl">
            <LeadContactForm />
          </div>

        </div>
      </section>
    </>
  );
}
