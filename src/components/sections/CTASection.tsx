"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fadeUp, viewportOnce } from "@/lib/animations";
import { FORMATIONS, ORDRE, PACK, euros } from "@/lib/commande";

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
                N&apos;attendez pas que <span className="texte-lumiere">les autres s&apos;y mettent</span>.
              </h2>
              <p className="mt-4 max-w-xl text-white/70">
                12 places par session, et elles partent vite. Réservez en deux minutes : à titre personnel, rien n&apos;est
                prélevé pendant vos 14 jours de rétractation.
              </p>
            </div>
            <div className="verre rounded-2xl p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/55">4 formations · chaque mois</p>
              <ul className="mt-3 space-y-1.5 text-sm">
                {ORDRE.map((c) => (
                  <li key={c} className="flex items-baseline justify-between gap-3 text-white/80">
                    <span>{FORMATIONS[c].nom}</span>
                    <b className="whitespace-nowrap text-white">{euros(FORMATIONS[c].prix)}</b>
                  </li>
                ))}
                <li className="flex items-baseline justify-between gap-3 border-t border-white/15 pt-1.5 text-white">
                  <span className="font-semibold">Pack 360 · les 4</span>
                  <b className="whitespace-nowrap text-cyan-200">{euros(PACK.prix)}</b>
                </li>
              </ul>
              <p className="mt-2 text-xs text-white/55">TTC · OPCO ou France Travail possible</p>
              <Link href="/planning" className="bouton-neon mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 font-bold">
                Je réserve maintenant <ArrowRight size={18} aria-hidden />
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
