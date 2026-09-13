import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { TunnelReservation } from "@/components/forms/TunnelReservation";
import { BreadcrumbJsonLd, CourseJsonLd } from "@/components/seo/JsonLd";
import { venteOuverte } from "@/lib/stripe";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Réserver la Formation IA 360 — 1 300 € la place, paiement sécurisé",
  description:
    "Réservez votre place à la Formation IA 360 en deux minutes : paiement en ligne pour les entreprises, 0 € aujourd'hui et paiement en trois fois pour les particuliers, devis OPCO ou France Travail.",
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
        title={<>Votre place, <span className="texte-lumiere">en deux minutes</span></>}
        subtitle="Choisissez votre situation, validez, et c'est réservé."
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
