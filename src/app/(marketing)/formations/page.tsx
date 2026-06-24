import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { GlassCard } from "@/components/ui/GlassCard";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { CTASection } from "@/components/sections/CTASection";
import { formations } from "@/lib/site";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Formations — Certifiantes, Bilan de compétences, VAE, Apprentissage",
  description:
    "Découvrez nos formations : parcours certifiants et continus, bilan de compétences, VAE, apprentissage/CFA, e-learning et conseil en ingénierie pédagogique.",
};

export default function FormationsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Nos formations"
        title={
          <>
            Six domaines, <span className="text-gold-gradient">un seul niveau d&apos;exigence</span>
          </>
        }
        subtitle="Présentiel, distanciel ou mixte — des dispositifs adaptés aux particuliers comme aux entreprises."
      />

      <section className="pb-[var(--section-padding)] pt-8">
        <div className="container-luxury space-y-6">
          {formations.map((f, i) => (
            <Reveal key={f.slug}>
              <GlassCard id={f.slug} className="scroll-mt-28 p-8 md:p-12">
                <div className="grid gap-8 md:grid-cols-[auto_1fr] md:gap-12">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gold-muted text-gold">
                    <Icon name={f.icon} size={32} />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-[0.2em] text-gold">
                      0{i + 1} — {f.tagline}
                    </span>
                    <h2 className="mt-2 font-display text-3xl font-semibold">{f.title}</h2>
                    <p className="mt-4 max-w-2xl leading-relaxed text-white/60">{f.description}</p>
                    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                      {f.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2.5 text-sm text-white/70">
                          <Check size={18} className="mt-0.5 shrink-0 text-gold" />
                          {feat}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8">
                      <Button href="/contact" variant="secondary" size="sm">
                        Être recontacté à propos de cette formation
                      </Button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      <CTASection />
    </>
  );
}
