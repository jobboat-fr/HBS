import Link from "next/link";
import { ArrowRight, CalendarDays, Check } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Planning } from "@/components/planning/Planning";
import { FORMATIONS, LANCEMENT, ORDRE, euros, libelleSemaine, prochaineSession } from "@/lib/commande";

/**
 * L'offre : quatre formations 360, une par semaine du mois, et la prochaine date de chacune.
 *
 * Composant serveur : les dates viennent du planning calculé à la requête (l'accueil se
 * revalide toutes les minutes). Chaque carte a un seul bouton principal, qui mène à la
 * réservation avec la formation et sa prochaine semaine déjà choisies.
 */
export function ServicesSection() {
  return (
    <section id="formations" className="bg-cloud py-20 lg:py-28">
      <div className="container-page">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full bg-teal-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-teal-700">
              Nos formations 360
            </span>
            <h2 className="mt-5 font-display text-display-lg font-extrabold text-ink text-balance">
              Quatre semaines. <span className="text-teal-600">Quatre compétences qui font vendre.</span>
            </h2>
            <p className="mt-4 text-lg text-ink-soft">
              Chaque mois, une semaine pour lire vos chiffres, une pour créer vos contenus, une pour vendre — et la
              dernière pour mettre l&apos;IA au travail. Choisissez la vôtre, ou enchaînez les quatre.
            </p>
          </div>
        </Reveal>

        <ul className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {ORDRE.map((code, i) => {
            const f = FORMATIONS[code];
            const s = prochaineSession(code);
            const ia = code === "IA360";
            return (
              <li key={code} className={ia ? "cadre-neon" : "verre-clair rounded-3xl border border-mist"}>
                <div className="flex h-full flex-col p-6">
                  <div className={`h-1.5 w-14 rounded-full bg-gradient-to-r ${f.couleur.degrade}`} aria-hidden />
                  <p className="mt-4 text-xs font-bold uppercase tracking-widest text-ink-muted">
                    {i < 3 ? `Semaine ${i + 1} du mois` : "Fin de mois"}
                  </p>
                  <h3 className="mt-1 font-display text-2xl font-extrabold leading-tight text-ink">{f.nom}</h3>
                  <p className={`font-semibold ${f.couleur.texte}`}>{f.accroche}</p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">{f.resume}</p>
                  <ul className="mt-4 space-y-1.5 text-sm text-ink-soft">
                    {f.inclus.slice(0, 2).map((x) => (
                      <li key={x} className="flex gap-2">
                        <Check size={16} className={`mt-0.5 shrink-0 ${f.couleur.texte}`} aria-hidden /> {x}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-6">
                    {s ? (
                      <p className="flex items-center gap-1.5 text-xs font-semibold text-ink">
                        <CalendarDays size={14} className="text-teal-600" aria-hidden /> Prochaine : semaine {libelleSemaine(s)}
                      </p>
                    ) : null}
                    <p className="mt-2 font-display text-4xl font-extrabold text-ink">
                      {euros(f.prix)} <span className="text-sm font-semibold text-ink-muted">/ place</span>
                    </p>
                    <Link
                      href={s ? `/reserver?formation=${code}&session=${s.code}` : `/reserver?formation=${code}`}
                      className="bouton-neon mt-4 flex min-h-[48px] items-center justify-center gap-2 rounded-full px-5 font-bold"
                    >
                      Je réserve ma place <ArrowRight size={18} aria-hidden />
                    </Link>
                    <Link href={f.href} className="mt-2 block text-center text-sm font-semibold text-teal-700 hover:underline">
                      Voir le programme
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mx-auto mt-20 max-w-4xl">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-display-md font-extrabold text-ink">Les prochaines semaines</h2>
                <p className="mt-1 text-ink-soft">
                  12 places par session.{" "}
                  {new Date().toISOString().slice(0, 10) < LANCEMENT ? "Jusqu'au 26 octobre, tout est déjà complet." : "Réservez tôt pour avoir la semaine qui vous convient."}
                </p>
              </div>
              <Link href="/planning" className="inline-flex min-h-[44px] items-center gap-2 font-bold text-teal-700 hover:underline">
                Tout le planning <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
          </Reveal>
          <div className="mt-8">
            <Planning mois={3} limite={5} avecComplets={false} />
          </div>
        </div>
      </div>
    </section>
  );
}
