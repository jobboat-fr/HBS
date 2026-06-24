import {
  GraduationCap,
  Compass,
  Award,
  Building2,
  MonitorPlay,
  Lightbulb,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  GraduationCap,
  Compass,
  Award,
  Building2,
  MonitorPlay,
  Lightbulb,
};

export function Icon({
  name,
  className,
  size = 28,
}: {
  name: string;
  className?: string;
  size?: number;
}) {
  const Cmp = map[name] ?? GraduationCap;
  return <Cmp className={className} size={size} strokeWidth={1.5} />;
}
