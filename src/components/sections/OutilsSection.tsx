"use client";

import { motion } from "framer-motion";
import { Bot, Workflow, SearchCheck, FileText, Video, Plus } from "lucide-react";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { outilsInclus, tarif } from "@/lib/site";

const ICONES = [Bot, Workflow, SearchCheck, FileText, Video, Plus];

/**
 * Ce que contient le forfait La Forge IA au-delà des 21 heures.
 *
 * C'est l'argument qui distingue cette formation d'une formation sur l'IA : on n'y apprend
 * pas seulement à s'en servir, on repart avec des outils qui travaillent déjà.
 */
export function OutilsSection() {
  return (
    <section className="fond-espace relative overflow-hidden py-20 lg:py-28">
      <div aria-hidden className="grille-tech pointer-events-none absolute inset-0" />
      <div className="container-page relative">
        <motion.div variants={fadeUp} initial="initial" whileInView="animate" viewport={viewportOnce} className="mx-auto max-w-2xl text-center">
          <span className="verre inline-flex rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/85">
            La Forge IA · inclus dans votre forfait
          </span>
          <h2 className="mt-5 font-display text-display-lg font-extrabold text-white text-balance">
            Vous ne repartez pas avec des notes.{" "}
            <span className="texte-lumiere">Vous repartez équipé.</span>
          </h2>
          <p className="mt-4 text-white/70">
            Pour {tarif.montant}, la formation et une boîte à outils IA déjà prête à travailler pour vous.
          </p>
        </motion.div>

        <motion.ul variants={staggerContainer} initial="initial" whileInView="animate" viewport={viewportOnce} className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {outilsInclus.map((o, i) => {
            const Icone = ICONES[i] ?? Plus;
            return (
              <motion.li key={o.titre} variants={fadeUp} className="verre group rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#2e5fe0] to-[#22d3ee] text-white shadow-[0_8px_24px_-8px_rgba(34,211,238,0.6)]">
                  <Icone size={22} strokeWidth={1.8} aria-hidden />
                </span>
                <h3 className="mt-5 text-lg font-bold text-white">{o.titre}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{o.texte}</p>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
