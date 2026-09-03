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
  title: "Entreprises & Organisations",
  description:
    "HBS FORMATION accompagne les entreprises : montée en compétences des équipes, formations intra-entreprise sur mesure, ingénierie pédagogique et alternance.",
};

const offres = [
  { icon: Target, title: "Diagnostic des besoins", text: "Nous analysons vos enjeux et les compétences à développer au sein de vos équipes." },
  { icon: Layers, title: "Formations sur mesure", text: "Des parcours intra-entreprise conçus spécifiquement pour votre contexte et vos métiers." },
  { icon: Users2, title: "Formateurs experts", text: "Des intervenants issus du terrain, mis à disposition selon vos besoins." },
  { icon: LineChart, title: "Suivi & impact", text: "Un suivi des acquis et de la montée en compétences, du déploiement au bilan." },
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
            Faites grandir <span className="text-teal-600">vos équipes</span>
          </>
        }
        subtitle="Montée en compétences, formations intra-entreprise sur mesure et ingénierie pédagogique pour les organisations."
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
                <div className="h-full rounded-2xl border border-mist bg-white p-6 shadow-card">
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
