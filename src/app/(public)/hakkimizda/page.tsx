import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import CTASection from "@/components/sections/CTASection";
import {
  Scale,
  Eye,
  Users,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  ShoppingCart,
  Megaphone,
  CreditCard,
  BookOpen,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Hakkımızda — E-Partnerim",
  description:
    "E-Partnerim, Türk KOBİ'lerini doğru dijital çözümlere ücretsiz olarak yönlendiren bir danışmanlık platformudur. Tarafsız, şeffaf, erişilebilir.",
};

// ── Zaman Çizgisi ──────────────────────────────────────────────────────────
const timeline = [
  {
    year: "2014",
    title: "Kuruluş",
    desc: "E-ticaret danışmanlığı alanında ilk adımlar. KOBİ'lerin dijital dönüşüm ihtiyacı gözlemlendi.",
  },
  {
    year: "2018",
    title: "Partner Ağı",
    desc: "T-Soft, İdeasoft ve Ticimax gibi altyapı firmalarıyla resmi ortaklıklar kuruldu.",
  },
  {
    year: "2022",
    title: "Platform Modeli",
    desc: "Yönlendirme ve eşleştirme modeline geçiş. Kullanıcıya ücretsiz rehberlik ana hizmet hâline geldi.",
  },
  {
    year: "2025",
    title: "Ekosistem Genişlemesi",
    desc: "Meta, Google, PayTR ve muhasebe yazılımları alanında da partner ağı oluşturuldu.",
  },
  {
    year: "Bugün",
    title: "Türkiye'nin Rehberi",
    desc: "İşletmelerin dijital kararlarında ilk başvurduğu tarafsız danışmanlık platformu olma hedefi.",
    accent: true,
  },
];

// ── Değerler ───────────────────────────────────────────────────────────────
const values = [
  {
    icon: Scale,
    title: "Tarafsızlık",
    desc: "Hiçbir platformun veya markanın reklamını yapmayız. Size en uygun çözümü tarafsız biçimde değerlendiririz — kendi çıkarımız değil, sizin ihtiyacınız önce gelir.",
  },
  {
    icon: Eye,
    title: "Şeffaflık",
    desc: "Gelir modelimizi açıkça paylaşırız: kullanıcılardan ücret almaz, yönlendirdiğimiz partner firmalardan komisyon kazanırız. Bunu her zaman söyleriz.",
  },
  {
    icon: Users,
    title: "Erişilebilirlik",
    desc: "Dijital dönüşüm yalnızca büyük bütçelilerin hakkı değil. Küçük işletmeler de doğru bilgiye, ücretsiz olarak ulaşabilmeli.",
  },
];

// ── Çalışma Alanları ───────────────────────────────────────────────────────
const areas = [
  { icon: ShoppingCart, label: "E-Ticaret Altyapısı Seçimi", href: "/platformlar#eticaret" },
  { icon: Megaphone, label: "Dijital Pazarlama Partneri", href: "/platformlar#pazarlama" },
  { icon: CreditCard, label: "Ödeme Sistemleri", href: "/platformlar#odeme" },
  { icon: BookOpen, label: "Muhasebe & ERP", href: "/platformlar#muhasebe" },
];

// ── İletişim ───────────────────────────────────────────────────────────────
const contactItems = [
  { icon: Phone, label: "+90 545 141 61 18", href: "tel:+905451416118" },
  { icon: Mail, label: "info@e-partnerim.com", href: "mailto:info@e-partnerim.com" },
  { icon: MapPin, label: "Avcılar / İstanbul", href: undefined },
];

export default function HakkimizdaPage() {
  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Ana Sayfa", href: "/" }, { label: "Hakkımızda" }]}
        badge="10+ Yıllık Deneyim"
        title="Hakkımızda"
        subtitle="Türk KOBİ'lerinin dijital dünyada doğru kararı vermesine yardımcı olmak için buradayız."
      />

      {/* ── 1. Misyon Kartı ───────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl bg-[#0F172A]">
            <div className="grid grid-cols-1 gap-0 lg:grid-cols-5">
              {/* Sol: Metin */}
              <div className="p-8 sm:p-10 lg:col-span-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00D084]">
                  Misyonumuz
                </p>
                <h2 className="mt-4 text-3xl font-extrabold leading-snug text-white sm:text-4xl">
                  Satmak için değil,
                  <br />
                  <span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundImage: "linear-gradient(90deg, #00D084 0%, #18AFC1 100%)" }}
                  >
                    yönlendirmek için
                  </span>{" "}
                  buradayız.
                </h2>
                <p className="mt-5 max-w-lg text-base leading-relaxed text-white/60">
                  E-Partnerim, dijital hizmet arayan işletmelerle bu hizmetleri sunan partner firmalar arasında köprü kuran bir danışmanlık platformudur. Kullanıcıdan ücret almayız; önce bilgi verir, ihtiyacı analiz eder, doğru çözüme yönlendiririz.
                </p>
              </div>

              {/* Sağ: İstatistikler */}
              <div className="flex flex-row lg:flex-col lg:col-span-2 divide-x lg:divide-x-0 lg:divide-y divide-white/10 border-t lg:border-t-0 lg:border-l border-white/10">
                <div className="flex flex-col justify-center p-8 flex-1">
                  <span className="text-5xl font-black text-white">%95</span>
                  <span className="mt-2 text-sm text-white/50 leading-snug">
                    Yönlendirilen işletmelerde başarılı sonuç oranı
                  </span>
                </div>
                <div className="flex flex-col justify-center p-8 flex-1">
                  <span className="text-5xl font-black text-white">10+</span>
                  <span className="mt-2 text-sm text-white/50 leading-snug">
                    Yıllık e-ticaret danışmanlık deneyimi
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Hikayemiz + Zaman Çizgisi ──────────────────── */}
      <section className="bg-[#FAFCFC] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
            {/* Sol: Metin */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00D084]">
                Hikayemiz
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0F172A]">
                10 Yılda Öğrendiklerimiz
              </h2>
              <div className="mt-5 space-y-4 text-base leading-relaxed text-[#64748B]">
                <p>
                  2014 yılında e-ticaret danışmanlığı alanında yola çıktık. O günden bu yana yüzlerce KOBİ ile çalıştık ve hepsinde aynı sorunu gözlemledik: işletmeler hangi altyapıyı seçeceğini, hangi ajansla çalışacağını, hangi ödeme sistemini kullanacağını bilmiyor.
                </p>
                <p>
                  Yanlış altyapı seçimi, gereksiz maliyetler, geç kalmış kararlar… Bunların çoğu doğru bilgiye erişemeyen küçük işletmelerin yaşadığı problemlerdi.
                </p>
                <p>
                  Bu yüzden modelimizi değiştirdik. Artık biz bir şey satmıyoruz. Türkiye&apos;nin önde gelen platformlarıyla kurduğumuz ortaklıklar sayesinde, işletmeleri doğrudan doğru çözüme ücretsiz yönlendiriyoruz.
                </p>
              </div>
            </div>

            {/* Sağ: Zaman Çizgisi */}
            <div className="relative pl-6">
              {/* Dikey çizgi */}
              <div className="absolute left-2.5 top-2 bottom-2 w-px bg-[#E8EEF0]" />

              <div className="space-y-6">
                {timeline.map((item) => (
                  <div key={item.year} className="relative flex gap-4">
                    {/* Nokta */}
                    <div
                      className={`absolute -left-6 mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 ${
                        item.accent
                          ? "border-[#00D084] bg-[#00D084]"
                          : "border-[#E8EEF0] bg-white"
                      }`}
                    >
                      {item.accent && (
                        <div className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </div>

                    {/* İçerik */}
                    <div className={`rounded-xl border p-4 w-full ${item.accent ? "border-[#00D084]/25 bg-[#F0FDF9]" : "border-[#E8EEF0] bg-white"}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-xs font-black ${item.accent ? "text-[#00D084]" : "text-[#94A3B8]"}`}
                        >
                          {item.year}
                        </span>
                        <span className="text-sm font-bold text-[#0F172A]">
                          {item.title}
                        </span>
                      </div>
                      <p className="text-sm text-[#64748B] leading-snug">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Değerlerimiz ────────────────────────────────── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00D084]">
              Değerlerimiz
            </p>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0F172A]">
              Güvenin üzerine inşa edildik
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="flex flex-col rounded-2xl border border-[#E8EEF0] bg-[#FAFCFC] p-6"
                >
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#00D084]/10">
                    <Icon className="h-5 w-5 text-[#00D084]" />
                  </div>
                  <h3 className="text-base font-bold text-[#0F172A]">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#64748B]">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 4. Çalışma Alanları ────────────────────────────── */}
      <section className="bg-[#FAFCFC] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00D084]">
              Rehberlik Ettiğimiz Alanlar
            </p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-[#0F172A]">
              Hangi konuda yardımcı oluyoruz?
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {areas.map((a) => {
              const Icon = a.icon;
              return (
                <Link
                  key={a.label}
                  href={a.href}
                  className="group flex items-center gap-3 rounded-2xl border border-[#E8EEF0] bg-white p-4 transition-all hover:border-[#00D084]/25 hover:shadow-sm"
                >
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#00D084]/10 group-hover:bg-[#00D084]/15 transition-colors">
                    <Icon className="h-4.5 w-4.5 text-[#00D084]" style={{ width: "1.125rem", height: "1.125rem" }} />
                  </div>
                  <span className="text-sm font-semibold text-[#0F172A] leading-snug">
                    {a.label}
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="mt-6">
            <Link
              href="/platformlar"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#00D084] hover:underline underline-offset-4"
            >
              Tüm platformları karşılaştır
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. İletişim ────────────────────────────────────── */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-[#E8EEF0] bg-[#FAFCFC] p-6 sm:p-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#00D084] mb-3">
                  Bize Ulaşın
                </p>
                <div className="flex flex-col gap-2.5">
                  {contactItems.map((item) => {
                    const Icon = item.icon;
                    return item.href ? (
                      <a
                        key={item.label}
                        href={item.href}
                        className="inline-flex items-center gap-2.5 text-sm text-[#374151] hover:text-[#00D084] transition-colors"
                      >
                        <Icon className="h-4 w-4 text-[#00D084] flex-shrink-0" />
                        {item.label}
                      </a>
                    ) : (
                      <span
                        key={item.label}
                        className="inline-flex items-center gap-2.5 text-sm text-[#374151]"
                      >
                        <Icon className="h-4 w-4 text-[#00D084] flex-shrink-0" />
                        {item.label}
                      </span>
                    );
                  })}
                </div>
              </div>

              <Link
                href="/iletisim"
                className="flex-shrink-0 inline-flex items-center gap-2 rounded-xl bg-[#0F172A] px-6 py-3 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(15,23,42,0.15)] transition-all hover:bg-[#1E293B] active:scale-[0.98]"
              >
                İletişim Sayfası
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
