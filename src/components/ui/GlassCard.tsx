import { cn } from "@/lib/utils";

export function GlassCard({
  className,
  children,
  goldAccent = true,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { goldAccent?: boolean }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/[0.08]",
        "bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-xl",
        "shadow-[0_0_40px_rgba(0,0,0,0.4)]",
        goldAccent &&
          "before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gold-gradient",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
