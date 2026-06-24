import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";
import { CTASection } from "@/components/sections/CTASection";
import { StatsSection } from "@/components/sections/StatsSection";
import { legal, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "HBS FORMATION, organisme de formation à Rouen. Notre mission : rendre la formation professionnelle exigeante, accessible et résolument tournée vers la réussite.",
};

const values = [
  {
    title: "Notre mission",
    text: "Concevoir et déployer des actions de formation professionnelle continue, certifiantes et par apprentissage qui transforment durablement les compétences.",
  },
  {
    title: "Notre approche",
    text: "Une ingénierie pédagogique sur mesure, en présentiel, à distance ou en modalités mixtes (FOAD), portée par des formateurs experts de leur domaine.",
  },
  {
    title: "Notre ambition",
    text: "Accompagner entreprises, organismes et particuliers vers l'excellence, du premier échange jusqu'au suivi post-formation.",
  },
];

export default function AProposPage() {
  return (
    <>
      <PageHeader
        eyebrow="À propos"
        title={
          <>
            L&apos;exigence au service de <span className="text-gold-gradient">vos compétences</span>
          </>
        }
        subtitle={`${site.name} est un organisme de formation basé à ${site.city}, dédié à la réussite professionnelle des apprenants et des entreprises.`}
      />

      <section className="py-[var(--section-padding)] pt-8">
        <div className="container-luxury grid gap-6 md:grid-cols-3">
          {values.map((v) => (
            <Reveal key={v.title}>
              <GlassCard className="h-full p-8">
                <h2 className="font-display text-2xl font-semibold text-gold">{v.title}</h2>
                <p className="mt-4 leading-relaxed text-white/60">{v.text}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      <StatsSection />

      <section className="pb-[var(--section-padding)]">
        <div className="container-luxury">
          <Reveal>
            <GlassCard className="p-8 md:p-12">
              <h2 className="font-display text-2xl font-semibold">Notre société</h2>
              <div className="mt-6 grid gap-x-12 gap-y-4 text-sm md:grid-cols-2">
                <Row label="Raison sociale" value={legal.raisonSociale} />
                <Row label="Forme juridique" value={legal.formeJuridique} />
                <Row label="Capital social" value={legal.capital} />
                <Row label="RCS" value={legal.rcs} />
                <Row label="SIREN" value={legal.siren} />
                <Row label="Président" value={legal.president} />
                <Row label="Siège social" value={legal.siege} />
                <Row label="Immatriculation" value={legal.immatriculation} />
              </div>
              <p className="mt-8 text-xs leading-relaxed text-white/40">
                Activité de formation professionnelle déclarée auprès des autorités compétentes —
                déclaration d&apos;activité : {legal.numeroDeclarationActivite}.
              </p>
            </GlassCard>
          </Reveal>
        </div>
      </section>

      <CTASection />
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-white/[0.06] py-3">
      <span className="text-white/45">{label}</span>
      <span className="text-right text-white/80">{value}</span>
    </div>
  );
}
