import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Check, Clock, UserRound } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { CTASection } from "@/components/sections/CTASection";
import { PackOffre } from "@/components/sections/PackSection";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ChampNeuronal } from "@/components/visuel/ChampNeuronal";
import { FORMATIONS, ORDRE, PACK, RETRACTATION_JOURS, duree, euros, prochaineSession } from "@/lib/commande";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tarifs des formations — Analyse de données, Création de contenu, Marketing, La Forge IA",
  description:
    "Analyse de données 1 999 €, Création de contenu 1 850 €, Marketing 1 500 €, La Forge IA 1 300 €, ou les 4 avec le Pack 360 à 6 071,65 €. Paiement en ligne, en 3 fois pour les particuliers, OPCO ou France Travail possible.",
  alternates: { canonical: "/financement" },
};

export const revalidate = 3600;

export default function TarifPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", url: site.url },
          { name: "Tarifs", url: `${site.url}/financement` },
        ]}
      />

      <header className="fond-espace relative overflow-hidden pt-[var(--entete)]">
        <div aria-hidden className="grille-tech pointer-events-none absolute inset-0" />
        <ChampNeuronal className="pointer-events-none absolute inset-0 h-full w-full opacity-60" />
        <div className="container-page relative py-14 text-center md:py-20">
          <span className="verre inline-flex rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/85">
            Tarifs
          </span>
          <h1 className="mt-5 font-display text-display-lg font-extrabold text-white text-balance">
            Des prix clairs. <span className="texte-lumiere">Pas de mauvaise surprise.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
            Un prix par formation, toutes taxes comprises. Et les quatre ensemble, moins cher.
          </p>
        </div>
      </header>

      <section className="bg-cloud py-16 lg:py-24">
        <div className="container-page">
          <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {ORDRE.map((c) => {
              const f = FORMATIONS[c];
              const s = prochaineSession(c);
              return (
                <li key={c} className="verre-clair flex flex-col rounded-3xl border border-mist p-6">
                  <div className={`h-1.5 w-14 rounded-full bg-gradient-to-r ${f.couleur.degrade}`} aria-hidden />
                  <h2 className="mt-4 font-display text-2xl font-extrabold text-ink">{f.nom}</h2>
                  <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-ink-soft">
                    <Clock size={14} aria-hidden /> {duree(f)}
                  </p>
                  <p className="mt-4 font-display text-5xl font-extrabold text-ink">{euros(f.prix)}</p>
                  <p className="text-xs text-ink-muted">TTC</p>
                  <ul className="mt-5 space-y-2 text-sm text-ink-soft">
                    <li className="flex gap-2"><Check size={16} className={`mt-0.5 shrink-0 ${f.couleur.texte}`} aria-hidden /> Test de positionnement avant l&apos;entrée</li>
                    {f.inclus.map((x) => (
                      <li key={x} className="flex gap-2"><Check size={16} className={`mt-0.5 shrink-0 ${f.couleur.texte}`} aria-hidden /> {x}</li>
                    ))}
                    <li className="flex gap-2"><Check size={16} className={`mt-0.5 shrink-0 ${f.couleur.texte}`} aria-hidden /> Un point de suivi à 3 mois</li>
                  </ul>
                  <div className="mt-auto pt-6">
                    <Link
                      href={s ? `/reserver?formation=${c}&session=${s.code}` : `/reserver?formation=${c}`}
                      className="bouton-neon flex min-h-[48px] items-center justify-center gap-2 rounded-full px-5 font-bold"
                    >
                      Je réserve <ArrowRight size={18} aria-hidden />
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-10">
            <PackOffre />
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container-page grid gap-6 lg:grid-cols-3">
          <Reveal>
            <div className="verre-clair h-full rounded-2xl p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#1d3fae] to-[#2e5fe0] text-white">
                <Building2 size={22} aria-hidden />
              </div>
              <h2 className="mt-5 font-display text-xl font-bold text-ink">Votre entreprise paie</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Paiement en ligne par carte, facture immédiate au nom de la société, convention de formation envoyée
                ensuite. Pour une équipe, la session peut aussi se tenir dans vos locaux.
              </p>
            </div>
          </Reveal>
          <Reveal>
            <div className="verre-clair h-full rounded-2xl p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#1d3fae] to-[#2e5fe0] text-white">
                <UserRound size={22} aria-hidden />
              </div>
              <h2 className="mt-5 font-display text-xl font-bold text-ink">Vous payez vous-même</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                0 € aujourd&apos;hui. Rien n&apos;est prélevé pendant vos {RETRACTATION_JOURS} jours de rétractation, puis vous
                réglez en 3 fois : 30 %, puis deux fois 35 % pendant la formation.
              </p>
            </div>
          </Reveal>
          <Reveal>
            <div className="h-full rounded-2xl border border-dashed border-mist p-7 text-sm leading-relaxed text-ink-soft">
              <h2 className="font-display text-xl font-bold text-ink">Un financeur prend en charge</h2>
              <p className="mt-2">
                HBS FORMATION est certifiée Qualiopi au titre des actions de formation. Salarié, votre OPCO peut financer
                votre formation ; demandeur d&apos;emploi, France Travail peut la prendre en charge selon votre projet. Nous
                montons le dossier avec vous.
              </p>
            </div>
          </Reveal>
        </div>
        <p className="container-page mt-8 text-center text-sm text-ink-muted">
          Pack 360 : {euros(PACK.prix)} au lieu de {euros(PACK.prixSepare)}, mêmes modes de paiement.
        </p>
      </section>

      <CTASection />
    </>
  );
}
