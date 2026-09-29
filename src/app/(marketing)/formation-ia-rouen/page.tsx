import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, MapPin, UserRound, Briefcase } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { CTASection } from "@/components/sections/CTASection";
import { BreadcrumbJsonLd, CourseJsonLd } from "@/components/seo/JsonLd";
import { site, legal } from "@/lib/site";
import { FORMATIONS, ORDRE, PACK, dateCourte, duree, dureeCourte, euros, prochaineSession } from "@/lib/commande";

export const metadata: Metadata = {
  title: "Formation IA, marketing et data à Rouen, en présentiel",
  description:
    "Formations en présentiel à Rouen (Seine-Maritime) : SPACE AI (IA, 3 jours), Marketing (3 jours), Création de contenu (5 jours), Analyse de données (5 jours). Accessibles depuis Le Havre, Évreux et Paris ; à distance sur demande. OPCO et France Travail.",
  alternates: { canonical: "/formation-ia-rouen" },
};

/**
 * D'où l'on vient se former, dans l'ordre de ce que les gens tapent réellement.
 *
 * Relevé du 29/09/2026 (autocomplétion Google, fr-FR) : « formation … paris » renvoie le plus de
 * requêtes, puis Rouen et Île-de-France, Le Havre, Versailles, Évreux. Les numéros de département
 * (76, 27, 78) ne sont jamais tapés : on les cite pour situer, on ne les vise pas. Une seule page,
 * pas une par ville — des pages quasi identiques par ville sont des pages satellites.
 * Les temps de trajet sont des ordres de grandeur, et le disent (« environ »).
 */
const acces = [
  { zone: "Rouen et la Métropole", dep: "Seine-Maritime (76)", trajet: "Sur place : nos locaux sont au cœur de Rouen." },
  { zone: "Paris et l'Île-de-France", dep: "Paris (75) et petite couronne", trajet: "Environ 1 h 15 depuis Paris-Saint-Lazare, en train direct." },
  { zone: "Le Havre et le littoral", dep: "Seine-Maritime (76)", trajet: "Environ 1 h de train jusqu'à Rouen." },
  { zone: "Versailles et les Yvelines", dep: "Yvelines (78)", trajet: "Environ 1 h 30 par l'A13." },
  { zone: "Évreux, Vernon et l'Eure", dep: "Eure (27)", trajet: "Environ 50 minutes de route depuis Évreux." },
];

const publics = [
  {
    icon: Building2,
    titre: "Entreprises normandes",
    texte: "Vos équipes formées sur leurs propres processus, dans nos locaux à Rouen ou dans les vôtres — au Havre, à Évreux, à Caen. Financement OPCO possible.",
    lien: { href: "/reserver?profil=entreprise", label: "Inscrire mon équipe" },
  },
  {
    icon: UserRound,
    titre: "Indépendants et particuliers",
    texte: "À titre personnel : rien de prélevé pendant 14 jours, puis un paiement en 3 fois. En 3 jours, vous changez déjà votre façon de travailler.",
    lien: { href: "/reserver", label: "Je réserve" },
  },
  {
    icon: Briefcase,
    titre: "Demandeurs d'emploi",
    texte: "Une prise en charge France Travail est possible si la formation s'inscrit dans votre projet. Avec SPACE AI, le moteur de recherche d'emploi automatisé est inclus.",
    lien: { href: "/preinscription", label: "Demander un devis" },
  },
];

export const revalidate = 3600;

export default function RouenPage() {
  const s = prochaineSession("IA360");
  const ia = FORMATIONS.IA360;
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", url: site.url },
          { name: "Formation IA à Rouen", url: `${site.url}/formation-ia-rouen` },
        ]}
      />
      <CourseJsonLd />

      <PageHeader
        eyebrow="Rouen · Normandie"
        title={<>Se former à Rouen, <span className="texte-lumiere">pour prendre de l&apos;avance</span></>}
        subtitle="HBS FORMATION, organisme rouennais certifié Qualiopi : 4 formations courtes, en présentiel, pour lire votre marché, créer, vendre et mettre l'IA au travail."
      />

      <section className="py-14 lg:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-5 text-[15px] leading-relaxed text-ink-soft">
            <h2 className="font-display text-display-md font-extrabold text-ink">Des formations concrètes, près de chez vous</h2>
            <ul className="space-y-1.5">
              {ORDRE.map((c) => (
                <li key={c}>
                  <Link href={FORMATIONS[c].href} className="font-bold text-ink hover:underline">{FORMATIONS[c].nom}</Link> · {dureeCourte(FORMATIONS[c])} · {euros(FORMATIONS[c].prix)}
                </li>
              ))}
              <li>
                <Link href={PACK.href} className="font-bold text-ink hover:underline">{PACK.nom}</Link> · les 4 · {euros(PACK.prix)}
              </li>
            </ul>
            <p>
              <b>SPACE AI</b> part de votre activité réelle : 21 heures en 3 jours, et un cas de votre entreprise
              traité de bout en bout — de la compréhension des outils à leur déploiement fiable, dans le respect du
              RGPD et du règlement européen sur l&apos;IA.
            </p>
            <p>
              Les sessions ont lieu <b>en présentiel, dans nos locaux au cœur de Rouen</b> : douze participants
              au plus, un formateur à vos côtés, vos dossiers sur la table. Si vous ne pouvez pas vous déplacer,
              chaque formation se suit aussi <b>à distance, sur demande</b>. Pour une équipe, nous venons
              dans vos locaux, partout en Normandie.
            </p>
            <p>
              Avec SPACE AI, votre forfait inclut les outils IA qui continuent de travailler après la formation : agents IA,
              automatisations, assistance au secrétariat, assistant de réunion et moteur de recherche
              d&apos;emploi automatisé.
            </p>
            <div className="flex items-start gap-3 rounded-2xl border border-mist bg-cloud p-5">
              <MapPin size={20} className="mt-0.5 shrink-0 text-teal-600" aria-hidden />
              <p className="text-sm">
                <b className="text-ink">{legal.raisonSociale}</b> — {legal.siege}
                <br />
                Déclaration d&apos;activité n° {legal.numeroDeclarationActivite} · certifié Qualiopi ({legal.qualiopiCategorie})
              </p>
            </div>
          </div>

          <aside className="cadre-neon self-start">
            <div className="p-7">
              <p className="text-xs font-bold uppercase tracking-widest text-red-600">{ia.nom} · prochaine session</p>
              <p className="mt-2 font-display text-3xl font-extrabold text-ink">{s ? dateCourte(s.debut) : "Dates à venir"}</p>
              <p className="mt-4 font-display text-5xl font-extrabold text-ink">{euros(ia.prix)}</p>
              <p className="text-sm text-ink-soft">TTC · {duree(ia)} · outils IA inclus dans votre forfait</p>
              <Link href={s ? `/reserver?formation=IA360&session=${s.code}` : "/reserver?formation=IA360"} className="bouton-neon mt-6 flex min-h-[48px] items-center justify-center gap-2 rounded-full px-6 font-bold">
                Je réserve <ArrowRight size={18} aria-hidden />
              </Link>
              <Link href="/formations" className="mt-3 block text-center text-sm font-semibold text-teal-700 underline">
                Voir le programme détaillé
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="py-14 lg:py-20">
        <div className="container-page">
          <h2 className="font-display text-display-md font-extrabold text-ink">
            Venir se former à Rouen, <span className="text-teal-600">d&apos;où que vous partiez</span>
          </h2>
          <p className="mt-3 max-w-2xl text-ink-soft">
            Rouen est à mi-chemin entre Paris et la mer : une journée de formation ici, c&apos;est une journée
            gagnée sur tout le reste.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {acces.map((a) => (
              <li key={a.zone} className="verre-clair rounded-2xl border border-mist p-5">
                <p className="font-display text-lg font-bold text-ink">{a.zone}</p>
                <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted">{a.dep}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{a.trajet}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-cloud py-14 lg:py-20">
        <div className="container-page">
          <h2 className="font-display text-display-md font-extrabold text-ink">Pour qui ?</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {publics.map(({ icon: I, titre, texte, lien }) => (
              <div key={titre} className="verre-clair flex flex-col rounded-2xl border border-mist p-6">
                <I size={26} className="text-teal-600" aria-hidden />
                <h3 className="mt-4 font-display text-lg font-bold text-ink">{titre}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{texte}</p>
                <Link href={lien.href} className="mt-5 inline-flex min-h-[44px] items-center gap-2 font-semibold text-teal-700">
                  {lien.label} <ArrowRight size={16} aria-hidden />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
