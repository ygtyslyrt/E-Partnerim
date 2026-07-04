import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2, XCircle, ArrowRight, Globe, ShieldCheck } from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import CTASection from "@/components/sections/CTASection";
import { getPlatform } from "@/lib/actions/platforms";
import { getPublishedPartners } from "@/lib/actions/partners";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const platform = await getPlatform(slug);
  if (!platform) return { title: "Platform Bulunamadı — E-Partnerim" };
  return {
    title: platform.seoTitle || `${platform.name} — E-Partnerim`,
    description: platform.seoDesc || platform.shortDesc || undefined,
  };
}

export default async function PlatformDetailPage({ params }: Props) {
  const { slug } = await params;
  const platform = await getPlatform(slug);
  if (!platform || platform.status !== "PUBLISHED") notFound();

  const { data: partners } = await getPublishedPartners({ platformId: platform.id });
  const advantages = platform.features.filter((f) => f.type === "ADVANTAGE");
  const disadvantages = platform.features.filter((f) => f.type === "DISADVANTAGE");

  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Ana Sayfa", href: "/" }, { label: "Platformlar", href: "/platformlar" }, { label: platform.name }]}
        badge={platform.category ?? undefined}
        title={platform.name}
        subtitle={platform.shortDesc ?? undefined}
      />

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="space-y-8 lg:col-span-2">
            {platform.description && (
              <div>
                <h2 className="mb-3 text-lg font-bold text-[#0F172A]">Kimler için uygun?</h2>
                <p className="text-sm leading-relaxed text-[#334155]">{platform.description}</p>
              </div>
            )}

            {advantages.length > 0 && (
              <div>
                <h2 className="mb-3 text-lg font-bold text-[#0F172A]">Avantajlar</h2>
                <ul className="space-y-2">
                  {advantages.map((f) => (
                    <li key={f.id} className="flex items-start gap-2.5 text-sm text-[#334155]">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#00D084]" /> {f.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {disadvantages.length > 0 && (
              <div>
                <h2 className="mb-3 text-lg font-bold text-[#0F172A]">Dikkat Edilmesi Gerekenler</h2>
                <ul className="space-y-2">
                  {disadvantages.map((f) => (
                    <li key={f.id} className="flex items-start gap-2.5 text-sm text-[#334155]">
                      <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" /> {f.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {partners.length > 0 && (
              <div>
                <h2 className="mb-4 text-lg font-bold text-[#0F172A]">Bu Alanda Uzman İş Ortakları</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {partners.map((p) => (
                    <Link key={p.id} href={`/partnerler/${p.slug}`} className="group flex items-center gap-3 rounded-xl border border-[#E8EEF0] bg-white p-4 transition hover:border-[#00D084]/30 hover:shadow-sm">
                      {p.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.logo} alt={p.name} className="h-10 w-10 shrink-0 rounded-lg object-contain" />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#3730A3] text-sm font-bold text-white">{p.name[0]}</div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate text-sm font-semibold text-[#0F172A] group-hover:text-[#00D084] transition-colors">{p.name}</span>
                          {p.verified && <ShieldCheck size={13} className="shrink-0 text-[#00D084]" />}
                        </div>
                        {p.shortDesc && <p className="truncate text-xs text-[#94A3B8]">{p.shortDesc}</p>}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-[#E8EEF0] bg-[#FAFCFC] p-5">
              {platform.url && (
                <a href={platform.url} target="_blank" rel="noopener noreferrer" className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#3730A3] hover:underline">
                  <Globe size={14} /> Web Sitesini Ziyaret Et
                </a>
              )}
              {platform.pricing && (
                <p className="mb-3 text-sm text-[#64748B]"><span className="text-[#94A3B8]">Fiyatlandırma:</span> {platform.pricing}</p>
              )}
              {platform.ctaLabel && platform.ctaUrl && (
                <a href={platform.ctaUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-[#00D084] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#00bb76] transition">
                  {platform.ctaLabel} <ArrowRight size={14} />
                </a>
              )}
            </div>
          </aside>
        </div>
      </section>

      <CTASection />
    </>
  );
}
