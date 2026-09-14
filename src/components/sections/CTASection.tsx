"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fadeUp, viewportOnce } from "@/lib/animations";

import { ChampNeuronal } from "@/components/visuel/ChampNeuronal";

export function CTASection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container-page">
        <motion.div
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
          className="fond-espace relative overflow-hidden rounded-3xl"
        >
          <div aria-hidden className="grille-tech pointer-events-none absolute inset-0" />
          <ChampNeuronal className="pointer-events-none absolute inset-0 h-full w-full opacity-60" />
          <div className="relative grid items-center gap-10 p-8 md:p-14 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <h2 className="font-display text-display-md font-extrabold text-white text-balance">
                Votre prochaine semaine peut <span className="texte-lumiere">tout changer</span>.
              </h2>
              <p className="mt-4 max-w-xl text-white/70">
                Data, contenus, marketing ou IA : 21 heures en direct, douze places par session. Choisissez
                votre semaine — la réservation est gratuite, sans engagement, et un conseiller vous confirme
                tout sous 48 heures ouvrées.
              </p>
            </div>
            <div className="verre rounded-2xl p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/55">4 formations 360 · chaque mois</p>
              <p className="mt-1 font-display text-5xl font-extrabold text-white">Dès 1 200 €</p>
              <p className="text-sm text-white/65">par place · OPCO ou France Travail possible</p>
              <Link href="/planning" className="bouton-neon mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 font-bold">
                Je réserve ma semaine <ArrowRight size={18} aria-hidden />
              </Link>
              <Link href="/contact" className="mt-3 block text-center text-sm font-semibold text-white/75 hover:text-white">
                Poser une question
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
