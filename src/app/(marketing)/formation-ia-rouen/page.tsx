import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, MapPin, UserRound, Briefcase } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { CTASection } from "@/components/sections/CTASection";
import { BreadcrumbJsonLd, CourseJsonLd } from "@/components/seo/JsonLd";
import { site, legal, tarif, annonce } from "@/lib/site";

export const metadata: Metadata = {
  title: "Formation IA à Rouen et en Normandie — organisme certifié Qualiopi",
  description:
    "Formation intelligence artificielle à Rouen : la Formation IA 360 de HBS FORMATION, en direct à distance ou dans votre entreprise en Normandie. 21 h, outils IA inclus, 1 300 € la place, OPCO et France Travail.",
  alternates: { canonical: "/formation-ia-rouen" },
};

const publics = [
  {
    icon: Building2,
    titre: "Entreprises normandes",
    texte: "Vos équipes formées sur leurs propres processus, à distance ou en présentiel dans vos locaux à Rouen, au Havre, à Évreux ou à Caen. Financement OPCO possible.",
    lien: { href: "/reserver?profil=entreprise", label: "Réserver des places" },
  },
  {
    icon: UserRound,
    titre: "Indépendants et particuliers",
    texte: "Une place à titre personnel, rien de prélevé pendant 14 jours, puis un paiement en trois fois. Vous repartez avec vos outils IA en place.",
    lien: { href: "/reserver?profil=particulier", label: "Réserver ma place" },
  },
  {
    icon: Briefcase,
    titre: "Demandeurs d'emploi",
    texte: "Une prise en charge France Travail est possible si la formation s'inscrit dans votre projet. Le moteur de recherche d'emploi automatisé est inclus.",
    lien: { href: "/preinscription", label: "Demander un devis" },
  },
];

export default function RouenPage() {
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
        title={<>La formation IA <span className="texte-lumiere">née à Rouen</span></>}
        subtitle="HBS FORMATION est un organisme de formation rouennais, certifié Qualiopi, dédié à l'intelligence artificielle appliquée au travail."
      />

      <section className="py-14 lg:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-5 text-[15px] leading-relaxed text-ink-soft">
            <h2 className="font-display text-display-md font-extrabold text-ink">Une formation IA concrète, près de chez vous</h2>
            <p>
              La <b>Formation IA 360</b> part de votre activité réelle : trois journées, six ateliers pratiques,
              et un cas de votre entreprise traité de bout en bout — de la compréhension des outils à leur
              déploiement fiable, dans le respect du RGPD et du règlement européen sur l&apos;IA.
            </p>
            <p>
              Les sessions se suivent <b>en direct à distance</b>, depuis Rouen comme depuis toute la France.
              Pour une équipe, la formation peut être organisée <b>en présentiel dans vos locaux</b>, partout
              en Normandie.
            </p>
            <p>
              Chaque place comprend les outils IA qui continuent de travailler après la formation : agents IA,
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
              <p className="text-xs font-bold uppercase tracking-widest text-red-600">Prochaine session</p>
              <p className="mt-2 font-display text-3xl font-extrabold text-ink">{annonce.dateLisible}</p>
              <p className="mt-4 font-display text-5xl font-extrabold text-ink">{tarif.montant}</p>
              <p className="text-sm text-ink-soft">{tarif.unite} · 21 h · outils IA inclus</p>
              <Link href="/reserver" className="bouton-neon mt-6 flex min-h-[48px] items-center justify-center gap-2 rounded-full px-6 font-bold">
                Réserver ma place <ArrowRight size={18} aria-hidden />
              </Link>
              <Link href="/formations" className="mt-3 block text-center text-sm font-semibold text-teal-700 underline">
                Voir le programme détaillé
              </Link>
            </div>
          </aside>
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
