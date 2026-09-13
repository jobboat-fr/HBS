import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Clock, FileCheck2, CalendarDays } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { CTASection } from "@/components/sections/CTASection";
import { OutilsSection } from "@/components/sections/OutilsSection";
import { TEINTE_DC } from "@/lib/teintes";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { ChampNeuronal } from "@/components/visuel/ChampNeuronal";
import { formations, programme, tarif, annonce, certificat, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Formation IA 360 — programme, ateliers et tarif",
  description:
    "Formation IA 360 : 21 heures, 6 ateliers pratiques, outils IA inclus (agents, automatisations, recherche d'emploi, secrétariat, assistant de réunion). 1 300 € par place. Programme détaillé atelier par atelier.",
};

export default function FormationsPage() {
  const ia = formations.find((f) => f.disponible)!;
  const bientot = formations.filter((f) => !f.disponible);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", url: site.url },
          { name: "Formation IA 360", url: `${site.url}/formations` },
        ]}
      />

      {/* ── En-tête ─────────────────────────────────────────────────────────── */}
      <header id="ia-360" className="fond-espace relative overflow-hidden pt-[var(--entete)]">
        <div aria-hidden className="grille-tech pointer-events-none absolute inset-0" />
        <ChampNeuronal className="pointer-events-none absolute inset-0 h-full w-full opacity-70" />
        <div className="container-page relative grid items-end gap-10 py-14 md:py-20 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <span className="verre inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-white/90">
              <CalendarDays size={14} className="text-cyan-300" aria-hidden />
              Prochaine session · {annonce.dateLisible}
            </span>
            <h1 className="mt-5 font-display text-5xl font-extrabold leading-[1.03] text-white md:text-6xl">
              Formation <span className="texte-lumiere">IA 360</span>
            </h1>
            <p className="mt-3 text-lg font-semibold text-white/80">{ia.tagline}</p>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/70">{ia.description}</p>
          </div>
          <div>
            <div className="cadre-neon">
              <div className="fond-espace rounded-2xl p-7">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/55">Votre place</p>
                <p className="mt-1 font-display text-6xl font-extrabold text-white">{tarif.montant}</p>
                <p className="text-sm text-white/65">{tarif.resume}</p>
                <Link href="/preinscription" className="bouton-neon mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 font-bold">
                  Réserver ma place <ArrowRight size={18} aria-hidden />
                </Link>
                <p className="mt-3 text-center text-xs text-white/50">Test de positionnement inclus · réponse sous 48 h</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ── Fiche ───────────────────────────────────────────────────────────── */}
      <section className="bg-cloud py-14">
        <div className="container-page">
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {programme.fiche.map((f) => (
              <Reveal key={f.label}>
                <div className="verre-clair h-full rounded-2xl p-5">
                  <dt className="text-[11px] font-semibold uppercase tracking-widest text-ink-muted">{f.label}</dt>
                  <dd className="mt-1.5 font-display text-xl font-extrabold leading-tight text-ink">{f.valeur}</dd>
                  <dd className="mt-1 text-xs leading-relaxed text-ink-soft">{f.detail}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <OutilsSection />

      {/* ── Programme détaillé ──────────────────────────────────────────────── */}
      <section id="programme" className="scroll-mt-28 py-20 lg:py-28">
        <div className="container-page">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex rounded-full bg-teal-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-teal-700">
                Programme détaillé
              </span>
              <h2 className="mt-5 font-display text-display-lg font-extrabold text-ink text-balance">
                Six ateliers, <span className="text-teal-600">trois domaines de compétences</span>
              </h2>
              <p className="mt-4 text-ink-soft">
                Chaque atelier dure 3 h 30, part de votre cas réel et produit une pièce de votre dossier IA.
                Aucun apport théorique ne dépasse 30 minutes sans mise en pratique.
              </p>
            </div>
          </Reveal>

          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-ink-soft">
            {programme.domaines.map((d) => (
              <span key={d.code} className="inline-flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-sm ${TEINTE_DC[d.code].barre}`} aria-hidden />
                <b className="font-semibold text-ink">{d.code}</b> {d.nom}
              </span>
            ))}
          </div>

          <div className="mt-14 space-y-14">
            {programme.journees.map((j) => {
              const t = TEINTE_DC[j.dc];
              return (
                <Reveal key={j.jour}>
                  <article>
                    <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-mist pb-4">
                      <h3 className="font-display text-3xl font-extrabold text-ink">
                        <span className={`mr-3 text-base font-bold uppercase tracking-widest ${t.texte}`}>{j.jour}</span>
                        {j.nom}
                      </h3>
                      <span className={`text-sm font-semibold ${t.texte}`}>{j.dc} · {programme.domaines.find((d) => d.code === j.dc)?.nom}</span>
                    </div>

                    <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_1fr_0.75fr]">
                      {j.ateliers.map((a) => (
                        <div key={a.code} className="verre-clair relative overflow-hidden rounded-2xl p-6">
                          <span aria-hidden className={`absolute inset-y-0 left-0 w-1 ${t.barre}`} />
                          <p className={`font-mono text-sm font-bold ${t.texte}`}>{a.code} · 3 h 30</p>
                          <h4 className="mt-1 font-display text-xl font-extrabold leading-snug text-ink">{a.titre}</h4>
                          <p className="mt-3 text-sm leading-relaxed text-ink-soft">{a.objectif}</p>
                          <ul className="mt-4 space-y-2">
                            {a.notions.map((n) => (
                              <li key={n} className="flex items-start gap-2 text-sm text-ink">
                                <Check size={16} className={`mt-0.5 shrink-0 ${t.texte}`} aria-hidden /> {n}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      <div className="rounded-2xl border border-dashed border-mist p-6">
                        <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-muted">Pièces produites</p>
                        <ul className="mt-3 space-y-2.5">
                          {j.pieces.map((p) => (
                            <li key={p} className="flex items-start gap-2 text-sm font-semibold text-ink">
                              <FileCheck2 size={16} className={`mt-0.5 shrink-0 ${t.texte}`} aria-hidden /> {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Évaluation ──────────────────────────────────────────────────────── */}
      <section className="bg-cloud py-20">
        <div className="container-page">
          <Reveal>
            <h2 className="text-center font-display text-display-md font-extrabold text-ink">
              Évalué, <span className="text-teal-600">du positionnement à l&apos;impact</span>
            </h2>
          </Reveal>
          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {programme.evaluation.map((e) => (
              <li key={e.quoi} className={`verre-clair flex flex-col gap-1.5 rounded-2xl p-5 ${e.clef ? "ring-2 ring-teal-500" : ""}`}>
                <span className="text-xs font-bold uppercase tracking-widest text-teal-700">{e.quand}</span>
                <span className="font-semibold leading-snug text-ink">{e.quoi}</span>
                <span className={`mt-auto text-sm ${e.clef ? "font-semibold text-teal-700" : "text-ink-soft"}`}>{e.seuil}</span>
              </li>
            ))}
          </ol>
          <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-relaxed text-ink-soft">
            <b className="text-ink">{certificat.nom}</b> à la réussite — {certificat.obtention.toLowerCase()}.{" "}
            Un domaine non acquis donne lieu à une attestation détaillée et à une session de rattrapage de 2 heures à
            distance dans les 30 jours. <span className="text-ink-muted">{certificat.precision}</span>
          </p>
        </div>
      </section>

      {/* ── Bientôt disponible ──────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="container-page">
          <Reveal>
            <h2 className="text-center font-display text-display-md font-extrabold text-ink">Bientôt disponible</h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-ink-soft">
              Notre offre s&apos;élargit. Laissez-nous vos coordonnées pour être prévenu à l&apos;ouverture.
            </p>
          </Reveal>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {bientot.map((f) => (
              <li key={f.slug} id={f.slug} className="verre-clair scroll-mt-28 rounded-2xl p-5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-ink-muted ring-1 ring-mist">
                  <Clock size={12} aria-hidden /> Bientôt
                </span>
                <h3 className="mt-3 font-display text-base font-bold leading-snug text-ink">{f.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">{f.description}</p>
              </li>
            ))}
          </ul>
          <div className="mt-8 text-center">
            <Link href="/contact" className="inline-flex items-center gap-2 font-semibold text-teal-700 hover:text-teal-600">
              Être prévenu à l&apos;ouverture <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
