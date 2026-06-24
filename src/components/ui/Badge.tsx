import { cn } from "@/lib/utils";

export function Badge({
  className,
  children,
  color = "teal",
}: {
  className?: string;
  children: React.ReactNode;
  color?: "teal" | "coral" | "sun";
}) {
  const colors = {
    teal: "bg-teal-50 text-teal-700",
    coral: "bg-coral-light text-coral-dark",
    sun: "bg-sun-light text-[#9A6B00]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide",
        colors[color],
        className,
      )}
    >
      {children}
    </span>
  );
}
