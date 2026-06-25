"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { fadeUp, viewportOnce } from "@/lib/animations";
import { faqs } from "@/lib/site";

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 lg:py-28">
      <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <motion.div
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
        >
          <Badge color="coral">Questions fréquentes</Badge>
          <h2 className="mt-5 font-display text-display-md font-extrabold text-ink text-balance">
            Tout ce qu&apos;il faut savoir avant de vous lancer
          </h2>
          <p className="mt-4 text-ink-soft">
            Une autre question ? Notre équipe vous répond sous 48 heures.
          </p>
          <div className="mt-6">
            <Button href="/contact" variant="outline" size="sm">
              Poser ma question
            </Button>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
          className="divide-y divide-mist rounded-2xl border border-mist bg-white shadow-card"
        >
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-display text-base font-bold text-ink">{f.q}</span>
                  <span className="shrink-0 text-teal-600">
                    {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                  </span>
                </button>
                {isOpen ? (
                  <p className="px-6 pb-5 text-sm leading-relaxed text-ink-soft">{f.a}</p>
                ) : null}
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
