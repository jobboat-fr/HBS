import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardList, ShieldCheck, UserCheck, CalendarCheck, CalendarDays, Check, Users } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { InscriptionForm, type Choix } from "@/components/forms/InscriptionForm";
import { Pastille } from "@/components/planning/Planning";
import { Button } from "@/components/ui/Button";
import { catalogue, configured, type Catalogue } from "@/lib/learn";
import {
  FORMATIONS,
  PLACES_MAX,
  duree,
  euros,
  libelleDates,
  planning,
  prochaineSession,
  sessionParCode,
  type CodeFormation,
} from "@/lib/commande";
import { site } from "@/lib/site";

/**
 * Le pont entre la vitrine et la plateforme — et l'arrivée du planning.
 *
 * Un clic sur une semaine du planning mène ici avec `?formation=…&session=…` : la formation
 * est présélectionnée, la semaine affichée, et le visiteur n'a plus qu'à laisser ses
 * coordonnées. La session est recalculée depuis le planning, jamais crue sur parole : un
 * code inventé ou une semaine complète retombe sur la prochaine session ouverte.
 *
 * La liste des formations vient de LEARN. Si la plateforme est injoignable, la page reste
 * utile — le formulaire cède la place au parcours de contact.
 */

export const metadata: Metadata = {
  title: "Demande d'inscription — Analyse de données, Création de contenu, Marketing, La Forge IA",
  description:
    "Demandez votre inscription chez HBS FORMATION : choisissez vos dates, laissez vos coordonnées, passez un test de positionnement de 15 minutes. Idéal si un OPCO ou France Travail finance votre formation.",
  alternates: { canonical: "/preinscription" },
};

const ETAPES = [
  { icon: ClipboardList, title: "Vous faites votre demande", body: "Deux minutes, sans compte ni paiement. Votre demande est enregistrée tout de suite." },
  { icon: UserCheck, title: "Vous passez le test", body: "15 minutes, juste après : on adapte la formation à votre niveau et à votre projet." },
  { icon: CalendarCheck, title: "On confirme", body: "Sous 48 h ouvrées : votre session, votre contrat ou convention, votre financement." },
];

const CODES = ["DATA360", "CONTENT360", "MKT360", "IA360"] as const;

export default async function InscriptionPage({
  searchParams,
}: {
  searchParams: Promise<{ formation?: string; session?: string }>;
}) {
  const params = await searchParams;
  const code = (CODES as readonly string[]).includes(params.formation ?? "")
    ? (params.formation as CodeFormation)
    : null;
  const demandee = params.session ? sessionParCode(params.session) : null;
  const creneau =
    demandee && demandee.statut === "ouvert" && (!code || demandee.formation === code)
      ? demandee
      : code
        ? prochaineSession(code)
        : null;
  const f = creneau ? FORMATIONS[creneau.formation] : null;
  const autres = f ? planning(new Date(), 6).filter((s) => s.formation === f.code && s.statut === "ouvert").slice(0, 4) : [];

  let data: Catalogue | null = null;
  if (configured()) {
    try {
      data = await catalogue();
    } catch {
      data = null;
    }
  }

  const programmeId =
    data?.programmes.find((p) => f && p.title.toLowerCase() === f.nom.toLowerCase())?.id ??
    data?.programmes.find((p) => p.title.toLowerCase() === FORMATIONS.IA360.nom.toLowerCase())?.id;
  const sessionId =
    data?.programmes.find((p) => p.id === programmeId)?.sessions?.find((s) => creneau && s.code === creneau.code)?.id ?? null;
  const choix: Choix | null =
    f && creneau ? { code: creneau.code, formation: f.nom, semaine: libelleDates(creneau), prix: euros(f.prix) } : null;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", url: site.url },
          { name: "Demande d'inscription", url: `${site.url}/preinscription` },
        ]}
      />
      <PageHeader
        eyebrow={f ? `Réservation · ${f.nom}` : "Réservation"}
        title={
          f ? (
            <>
              {f.accroche}. <span className="texte-lumiere">On garde une place pour vous.</span>
            </>
          ) : (
            <>
              Votre inscription, <span className="texte-lumiere">en deux minutes</span>
            </>
          )
        }
        subtitle={
          f && creneau
            ? `${f.nom}, ${libelleDates(creneau)}. ${PLACES_MAX} places seulement : faites votre demande avant que ce soit complet.`
            : "Choisissez votre formation, laissez vos coordonnées, passez le test : on s'occupe du reste, financement compris."
        }
      />

      <section className="bg-cloud py-10 lg:py-14">
        {/* Sur téléphone : sélection, formulaire, puis étapes. Sur ordinateur : sélection et étapes à
            gauche, formulaire à droite sur toute la hauteur. */}
        <div className="container-page grid gap-6 lg:grid-cols-[1fr_1.35fr] lg:gap-8">
          {/* ── Votre sélection ─────────────────────────────────────────────── */}
          <aside className="lg:col-start-1 lg:row-start-1">
            {f && creneau ? (
              <div className="cadre-neon">
                <div className="p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-ink-muted">Votre sélection</p>
                  <div className="mt-3">
                    <Pastille code={f.code} taille="md" />
                  </div>
                  <p className="mt-3 font-display text-2xl font-extrabold leading-tight text-ink">{f.nom}</p>
                  <p className={`font-semibold ${f.couleur.texte}`}>{f.accroche}</p>
                  <p className="mt-4 flex items-center gap-2 font-semibold text-ink">
                    <CalendarDays size={18} className="text-teal-600" aria-hidden /> {libelleDates(creneau)}
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-ink-soft">
                    <Users size={16} aria-hidden /> {duree(f)} en direct · {PLACES_MAX} places maximum
                  </p>
                  <ul className="mt-4 space-y-1.5 text-sm text-ink-soft">
                    {f.inclus.map((x) => (
                      <li key={x} className="flex gap-2">
                        <Check size={16} className={`mt-0.5 shrink-0 ${f.couleur.texte}`} aria-hidden /> {x}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 flex items-baseline justify-between border-t border-mist pt-4">
                    <span className="text-sm text-ink-soft">Prix</span>
                    <span className="font-display text-3xl font-extrabold text-ink">{euros(f.prix)}</span>
                  </div>
                  <p className="text-right text-xs text-ink-muted">TTC · OPCO ou France Travail possible</p>
                  <Link
                    href={`/reserver?formation=${f.code}&session=${creneau.code}`}
                    className="bouton-neon mt-4 flex min-h-[52px] items-center justify-center gap-2 rounded-full px-6 font-bold"
                  >
                    Payer en ligne maintenant
                  </Link>

                  {autres.length > 1 ? (
                    <div className="mt-5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Autres dates ?</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {autres.map((s) => (
                          <Link
                            key={s.code}
                            href={`/preinscription?formation=${s.formation}&session=${s.code}`}
                            aria-current={s.code === creneau.code ? "true" : undefined}
                            className={`inline-flex min-h-[40px] items-center rounded-full border px-3 text-sm font-semibold ${
                              s.code === creneau.code ? "border-teal-500 bg-teal-50 text-teal-700" : "border-mist bg-white text-ink-soft hover:border-teal-300"
                            }`}
                          >
                            {new Date(`${s.debut}T12:00:00Z`).toLocaleDateString("fr-FR", { day: "numeric", month: "short", timeZone: "Europe/Paris" })}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  <p className="mt-4 text-sm">
                    <Link href="/planning" className="font-semibold text-teal-700 underline">Changer de formation</Link>
                    {" · "}
                    <Link href={f.href} className="font-semibold text-teal-700 underline">Voir le programme</Link>
                  </p>
                </div>
              </div>
            ) : (
              <div className="verre-clair rounded-2xl border border-mist p-6">
                <p className="font-display text-lg font-extrabold text-ink">Pas encore choisi vos dates ?</p>
                <p className="mt-2 text-sm text-ink-soft">
                  Chaque mois : Analyse de données, Création de contenu, Marketing, puis La Forge IA.
                </p>
                <Link href="/planning" className="bouton-neon mt-4 inline-flex min-h-[48px] items-center rounded-full px-5 font-bold">
                  Voir le planning
                </Link>
              </div>
            )}
          </aside>

          <ol className="space-y-3 lg:col-start-1 lg:row-start-2">
              {ETAPES.map((e, i) => (
                <li key={e.title} className="flex gap-3 rounded-2xl border border-mist bg-white p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white">{i + 1}</span>
                  <div>
                    <p className="font-display font-bold text-ink">{e.title}</p>
                    <p className="text-sm text-ink-soft">{e.body}</p>
                  </div>
                </li>
              ))}
          </ol>

          {/* ── Le formulaire ───────────────────────────────────────────────── */}
          <div className="rounded-3xl border border-mist bg-white p-6 shadow-card md:p-10 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start">
            <h2 className="font-display text-2xl font-extrabold text-ink">
              {f ? `Ma demande d'inscription · ${f.nom}` : "Ma demande d'inscription"}
            </h2>
            <p className="mt-1 text-sm text-ink-soft">Deux minutes. Aucun paiement à cette étape.</p>
            <div className="mt-6">
              {data ? (
                <InscriptionForm
                  // La clé remonte le formulaire quand la semaine change : la présélection suit le clic.
                  key={creneau?.code ?? "sans-choix"}
                  programmes={data.programmes.map((p) => ({ id: p.id, title: p.title }))}
                  consentText={data.consent_text}
                  defaultProgramId={programmeId}
                  choix={choix}
                  sessionId={sessionId}
                />
              ) : (
                <div className="py-8 text-center">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                    <ShieldCheck size={24} />
                  </span>
                  <h3 className="mt-5 font-display text-xl font-bold text-ink">Réservez avec un conseiller</h3>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
                    Notre formulaire est momentanément indisponible. Écrivez-nous : votre demande est notée dans la journée.
                  </p>
                  <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Button href="/contact" size="md">Réserver avec un conseiller</Button>
                    <Button href="/planning" variant="outline" size="md">Voir le planning</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
