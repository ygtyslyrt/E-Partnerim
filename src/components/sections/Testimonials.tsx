import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Ayşe Kaya",
    title: "Kurucu, ModaKo",
    avatar: "AK",
    rating: 5,
    quote:
      "E-Partnerim'in AI içerik aracı sayesinde sosyal medya yönetimimiz tamamen değişti. Haftada 2 saat harcadığımız işi artık 20 dakikada bitiriyoruz.",
  },
  {
    name: "Mehmet Demir",
    title: "CEO, TechStart A.Ş.",
    avatar: "MD",
    rating: 5,
    quote:
      "Müşteri desteği maliyetimizi %60 düşürdük. AI destekçi 7/24 müşterilerimize yanıt veriyor, ekibimiz yalnızca karmaşık konulara odaklanıyor.",
  },
  {
    name: "Zeynep Arslan",
    title: "Pazarlama Müdürü, EmlakPro",
    avatar: "ZA",
    rating: 5,
    quote:
      "SEO analiz araçları inanılmaz. 3 ayda organik trafiğimiz %200 arttı. Tek platform için ödediğimiz ücret, eski 8 aboneliğimizin yarısı.",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            Müşteri Yorumları
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900">
            Başarı hikayeleri
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            2.500+ işletme E-Partnerim ile büyüyor. Onların deneyimlerini okuyun.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-2xl border border-gray-100 bg-white p-7 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Yıldızlar */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Alıntı */}
              <blockquote className="flex-1 text-gray-600 text-sm leading-relaxed mb-6">
                "{t.quote}"
              </blockquote>

              {/* Kişi */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary flex-shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{t.name}</div>
                  <div className="text-xs text-gray-400">{t.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
