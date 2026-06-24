import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";

export function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <header className="relative overflow-hidden pb-12 pt-40">
      <div className="absolute inset-0 bg-hero-radial opacity-70" />
      <div className="container-luxury relative z-10 text-center">
        <Reveal>
          {eyebrow ? <Badge>{eyebrow}</Badge> : null}
          <h1 className="mt-6 font-display text-display-lg font-semibold text-balance">{title}</h1>
          {subtitle ? (
            <p className="mx-auto mt-5 max-w-2xl text-white/60">{subtitle}</p>
          ) : null}
        </Reveal>
      </div>
    </header>
  );
}
