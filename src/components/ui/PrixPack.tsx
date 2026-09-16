import { FORMATIONS, PACK, euros, type CodeFormation } from "@/lib/commande";

/**
 * Le prix d'une formation dans une liste de prix qui se termine par le Pack 360.
 *
 * C'est le seul endroit où la remise du pack se voit : prix barré, prix dans le pack, pourcentage.
 * Partout ailleurs, chaque formation et le pack s'affichent à leur prix, sans commentaire.
 */
export function PrixPack({ code, sombre = false }: { code: CodeFormation; sombre?: boolean }) {
  const f = FORMATIONS[code];
  const prix = sombre ? "text-white" : "text-ink";
  if (f.remisePack <= 0) {
    return <b className={`whitespace-nowrap ${prix}`}>{euros(f.prix)}</b>;
  }
  return (
    <span className="flex flex-wrap items-baseline justify-end gap-x-2 whitespace-nowrap">
      <s className={sombre ? "text-white/40" : "text-ink-muted"}>{euros(f.prix)}</s>
      <b className={prix}>{euros(PACK.prixDans(code))}</b>
      <span
        className={`rounded-full px-2 py-0.5 text-xs font-bold ${
          sombre ? "bg-cyan-300/15 text-cyan-200" : "bg-teal-50 text-teal-700"
        }`}
      >
        −{Math.round(f.remisePack * 100)} %
      </span>
    </span>
  );
}
