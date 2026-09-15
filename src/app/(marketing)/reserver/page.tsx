import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { TunnelReservation } from "@/components/forms/TunnelReservation";
import { BreadcrumbJsonLd, CourseJsonLd } from "@/components/seo/JsonLd";
import { venteOuverte } from "@/lib/stripe";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Réserver et payer en ligne — Analyse de données, Création de contenu, Marketing, La Forge IA",
  description:
    "Réservez votre formation en deux minutes : paiement en ligne pour les entreprises, 0 € aujourd'hui et paiement en 3 fois pour les particuliers, devis OPCO ou France Travail.",
  alternates: { canonical: "/reserver" },
};

// L'ouverture de la vente dépend de variables d'environnement lues à l'exécution.
export const dynamic = "force-dynamic";

export default function ReserverPage() {
  const { ouverte } = venteOuverte();
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
          <Suspense>
            <TunnelReservation ouverte={ouverte} />
          </Suspense>
        </div>
      </section>
    </>
  );
}
