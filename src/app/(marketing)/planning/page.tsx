import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { CTASection } from "@/components/sections/CTASection";
import { Planning, Rythme } from "@/components/planning/Planning";
import { BreadcrumbJsonLd, CourseJsonLd } from "@/components/seo/JsonLd";
import { PackCycles } from "@/components/sections/PackSection";
import { ORDRE } from "@/lib/commande";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Planning des formations — Analyse de données, Création de contenu, Marketing, La Forge IA",
  description:
    "Toutes les dates HBS FORMATION : chaque mois Analyse de données (5 jours), Création de contenu (5 jours), Marketing (3 jours) et La Forge IA (3 jours). Prix, places et réservation en ligne.",
  alternates: { canonical: "/planning" },
};

// Recalculé chaque heure : une session commencée quitte le planning d'elle-même.
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
        title={<>Votre prochaine session <span className="texte-lumiere">est déjà là</span></>}
        subtitle="4 formations chaque mois, 12 places par session. Choisissez vos dates et réservez en deux minutes, avant que ce soit complet."
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
            7 heures par jour, à distance en direct · 4 à 12 participants · une session dédiée à votre équipe est possible
            à d&apos;autres dates.
          </p>
          <div className="mt-8">
            <Planning mois={6} />
          </div>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="container-page mx-auto max-w-4xl">
          <PackCycles />
        </div>
      </section>

      <CTASection />
    </>
  );
}
