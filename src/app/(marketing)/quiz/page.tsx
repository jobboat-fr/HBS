import type { Metadata } from "next";
import { ClipboardList, ArrowRight, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Quiz de positionnement",
  description:
    "Le quiz de positionnement HBS FORMATION arrive bientôt. En attendant, parlez de votre projet à un conseiller ou explorez nos formations.",
  robots: { index: false },
};

export default function QuizPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", url: site.url },
          { name: "Quiz de positionnement", url: `${site.url}/quiz` },
        ]}
      />
      <PageHeader
        eyebrow="Quiz de positionnement"
        title={
          <>
            Bientôt disponible <span className="text-teal-600">chez HBS FORMATION</span>
          </>
        }
        subtitle="Nous préparons un quiz de positionnement pour évaluer votre niveau et vous orienter vers le parcours le plus adapté."
      />

      <section className="py-16 lg:py-24">
        <div className="container-page">
          <Reveal>
            <div className="mx-auto max-w-2xl rounded-3xl border border-mist bg-white p-8 text-center shadow-card md:p-12">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                <ClipboardList size={28} />
              </span>
              <h2 className="mt-6 font-display text-2xl font-bold text-ink">
                Cette fonctionnalité arrive bientôt
              </h2>
              <p className="mt-3 leading-relaxed text-ink-soft">
                Le quiz de positionnement est en cours de préparation : il vous prendra une dizaine de
                minutes et déterminera votre niveau pour orienter votre parcours. En attendant sa mise
                en ligne, un conseiller peut faire ce point avec vous directement.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button href="/contact" size="md">
                  Parler à un conseiller <ArrowRight size={16} />
                </Button>
                <Button href="/formations" variant="outline" size="md">
                  Découvrir les formations
                </Button>
              </div>

              <p className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-ink-muted">
                <Sparkles size={14} className="text-teal-500" /> Nous vous préviendrons dès son
                ouverture.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
