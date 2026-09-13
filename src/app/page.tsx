import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { OutilsSection } from "@/components/sections/OutilsSection";
import { ProgrammeSection } from "@/components/sections/ProgrammeSection";
import { CommitmentsSection } from "@/components/sections/CommitmentsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { CTASection } from "@/components/sections/CTASection";
import { FaqJsonLd, CoursesJsonLd } from "@/components/seo/JsonLd";
import { getTestimonials } from "@/lib/sanity/queries";

export const revalidate = 60;

export default async function HomePage() {
  const testimonials = await getTestimonials();

  return (
    <>
      <FaqJsonLd />
      <CoursesJsonLd />
      <HeroSection />
      <ServicesSection />
      <OutilsSection />
      <ProgrammeSection />
      <StatsSection />
      <ProcessSection />
      <CommitmentsSection />
      <TestimonialsSection items={testimonials} />
      <FaqSection />
      <CTASection />
    </>
  );
}
