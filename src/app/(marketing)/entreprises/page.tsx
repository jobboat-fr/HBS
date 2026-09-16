import type { Metadata } from "next";
import Image from "next/image";
import { Target, Layers, Users2, LineChart } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { CTASection } from "@/components/sections/CTASection";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { media, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Formation professionnelle entreprise — données, contenu, marketing et IA pour vos équipes",
  description:
    "Formez vos équipes à l'analyse de données, la création de contenu, le marketing et l'IA (IA 360), sur vos propres dossiers. À distance ou dans vos locaux, OPCO possible, organisme certifié Qualiopi.",
  alternates: { canonical: "/entreprises" },
};

const offres = [
  { icon: Target, title: "Les compétences qui vous manquent", text: "Données, contenu, marketing ou IA : on part de vos objectifs et on forme là où ça rapporte." },
  { icon: Layers, title: "Dans vos locaux, sur vos dossiers", text: "Nos 4 formations organisées pour vos collaborateurs, sur vos propres chiffres, offres et processus." },
  { icon: Users2, title: "Toute l'équipe d'un coup", text: "De 4 à 12 collaborateurs par session. Avec IA 360, les outils IA sont inclus dans le forfait de chacun." },
  { icon: LineChart, title: "Un suivi à trois mois", text: "On mesure ce qui a réellement été déployé dans vos équipes, et ce qui reste à faire." },
];

export default function EntreprisesPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", url: site.url },
          { name: "Entreprises", url: `${site.url}/entreprises` },
        ]}
      />
      <PageHeader
        eyebrow="Entreprises"
        title={
          <>
            Vos équipes ont 3 jours ? <span className="texte-lumiere">Elles repartent transformées.</span>
          </>
        }
        subtitle="Analyse de données, Création de contenu, Marketing, IA 360 : formez vos collaborateurs sur vos vrais dossiers, et voyez la différence dès le lundi suivant."
      />

      <section className="py-16 lg:py-24">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-card">
              <Image src={media.entreprises} alt="Équipe en entreprise" fill sizes="(max-width:1024px) 90vw, 45vw" className="object-cover" />
            </div>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2">
            {offres.map((o) => (
              <Reveal key={o.title}>
                <div className="verre-clair h-full rounded-2xl p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                    <o.icon size={22} strokeWidth={1.75} />
                  </div>
                  <h2 className="mt-4 font-display text-base font-bold text-ink">{o.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{o.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <div className="container-page mt-12 text-center">
          <Button href="/contact" size="lg">Construire le plan de mon équipe</Button>
        </div>
      </section>

      <CTASection />
    </>
  );
}
