"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { VideoPlayer } from "@/components/media/VideoPlayer";
import { fadeUp, viewportOnce } from "@/lib/animations";
import { media } from "@/lib/site";

const points = [
  "Cours en direct et en différé, accessibles partout",
  "Un formateur référent qui suit votre progression",
  "Une plateforme pensée pour apprendre à votre rythme",
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
            Une formation <span className="text-teal-600">en ligne et humaine</span>
          </h2>
          <p className="mt-4 text-ink-soft">
            Le meilleur du distanciel sans jamais être seul : des contenus de qualité, des classes
            virtuelles et un accompagnement individuel tout au long de votre parcours.
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
