"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/animations";
import { stats } from "@/lib/site";

function Counter({ value, suffix }: { value: string; suffix: string }) {
  const target = Number(value);
  const isNumeric = !Number.isNaN(target);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(isNumeric ? 0 : value);

  useEffect(() => {
    if (!isNumeric || !inView) return;
    const controls = animate(0, target, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, isNumeric, target]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  return (
    <section className="relative py-[var(--section-padding)]">
      <div className="container-luxury">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={viewportOnce}
          className="grid gap-10 text-center sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((s) => (
            <motion.div key={s.label} variants={fadeUp}>
              <div className="font-display text-5xl font-semibold text-gold-gradient lg:text-6xl">
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <p className="mt-3 text-sm text-white/55">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
