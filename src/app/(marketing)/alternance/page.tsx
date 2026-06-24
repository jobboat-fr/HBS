import type { Metadata } from "next";
import Image from "next/image";
import { Check } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { CTASection } from "@/components/sections/CTASection";
import { media } from "@/lib/site";

export const metadata: Metadata = {
  title: "Alternance & Apprentissage",
  description:
    "Se former en alternance avec HBS FORMATION : articuler centre de formation et entreprise, être rémunéré et acquérir un métier. Accompagnement administratif et pédagogique.",
};

const avantages = [
  "Une rémunération pendant toute la formation",
  "Des frais de formation pris en charge",
  "Une expérience professionnelle concrète en entreprise",
  "Un accompagnement administratif de A à Z",
  "Un suivi pédagogique régulier de l'apprenti",
  "Un lien renforcé entre l'école et l'entreprise",
];

export default function AlternancePage() {
  return (
    <>
      <PageHeader
        eyebrow="Alternance"
        title={
          <>
            Apprenez un métier <span className="text-teal-600">en alternance</span>
          </>
        }
        subtitle="Alternez théorie en centre de formation et pratique en entreprise — tout en étant rémunéré."
      />

      <section className="py-16 lg:py-24">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-card">
              <Image src={media.formationImages["apprentissage-cfa"]} alt="Apprenti en alternance" fill sizes="(max-width:1024px) 90vw, 45vw" className="object-cover" />
            </div>
          </Reveal>
          <div>
            <h2 className="font-display text-display-md font-extrabold text-ink">
              Les avantages de l&apos;alternance
            </h2>
            <p className="mt-4 text-ink-soft">
              L&apos;alternance est une voie d&apos;excellence pour se former à un métier tout en
              s&apos;insérant durablement dans le monde professionnel.
            </p>
            <ul className="mt-6 space-y-3">
              {avantages.map((a) => (
                <li key={a} className="flex items-start gap-3 text-ink-soft">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                    <Check size={14} />
                  </span>
                  {a}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/contact">Je veux me former en alternance</Button>
              <Button href="/entreprises" variant="outline">Je suis une entreprise</Button>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
