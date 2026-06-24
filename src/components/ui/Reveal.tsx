"use client";

import { motion, type Variants } from "framer-motion";
import { fadeUp, viewportOnce } from "@/lib/animations";

export function Reveal({
  children,
  className,
  variants = fadeUp,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  as?: "div" | "section" | "li" | "span";
}) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="initial"
      whileInView="animate"
      viewport={viewportOnce}
    >
      {children}
    </MotionTag>
  );
}
