import { cn } from "@/lib/utils";

export function Badge({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold-muted px-4 py-1.5",
        "text-[11px] font-medium uppercase tracking-[0.2em] text-gold",
        className,
      )}
    >
      {children}
    </span>
  );
}
