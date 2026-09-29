"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { fadeUp, viewportOnce } from "@/lib/animations";
import { media } from "@/lib/site";

const points = [
  "En présentiel au cœur de Rouen, à distance sur demande",
  "Un formateur référent qui suit votre progression",
  "Votre espace en ligne pour retrouver supports et livrables",
];

export function VideoSection() {
  return (
    <section className="bg-cloud py-20 lg:py-28">
      <div className="container-page grid items-center gap-12 lg:grid-cols-2">
        <motion.div
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
          className="relative aspect-video overflow-hidden rounded-3xl shadow-card"
        >
          <VideoPlayer src={media.showcaseVideo} poster={media.showcasePoster} />
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
        >
          <Badge>L&apos;expérience HBS</Badge>
          <h2 className="mt-5 font-display text-display-lg font-extrabold text-ink text-balance">
            Une salle, un formateur, <span className="text-teal-600">votre projet sur la table</span>
          </h2>
          <p className="mt-4 text-ink-soft">
            Douze participants au plus, dans nos locaux rouennais : on travaille sur vos vrais dossiers, on se
            trompe ensemble, on corrige ensemble. Ce que vous bâtissez ici, vous le retrouvez lundi matin sur votre
            bureau.
          </p>
          <ul className="mt-6 space-y-3">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-ink-soft">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                  <Check size={14} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
