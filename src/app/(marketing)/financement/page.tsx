import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Check, UserRound } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { CTASection } from "@/components/sections/CTASection";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ChampNeuronal } from "@/components/visuel/ChampNeuronal";
import { site, tarif, outilsInclus, certificat, annonce } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tarif Formation IA — 1 300 € la place, OPCO et France Travail",
  description:
    "Formation IA 360 : 1 300 € par place, 21 heures en direct et outils IA inclus. Paiement en ligne entreprise ou particulier, prise en charge OPCO ou France Travail possible (organisme certifié Qualiopi).",
  alternates: { canonical: "/financement" },
};

const inclus = [
  "21 heures de formation en direct, 6 ateliers pratiques",
  "Test de positionnement avant l'entrée",
  ...outilsInclus.filter((o) => !o.titre.startsWith("Et ")).map((o) => o.titre),
  "Votre dossier IA : 9 pièces datées",
  `${certificat.nom} à la réussite de l'épreuve`,
  "Un point de suivi à 3 mois",
];

export default function TarifPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", url: site.url },
          { name: "Tarif", url: `${site.url}/financement` },
        ]}
      />

      <header className="fond-espace relative overflow-hidden pt-[var(--entete)]">
        <div aria-hidden className="grille-tech pointer-events-none absolute inset-0" />
        <ChampNeuronal className="pointer-events-none absolute inset-0 h-full w-full opacity-60" />
        <div className="container-page relative py-14 text-center md:py-20">
          <div>
            <span className="verre inline-flex rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/85">
              Tarif
            </span>
            <h1 className="mt-5 font-display text-display-lg font-extrabold text-white text-balance">
              Un prix, <span className="texte-lumiere">tout compris</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
              La formation et les outils IA qui continuent de travailler pour vous après.
            </p>
          </div>
        </div>
      </header>

      <section className="bg-cloud py-16 lg:py-24">
        <div className="container-page grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <div className="cadre-neon h-full">
              <div className="h-full rounded-2xl p-8 md:p-10">
                <p className="text-xs font-bold uppercase tracking-widest text-red-600">Formation IA 360</p>
                <p className="mt-3 font-display text-7xl font-extrabold text-ink">{tarif.montant}</p>
                <p className="mt-1 text-ink-soft">{tarif.unite} · prochaine session le {annonce.dateLisible}</p>
                <ul className="mt-8 space-y-3">
                  {inclus.map((i) => (
                    <li key={i} className="flex items-start gap-3 text-ink">
                      <Check size={20} className="mt-0.5 shrink-0 text-red-500" aria-hidden /> {i}
                    </li>
                  ))}
                </ul>
                <Link href="/reserver?formation=IA360" className="bouton-neon mt-9 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-base font-bold">
                  Réserver ma place <ArrowRight size={18} aria-hidden />
                </Link>
              </div>
            </div>
          </Reveal>

          <div className="flex flex-col gap-6">
            <Reveal>
              <div className="verre-clair rounded-2xl p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#1d3fae] to-[#2e5fe0] text-white">
                  <Building2 size={22} aria-hidden />
                </div>
                <h2 className="mt-5 font-display text-xl font-bold text-ink">Votre entreprise règle la place</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  Une convention de formation est établie avec l&apos;entreprise, qui règle la place sur facture.
                  Pour plusieurs collaborateurs, la session peut aussi être organisée dans vos locaux.
                </p>
              </div>
            </Reveal>
            <Reveal>
              <div className="verre-clair rounded-2xl p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#1d3fae] to-[#2e5fe0] text-white">
                  <UserRound size={22} aria-hidden />
                </div>
                <h2 className="mt-5 font-display text-xl font-bold text-ink">Vous réglez à titre personnel</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  Un contrat de formation est signé avec vous. Vous disposez d&apos;un délai de rétractation de
                  10 jours, et aucun paiement n&apos;est demandé avant son expiration.
                </p>
              </div>
            </Reveal>
            <Reveal>
              <p className="rounded-2xl border border-dashed border-mist p-6 text-sm leading-relaxed text-ink-soft">
                <b className="text-ink">Prise en charge par un OPCO ou France Travail :</b> HBS FORMATION est certifiée
                Qualiopi au titre des actions de formation. Salarié, votre OPCO peut financer votre place ; demandeur
                d&apos;emploi, France Travail peut la financer selon votre projet. Nous montons le dossier avec vous.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
