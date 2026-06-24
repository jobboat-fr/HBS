"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { processSteps } from "@/lib/site";

export function ProcessSection() {
  return (
    <section className="relative border-y border-white/[0.06] bg-dark/50 py-[var(--section-padding)]">
      <div className="container-luxury">
        <motion.div
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
          className="mx-auto max-w-2xl text-center"
        >
          <Badge>Votre parcours</Badge>
          <h2 className="mt-6 font-display text-display-lg font-semibold text-balance">
            Un accompagnement <span className="text-gold-gradient">de bout en bout</span>
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
          className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.04] md:grid-cols-2 lg:grid-cols-4"
        >
          {processSteps.map((s) => (
            <motion.div
              key={s.step}
              variants={fadeUp}
              className="bg-dark p-8 transition-colors hover:bg-surface"
            >
              <span className="font-display text-5xl font-semibold text-gold/30">{s.step}</span>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/55">{s.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
