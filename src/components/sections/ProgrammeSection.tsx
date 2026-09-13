"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FileCheck2 } from "lucide-react";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { programme } from "@/lib/site";
import { TEINTE_DC } from "@/lib/teintes";


/**
 * Le programme en un coup d'œil, sur la page d'accueil : trois journées, deux ateliers
 * chacune, et les pièces du dossier qu'elles produisent. Le détail vit sur /formations.
 */
export function ProgrammeSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container-page">
        <motion.div variants={fadeUp} initial="initial" whileInView="animate" viewport={viewportOnce} className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-teal-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-teal-700">
            Le programme
          </span>
          <h2 className="mt-5 font-display text-display-lg font-extrabold text-ink text-balance">
            Trois journées, <span className="text-teal-600">un dossier IA</span>
          </h2>
          <p className="mt-4 text-ink-soft">
            Chaque journée enchaîne deux ateliers sur votre cas réel et produit des pièces datées,
            utilisables dès le lendemain.
          </p>
        </motion.div>

        <motion.ol variants={staggerContainer} initial="initial" whileInView="animate" viewport={viewportOnce} className="mt-14 grid gap-6 lg:grid-cols-3">
          {programme.journees.map((j) => {
            const t = TEINTE_DC[j.dc];
            return (
              <motion.li key={j.jour} variants={fadeUp} className={`verre-clair relative overflow-hidden rounded-2xl bg-gradient-to-b ${t.fond} to-transparent p-6`}>
                <span aria-hidden className={`absolute inset-x-0 top-0 h-1 ${t.barre}`} />
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-2xl font-extrabold text-ink">{j.nom}</h3>
                  <span className={`text-xs font-bold uppercase tracking-widest ${t.texte}`}>{j.jour}</span>
                </div>
                <ul className="mt-5 space-y-3">
                  {j.ateliers.map((a) => (
                    <li key={a.code} className="rounded-xl bg-white/70 p-4 ring-1 ring-mist">
                      <p className={`font-mono text-xs font-bold ${t.texte}`}>{a.code}</p>
                      <p className="mt-0.5 font-semibold leading-snug text-ink">{a.titre}</p>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 border-t border-mist pt-4">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-ink-muted">Pièces produites</p>
                  <ul className="mt-2 space-y-1.5">
                    {j.pieces.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-sm text-ink-soft">
                        <FileCheck2 size={15} className={t.texte} aria-hidden /> {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.li>
            );
          })}
        </motion.ol>

        <div className="mt-10 text-center">
          <Link href="/formations#programme" className="inline-flex items-center gap-2 font-semibold text-teal-700 hover:text-teal-600">
            Le programme détaillé, atelier par atelier <ArrowRight size={16} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
