import { cn } from "@/lib/utils";

/** Marque HBS FORMATION : monogramme "HBS" dans une tuile bleu marine (couleur du logo officiel). */
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
          <stop offset="0" stopColor="#2E5FE0" />
          <stop offset="1" stopColor="#0F2159" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="url(#hbsLogoGrad)" />
      <path d="M10 17 Q24 6 38 17" fill="none" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
      <text
        x="24"
        y="32.5"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="17"
        fontWeight="700"
        letterSpacing="-0.5"
        fill="#ffffff"
      >
        HBS
      </text>
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

/**
 * Recréation fidèle du logo officiel HBS FORMATION (arche, monogramme "HBS" à ruban diagonal,
 * script "Formation", pictogrammes Digitalisé / Moderne / Accessible / Pour tous, baseline
 * "Apprendre · Progresser · Réussir"). `variant="light"` = tuile blanche / encre bleue (sur fond
 * clair), `variant="dark"` = tuile bleue / encre blanche (sur fond sombre), comme les deux
 * déclinaisons de la charte.
 */
export function HbsBadge({
  className,
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "dark";
}) {
  const ink = variant === "dark" ? "#FFFFFF" : "#1D3FAE";
  const tileFill = variant === "dark" ? "#1D3FAE" : "#FFFFFF";
  const tileStroke = variant === "dark" ? "none" : "#E7ECFB";

  return (
    <svg
      viewBox="0 0 360 400"
      className={cn("h-64 w-auto", className)}
      role="img"
      aria-label="HBS FORMATION — Digitalisé, moderne, accessible, pour tous. Apprendre, progresser, réussir."
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="4" y="4" width="352" height="392" rx="20" fill={tileFill} stroke={tileStroke} strokeWidth="2" />

      {/* Arche */}
      <path d="M55 138 C 95 48 265 48 305 138" fill="none" stroke={ink} strokeWidth="5" strokeLinecap="round" />

      {/* Ruban diagonal derrière le monogramme */}
      <rect x="55" y="188" width="250" height="16" rx="8" fill={ink} opacity="0.85" transform="rotate(-14 180 196)" />

      {/* Monogramme HBS */}
      <text
        x="180"
        y="222"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="96"
        fontWeight="700"
        letterSpacing="-2"
        fill={ink}
      >
        HBS
      </text>

      {/* Script "Formation" */}
      <text
        x="180"
        y="266"
        textAnchor="middle"
        fontFamily="'Brush Script MT', 'Segoe Script', cursive"
        fontStyle="italic"
        fontSize="46"
        fill={ink}
      >
        Formation
      </text>

      {/* Ligne de pictogrammes */}
      <g stroke={ink} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Ordinateur portable */}
        <g transform="translate(52 288)">
          <rect x="0" y="0" width="26" height="17" rx="2" />
          <path d="M-5 20 H31 L27 24 H-1 Z" fill={ink} stroke="none" />
        </g>
        {/* Globe */}
        <g transform="translate(128 288)">
          <circle cx="13" cy="9" r="13" />
          <ellipse cx="13" cy="9" rx="5.5" ry="13" />
          <line x1="0" y1="9" x2="26" y2="9" />
        </g>
        {/* Téléphone */}
        <g transform="translate(210 285)">
          <rect x="0" y="0" width="18" height="28" rx="4" />
          <line x1="9" y1="23" x2="9" y2="23" strokeWidth="3.2" />
        </g>
        {/* Personne */}
        <g transform="translate(284 285)">
          <circle cx="10" cy="7" r="7" />
          <path d="M-3 28 C-3 17 23 17 23 28" />
        </g>
      </g>

      {/* Séparateurs verticaux */}
      <g stroke={ink} strokeOpacity="0.35" strokeWidth="1.5">
        <line x1="98" y1="286" x2="98" y2="326" />
        <line x1="174" y1="286" x2="174" y2="326" />
        <line x1="252" y1="286" x2="252" y2="326" />
      </g>

      {/* Légendes pictogrammes */}
      <g fontFamily="Arial, sans-serif" fontWeight="700" fontSize="9.5" letterSpacing="0.3" fill={ink} textAnchor="middle">
        <text x="65" y="342">DIGITALISÉ</text>
        <text x="141" y="342">MODERNE</text>
        <text x="219" y="342">ACCESSIBLE</text>
        <text x="296" y="342">POUR TOUS</text>
      </g>

      {/* Baseline */}
      <text
        x="180"
        y="378"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="800"
        fontSize="15"
        letterSpacing="1.2"
        fill={ink}
      >
        APPRENDRE · PROGRESSER · RÉUSSIR
      </text>
    </svg>
  );
}
