import type { Metadata } from "next";
import PageHero from "@/components/layout/PageHero";
import CTASection from "@/components/sections/CTASection";

// TODO: generateStaticParams ile blog sluglarını CMS'den çek

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Blog — E-Partnerim`,
    description: `E-Partnerim blog yazısı: ${slug}`,
  };
}

export default async function BlogSlugPage({ params }: Props) {
  const { slug } = await params;

  return (
    <>
      <PageHero
        breadcrumb={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: slug },
        ]}
        title="Blog Yazısı"
        subtitle="Bu sayfa yakında gerçek içerikle güncellenecek."
      />

      {/* TODO: Blog yazısı içeriği (MDX veya CMS) */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[#94A3B8]">
            İçerik hazırlanıyor:{" "}
            <code className="font-mono text-sm text-[#00D084]">{slug}</code>
          </p>
        </div>
      </section>

      <CTASection />
    </>
  );
}
