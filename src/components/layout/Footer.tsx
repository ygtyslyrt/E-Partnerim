import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  Çözümler: [
    { href: "/cozumler#danismanlik", label: "İhtiyaç Analizi" },
    { href: "/cozumler#altyapi", label: "Altyapı Seçimi" },
    { href: "/cozumler#pazarlama", label: "Dijital Pazarlama" },
    { href: "/cozumler#marka-tescil", label: "Marka Tescil" },
  ],
  Platformlar: [
    { href: "/platformlar#eticaret", label: "E-Ticaret Altyapıları" },
    { href: "/platformlar#entegrasyon", label: "Entegrasyon Programları" },
    { href: "/platformlar#sanal-pos", label: "Sanal POS" },
    { href: "/platformlar#muhasebe", label: "Muhasebe Yazılımları" },
  ],
  Şirket: [
    { href: "/hakkimizda", label: "Hakkımızda" },
    { href: "/blog", label: "Blog" },
    { href: "/iletisim", label: "İletişim" },
    { href: "/kvkk", label: "KVKK" },
    { href: "/gizlilik", label: "Gizlilik Politikası" },
  ],
};

const socialLinks = [
  {
    href: "https://www.linkedin.com/company/e-partnerim",
    label: "LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    href: "https://www.instagram.com/e.partnerim",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    href: "https://www.tiktok.com/@e.partnerim",
    label: "TikTok",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
      </svg>
    ),
  },
  {
    href: "https://www.facebook.com/epartnerim",
    label: "Facebook",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#0F172A]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">

          {/* ── Marka Sütunu ───────────────────────── */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <Link href="/" className="inline-block">
              <Image
                src="/logo-horizontal-light.svg"
                alt="e-partnerim.com"
                width={220}
                height={48}
                className="h-12 w-auto brightness-0 invert"
              />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-white/50 max-w-xs">
              İşletmenizin dijital yol arkadaşı. Türkiye&apos;nin önde gelen e-ticaret altyapıları ile iş birliği yapıyoruz.
            </p>

            {/* İletişim */}
            <div className="mt-6 space-y-2">
              <a href="tel:+905451416118" className="flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors">
                <span className="text-[#00D084]">T:</span>
                +90 545 141 61 18
              </a>
              <a href="mailto:info@e-partnerim.com" className="flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors">
                <span className="text-[#00D084]">E:</span>
                info@e-partnerim.com
              </a>
              <p className="text-sm text-white/40 leading-snug">
                Merkez mah. Marmara cad. Bekir Aşçı İş Merkezi No:10
                <br />Avcılar / İstanbul
              </p>
            </div>

            {/* Sosyal Medya */}
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/8 text-white/50 transition-colors hover:bg-[#00D084]/20 hover:text-[#00D084]"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Link Sütunları ──────────────────────── */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-white/30 mb-4">
                {category}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Alt Bar */}
        <div className="mt-14 border-t border-white/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © 2025 e-partnerim.com — Tüm Hakları Saklıdır.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/kvkk" className="text-xs text-white/30 hover:text-white/60 transition-colors">
              KVKK
            </Link>
            <Link href="/gizlilik" className="text-xs text-white/30 hover:text-white/60 transition-colors">
              Gizlilik Politikası
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
