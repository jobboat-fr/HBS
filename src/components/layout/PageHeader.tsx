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
    <header className="bg-hero-soft pt-[72px]">
      <div className="container-page py-14 text-center md:py-20">
        <Reveal>
          {eyebrow ? <Badge>{eyebrow}</Badge> : null}
          <h1 className="mt-5 font-display text-display-lg font-extrabold text-ink text-balance">
            {title}
          </h1>
          {subtitle ? (
            <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-soft">{subtitle}</p>
          ) : null}
        </Reveal>
      </div>
    </header>
  );
}
