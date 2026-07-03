import {
  BrainCircuit,
  BarChart3,
  FileText,
  MessageSquare,
  Shield,
  Rocket,
} from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "50+ AI Aracı",
    description:
      "İçerik üretimi, SEO analizi, müşteri yanıtları ve daha fazlası için özel geliştirilmiş yapay zeka araçları.",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    icon: BarChart3,
    title: "Akıllı Analizler",
    description:
      "İş performansınızı gerçek zamanlı takip edin. AI destekli öngörülerle doğru kararlar alın.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: FileText,
    title: "Otomatik Raporlama",
    description:
      "Haftalık ve aylık iş raporlarınızı dakikalar içinde otomatik oluşturun. Müşterilerinizi etkileyin.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: MessageSquare,
    title: "AI Müşteri Desteği",
    description:
      "7/24 çalışan AI destekçiniz müşteri sorularını yanıtlar, sizi yalnızca kritik konulara yönlendirir.",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    icon: Shield,
    title: "Kurumsal Güvenlik",
    description:
      "Verileriniz SSL şifrelemesi ve KVKK uyumlu altyapıda korunur. ISO 27001 sertifikalı sistemler.",
    color: "text-red-600",
    bg: "bg-red-50",
  },
  {
    icon: Rocket,
    title: "Hızlı Entegrasyon",
    description:
      "Mevcut iş araçlarınızla — CRM, muhasebe, e-ticaret — 5 dakikada entegre olun. Sıfır kod.",
    color: "text-primary",
    bg: "bg-primary/5",
  },
];

export default function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Başlık */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary mb-4">
            Neden E-Partnerim?
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900">
            İşinizin ihtiyacı olan her şey tek yerde
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Onlarca farklı araç ve abonelik yerine tek bir platform. Hem daha ucuz, hem daha güçlü.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200"
            >
              <div className={`inline-flex rounded-xl ${feature.bg} p-3 mb-4`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
