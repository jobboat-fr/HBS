import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Clock, Sparkles, GraduationCap, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { CTASection } from "@/components/sections/CTASection";
import { PackOffre } from "@/components/sections/PackSection";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { FORMATIONS, ORDRE, PACK, duree, euros, libelleDates, prochaineSession } from "@/lib/commande";
import { outilsInclus, site } from "@/lib/site";

/**
 * Tout ce que HBS FORMATION vend, sur une page.
 *
 * Le site conduit d'habitude vers une formation précise ; cette page sert l'autre besoin —
 * celui de quelqu'un qui veut d'abord voir l'ensemble avant de choisir. Elle ne réinvente
 * aucun prix ni aucune date : tout vient de `commande.ts`, la même source que le paiement.
 */

export const metadata: Metadata = {
  title: "Nos produits — formations, Pack 360, outils IA et espace apprenant",
  description:
    "L'offre complète de HBS FORMATION : quatre formations de 3 à 5 jours, le Pack 360 qui les réunit, les outils IA inclus dans IA 360, et l'espace apprenant en ligne.",
  alternates: { canonical: "/produits" },
};

export const revalidate = 3600;

export default function ProduitsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", url: site.url },
          { name: "Nos produits", url: `${site.url}/produits` },
        ]}
      />

      <PageHeader
        eyebrow="Nos produits"
        title={<>Formations, outils, suivi : <span className="texte-lumiere">tout pour avancer</span></>}
        subtitle="Quatre formations, un pack qui les réunit, des outils qui continuent de travailler après, et un espace en ligne pour suivre votre parcours."
      />

      {/* ── Les formations ───────────────────────────────────────────────── */}
      <section className="py-14 lg:py-20">
        <div className="container-page">
          <div className="flex items-center gap-3">
            <GraduationCap size={26} className="text-teal-600" aria-hidden />
            <h2 className="font-display text-display-md font-extrabold text-ink">Les formations</h2>
          </div>
          <p className="mt-2 max-w-2xl text-ink-soft">
            À distance, en direct, 7 heures par jour, 12 places maximum.
          </p>

          <ul className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {ORDRE.map((code) => {
              const f = FORMATIONS[code];
              const s = prochaineSession(code);
              return (
                <li key={code} className="verre-clair flex flex-col rounded-3xl border border-mist p-6">
                  <div className={`h-1.5 w-14 rounded-full bg-gradient-to-r ${f.couleur.degrade}`} aria-hidden />
                  <p className="mt-4 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-ink-muted">
                    <Clock size={13} aria-hidden /> {duree(f)}
                  </p>
                  <h3 className="mt-1 font-display text-2xl font-extrabold leading-tight text-ink">{f.nom}</h3>
                  <p className={`font-semibold ${f.couleur.texte}`}>{f.accroche}</p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">{f.resume}</p>
                  <div className="mt-auto pt-6">
                    {s ? <p className="text-xs font-semibold text-ink">Prochaine session {libelleDates(s)}</p> : null}
                    <p className="mt-1 font-display text-3xl font-extrabold text-ink">
                      {euros(f.prix)} <span className="text-sm font-semibold text-ink-muted">TTC</span>
                    </p>
                    <Link
                      href={s ? `/reserver?formation=${code}&session=${s.code}` : `/reserver?formation=${code}`}
                      className="bouton-neon mt-4 flex min-h-[48px] items-center justify-center gap-2 rounded-full px-5 font-bold"
                    >
                      Je réserve <ArrowRight size={18} aria-hidden />
                    </Link>
                    <Link href={f.href} className="mt-2 block text-center text-sm font-semibold text-teal-700 hover:underline">
                      Voir le programme
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ── Le Pack 360 ──────────────────────────────────────────────────── */}
      <section className="bg-cloud py-14 lg:py-20">
        <div className="container-page">
          <h2 className="font-display text-display-md font-extrabold text-ink">Le {PACK.nom}</h2>
          <p className="mt-2 max-w-2xl text-ink-soft">
            Les quatre formations d&apos;un même mois, dans un seul forfait : {euros(PACK.prix)}.
          </p>
          <div className="mt-8">
            <PackOffre />
          </div>
        </div>
      </section>

      {/* ── Les outils inclus ────────────────────────────────────────────── */}
      <section className="py-14 lg:py-20">
        <div className="container-page">
          <div className="flex items-center gap-3">
            <Sparkles size={26} className="text-teal-600" aria-hidden />
            <h2 className="font-display text-display-md font-extrabold text-ink">Les outils inclus dans votre forfait</h2>
          </div>
          <p className="mt-2 max-w-2xl text-ink-soft">
            Livrés avec IA 360 : vous ne repartez pas avec des notes, mais avec des outils qui travaillent.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {outilsInclus.map((o) => (
              <li key={o.titre} className="verre-clair rounded-2xl border border-mist p-5">
                <p className="flex items-center gap-2 font-display text-lg font-bold text-ink">
                  <Check size={18} className="text-teal-600" aria-hidden /> {o.titre}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{o.texte}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── L'espace apprenant ───────────────────────────────────────────── */}
      <section className="bg-cloud py-14 lg:py-20">
        <div className="container-page">
          <div className="flex items-center gap-3">
            <Users size={26} className="text-teal-600" aria-hidden />
            <h2 className="font-display text-display-md font-extrabold text-ink">Votre espace en ligne</h2>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {[
              { t: "Avant la formation", d: "Test de positionnement, convention ou contrat, informations pratiques." },
              { t: "Pendant", d: "Émargement, supports, exercices et échanges avec votre formateur." },
              { t: "Après", d: "Attestation, certificat le cas échéant, et vos documents conservés au coffre." },
            ].map((x) => (
              <div key={x.t} className="verre-clair rounded-2xl border border-mist p-6">
                <p className="font-display text-lg font-bold text-ink">{x.t}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{x.d}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-ink-soft">
            L&apos;accès vous est ouvert après votre inscription, sur la plateforme VTLVS éditée par AZZ&amp;CO Labs.
          </p>
        </div>
      </section>

      <CTASection />
    </>
  );
}
