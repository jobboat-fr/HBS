"use client";

import { motion } from "framer-motion";
import { Users, ShieldCheck, Sparkles, HeartHandshake } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";

const commitments = [
  { icon: Users, title: "Sur mesure", text: "Chaque parcours est construit à partir de vos objectifs réels, jamais sur étagère." },
  { icon: ShieldCheck, title: "Financements maîtrisés", text: "CPF, OPCO, France Travail, entreprise : nous vous orientons vers le bon dispositif." },
  { icon: Sparkles, title: "Formateurs experts", text: "Des intervenants issus du terrain, sélectionnés pour leur expertise et leur pédagogie." },
  { icon: HeartHandshake, title: "Suivi durable", text: "Un accompagnement avant, pendant et après la formation pour ancrer les acquis." },
];

export function CommitmentsSection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container-page">
        <motion.div
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
          className="mx-auto max-w-2xl text-center"
        >
          <Badge>Nos engagements</Badge>
          <h2 className="mt-5 font-display text-display-lg font-extrabold text-ink text-balance">
            Une formation <span className="text-teal-600">100 % humaine</span>
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {commitments.map((c) => (
            <motion.div key={c.title} variants={fadeUp} className="rounded-2xl bg-cloud p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-teal-600 shadow-soft">
                <c.icon size={24} strokeWidth={1.75} />
              </div>
              <h3 className="mt-5 text-lg font-bold text-ink">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{c.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
