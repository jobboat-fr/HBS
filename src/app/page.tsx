import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { VideoSection } from "@/components/sections/VideoSection";
import { CommitmentsSection } from "@/components/sections/CommitmentsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { CTASection } from "@/components/sections/CTASection";
import { getTestimonials } from "@/lib/sanity/queries";

export const revalidate = 60;

export default async function HomePage() {
  const testimonials = await getTestimonials();

  return (
    <>
      <HeroSection />
      <ServicesSection />
      <StatsSection />
      <VideoSection />
      <ProcessSection />
      <CommitmentsSection />
      <TestimonialsSection items={testimonials} />
      <CTASection />
    </>
  );
}
