import PageHero from "@/components/layout/PageHero";
import PartnerApplicationForm from "./PartnerApplicationForm";
import { getPublishedPlatforms } from "@/lib/actions/platforms";
import { getPublishedSolutions } from "@/lib/actions/solutions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "İş Ortağı Ol — E-Partnerim",
  description: "E-Partnerim iş ortağı ağına katılın, binlerce KOBİ'ye ulaşın.",
};

export default async function IsOrtagiOlPage() {
  const [platforms, solutions] = await Promise.all([
    getPublishedPlatforms(),
    getPublishedSolutions(),
  ]);

  return (
    <>
      <PageHero
        breadcrumb={[{ label: "Ana Sayfa", href: "/" }, { label: "İş Ortağı Ol" }]}
        badge="İş Ortaklığı Programı"
        title="İş Ortağımız Olun"
        subtitle="Ajansınızı, danışmanlığınızı veya hizmetinizi binlerce KOBİ'ye ulaştırın. Başvurunuz ekibimiz tarafından incelenip onaylandıktan sonra profiliniz yayına alınır."
      />
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <PartnerApplicationForm
            platforms={platforms.map((p) => ({ id: p.id, name: p.name }))}
            solutions={solutions.map((s) => ({ id: s.id, title: s.title }))}
          />
        </div>
      </section>
    </>
  );
}
