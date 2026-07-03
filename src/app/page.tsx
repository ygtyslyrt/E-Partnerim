import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import SocialProof from "@/components/sections/SocialProof";
import Services from "@/components/sections/Services";
import HowItWorks from "@/components/sections/HowItWorks";
import WhyUs from "@/components/sections/WhyUs";
import Blog from "@/components/sections/Blog";
import CTASection from "@/components/sections/CTASection";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <SocialProof />
        <Services />
        <HowItWorks />
        <WhyUs />
        <Blog />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
