"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import type { Testimonial } from "@/lib/sanity/queries";

export function TestimonialsSection({ items }: { items: Testimonial[] }) {
  if (!items || items.length === 0) return null;

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
          <Badge color="sun">Ils nous font confiance</Badge>
          <h2 className="mt-5 font-display text-display-lg font-extrabold text-ink">
            Notre plus belle réussite, c&apos;est vous
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
          className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((t) => (
            <motion.div
              key={t._id}
              variants={fadeUp}
              className="rounded-2xl border border-mist bg-white p-7 shadow-card"
            >
              <div className="flex gap-1 text-sun">
                {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="mt-4 leading-relaxed text-ink-soft">“{t.quote}”</p>
              <div className="mt-6 text-sm">
                <div className="font-bold text-ink">{t.name}</div>
                <div className="text-ink-muted">{[t.role, t.company].filter(Boolean).join(" · ")}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
