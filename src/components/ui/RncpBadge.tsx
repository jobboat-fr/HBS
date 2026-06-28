import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function RncpBadge({ code, level, className }: { code: string; level?: string | null; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-white",
        className,
      )}
    >
      <ShieldCheck size={12} className="text-teal-400" />
      {code}
      {level ? <span className="text-white/60">· {level}</span> : null}
    </span>
  );
}
