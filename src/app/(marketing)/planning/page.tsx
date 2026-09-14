import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { CTASection } from "@/components/sections/CTASection";
import { Planning, Rythme } from "@/components/planning/Planning";
import { BreadcrumbJsonLd, CourseJsonLd } from "@/components/seo/JsonLd";
import { ORDRE } from "@/lib/commande";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Planning des formations — Data, Content, Marketing et IA 360",
  description:
    "Le calendrier des formations HBS FORMATION : chaque mois, Data Analyse 360, Content Making 360, Marketing 360 et la Formation IA 360 en dernière semaine. Dates, prix et réservation en ligne.",
  alternates: { canonical: "/planning" },
};

// Recalculé chaque heure : une semaine commencée quitte le planning d'elle-même.
export const revalidate = 3600;

export default function PlanningPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", url: site.url },
          { name: "Planning", url: `${site.url}/planning` },
        ]}
      />
      {ORDRE.map((c) => <CourseJsonLd key={c} code={c} />)}

      <PageHeader
        eyebrow="Planning"
        title={<>Chaque semaine, <span className="texte-lumiere">un thème</span></>}
        subtitle="Data, contenu, marketing — et chaque fin de mois, la Formation IA 360. Choisissez votre semaine, réservez en deux minutes."
      />

      <section className="py-12 lg:py-16">
        <div className="container-page">
          <h2 className="font-display text-display-md font-extrabold text-ink">Le rythme du mois</h2>
          <div className="mt-6">
            <Rythme />
          </div>
        </div>
      </section>

      <section className="bg-cloud py-12 lg:py-16">
        <div className="container-page mx-auto max-w-4xl">
          <h2 className="font-display text-display-md font-extrabold text-ink">Les prochaines sessions</h2>
          <p className="mt-2 text-sm text-ink-soft">
            21 heures sur la semaine, à distance en direct · 4 à 12 participants · une session dédiée pour votre équipe est
            possible les autres semaines.
          </p>
          <div className="mt-8">
            <Planning mois={6} />
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
