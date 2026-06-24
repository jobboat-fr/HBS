"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Star, BadgeCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { formations, media } from "@/lib/site";

export function HeroSection() {
  const router = useRouter();
  const [slug, setSlug] = useState("");

  function find(e: React.FormEvent) {
    e.preventDefault();
    router.push(slug ? `/formations#${slug}` : "/formations");
  }

  return (
    <section className="relative overflow-hidden bg-hero-soft pt-[72px]">
      <div className="container-page grid items-center gap-12 py-12 lg:grid-cols-2 lg:py-20">
        {/* Texte */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-teal-700 shadow-soft">
            <Star size={14} className="fill-sun text-sun" /> Organisme de formation · Rouen
          </span>

          <h1 className="mt-6 font-display text-display-xl font-extrabold text-ink">
            Montez en compétences,{" "}
            <span className="underline-brush text-teal-600">à votre rythme</span>
          </h1>

          <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-soft">
            Formations certifiantes, bilans de compétences, VAE et alternance — en ligne, en
            présentiel ou en mixte. Un accompagnement humain, du premier contact à la certification.
          </p>

          {/* Recherche de formation */}
          <form
            onSubmit={find}
            className="mt-8 flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-soft sm:flex-row sm:items-center"
          >
            <div className="flex flex-1 items-center gap-2 px-3">
              <Search size={20} className="shrink-0 text-teal-500" />
              <select
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-transparent py-2 text-sm text-ink focus:outline-none"
                aria-label="Choisir un domaine de formation"
              >
                <option value="">Quelle formation recherchez-vous ?</option>
                {formations.map((f) => (
                  <option key={f.slug} value={f.slug}>
                    {f.title}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" size="md" className="sm:shrink-0">
              Trouver ma formation
            </Button>
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-soft">
            <span className="inline-flex items-center gap-1.5">
              <BadgeCheck size={18} className="text-teal-500" /> Éligible CPF / OPCO
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={18} className="text-teal-500" /> Réponse sous 48 h
            </span>
          </div>
        </motion.div>

        {/* Visuel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-lg"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-card">
            <Image
              src={media.heroPerson}
              alt="Apprenante suivant une formation HBS FORMATION"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-cover"
            />
          </div>

          {/* Cartes flottantes */}
          <div className="absolute -left-4 top-10 hidden rounded-2xl bg-white p-4 shadow-card sm:block">
            <p className="text-2xl font-extrabold text-ink">100%</p>
            <p className="text-xs text-ink-muted">parcours personnalisés</p>
          </div>
          <div className="absolute -bottom-5 -right-2 hidden items-center gap-3 rounded-2xl bg-white p-4 shadow-card sm:flex">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
              <BadgeCheck size={22} />
            </span>
            <div>
              <p className="text-sm font-bold text-ink">Diplômes & certifications</p>
              <p className="text-xs text-ink-muted">reconnus</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bandeau financeurs */}
      <div className="border-y border-mist bg-white/70">
        <div className="container-page flex flex-wrap items-center justify-center gap-x-8 gap-y-2 py-5 text-sm font-semibold text-ink-muted">
          <span className="text-ink-soft">Financements&nbsp;:</span>
          {["CPF", "OPCO", "France Travail", "Entreprise", "Région"].map((f) => (
            <span key={f}>{f}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
