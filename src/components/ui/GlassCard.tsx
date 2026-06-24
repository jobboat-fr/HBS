import { cn } from "@/lib/utils";

/**
 * Carte claire façon edtech (fond blanc, ombre douce, coins arrondis).
 * Nom conservé (GlassCard) pour compatibilité des imports existants.
 */
export function GlassCard({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-mist bg-white shadow-card",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
