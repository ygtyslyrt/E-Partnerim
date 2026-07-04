import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ShieldCheck, Star, Globe, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { getPartner } from "@/lib/actions/partners";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const partner = await getPartner(slug);
  if (!partner) return { title: "İş Ortağı Bulunamadı — E-Partnerim" };
  return {
    title: partner.seoTitle || `${partner.name} — E-Partnerim İş Ortağı`,
    description: partner.seoDesc || partner.shortDesc || undefined,
  };
}

export default async function PartnerProfilePage({ params }: Props) {
  const { slug } = await params;
  const partner = await getPartner(slug);
  if (!partner || partner.status !== "PUBLISHED") notFound();

  return (
    <>
      {/* Kapak */}
      <div
        className="relative h-56 w-full bg-[#0F172A] sm:h-72"
        style={partner.coverImage ? { backgroundImage: `url(${partner.coverImage})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Profil başlığı */}
        <div className="relative -mt-16 flex flex-col items-start gap-4 sm:-mt-14 sm:flex-row sm:items-end">
          <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-lg">
            {partner.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={partner.logo} alt={partner.name} className="h-full w-full object-contain p-2" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#3730A3] text-3xl font-bold text-white">
                {partner.name[0]?.toUpperCase()}
              </div>
            )}
          </div>

          <div className="flex-1 pb-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-[#0F172A] sm:text-3xl">{partner.name}</h1>
              {partner.verified && (
                <span className="flex items-center gap-1 rounded-full bg-[#F0FDF9] px-2.5 py-0.5 text-xs font-semibold text-[#00D084]">
                  <ShieldCheck size={13} /> Doğrulanmış
                </span>
              )}
              {partner.featured && (
                <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-600">
                  <Star size={13} className="fill-amber-500" /> Öne Çıkan
                </span>
              )}
            </div>
            {partner.tagline && <p className="mt-1 text-sm font-medium text-[#3730A3]">{partner.tagline}</p>}
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[#94A3B8]">
              {partner.category && <span>{partner.category}</span>}
              {partner.city && <span className="flex items-center gap-1"><MapPin size={12} /> {partner.city}</span>}
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2 pb-2">
            {partner.website && (
              <a href={partner.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-xl border border-[#E4E9F2] bg-white px-4 py-2 text-xs font-semibold text-[#0F172A] hover:bg-slate-50 transition">
                <Globe size={13} /> Web Sitesi
              </a>
            )}
            {partner.whatsapp && (
              <a href={`https://wa.me/${partner.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-xl bg-[#00D084] px-4 py-2 text-xs font-semibold text-white hover:bg-[#00bb76] transition">
                İletişime Geç
              </a>
            )}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 pb-20 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            {/* Açıklama */}
            {partner.description && (
              <section>
                <h2 className="mb-3 text-lg font-bold text-[#0F172A]">Hakkında</h2>
                <p className="whitespace-pre-line text-sm leading-relaxed text-[#334155]">{partner.description}</p>
              </section>
            )}

            {/* Platform/Çözüm uzmanlığı */}
            {(partner.platforms.length > 0 || partner.solutions.length > 0) && (
              <section>
                <h2 className="mb-3 text-lg font-bold text-[#0F172A]">Uzmanlık Alanları</h2>
                <div className="flex flex-wrap gap-2">
                  {partner.platforms.map((pp) => (
                    <Link key={pp.platformId} href={`/platformlar/${pp.platform.slug}`} className="rounded-full bg-[#F0FDF9] px-3 py-1.5 text-xs font-semibold text-[#00D084] hover:bg-[#00D084]/10 transition">
                      {pp.platform.name}
                    </Link>
                  ))}
                  {partner.solutions.map((ps) => (
                    <Link key={ps.solutionId} href={`/cozumler/${ps.solution.slug}`} className="rounded-full bg-[#EEF2FF] px-3 py-1.5 text-xs font-semibold text-[#4F46E5] hover:bg-[#4F46E5]/10 transition">
                      {ps.solution.title}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Paketler */}
            {partner.packages.length > 0 && (
              <section>
                <h2 className="mb-3 text-lg font-bold text-[#0F172A]">Paketler</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {partner.packages.map((pkg) => (
                    <div key={pkg.id} className="rounded-2xl border border-[#E4E9F2] bg-white p-5">
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="font-bold text-[#0F172A]">{pkg.name}</h3>
                        {pkg.price && <span className="shrink-0 text-sm font-semibold text-[#3730A3]">{pkg.price}</span>}
                      </div>
                      {pkg.description && <p className="mt-2 text-sm text-[#64748B]">{pkg.description}</p>}
                      {Array.isArray(pkg.features) && (pkg.features as string[]).length > 0 && (
                        <ul className="mt-3 space-y-1.5">
                          {(pkg.features as string[]).map((f, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-[#334155]">
                              <ArrowRight size={12} className="mt-0.5 shrink-0 text-[#00D084]" /> {f}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Medya Galerisi */}
            {partner.media.length > 0 && (
              <section>
                <h2 className="mb-3 text-lg font-bold text-[#0F172A]">Portföy</h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {partner.media.map((m) => (
                    <div key={m.id} className="overflow-hidden rounded-xl border border-[#E4E9F2] bg-slate-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.url} alt={m.caption ?? partner.name} className="h-32 w-full object-cover" />
                      {m.caption && <p className="px-2 py-1.5 text-[11px] text-[#94A3B8]">{m.caption}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Referanslar */}
            {partner.references.length > 0 && (
              <section>
                <h2 className="mb-3 text-lg font-bold text-[#0F172A]">Referanslar</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {partner.references.map((ref) => (
                    <div key={ref.id} className="rounded-2xl border border-[#E4E9F2] bg-[#FAFCFC] p-5">
                      <p className="text-sm leading-relaxed text-[#334155]">&ldquo;{ref.content}&rdquo;</p>
                      <div className="mt-4 flex items-center gap-3">
                        {ref.avatar ? (
                          <Image src={ref.avatar} alt={ref.name} width={36} height={36} className="rounded-full object-cover" />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#3730A3]/10 text-sm font-bold text-[#3730A3]">
                            {ref.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-[#0F172A]">{ref.name}</p>
                          {(ref.role || ref.company) && (
                            <p className="text-xs text-[#94A3B8]">{[ref.role, ref.company].filter(Boolean).join(" · ")}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Yan panel */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-[#E4E9F2] bg-white p-5">
              <h3 className="mb-3 text-sm font-bold text-[#0F172A]">İletişim</h3>
              <div className="space-y-2.5 text-sm">
                {partner.email && (
                  <a href={`mailto:${partner.email}`} className="flex items-center gap-2 text-[#334155] hover:text-[#3730A3] transition">
                    <Mail size={14} className="text-[#94A3B8]" /> {partner.email}
                  </a>
                )}
                {partner.phone && (
                  <a href={`tel:${partner.phone}`} className="flex items-center gap-2 text-[#334155] hover:text-[#3730A3] transition">
                    <Phone size={14} className="text-[#94A3B8]" /> {partner.phone}
                  </a>
                )}
                {partner.website && (
                  <a href={partner.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#334155] hover:text-[#3730A3] transition">
                    <Globe size={14} className="text-[#94A3B8]" /> Web Sitesi
                  </a>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
