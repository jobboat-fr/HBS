"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { formations, media, annonce } from "@/lib/site";

export function ServicesSection() {
  return (
    <section id="formations" className="bg-cloud py-20 lg:py-28">
      <div className="container-page">
        <motion.div
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
          className="mx-auto max-w-2xl text-center"
        >
          <Badge>Nos domaines</Badge>
          <h2 className="mt-5 font-display text-display-lg font-extrabold text-ink text-balance">
            Décrochez une certification <span className="text-teal-600">reconnue</span>
          </h2>
          <p className="mt-4 text-ink-soft">
            Des parcours pour chaque objectif : se reconvertir, se perfectionner ou faire reconnaître
            son expérience.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {formations.map((f) => (
            <motion.div key={f.slug} variants={fadeUp} className={f.slug === "ia-360" ? "cadre-neon" : undefined}>
              <Link
                href={`/formations#${f.slug}`}
                className={
                  f.slug === "ia-360"
                    ? "group block h-full overflow-hidden rounded-2xl bg-white transition-all duration-300 hover:-translate-y-1"
                    : "group block h-full overflow-hidden rounded-2xl border border-mist bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                }
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={media.formationImages[f.slug]}
                    alt={f.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span
                    className={
                      f.slug === "ia-360"
                        ? "absolute left-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white"
                        : "absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-teal-700"
                    }
                  >
                    {f.slug === "ia-360" ? `Session du ${annonce.dateLisible}` : f.tagline}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-bold text-ink">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.description}</p>
                  {f.slug === "ia-360" ? (
                    <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white transition-colors group-hover:bg-red-700">
                      Réserver ma place
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  ) : (
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-teal-600">
                      En savoir plus
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
