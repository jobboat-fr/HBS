import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { CTASection } from "@/components/sections/CTASection";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/JsonLd";
import { faqComplete, toutesLesQuestions } from "@/lib/faq";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ Formation IA — tarif, financement OPCO, France Travail, programme",
  description:
    "Toutes les réponses sur nos 4 formations et le Pack 360 : durées, prix, paiement en 3 fois, financement OPCO et France Travail, rétractation, outils IA inclus, AI Act.",
  alternates: { canonical: "/faq" },
};

/**
 * La FAQ en `<details>` et non en accordéon piloté par JavaScript : chaque réponse est dans le
 * HTML servi, lisible par un moteur ou un agent sans exécuter la page, et le balisage FAQPage
 * décrit exactement ce que la page affiche.
 */
export default function FaqPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", url: site.url },
          { name: "FAQ", url: `${site.url}/faq` },
        ]}
      />
      <FaqJsonLd questions={toutesLesQuestions} />

      <PageHeader
        eyebrow="Questions fréquentes"
        title={<>Vos questions, <span className="texte-lumiere">nos réponses</span></>}
        subtitle="Programme, outils inclus, tarif, financement, inscription : les réponses, sans détour."
      />

      <section className="bg-cloud py-14 lg:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[220px_1fr]">
          <nav aria-label="Thèmes" className="hidden lg:block">
            <ul className="sticky top-[calc(var(--entete)+1.5rem)] space-y-1 text-sm">
              {faqComplete.map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`} className="block rounded-lg px-3 py-2 font-medium text-ink-soft hover:bg-white hover:text-teal-700">
                    {t.titre}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-12">
            {faqComplete.map((t) => (
              <section key={t.id} id={t.id} className="scroll-mt-[calc(var(--entete)+1rem)]">
                <h2 className="font-display text-2xl font-extrabold text-ink">{t.titre}</h2>
                <div className="verre-clair mt-5 divide-y divide-mist overflow-hidden rounded-2xl border border-mist">
                  {t.questions.map((f) => (
                    <details key={f.q} className="group">
                      <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-display text-base font-bold text-ink marker:hidden [&::-webkit-details-marker]:hidden">
                        {f.q}
                        <Plus size={20} aria-hidden className="shrink-0 text-teal-600 transition-transform group-open:rotate-45" />
                      </summary>
                      <p className="px-5 pb-5 text-sm leading-relaxed text-ink-soft">{f.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            ))}

            <div className="rounded-2xl border border-mist bg-white p-6 text-sm text-ink-soft">
              Les conditions de paiement, de rétractation et d&apos;annulation font foi dans nos{" "}
              <Link href="/cgv" className="font-semibold text-teal-700 underline">conditions générales de vente</Link>.
              Une autre question ?{" "}
              <Link href="/contact" className="inline-flex items-center gap-1 font-semibold text-teal-700 underline">
                Écrivez-nous <ArrowRight size={14} aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
