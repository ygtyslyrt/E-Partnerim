import PageHero from "@/components/layout/PageHero";
import PartnerDirectoryClient from "./PartnerDirectoryClient";
import { getPublishedPartners } from "@/lib/actions/partners";
import { getPublishedPlatforms } from "@/lib/actions/platforms";
import { getPublishedSolutions } from "@/lib/actions/solutions";
import { getPageBySlug } from "@/lib/actions/seo";
import { buildPageMetadata } from "@/lib/seo-metadata";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("/partnerler");
  return buildPageMetadata(
    page,
    "İş Ortaklarımız — E-Partnerim",
    "Doğrulanmış, uzman e-ticaret ajansları, danışmanlar ve hizmet sağlayıcıları."
  );
}

export default async function PartnerlerPage() {
  const { data: partners } = await getPublishedPartners({ pageSize: 200 });
  const [platforms, solutions] = await Promise.all([getPublishedPlatforms(), getPublishedSolutions()]);

  const categories = [...new Set(partners.map((p) => p.category).filter((c): c is string => Boolean(c)))];

  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Ana Sayfa", href: "/" }, { label: "İş Ortaklarımız" }]}
        badge="Doğrulanmış Ağ"
        title="İş Ortaklarımız"
        subtitle="Uzman ajanslar, danışmanlar ve hizmet sağlayıcılarla tanışın — ihtiyacınıza en uygun ortağı bulun."
      />
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PartnerDirectoryClient
            partners={partners}
            platforms={platforms.map((p) => ({ id: p.id, name: p.name }))}
            solutions={solutions.map((s) => ({ id: s.id, title: s.title }))}
            categories={categories}
          />
        </div>
      </section>
    </>
  );
}
