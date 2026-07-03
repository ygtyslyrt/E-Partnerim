import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Ücretsiz",
    price: "0",
    period: "/ay",
    description: "Başlamak için ideal. Temel araçlara erişin.",
    cta: "Hemen Başla",
    ctaHref: "/kayit",
    popular: false,
    features: [
      "5 AI aracı kullanımı",
      "Aylık 50 kredi",
      "Temel analizler",
      "E-posta desteği",
      "1 kullanıcı",
    ],
    disabled: [],
  },
  {
    name: "Pro",
    price: "299",
    period: "/ay",
    description: "Büyüyen işletmeler için güçlü özellikler.",
    cta: "Pro'yu Dene",
    ctaHref: "/kayit?plan=pro",
    popular: true,
    features: [
      "Tüm AI araçları (50+)",
      "Aylık 2.000 kredi",
      "Gelişmiş analizler ve raporlar",
      "Öncelikli destek",
      "5 kullanıcı",
      "API erişimi",
      "Özel entegrasyonlar",
    ],
    disabled: [],
  },
  {
    name: "Kurumsal",
    price: "799",
    period: "/ay",
    description: "Büyük ekipler için sınırsız güç.",
    cta: "Satışla Görüş",
    ctaHref: "/iletisim",
    popular: false,
    features: [
      "Tüm Pro özellikleri",
      "Sınırsız kredi",
      "Özel AI model eğitimi",
      "7/24 telefon desteği",
      "Sınırsız kullanıcı",
      "SLA garantisi",
      "Özel altyapı",
    ],
    disabled: [],
  },
];

export default function Pricing() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            Fiyatlandırma
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900">
            İşinize uygun plan seçin
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            14 gün boyunca Pro planı ücretsiz deneyin. İstediğiniz zaman iptal edin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-8 ${
                plan.popular
                  ? "border-primary bg-primary text-white shadow-xl shadow-primary/30 scale-[1.02]"
                  : "border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-white px-4 py-1 text-xs font-bold text-primary shadow">
                    En Popüler
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3
                  className={`text-lg font-semibold ${
                    plan.popular ? "text-white/90" : "text-gray-900"
                  }`}
                >
                  {plan.name}
                </h3>
                <div className="mt-3 flex items-end gap-1">
                  <span
                    className={`text-5xl font-bold ${
                      plan.popular ? "text-white" : "text-gray-900"
                    }`}
                  >
                    ₺{plan.price}
                  </span>
                  <span
                    className={`mb-1.5 text-sm ${
                      plan.popular ? "text-white/70" : "text-gray-400"
                    }`}
                  >
                    {plan.period}
                  </span>
                </div>
                <p
                  className={`mt-2 text-sm ${
                    plan.popular ? "text-white/70" : "text-gray-500"
                  }`}
                >
                  {plan.description}
                </p>
              </div>

              <ul className="flex-1 space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <Check
                      className={`h-4 w-4 flex-shrink-0 ${
                        plan.popular ? "text-white" : "text-primary"
                      }`}
                    />
                    <span className={plan.popular ? "text-white/85" : "text-gray-600"}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? "secondary" : "outline"}
                className={`w-full h-11 font-semibold ${
                  plan.popular
                    ? "bg-white text-primary hover:bg-white/90"
                    : ""
                }`}
                render={<Link href={plan.ctaHref} />}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-gray-400">
          Tüm planlar KDV hariçtir. Yıllık ödemede %20 indirim uygulanır.
        </p>
      </div>
    </section>
  );
}
