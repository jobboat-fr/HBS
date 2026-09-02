import { cn } from "@/lib/utils";

export type MascotVariant = "graduate" | "suit" | "hiphop" | "casual";

const NAVY = "#0B2239";
const TEAL = "#1D3FAE";
const CORAL = "#111111";
const GOLD = "#D9DCE1";

/**
 * Hub — la mascotte de HBS FORMATION.
 * Personnage à chapeau de diplômé qui change de style selon l'univers de la page
 * (« la formation s'adapte à vous »).
 */
export function Mascot({
  variant = "graduate",
  className,
}: {
  variant?: MascotVariant;
  className?: string;
}) {
  const shoulders =
    variant === "suit" ? NAVY : variant === "hiphop" ? CORAL : variant === "casual" ? "#FFFFFF" : "url(#hubBody)";

  return (
    <svg
      viewBox="0 0 160 176"
      className={cn("h-40 w-40", className)}
      role="img"
      aria-label="Hub, la mascotte de HBS FORMATION"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="hubBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={TEAL} />
          <stop offset="1" stopColor="#0F2159" />
        </linearGradient>
      </defs>

      {/* Épaules / vêtement */}
      <path
        d="M24 176 V150 C24 132 40 120 80 120 C120 120 136 132 136 150 V176 Z"
        fill={shoulders}
        stroke={variant === "casual" ? "#E3EAF2" : "none"}
        strokeWidth="2"
      />

      {/* Tenue : détails */}
      {variant === "suit" && (
        <>
          <path d="M72 120 H88 L86 176 H74 Z" fill="#FFFFFF" />
          <path d="M80 122 L75 122 L78 158 L80 164 L82 158 L85 122 Z" fill={CORAL} />
          <path d="M80 120 L66 126 L74 176 L80 168 Z" fill="#091a2d" />
          <path d="M80 120 L94 126 L86 176 L80 168 Z" fill="#091a2d" />
        </>
      )}
      {variant === "hiphop" && (
        <>
          <path d="M48 134 Q80 112 112 134 L106 150 Q80 134 54 150 Z" fill={CORAL} />
          <path d="M62 132 Q80 156 98 132" fill="none" stroke={GOLD} strokeWidth="4" strokeLinecap="round" />
          <circle cx="80" cy="150" r="3.5" fill={GOLD} />
        </>
      )}
      {variant === "casual" && (
        <>
          <path d="M64 122 Q80 134 96 122" fill="none" stroke={TEAL} strokeWidth="3" />
          <text x="80" y="156" textAnchor="middle" fontFamily="Poppins, sans-serif" fontSize="20" fontWeight="800" fill={TEAL}>
            H
          </text>
        </>
      )}
      {variant === "graduate" && (
        <path d="M64 122 Q80 132 96 122 L92 140 Q80 134 68 140 Z" fill="#FFFFFF" opacity="0.9" />
      )}

      {/* Cou */}
      <rect x="70" y="104" width="20" height="20" rx="8" fill="url(#hubBody)" />

      {/* Tête */}
      <circle cx="80" cy="68" r="46" fill="url(#hubBody)" />
      {/* Oreilles */}
      <circle cx="36" cy="68" r="9" fill="url(#hubBody)" />
      <circle cx="124" cy="68" r="9" fill="url(#hubBody)" />
      {/* Visage */}
      <ellipse cx="80" cy="76" rx="33" ry="28" fill="#FFFFFF" />

      {/* Joues */}
      <circle cx="55" cy="86" r="6" fill={CORAL} opacity="0.55" />
      <circle cx="105" cy="86" r="6" fill={CORAL} opacity="0.55" />

      {/* Yeux ou lunettes */}
      {variant === "hiphop" ? (
        <g fill={NAVY}>
          <rect x="54" y="64" width="22" height="13" rx="4" />
          <rect x="84" y="64" width="22" height="13" rx="4" />
          <rect x="76" y="68" width="8" height="3" />
        </g>
      ) : (
        <g>
          <circle cx="67" cy="70" r="6.5" fill={NAVY} />
          <circle cx="93" cy="70" r="6.5" fill={NAVY} />
          <circle cx="69" cy="68" r="2" fill="#FFFFFF" />
          <circle cx="95" cy="68" r="2" fill="#FFFFFF" />
        </g>
      )}

      {/* Sourire */}
      <path d="M68 88 Q80 99 92 88" fill="none" stroke={NAVY} strokeWidth="3.2" strokeLinecap="round" />

      {/* Chapeau de diplômé (incliné en mode hip-hop) */}
      <g transform={variant === "hiphop" ? "rotate(-17 80 30)" : undefined}>
        <path d="M80 12 L118 30 L80 48 L42 30 Z" fill={NAVY} />
        <path d="M60 33 L80 42 L100 33 L100 42 C100 47 91 50 80 50 C69 50 60 47 60 42 Z" fill="#091a2d" />
        <circle cx="80" cy="30" r="2.6" fill={CORAL} />
        <line x1="118" y1="30" x2="118" y2="44" stroke={CORAL} strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="118" cy="46" r="2.6" fill={CORAL} />
      </g>
    </svg>
  );
}
