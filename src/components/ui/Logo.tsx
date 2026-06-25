import { cn } from "@/lib/utils";

/** Marque HBS FORMATION : chapeau de diplômé dans une tuile teal, pompon corail. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("h-9 w-9", className)}
      role="img"
      aria-label="HBS FORMATION"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="hbsLogoGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#10B8AA" />
          <stop offset="1" stopColor="#22C3B1" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="13" fill="url(#hbsLogoGrad)" />
      <path d="M24 12 L40 19 L24 26 L8 19 Z" fill="#ffffff" />
      <path
        d="M15 22 L24 25.4 L33 22 L33 29 C33 31.3 29 33 24 33 C19 33 15 31.3 15 29 Z"
        fill="#ffffff"
      />
      <circle cx="24" cy="19" r="1.4" fill="#FF6B5B" />
      <line x1="40" y1="19" x2="40" y2="27.4" stroke="#FF6B5B" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="40" cy="29" r="1.9" fill="#FF6B5B" />
    </svg>
  );
}

/** Logotype complet (marque + texte) pour usage hors header/footer. */
export function LogoLockup({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark className="h-9 w-9" />
      <span className="font-display text-xl font-extrabold tracking-tight text-ink">
        HBS<span className="text-teal-500"> FORMATION</span>
      </span>
    </span>
  );
}
