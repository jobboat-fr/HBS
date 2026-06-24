"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { fadeUp, viewportOnce } from "@/lib/animations";
import { media } from "@/lib/site";

export function CTASection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container-page">
        <motion.div
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
          className="overflow-hidden rounded-3xl bg-ink"
        >
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="p-10 md:p-14">
              <h2 className="font-display text-display-md font-extrabold text-white text-balance">
                Prêt à lancer votre projet de formation ?
              </h2>
              <p className="mt-4 text-white/70">
                Échangeons sur vos objectifs et identifions ensemble le parcours et le financement
                adaptés à votre situation. Réponse sous 48 heures.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/contact" size="lg">
                  Demander un devis gratuit
                </Button>
                <Button href="/formations" variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                  Voir les formations
                </Button>
              </div>
            </div>
            <div className="relative hidden h-full min-h-[280px] lg:block">
              <Image
                src={media.ctaImage}
                alt="Équipe en formation professionnelle"
                fill
                sizes="50vw"
                className="object-cover"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
