"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays } from "lucide-react";
import { ChampNeuronal } from "@/components/visuel/ChampNeuronal";
import { ConsoleAgent } from "@/components/visuel/ConsoleAgent";

/** La prochaine session, calculée côté serveur et passée au héros (composant client). */
export type ProchaineSession = { nom: string; iso: string; date: string; href: string } | null;

/**
 * Le héros : une promesse courte, les quatre formations au même niveau, la prochaine date.
 * La console montre un agent à l'œuvre — l'un des outils d'IA 360, pas le sujet unique.
 */
export function HeroSection({ prochaine }: { prochaine: ProchaineSession }) {
  return (
    <section className="fond-espace relative overflow-hidden pt-[var(--entete)]">
      <div aria-hidden className="grille-tech pointer-events-none absolute inset-0" />
      <ChampNeuronal className="pointer-events-none absolute inset-0 h-full w-full opacity-80" />

      <div className="container-page relative flex flex-col items-center gap-12 py-14 text-center lg:py-24">
        <motion.div
          initial={{ y: 14 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex max-w-4xl flex-col items-center"
        >
          {prochaine ? (
            <Link
              href={prochaine.href}
              className="verre inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-white/90 transition hover:text-white"
            >
              <CalendarDays size={14} className="text-cyan-300" aria-hidden />
              <span>
                Prochaine session : {prochaine.nom} · <time dateTime={prochaine.iso}>{prochaine.date}</time>
              </span>
            </Link>
          ) : null}

          <h1 className="mt-6 font-display text-[2.6rem] font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Des compétences qui comptent,
            <br />
            <span className="texte-lumiere">dès la semaine prochaine.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75">
            Analyse de données, Création de contenu, Marketing, IA 360 : 4 formations courtes, en direct, pour
            gagner du temps et prendre de l&apos;avance pendant que les autres hésitent. En 3 jours, votre carrière peut
            déjà changer.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
            <Link
              href="/#formations"
              className="bouton-neon inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-base font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Je choisis ma formation
              <ArrowRight size={18} aria-hidden />
            </Link>
            <Link
              href="/planning"
              className="verre inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-base font-semibold text-white transition hover:bg-white/10"
            >
              Voir les dates
            </Link>
          </div>

          <ul className="mt-9 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/65">
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />3 ou 5 jours, en direct</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />12 places maximum par session</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />Pack 360 : les 4 formations en un forfait</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />Organisme certifié Qualiopi</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ y: 16 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-2xl"
        >
          <div aria-hidden className="absolute -inset-6 rounded-[2rem] bg-[radial-gradient(closest-side,rgba(46,95,224,0.45),transparent)] blur-2xl" />
          <div className="relative">
            <ConsoleAgent />
            <p className="mt-3 text-center text-xs text-white/45">
              Un agent d&apos;IA 360 à l&apos;œuvre — outils inclus dans votre forfait, toujours sous votre validation.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
