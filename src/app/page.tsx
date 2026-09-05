import HeroSection from "@/components/home/HeroSection";
import MissionVisionSection from "@/components/about/MissionVisionSection";
import OurImpactSection from "@/components/home/OurImpactSection";
import WhySELSection from "@/components/home/WhySELSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import PartnersSection from "@/components/home/PartnersSection";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MissionVisionSection />
      <WhySELSection />
      <TestimonialsSection />
      <OurImpactSection />
      <PartnersSection />
      <CTASection />
    </>
  );
}
