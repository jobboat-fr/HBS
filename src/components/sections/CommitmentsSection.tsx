"use client";

import { motion } from "framer-motion";
import { Target, ShieldCheck, Gauge, HeartHandshake } from "lucide-react";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";

const engagements = [
  { icon: Target, title: "Votre cas, pas un cas d'école", text: "Les six ateliers travaillent sur un problème réel de votre activité, choisi dès le premier jour." },
  { icon: ShieldCheck, title: "Fiable avant d'être rapide", text: "On apprend à vérifier ce que produit l'IA, à protéger ses données et à reconnaître ses défaillances." },
  { icon: Gauge, title: "Des démonstrations en exploitation", text: "Des systèmes d'IA qui tournent réellement, pannes comprises — pas des vidéos de présentation." },
  { icon: HeartHandshake, title: "Un suivi à trois mois", text: "On revient vers vous pour mesurer ce qui a été déployé, et ce qui reste à faire." },
];

export function CommitmentsSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container-page">
        <motion.div variants={fadeUp} initial="initial" whileInView="animate" viewport={viewportOnce} className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center rounded-full bg-teal-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-teal-700">
            Nos engagements
          </span>
          <h2 className="mt-5 font-display text-display-lg font-extrabold text-ink text-balance">
            L&apos;IA qui tourne, <span className="text-teal-600">pas l&apos;IA qui promet</span>
          </h2>
        </motion.div>

        <motion.div variants={staggerContainer} initial="initial" whileInView="animate" viewport={viewportOnce} className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {engagements.map((c) => (
            <motion.div key={c.title} variants={fadeUp} className="verre-clair rounded-2xl p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#1d3fae] to-[#2e5fe0] text-white shadow-soft">
                <c.icon size={22} strokeWidth={1.8} aria-hidden />
              </div>
              <h3 className="mt-5 text-lg font-bold leading-snug text-ink">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{c.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
