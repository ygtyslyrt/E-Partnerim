import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import SocialProof from "@/components/sections/SocialProof";
import Services from "@/components/sections/Services";
import HowItWorks from "@/components/sections/HowItWorks";
import WhyUs from "@/components/sections/WhyUs";
import Blog from "@/components/sections/Blog";
import CTASection from "@/components/sections/CTASection";
import PlatformsPreview from "@/components/sections/PlatformsPreview";
import SolutionsPreview from "@/components/sections/SolutionsPreview";
import { getHomepageSections, type HomepageSection, type HomepageSections } from "@/lib/actions/homepage";

function renderSection(section: HomepageSection, data: HomepageSections) {
  switch (section.sectionType) {
    case "hero":
      return section.heroContent && <Hero content={section.heroContent} />;
    case "platforms":
      return section.platformsContent && (
        <PlatformsPreview config={section.platformsContent} items={data.featuredPlatforms} />
      );
    case "solutions":
      return section.solutionsContent && (
        <SolutionsPreview config={section.solutionsContent} items={data.featuredSolutions} />
      );
    case "social-proof":
      return section.socialProofContent && <SocialProof content={section.socialProofContent} />;
    case "services":
      return section.servicesContent && <Services content={section.servicesContent} />;
    case "how-it-works":
      return section.howItWorksContent && (
        <HowItWorks content={section.howItWorksContent} whatsappUrl={`https://wa.me/${data.settings.whatsapp ?? ""}`} />
      );
    case "why-us":
      return section.whyUsContent && (
        <WhyUs content={section.whyUsContent} whatsappUrl={`https://wa.me/${data.settings.whatsapp ?? ""}`} />
      );
    case "blog":
      return section.blogContent && <Blog config={section.blogContent} posts={data.blogPosts} />;
    case "cta":
      return section.ctaContent && <CTASection content={section.ctaContent} settings={data.settings} />;
    default:
      return null;
  }
}

export default async function HomePage() {
  const data = await getHomepageSections();

  return (
    <>
      <Header />
      <main className="flex-1">
        {data.sections.map((section) => (
          <div key={section.id}>{renderSection(section, data)}</div>
        ))}
      </main>
      <Footer />
    </>
  );
}
