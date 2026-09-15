import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { ComplementSection } from "@/components/sections/PackSection";
import { CommitmentsSection } from "@/components/sections/CommitmentsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { CTASection } from "@/components/sections/CTASection";
import { FaqJsonLd, CoursesJsonLd } from "@/components/seo/JsonLd";
import { getTestimonials } from "@/lib/sanity/queries";
import { FORMATIONS, dateCourte, prochaineSessionTous } from "@/lib/commande";

export const revalidate = 60;

export const metadata = { alternates: { canonical: "/" } };

export default async function HomePage() {
  const testimonials = await getTestimonials();
  const s = prochaineSessionTous();
  const prochaine = s
    ? { nom: FORMATIONS[s.formation].nom, iso: s.debut, date: dateCourte(s.debut), href: `/reserver?formation=${s.formation}&session=${s.code}` }
    : null;

  return (
    <>
      <FaqJsonLd />
      <CoursesJsonLd />
      <HeroSection prochaine={prochaine} />
      <ServicesSection />
      <ComplementSection />
      <StatsSection />
      <ProcessSection />
      <CommitmentsSection />
      <TestimonialsSection items={testimonials} />
      <FaqSection />
      <CTASection />
    </>
  );
}
