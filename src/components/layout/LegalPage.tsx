import { PageHeader } from "@/components/layout/PageHeader";

/** Gabarit commun des pages juridiques (CGV, CGU) : sommaire ancré, articles numérotés. */
export function LegalPage({
  eyebrow,
  title,
  version,
  intro,
  articles,
}: {
  eyebrow: string;
  title: string;
  version: string;
  intro?: React.ReactNode;
  articles: { id: string; titre: string; contenu: React.ReactNode }[];
}) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} subtitle={version} />
      <section className="py-12 lg:py-16">
        <div className="container-page mx-auto max-w-3xl text-[15px] leading-relaxed text-ink-soft">
          {intro ? <div className="mb-8 space-y-3">{intro}</div> : null}
          <nav aria-label="Sommaire" className="mb-10 rounded-2xl border border-mist bg-cloud p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-ink-muted">Sommaire</p>
            <ol className="mt-3 grid gap-1.5 text-sm sm:grid-cols-2">
              {articles.map((a, i) => (
                <li key={a.id}>
                  <a href={`#${a.id}`} className="inline-block py-1 text-teal-700 hover:underline">
                    {i + 1}. {a.titre}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="space-y-10">
            {articles.map((a, i) => (
              <article key={a.id} id={a.id} className="scroll-mt-[calc(var(--entete)+1rem)]">
                <h2 className="font-display text-xl font-bold text-ink">
                  Article {i + 1} — {a.titre}
                </h2>
                <div className="mt-3 space-y-3 [&_li]:ml-5 [&_li]:list-disc [&_li]:pl-1 [&_ul]:space-y-1.5">
                  {a.contenu}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
