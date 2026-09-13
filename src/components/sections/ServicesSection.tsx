"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, Clock } from "lucide-react";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { formations, tarif, annonce, certificat } from "@/lib/site";

/**
 * L'offre : une formation disponible, les autres annoncées.
 *
 * La Formation IA 360 occupe toute la largeur, dans son cadre néon. Les autres produits
 * restent visibles — un visiteur qui cherchait un bilan de compétences doit comprendre
 * qu'il arrive, pas conclure qu'il s'est trompé de site — mais en verre dépoli, sans lien
 * ni promesse de date.
 */
export function ServicesSection() {
  const ia = formations.find((f) => f.disponible)!;
  const bientot = formations.filter((f) => !f.disponible);

  return (
    <section id="formations" className="bg-cloud py-20 lg:py-28">
      <div className="container-page">
        <motion.div variants={fadeUp} initial="initial" whileInView="animate" viewport={viewportOnce} className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-teal-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-teal-700">
            Notre formation
          </span>
          <h2 className="mt-5 font-display text-display-lg font-extrabold text-ink text-balance">
            Une formation, <span className="text-teal-600">faite pour agir</span>
          </h2>
        </motion.div>

        <motion.div variants={fadeUp} initial="initial" whileInView="animate" viewport={viewportOnce} className="cadre-neon mt-12">
          <div className="grid overflow-hidden rounded-2xl lg:grid-cols-[1.3fr_1fr]">
            <div className="p-8 md:p-10">
              <p className="text-xs font-bold uppercase tracking-widest text-red-600">Disponible · session du {annonce.dateLisible}</p>
              <h3 className="mt-3 font-display text-3xl font-extrabold text-ink md:text-4xl">{ia.title}</h3>
              <p className="mt-2 font-semibold text-teal-700">{ia.tagline}</p>
              <p className="mt-5 max-w-2xl leading-relaxed text-ink-soft">{ia.description}</p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {ia.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-ink-soft">
                    <Check size={18} className="mt-0.5 shrink-0 text-red-500" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="fond-espace relative flex flex-col justify-between gap-8 p-8 md:p-10">
              <div aria-hidden className="grille-tech pointer-events-none absolute inset-0" />
              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/55">Votre place</p>
                <p className="mt-2 font-display text-6xl font-extrabold text-white">{tarif.montant}</p>
                <p className="mt-1 text-sm text-white/70">{tarif.resume}</p>
                <p className="mt-4 text-xs text-white/50">{certificat.nom} délivré par HBS FORMATION.</p>
              </div>
              <div className="relative flex flex-col gap-3">
                <Link href="/preinscription" className="bouton-neon inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 font-bold">
                  Réserver ma place <ArrowRight size={18} aria-hidden />
                </Link>
                <Link href="/formations#programme" className="verre inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">
                  Découvrir le programme
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-16">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-ink-muted">Bientôt disponible</p>
          <motion.ul variants={staggerContainer} initial="initial" whileInView="animate" viewport={viewportOnce} className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {bientot.map((f) => (
              <motion.li key={f.slug} variants={fadeUp} className="verre-clair rounded-2xl p-5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold text-ink-muted ring-1 ring-mist">
                  <Clock size={12} aria-hidden /> Bientôt
                </span>
                <h3 className="mt-3 font-display text-base font-bold leading-snug text-ink">{f.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">{f.description}</p>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
