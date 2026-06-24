"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { fadeUp, viewportOnce } from "@/lib/animations";

export function CTASection() {
  return (
    <section className="relative py-[var(--section-padding)]">
      <div className="container-luxury">
        <motion.div
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
          className="relative overflow-hidden rounded-3xl border border-gold/20 bg-gradient-to-br from-gold-muted to-transparent p-12 text-center md:p-20"
        >
          <div className="absolute inset-0 bg-hero-radial opacity-60" />
          <div className="relative z-10 mx-auto max-w-2xl">
            <h2 className="font-display text-display-lg font-semibold text-balance">
              Prêt à construire votre <span className="text-gold-gradient">projet de formation</span> ?
            </h2>
            <p className="mt-5 text-white/60">
              Échangeons sur vos objectifs et identifions ensemble le parcours et le financement
              adaptés à votre situation.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Button href="/contact" size="lg">
                Demander un devis gratuit →
              </Button>
              <Button href="/formations" variant="secondary" size="lg">
                Voir toutes les formations
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
