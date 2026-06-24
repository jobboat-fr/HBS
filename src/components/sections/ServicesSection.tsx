"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { formations, featuredFormationSlugs } from "@/lib/site";

const featured = featuredFormationSlugs
  .map((slug) => formations.find((f) => f.slug === slug)!)
  .filter(Boolean);

export function ServicesSection() {
  return (
    <section id="formations" className="relative py-[var(--section-padding)]">
      <div className="container-luxury">
        <motion.div
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
          className="mx-auto max-w-2xl text-center"
        >
          <Badge>Nos domaines</Badge>
          <h2 className="mt-6 font-display text-display-lg font-semibold text-balance">
            Des parcours pensés pour <span className="text-gold-gradient">votre réussite</span>
          </h2>
          <p className="mt-5 text-white/55">
            De la montée en compétences à la reconnaissance de votre expérience, nous concevons
            des dispositifs de formation adaptés à chaque objectif.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
          className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {featured.map((f) => (
            <motion.div key={f.slug} variants={fadeUp}>
              <GlassCard className="group h-full p-8 transition-all duration-500 hover:shadow-[0_0_60px_rgba(201,168,76,0.15)]">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gold-muted text-gold">
                  <Icon name={f.icon} />
                </div>
                <h3 className="mt-6 font-display text-2xl font-semibold">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">{f.description}</p>
                <Link
                  href={`/formations#${f.slug}`}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gold"
                >
                  En savoir plus
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
