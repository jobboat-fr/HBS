import { cn } from "@/lib/utils";

/** Petit logo AZZ&CO Labs (tuile + étincelle) — studio ayant conçu le site. */
export function AzzcoLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-5 w-5", className)} role="img" aria-label="AZZ&CO Labs" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="azzcoGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FF6B5B" />
          <stop offset="1" stopColor="#10B8AA" />
        </linearGradient>
      </defs>
      <rect width="24" height="24" rx="7" fill="url(#azzcoGrad)" />
      <path
        d="M12 4 C12.7 9 12.9 9.3 18 12 C12.9 14.7 12.7 15 12 20 C11.3 15 11.1 14.7 6 12 C11.1 9.3 11.3 9 12 4 Z"
        fill="#ffffff"
      />
    </svg>
  );
}
