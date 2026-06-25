"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  poster?: string;
  className?: string;
  rounded?: boolean;
};

/** Vidéo d'ambiance : lecture quand visible, pause hors écran. Muette, en boucle. */
export function VideoPlayer({ src, poster, className, rounded = true }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={cn("h-full w-full object-cover", rounded && "rounded-3xl", className)}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
