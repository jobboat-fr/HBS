"use client";

import { motion } from "framer-motion";
import { Users, ShieldCheck, Sparkles, HeartHandshake } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";

const commitments = [
  {
    icon: Users,
    title: "Sur mesure",
    text: "Chaque parcours est construit à partir de vos objectifs réels, jamais sur étagère.",
  },
  {
    icon: ShieldCheck,
    title: "Financements maîtrisés",
    text: "CPF, OPCO, France Travail, entreprise : nous vous orientons vers le bon dispositif.",
  },
  {
    icon: Sparkles,
    title: "Formateurs experts",
    text: "Des intervenants issus du terrain, sélectionnés pour leur expertise et leur pédagogie.",
  },
  {
    icon: HeartHandshake,
    title: "Suivi durable",
    text: "Un accompagnement avant, pendant et après la formation pour ancrer les acquis.",
  },
];

export function CommitmentsSection() {
  return (
    <section className="relative py-[var(--section-padding)]">
      <div className="container-luxury">
        <motion.div
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
          className="mx-auto max-w-2xl text-center"
        >
          <Badge>Nos engagements</Badge>
          <h2 className="mt-6 font-display text-display-lg font-semibold text-balance">
            Ce qui fait <span className="text-gold-gradient">la différence</span>
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
          className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {commitments.map((c) => (
            <motion.div key={c.title} variants={fadeUp} className="text-center sm:text-left">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gold-muted text-gold sm:mx-0">
                <c.icon size={24} strokeWidth={1.5} />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{c.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
