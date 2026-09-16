import Link from "next/link";
import { ArrowRight, BarChart3, PenTool, Megaphone, Sparkles, CalendarDays, Check } from "lucide-react";
import { PrixPack } from "@/components/ui/PrixPack";
import { FORMATIONS, ORDRE, PACK, cyclesPack, dureeCourte, euros, libelleDates, nomMois, type CodeFormation } from "@/lib/commande";

/**
 * Pourquoi les quatre formations se complètent, et le Pack 360 qui les réunit.
 *
 * Composant serveur : le prix du pack et ses mois réservables viennent de `commande.ts`,
 * la même source que le paiement.
 */

const ICONES: Record<CodeFormation, typeof BarChart3> = {
  DATA360: BarChart3,
  CONTENT360: PenTool,
  MKT360: Megaphone,
  IA360: Sparkles,
};

const VERBES: Record<CodeFormation, { verbe: string; texte: string }> = {
  DATA360: { verbe: "Lire", texte: "Vous savez qui achète, quoi proposer et à quel prix — chiffres à l'appui." },
  CONTENT360: { verbe: "Créer", texte: "Vous produisez le contenu qui attire exactement ces clients-là." },
  MKT360: { verbe: "Vendre", texte: "Vous transformez l'attention en ventes, campagne après campagne." },
  IA360: { verbe: "Automatiser", texte: "Vous gagnez des heures chaque semaine sur tout le reste." },
};

export function ComplementSection() {
  return (
    <section id="pack-360" className="py-20 lg:py-28">
      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full bg-teal-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-teal-700">
            Pourquoi nos formations font la différence
          </span>
          <h2 className="mt-5 font-display text-display-lg font-extrabold text-ink text-balance">
            Seules, elles vous font avancer. <span className="text-teal-600">Ensemble, elles lancent votre projet.</span>
          </h2>
          <p className="mt-4 text-lg text-ink-soft">
            Un projet qui marche, c&apos;est un marché bien lu, un contenu qui parle, une offre qui se vend et une marque
            cohérente du premier post à la facture. Nos quatre formations couvrent exactement ça.
          </p>
        </div>

        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ORDRE.map((c, i) => {
            const f = FORMATIONS[c];
            const I = ICONES[c];
            return (
              <li key={c} className="verre-clair relative rounded-2xl border border-mist p-6">
                <span className="text-xs font-bold text-ink-muted">0{i + 1}</span>
                <div className={`mt-2 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${f.couleur.degrade} text-white`}>
                  <I size={20} aria-hidden />
                </div>
                <p className="mt-4 font-display text-2xl font-extrabold text-ink">{VERBES[c].verbe}</p>
                <p className={`text-sm font-bold ${f.couleur.texte}`}>{f.nom}</p>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{VERBES[c].texte}</p>
              </li>
            );
          })}
        </ol>

        <p className="mx-auto mt-8 max-w-2xl text-center font-display text-lg font-bold text-ink">
          Ce qu&apos;on vous apprend, même l&apos;IA ne sait pas l&apos;assembler d&apos;un seul bloc ;)
        </p>

        <div className="mt-12">
          <PackOffre />
        </div>
      </div>
    </section>
  );
}

/** La carte du Pack 360 : les quatre formations avec la remise du pack, le prix du pack, un seul bouton. */
export function PackOffre({ titre = true }: { titre?: boolean }) {
  const prochain = cyclesPack(new Date(), 6)[0];
  return (
    <div className="fond-espace relative overflow-hidden rounded-3xl">
      <div aria-hidden className="grille-tech pointer-events-none absolute inset-0" />
      <div className="relative grid gap-8 p-7 md:p-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div>
          {titre ? (
            <>
              <p className="text-xs font-bold uppercase tracking-widest text-cyan-300">Pack 360 · les 4 formations</p>
              <h3 className="mt-2 font-display text-display-md font-extrabold text-white text-balance">
                Tout le parcours. <span className="texte-lumiere">Un seul forfait.</span>
              </h3>
            </>
          ) : null}
          <p className="mt-3 max-w-xl text-white/75">
            {PACK.heures} heures en {PACK.jours} jours sur un mois : vous lisez votre marché, créez votre contenu, le vendez et
            automatisez le tout. Un seul forfait, un seul échéancier.
          </p>
          <ul className="mt-6 divide-y divide-white/10 rounded-2xl bg-white/5 text-sm">
            {ORDRE.map((c) => {
              const f = FORMATIONS[c];
              return (
                <li key={c} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 py-3">
                  <span className="text-white">
                    <Check size={14} className="mr-1.5 inline text-cyan-300" aria-hidden />
                    {f.nom} <span className="text-white/50">· {dureeCourte(f)}</span>
                  </span>
                  <PrixPack code={c} sombre />
                </li>
              );
            })}
          </ul>
        </div>

        <div className="verre rounded-2xl p-6 text-center lg:text-left">
          <p className="text-sm text-white/60">Pack 360</p>
          <p className="mt-1 font-display text-5xl font-extrabold text-white">{euros(PACK.prix)}</p>
          <p className="text-sm text-white/65">TTC · OPCO ou France Travail possible</p>
          {prochain ? (
            <p className="mt-4 flex items-center justify-center gap-1.5 text-sm font-semibold text-white lg:justify-start">
              <CalendarDays size={15} className="text-cyan-300" aria-hidden /> Prochain parcours : {nomMois(prochain.mois)}
            </p>
          ) : null}
          <Link
            href={prochain ? `/reserver?formation=${PACK.code}&session=${prochain.code}` : PACK.href}
            className="bouton-neon mt-5 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full px-6 font-bold"
          >
            Je prends le Pack 360 <ArrowRight size={18} aria-hidden />
          </Link>
          <p className="mt-3 text-xs text-white/55">12 places maximum par session. Quand c&apos;est complet, c&apos;est le mois suivant.</p>
        </div>
      </div>
    </div>
  );
}

/** Les mois où le Pack 360 se réserve, avec les dates de chaque formation. */
export function PackCycles({ mois = 6 }: { mois?: number }) {
  const cycles = cyclesPack(new Date(), mois);
  if (!cycles.length) return null;
  return (
    <div>
      <h2 className="font-display text-display-md font-extrabold text-ink">Le Pack 360, mois par mois</h2>
      <p className="mt-2 text-sm text-ink-soft">
        Les 4 formations d&apos;un même mois pour {euros(PACK.prix)}.
      </p>
      <ul className="mt-6 space-y-3">
        {cycles.map((c) => (
          <li key={c.code} className="verre-clair flex flex-col gap-4 rounded-2xl border border-mist p-5 sm:flex-row sm:items-center">
            <div className="flex-1">
              <p className="font-display text-lg font-extrabold capitalize text-ink">{nomMois(c.mois)}</p>
              <ul className="mt-2 grid gap-1 text-xs text-ink-soft sm:grid-cols-2">
                {c.sessions.map((s) => (
                  <li key={s.code}>
                    <b className={FORMATIONS[s.formation].couleur.texte}>{FORMATIONS[s.formation].nom}</b> · {libelleDates(s)}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <p className="font-display text-2xl font-extrabold text-ink">{euros(PACK.prix)}</p>
              <Link
                href={`/reserver?formation=${PACK.code}&session=${c.code}`}
                className="bouton-neon inline-flex min-h-[44px] items-center gap-1.5 whitespace-nowrap rounded-full px-5 text-sm font-bold"
              >
                Je réserve <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
