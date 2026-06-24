"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EASE_LUXURY } from "@/lib/animations";

// Three.js exclu du bundle serveur (sinon casse le SSR).
const ParticleField = dynamic(() => import("./ParticleField"), { ssr: false });

const container = {
  animate: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};
const item = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_LUXURY } },
};

export function HeroSection() {
  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      {/* Couche 1 : dégradé radial doré */}
      <div className="absolute inset-0 bg-hero-radial" />
      {/* Couche 2 : particules Three.js */}
      <div className="absolute inset-0">
        <ParticleField />
      </div>
      {/* Couche 3 : voile sombre */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black" />

      {/* Couche 4 : contenu */}
      <motion.div
        variants={container}
        initial="initial"
        animate="animate"
        className="container-luxury relative z-10 flex flex-col items-center text-center"
      >
        <motion.div variants={item}>
          <Badge>Organisme de formation · Rouen</Badge>
        </motion.div>

        <motion.h1
          variants={item}
          className="mt-8 max-w-4xl font-display text-display-xl font-semibold leading-[1.05] text-balance"
        >
          Formez-vous à <span className="text-gold-gradient">l&apos;excellence</span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-6 max-w-xl text-lg leading-relaxed text-white/60"
        >
          Formations certifiantes, bilans de compétences, VAE, apprentissage et e-learning.
          Un accompagnement sur mesure pour révéler votre potentiel et celui de vos équipes.
        </motion.p>

        <motion.div variants={item} className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Button href="/contact" size="lg">
            Démarrer mon projet →
          </Button>
          <Button href="/formations" variant="secondary" size="lg">
            Découvrir nos formations
          </Button>
        </motion.div>
      </motion.div>

      {/* Indicateur de scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="text-gold/70"
        >
          <ChevronDown size={24} />
        </motion.div>
      </motion.div>
    </section>
  );
}
