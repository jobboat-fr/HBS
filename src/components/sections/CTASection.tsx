"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fadeUp, viewportOnce } from "@/lib/animations";
import { annonce, tarif } from "@/lib/site";
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
                Dans trois journées, l&apos;IA travaille <span className="texte-lumiere">pour vous</span>.
              </h2>
              <p className="mt-4 max-w-xl text-white/70">
                Prochaine session le {annonce.dateLisible}, douze places au plus. Réservez la vôtre :
                un conseiller vous rappelle sous 48 heures ouvrées.
              </p>
            </div>
            <div className="verre rounded-2xl p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/55">Formation IA 360</p>
              <p className="mt-1 font-display text-5xl font-extrabold text-white">{tarif.montant}</p>
              <p className="text-sm text-white/65">{tarif.unite} · formation et outils IA inclus</p>
              <Link href="/reserver" className="bouton-neon mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 font-bold">
                Réserver ma place <ArrowRight size={18} aria-hidden />
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
