
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
    <header className="entete-sombre fond-espace relative overflow-hidden pt-[var(--entete)]">
      <div aria-hidden className="grille-tech pointer-events-none absolute inset-0" />
      <div className="container-page relative py-14 text-center md:py-20">
        <div>
          {eyebrow ? (
            <span className="verre inline-flex rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/85">
              {eyebrow}
            </span>
          ) : null}
          <h1 className="mt-5 font-display text-display-lg font-extrabold text-white text-balance">
            {title}
          </h1>
          {subtitle ? (
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">{subtitle}</p>
          ) : null}
        </div>
      </div>
    </header>
  );
}
