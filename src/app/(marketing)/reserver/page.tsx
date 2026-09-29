import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { TunnelReservation } from "@/components/forms/TunnelReservation";
import { BreadcrumbJsonLd, CourseJsonLd } from "@/components/seo/JsonLd";
import { venteOuverte } from "@/lib/stripe";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Réserver et payer en ligne — Analyse de données, Création de contenu, Marketing, SPACE AI",
  description:
    "Réservez votre formation en deux minutes : paiement en ligne pour les entreprises, 0 € aujourd'hui et paiement en 3 fois pour les particuliers, devis OPCO ou France Travail.",
  alternates: { canonical: "/reserver" },
};

// L'ouverture de la vente dépend de variables d'environnement lues à l'exécution.
export const dynamic = "force-dynamic";

export default async function ReserverPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { ouverte } = venteOuverte();
  const brut = await searchParams;
  // Lus ici plutôt que par useSearchParams() dans le tunnel : ce dernier suspendait le rendu, le
  // tunnel arrivait en flux après le pied de page et le repoussait sous la ligne de flottaison.
  const un = (k: string) => (typeof brut[k] === "string" ? (brut[k] as string) : undefined);
  const demande = { formation: un("formation"), session: un("session"), profil: un("profil"), annule: un("annule") };
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", url: site.url },
          { name: "Réserver", url: `${site.url}/reserver` },
        ]}
      />
      <CourseJsonLd />
      <PageHeader
        eyebrow="Réservation"
        title={<>C&apos;est réservé <span className="texte-lumiere">en deux minutes</span></>}
        subtitle="Choisissez votre formation et vos dates, validez : c'est réservé."
      />
      <section className="bg-cloud py-10 lg:py-16">
        <div className="container-page">
          <TunnelReservation ouverte={ouverte} demande={demande} />
        </div>
      </section>
    </>
  );
}
