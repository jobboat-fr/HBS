import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Clock, MonitorPlay, Users, Target } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { CTASection } from "@/components/sections/CTASection";
import { Planning } from "@/components/planning/Planning";
import { BreadcrumbJsonLd, CourseJsonLd } from "@/components/seo/JsonLd";
import { FORMATIONS, FORMAT, ORDRE, euros, prochaineSession, libelleSemaine, type CodeFormation } from "@/lib/commande";
import { site } from "@/lib/site";

export const revalidate = 3600;

const PAGES = ORDRE.filter((c) => c !== "IA360");
const parSlug = (slug: string) => PAGES.map((c) => FORMATIONS[c]).find((f) => f.slug === slug);

export function generateStaticParams() {
  return PAGES.map((c) => ({ slug: FORMATIONS[c].slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const f = parSlug((await params).slug);
  if (!f) return {};
  return {
    title: `${f.nom} — ${f.accroche} · formation en ligne ${euros(f.prix)}`,
    description: `${f.resume} 21 h en direct, ${euros(f.prix)} la place. Organisme certifié Qualiopi, financement OPCO ou France Travail possible.`,
    alternates: { canonical: f.href },
  };
}

export default async function FormationPage({ params }: { params: Promise<{ slug: string }> }) {
  const f = parSlug((await params).slug);
  if (!f) notFound();
  const prochaine = prochaineSession(f.code as CodeFormation);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", url: site.url },
          { name: "Planning", url: `${site.url}/planning` },
          { name: f.nom, url: `${site.url}${f.href}` },
        ]}
      />
      <CourseJsonLd code={f.code} />

      <PageHeader
        eyebrow={`Formation 360 · ${euros(f.prix)}`}
        title={<>{f.nom} <span className="texte-lumiere">— {f.accroche}</span></>}
        subtitle={f.resume}
      />

      <section className="py-14 lg:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="flex items-center gap-2 font-display text-display-md font-extrabold text-ink">
              <Target size={26} className={f.couleur.texte} aria-hidden /> Ce que vous saurez faire
            </h2>
            <ul className="mt-6 space-y-3">
              {f.objectifs.map((o) => (
                <li key={o} className="flex gap-3 text-[15px] leading-relaxed text-ink-soft">
                  <Check size={18} className={`mt-1 shrink-0 ${f.couleur.texte}`} aria-hidden /> {o}
                </li>
              ))}
            </ul>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                { i: Clock, t: "Durée", d: FORMAT.duree },
                { i: MonitorPlay, t: "Modalité", d: FORMAT.modalite },
                { i: Users, t: "Effectif", d: FORMAT.effectif },
              ].map(({ i: I, t, d }) => (
                <div key={t} className="verre-clair rounded-2xl border border-mist p-5">
                  <I size={20} className="text-teal-600" aria-hidden />
                  <p className="mt-2 text-xs font-bold uppercase tracking-wider text-ink-muted">{t}</p>
                  <p className="mt-1 text-sm font-semibold text-ink">{d}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 space-y-4 text-[15px] leading-relaxed text-ink-soft">
              <p><b className="text-ink">Pour qui :</b> {f.pourQui}</p>
              <p><b className="text-ink">Prérequis :</b> {f.prerequis}</p>
              <p>
                <b className="text-ink">Avant l&apos;entrée :</b> un test de positionnement d&apos;environ 20 minutes adapte les
                ateliers à votre niveau et à votre cas réel. <b className="text-ink">Évaluation :</b> mises en situation
                pendant la formation, attestation de fin de formation, questionnaire de suivi à 3 mois.
              </p>
              <p>
                <b className="text-ink">Accessibilité :</b> signalez tout besoin d&apos;aménagement au test de positionnement,
                nous l&apos;étudions avec vous avant l&apos;entrée.
              </p>
            </div>
          </div>

          <aside className="self-start lg:sticky lg:top-[calc(var(--entete)+1.5rem)]">
            <div className="cadre-neon">
              <div className="p-7">
                <p className={`text-xs font-bold uppercase tracking-widest ${f.couleur.texte}`}>Prochaine session</p>
                <p className="mt-2 font-display text-2xl font-extrabold text-ink">
                  {prochaine ? `Semaine ${libelleSemaine(prochaine)}` : "Dates à venir"}
                </p>
                <p className="mt-4 font-display text-5xl font-extrabold text-ink">{euros(f.prix)}</p>
                <p className="text-sm text-ink-soft">par place · TTC</p>
                <ul className="mt-4 space-y-1.5 text-sm text-ink-soft">
                  {f.inclus.map((x) => <li key={x}>✓ {x}</li>)}
                </ul>
                <Link
                  href={prochaine ? `/reserver?formation=${f.code}&session=${prochaine.code}` : `/reserver?formation=${f.code}`}
                  className="bouton-neon mt-6 flex min-h-[52px] items-center justify-center gap-2 rounded-full px-6 font-bold"
                >
                  Réserver ma place <ArrowRight size={18} aria-hidden />
                </Link>
                <p className="mt-3 text-center text-xs text-ink-muted">
                  Paiement sécurisé par Stripe · OPCO ou France Travail possible
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-cloud py-14 lg:py-20">
        <div className="container-page mx-auto max-w-4xl">
          <h2 className="font-display text-display-md font-extrabold text-ink">Les prochaines semaines {f.nom}</h2>
          <p className="mt-2 text-ink-soft">
            Une session chaque mois. <Link href="/planning" className="font-semibold text-teal-700 underline">Voir tout le planning</Link>
          </p>
          <div className="mt-8">
            <Planning formation={f.code} mois={6} avecComplets={false} limite={4} />
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
