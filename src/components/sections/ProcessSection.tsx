"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { processSteps } from "@/lib/site";

export function ProcessSection() {
  return (
    <section className="bg-cloud py-20 lg:py-28">
      <div className="container-page">
        <motion.div
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
          className="mx-auto max-w-2xl text-center"
        >
          <Badge color="coral">Votre parcours</Badge>
          <h2 className="mt-5 font-display text-display-lg font-extrabold text-ink text-balance">
            Un accompagnement <span className="text-teal-600">de bout en bout</span>
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {processSteps.map((s) => (
            <motion.div
              key={s.step}
              variants={fadeUp}
              className="relative rounded-2xl border border-mist bg-white p-7 shadow-card"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-gradient font-display text-lg font-bold text-white">
                {s.step}
              </span>
              <h3 className="mt-5 text-lg font-bold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
