"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import type { Testimonial } from "@/lib/sanity/queries";

export function TestimonialsSection({ items }: { items: Testimonial[] }) {
  if (!items || items.length === 0) return null;

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
          <Badge>Ils nous font confiance</Badge>
          <h2 className="mt-6 font-display text-display-lg font-semibold">Témoignages</h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
          className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((t) => (
            <motion.div key={t._id} variants={fadeUp}>
              <GlassCard className="h-full p-8">
                <div className="flex gap-1 text-gold">
                  {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="mt-5 leading-relaxed text-white/75">“{t.quote}”</p>
                <div className="mt-6 text-sm">
                  <div className="font-semibold text-white">{t.name}</div>
                  <div className="text-white/50">
                    {[t.role, t.company].filter(Boolean).join(" · ")}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
