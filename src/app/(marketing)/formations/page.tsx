import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { CTASection } from "@/components/sections/CTASection";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { formations, media, site, annonce, certificat } from "@/lib/site";

export const metadata: Metadata = {
  title: "Formations — IA 360, Certifiantes, Bilan de compétences, VAE",
  description:
    "Découvrez nos formations : formation IA 360, parcours certifiants et continus, bilan de compétences, VAE, e-learning et conseil en ingénierie pédagogique.",
};

export default function FormationsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", url: site.url },
          { name: "Formations", url: `${site.url}/formations` },
        ]}
      />
      <PageHeader
        eyebrow="Nos formations"
        title={
          <>
            Six domaines, <span className="text-teal-600">un seul niveau d&apos;exigence</span>
          </>
        }
        subtitle="Présentiel, distance ou mixte — des dispositifs adaptés aux particuliers comme aux entreprises."
      />

      <section className="py-16 lg:py-24">
        <div className="container-page space-y-8">
          {formations.map((f, i) => (
            <Reveal key={f.slug}>
              <article
                id={f.slug}
                className={
                  f.slug === "ia-360"
                    ? "cadre-neon scroll-mt-28"
                    : "grid scroll-mt-28 overflow-hidden rounded-3xl border border-mist bg-white shadow-card md:grid-cols-2"
                }
              >
              <div className={f.slug === "ia-360" ? "grid overflow-hidden md:grid-cols-2" : "contents"}>
                <div className={`relative min-h-[240px] ${i % 2 === 1 ? "md:order-2" : ""}`}>
                  <Image
                    src={media.formationImages[f.slug]}
                    alt={f.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-8 md:p-12">
                  <span className="text-sm font-semibold text-teal-600">
                    0{i + 1} — {f.tagline}
                  </span>
                  <h2 className="mt-2 font-display text-2xl font-bold text-ink md:text-3xl">{f.title}</h2>
                  <p className="mt-4 leading-relaxed text-ink-soft">{f.description}</p>
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {f.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-sm text-ink-soft">
                        <Check size={18} className="mt-0.5 shrink-0 text-teal-500" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    {f.slug === "ia-360" ? (
                      <>
                        <Link
                          href="/preinscription"
                          className="inline-flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                        >
                          Réserver ma place — session du {annonce.dateLisible}
                          <ArrowRight size={17} aria-hidden />
                        </Link>
                        <Button href="/contact" size="sm" variant="outline">
                          Poser une question
                        </Button>
                      </>
                    ) : (
                      <Button href="/contact" size="sm">
                        Demander des informations
                      </Button>
                    )}
                  </div>

                  {f.slug === "ia-360" && (
                    <p className="mt-6 border-t border-mist pt-4 text-xs leading-relaxed text-ink-muted">
                      <strong className="text-ink-soft">{certificat.nom}</strong> — {certificat.obtention}.{" "}
                      {certificat.precision}
                    </p>
                  )}
                </div>
              </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <CTASection />
    </>
  );
}
