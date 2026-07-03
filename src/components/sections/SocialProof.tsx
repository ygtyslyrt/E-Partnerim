// TODO: Partner logoları resmi SVG dosyalarıyla değiştirilecek

// Gerçek teknoloji ortakları — e-partnerim.com'dan alınmıştır
const partners = [
  { name: "T-Soft", color: "#E5510F" },
  { name: "İdeasoft", color: "#3AAA35" },
  { name: "İkas", color: "#0F172A" },
  { name: "Ticimax", color: "#F7941D" },
  { name: "Meta", color: "#0082FB" },
  { name: "Google Ads", color: "#4285F4" },
  { name: "Paytr", color: "#1A355E" },
  { name: "Entegra", color: "#0096D6" },
  { name: "Logo Yazılım", color: "#E31E25" },
  { name: "Uyumsoft", color: "#E5851D" },
  { name: "Kobikom", color: "#003D7C" },
  { name: "Sentoz", color: "#2563EB" },
];

// İstatistikler — e-partnerim.com'dan alınmıştır, gerçek veriler
const stats = [
  { value: "10+", label: "Yıllık Deneyim" },
  { value: "%95", label: "Müşteri Başarı Oranı" },
  { value: "4", label: "Temel Hizmet Kategorisi" },
];

export default function SocialProof() {
  // Marquee için listeyi iki kez tekrar et
  const marqueeItems = [...partners, ...partners];

  return (
    <section className="bg-white py-16 border-t border-[#E8EEF0]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Üst Başlık */}
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#94A3B8]">
          Güçlü Ortaklıkların Desteğiyle
        </p>
        <p className="mt-2 text-center text-sm text-[#64748B]">
          Türkiye&apos;nin önde gelen e-ticaret, ödeme ve pazarlama platformları ile entegre çalışıyoruz
        </p>

        {/* Marquee */}
        <div className="relative mt-10 overflow-hidden">
          {/* Sol gradient maskesi */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-white to-transparent" />
          {/* Sağ gradient maskesi */}
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-white to-transparent" />

          <div className="animate-marquee flex items-center gap-10 w-max">
            {marqueeItems.map((partner, i) => (
              <span
                key={`${partner.name}-${i}`}
                className="flex-shrink-0 text-base font-bold tracking-tight cursor-default select-none transition-opacity duration-200 hover:opacity-80"
                style={{ color: partner.color, opacity: 0.65 }}
              >
                {partner.name}
              </span>
            ))}
          </div>
        </div>

        {/* İstatistik Şeridi */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-center divide-y sm:divide-y-0 sm:divide-x divide-[#E8EEF0]">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center px-10 py-4 sm:py-0">
              <span className="text-3xl font-extrabold tracking-tight text-[#0F172A]">
                {stat.value}
              </span>
              <span className="mt-1 text-sm text-[#64748B]">{stat.label}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
