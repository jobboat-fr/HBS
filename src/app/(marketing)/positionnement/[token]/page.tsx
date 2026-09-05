import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { PositionnementQuiz } from "@/components/forms/PositionnementQuiz";
import { paper, configured, LearnError, type Paper } from "@/lib/learn";

/**
 * Le test de positionnement, atteint par un lien personnel.
 *
 * `noindex` et `no-store` : l'URL contient un jeton d'usage unique. Le laisser entrer dans
 * un index de moteur de recherche ou dans un cache partagé reviendrait à publier une
 * invitation nominative.
 */

export const metadata: Metadata = {
  title: "Test de positionnement",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function PositionnementPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  let data: Paper | null = null;
  let reason: string | null = null;

  if (!configured()) {
    reason = "Le test de positionnement n'est pas encore ouvert.";
  } else {
    try {
      data = await paper(token);
    } catch (e) {
      reason =
        e instanceof LearnError && e.code === "no_positioning_assessment"
          ? "Aucun test de positionnement n'est encore publié pour cette formation. L'organisme vous contactera directement."
          : "Ce lien n'est plus valable — il a peut-être déjà été utilisé, ou il a expiré.";
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Positionnement"
        title={
          data ? (
            <>
              Établissons votre <span className="text-teal-600">niveau de départ</span>
            </>
          ) : (
            <>
              Lien <span className="text-teal-600">non valable</span>
            </>
          )
        }
        subtitle={
          data
            ? "Il n'y a rien à réviser. Ce test sert à vous orienter vers le parcours adapté, pas à vous départager."
            : undefined
        }
      />

      <section className="py-14 lg:py-20">
        <div className="container-page">
          {data ? (
            <PositionnementQuiz
              token={token}
              title={data.title}
              durationMinutes={data.duration_minutes}
              questions={data.questions}
            />
          ) : (
            <div className="mx-auto max-w-xl rounded-3xl border border-mist bg-white p-8 text-center shadow-card md:p-12">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-coral/10 text-coral-dark">
                <AlertTriangle size={24} />
              </span>
              <p className="mt-5 leading-relaxed text-ink-soft">{reason}</p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button href="/preinscription" size="md">
                  Refaire une demande
                </Button>
                <Button href="/contact" variant="outline" size="md">
                  Contacter un conseiller
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
