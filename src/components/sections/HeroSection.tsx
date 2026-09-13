"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays } from "lucide-react";
import { annonce, tarif } from "@/lib/site";
import { ChampNeuronal } from "@/components/visuel/ChampNeuronal";
import { ConsoleAgent } from "@/components/visuel/ConsoleAgent";

/**
 * Le héros : la page elle-même doit montrer qu'on sait faire travailler l'IA.
 *
 * Trois choses le portent, dans cet ordre de lecture : une promesse courte, une console où
 * l'on voit un agent à l'œuvre, et un prix affiché d'emblée. Un prix caché derrière
 * « demander un devis » fait fuir exactement les indépendants et les particuliers qu'on
 * veut ; un prix clair qualifie la demande avant même le premier échange.
 */
export function HeroSection() {
  return (
    <section className="fond-espace relative overflow-hidden pt-[var(--entete)]">
      <div aria-hidden className="grille-tech pointer-events-none absolute inset-0" />
      <ChampNeuronal className="pointer-events-none absolute inset-0 h-full w-full opacity-80" />

      <div className="container-page relative grid items-center gap-12 py-14 lg:grid-cols-[1.08fr_0.92fr] lg:py-24">
        <motion.div
          initial={{ y: 14 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link
            href={annonce.href}
            className="verre inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-white/90 transition hover:text-white"
          >
            <CalendarDays size={14} className="text-cyan-300" aria-hidden />
            <span>Prochaine session · <time dateTime={annonce.iso}>{annonce.dateLisible}</time></span>
          </Link>

          <h1 className="mt-6 font-display text-[2.6rem] font-extrabold leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Mettez l&apos;IA
            <br />
            <span className="texte-lumiere">au travail.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
            21 heures pour comprendre, fiabiliser et déployer l&apos;intelligence artificielle
            dans votre activité — et repartir avec vos agents, vos automatisations et votre
            dossier IA.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/preinscription"
              className="bouton-neon inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-base font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Réserver ma place · {tarif.montant}
              <ArrowRight size={18} aria-hidden />
            </Link>
            <Link
              href="/formations#programme"
              className="verre inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-base font-semibold text-white transition hover:bg-white/10"
            >
              Voir le programme
            </Link>
          </div>

          <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/65">
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />21 h en direct</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />6 ateliers pratiques</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />Outils IA inclus</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />Certificat IA 360</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />Organisme certifié Qualiopi</li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ y: 16 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div aria-hidden className="absolute -inset-6 rounded-[2rem] bg-[radial-gradient(closest-side,rgba(46,95,224,0.45),transparent)] blur-2xl" />
          <div className="relative">
            <ConsoleAgent />
            <p className="mt-3 text-center text-xs text-white/45">
              Les outils inclus dans votre place, à l&apos;œuvre — toujours sous votre validation.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
