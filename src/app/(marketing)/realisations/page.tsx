import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { CTASection } from "@/components/sections/CTASection";
import { getRealisations } from "@/lib/sanity/queries";
import { urlForImage } from "@/lib/sanity/image";

export const metadata: Metadata = {
  title: "Réalisations",
  description:
    "Découvrez les parcours de formation et dispositifs déployés par HBS FORMATION pour les entreprises et les apprenants.",
};

export const revalidate = 60;

export default async function RealisationsPage() {
  const realisations = await getRealisations();

  return (
    <>
      <PageHeader
        eyebrow="Réalisations"
        title={
          <>
            Des parcours qui <span className="text-gold-gradient">font la différence</span>
          </>
        }
        subtitle="Une sélection de dispositifs de formation conçus et déployés avec nos partenaires."
      />

      <section className="py-[var(--section-padding)] pt-8">
        <div className="container-luxury">
          {realisations.length === 0 ? (
            <Reveal>
              <GlassCard className="mx-auto max-w-xl p-12 text-center">
                <h2 className="font-display text-2xl font-semibold">Bientôt en ligne</h2>
                <p className="mt-4 text-white/60">
                  Nos premières réalisations seront publiées ici très prochainement. En attendant,
                  parlons de votre projet.
                </p>
                <div className="mt-8">
                  <Button href="/contact" size="md">
                    Discutons de votre besoin →
                  </Button>
                </div>
              </GlassCard>
            </Reveal>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {realisations.map((r) => (
                <Reveal key={r._id}>
                  <GlassCard className="group h-full overflow-hidden">
                    {r.coverImage ? (
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={urlForImage(r.coverImage).width(800).height(600).url()}
                          alt={r.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    ) : null}
                    <div className="p-6">
                      {r.category ? (
                        <span className="text-xs uppercase tracking-[0.2em] text-gold">
                          {r.category}
                        </span>
                      ) : null}
                      <h3 className="mt-2 font-display text-xl font-semibold">{r.title}</h3>
                      {r.summary ? (
                        <p className="mt-2 text-sm leading-relaxed text-white/55">{r.summary}</p>
                      ) : null}
                    </div>
                  </GlassCard>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </>
  );
}
