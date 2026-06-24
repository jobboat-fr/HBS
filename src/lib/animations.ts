import type { Variants } from "framer-motion";

export const EASE_LUXURY = [0.22, 1, 0.36, 1] as const;

export const fadeUp: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_LUXURY } },
};

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.6, ease: EASE_LUXURY } },
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: EASE_LUXURY } },
};

export const staggerContainer: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.12 } },
};

/** Réglages de viewport standard pour whileInView (jouer une seule fois). */
export const viewportOnce = { once: true, margin: "-80px" } as const;
