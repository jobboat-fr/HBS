import Link from "next/link";
import { ArrowRight, CalendarDays, Lock } from "lucide-react";
import {
  FORMATIONS,
  ORDRE,
  PLACES_MAX,
  euros,
  libelleSemaine,
  planning,
  type CodeFormation,
  type Session,
} from "@/lib/commande";

/**
 * Le planning des formations 360, calculé — pas saisi. Chaque semaine a son thème : Data,
 * Content, Marketing, et la Formation IA 360 la dernière semaine du mois. Composant serveur :
 * la page qui l'affiche fixe sa fréquence de revalidation, pour que la semaine en cours
 * disparaisse d'elle-même.
 */

const nomMois = (isoDate: string) =>
  new Date(`${isoDate}T12:00:00Z`).toLocaleDateString("fr-FR", { month: "long", year: "numeric", timeZone: "Europe/Paris" });

export function Pastille({ code, taille = "sm" }: { code: CodeFormation; taille?: "sm" | "md" }) {
  const f = FORMATIONS[code];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${f.couleur.bord} ${f.couleur.fond} ${f.couleur.texte} font-bold ${
        taille === "md" ? "px-3 py-1 text-xs" : "px-2.5 py-0.5 text-[11px]"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${f.couleur.degrade}`} />
      {f.nom}
    </span>
  );
}

function Ligne({ s }: { s: Session }) {
  const f = FORMATIONS[s.formation];
  const complet = s.statut === "complet";
  return (
    <li
      className={`verre-clair relative flex flex-col gap-4 overflow-hidden rounded-2xl border p-5 sm:flex-row sm:items-center ${
        complet ? "border-mist opacity-70" : "border-mist"
      }`}
    >
      <span aria-hidden className={`absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b ${f.couleur.degrade}`} />
      <div className="min-w-[10.5rem] pl-2">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
          <CalendarDays size={14} aria-hidden /> Semaine
        </p>
        <p className="mt-0.5 font-display font-bold text-ink">{libelleSemaine(s)}</p>
      </div>
      <div className="flex-1 pl-2 sm:pl-0">
        <Pastille code={s.formation} />
        <p className="mt-1.5 font-display text-lg font-extrabold leading-tight text-ink">
          {f.nom} <span className="font-semibold text-ink-soft">— {f.accroche}</span>
        </p>
        <p className="text-xs text-ink-muted">21 h · à distance, en direct · {PLACES_MAX} places</p>
      </div>
      <div className="flex items-center justify-between gap-4 pl-2 sm:justify-end sm:pl-0">
        <p className="font-display text-2xl font-extrabold text-ink">{euros(f.prix)}</p>
        {complet ? (
          <span className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-mist px-4 text-sm font-bold text-ink-muted">
            <Lock size={14} aria-hidden /> Complet
          </span>
        ) : (
          <Link
            href={`/reserver?formation=${s.formation}&session=${s.code}`}
            className="bouton-neon inline-flex min-h-[44px] items-center gap-1.5 whitespace-nowrap rounded-full px-5 text-sm font-bold"
          >
            Je réserve <ArrowRight size={16} aria-hidden />
          </Link>
        )}
      </div>
    </li>
  );
}

/** Le rythme mensuel, en une ligne. */
export function Rythme() {
  return (
    <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {ORDRE.map((code, i) => {
        const f = FORMATIONS[code];
        return (
          <li key={code} className="verre-clair rounded-2xl border border-mist p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-muted">
              {i < 3 ? `Semaine ${i + 1}` : "Dernière semaine du mois"}
            </p>
            <p className={`mt-2 font-display text-xl font-extrabold ${f.couleur.texte}`}>{f.nom}</p>
            <p className="text-sm font-semibold text-ink-soft">{f.accroche}</p>
            <p className="mt-3 flex items-baseline justify-between">
              <Link href={`/reserver?formation=${code}`} className="text-sm font-bold text-teal-700 underline">Réserver</Link>
              <span className="font-display text-lg font-extrabold text-ink">{euros(f.prix)}</span>
            </p>
          </li>
        );
      })}
    </ol>
  );
}

export function Planning({
  mois = 6,
  limite,
  formation,
  avecComplets = true,
}: {
  mois?: number;
  /** Nombre maximal de semaines affichées. */
  limite?: number;
  formation?: CodeFormation;
  avecComplets?: boolean;
}) {
  let sessions = planning(new Date(), mois).filter(
    (s) => s.statut !== "passee" && (avecComplets || s.statut === "ouvert") && (!formation || s.formation === formation),
  );
  if (limite) sessions = sessions.slice(0, limite);

  const parMois = new Map<string, Session[]>();
  for (const s of sessions) {
    const k = s.debut.slice(0, 7);
    parMois.set(k, [...(parMois.get(k) ?? []), s]);
  }

  return (
    <div className="space-y-10">
      {[...parMois.entries()].map(([k, liste]) => (
        <section key={k} aria-labelledby={`mois-${k}`}>
          <h3 id={`mois-${k}`} className="font-display text-xl font-extrabold capitalize text-ink">
            {nomMois(`${k}-15`)}
          </h3>
          <ul className="mt-4 space-y-3">
            {liste.map((s) => (
              <Ligne key={s.code} s={s} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
