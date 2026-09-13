import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { CTASection } from "@/components/sections/CTASection";
import { StatsSection } from "@/components/sections/StatsSection";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { legal, site, media } from "@/lib/site";

export const metadata: Metadata = {
  title: "À propos — organisme de formation IA à Rouen",
  description:
    "HBS FORMATION, organisme de formation à Rouen spécialisé dans l'intelligence artificielle : rendre l'IA utile, fiable et maîtrisée pour les entreprises et les particuliers.",
  alternates: { canonical: "/a-propos" },
};

const values = [
  { title: "Notre mission", text: "Rendre l'intelligence artificielle utile, fiable et maîtrisée — dans les entreprises comme pour les particuliers." },
  { title: "Notre approche", text: "Des ateliers pratiques sur vos cas réels, des démonstrations sur des systèmes en exploitation, et des outils qui continuent de travailler après la formation." },
  { title: "Notre ambition", text: "Que chaque participant reparte équipé, et que l'IA soit au travail dans son activité dès la semaine suivante." },
];

export default function AProposPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", url: site.url },
          { name: "À propos", url: `${site.url}/a-propos` },
        ]}
      />
      <PageHeader
        eyebrow="À propos"
        title={
          <>
            Rendre l&apos;IA <span className="text-teal-600">utile, fiable et maîtrisée</span>
          </>
        }
        subtitle={`${site.name} est un organisme de formation basé à ${site.city}, spécialisé dans la formation à l'intelligence artificielle.`}
      />

      <section className="py-16 lg:py-24">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-card">
              <Image src={media.aboutTeam} alt="L'équipe HBS FORMATION" fill sizes="(max-width:1024px) 90vw, 45vw" className="object-cover" />
            </div>
          </Reveal>
          <div className="space-y-6">
            {values.map((v) => (
              <Reveal key={v.title}>
                <div className="rounded-2xl border border-mist bg-white p-7 shadow-card">
                  <h2 className="font-display text-xl font-bold text-teal-600">{v.title}</h2>
                  <p className="mt-3 leading-relaxed text-ink-soft">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <StatsSection />

      <section className="py-16 lg:py-24">
        <div className="container-page">
          <Reveal>
            <div className="rounded-3xl border border-mist bg-cloud p-8 md:p-12">
              <h2 className="font-display text-2xl font-bold text-ink">Notre société</h2>
              <div className="mt-6 grid gap-x-12 gap-y-1 text-sm md:grid-cols-2">
                <Row label="Raison sociale" value={legal.raisonSociale} />
                <Row label="Forme juridique" value={legal.formeJuridique} />
                <Row label="Capital social" value={legal.capital} />
                <Row label="RCS" value={legal.rcs} />
                <Row label="SIRET" value={legal.siret} />
                <Row label="Code NAF" value={legal.naf} />
                <Row label="Président" value={legal.president} />
                <Row label="Siège social" value={legal.siege} />
              </div>
              <p className="mt-8 text-xs leading-relaxed text-ink-muted">
                Déclaration d&apos;activité enregistrée sous le n° {legal.numeroDeclarationActivite} auprès
                du {legal.declarationAutorite} (le {legal.declarationDate}). Cet enregistrement ne vaut pas
                agrément de l&apos;État.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <CTASection />
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-mist py-3">
      <span className="text-ink-muted">{label}</span>
      <span className="text-right font-medium text-ink">{value}</span>
    </div>
  );
}
