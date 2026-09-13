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
  title: "Formation IA entreprise — former vos équipes à l'IA, AI Act compris",
  description:
    "Formation IA 360 pour les entreprises : vos collaborateurs formés à l'intelligence artificielle sur vos propres processus, outils IA inclus dans chaque place. 1 300 € par place, en intra-entreprise possible.",
  alternates: { canonical: "/entreprises" },
};

const offres = [
  { icon: Target, title: "Ce que l'IA peut prendre", text: "On identifie les tâches de vos équipes que l'IA peut assumer — et celles qu'elle ne doit pas toucher." },
  { icon: Layers, title: "La formation dans vos locaux", text: "La Formation IA 360 organisée pour vos collaborateurs, sur vos propres documents et processus." },
  { icon: Users2, title: "Des outils pour chaque place", text: "Agents, automatisations, secrétariat, assistant de réunion : inclus pour chaque collaborateur formé." },
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
            Mettez l&apos;IA <span className="text-teal-600">au travail dans vos équipes</span>
          </>
        }
        subtitle="La Formation IA 360 pour vos collaborateurs, sur vos processus, avec les outils IA inclus dans chaque place."
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
          <Button href="/contact" size="lg">Construire un plan de formation</Button>
        </div>
      </section>

      <CTASection />
    </>
  );
}
