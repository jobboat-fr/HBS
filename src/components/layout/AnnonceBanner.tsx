import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { annonce } from "@/lib/site";

/**
 * Bandeau d'annonce, au-dessus de l'en-tête et sur toutes les pages.
 *
 * Une seule source : `annonce` dans `site.ts`. La date lisible et la date ISO y sont
 * déclarées ensemble, si bien que le texte affiché au visiteur et la date machine ne
 * peuvent pas diverger — c'est exactement le genre d'écart qui laisse une session
 * « ouverte » trois semaines après qu'elle a commencé.
 *
 * `actif: false` retire le bandeau sans toucher au balisage ni aux pages.
 */
export function AnnonceBanner() {
  if (!annonce.actif) return null;

  return (
    <div className="bg-ink text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2.5 text-center text-sm">
        {/* teal-200 (#96B6F7) et non coral : dans ce thème « coral » est du noir, invisible
            sur l'encre. Le bleu clair de la palette officielle porte sur fond #0B2239. */}
        <Sparkles aria-hidden className="h-4 w-4 shrink-0 text-teal-200" />
        <span className="font-semibold">{annonce.titre}</span>
        <span className="text-white/85">
          {/* La date machine sert aux lecteurs d'écran et aux moteurs ; le texte reste lisible. */}
          Première session le{" "}
          <time dateTime={annonce.iso} className="font-semibold text-white">
            {annonce.dateLisible}
          </time>{" "}
          — inscriptions ouvertes.
        </span>
        <Link
          href={annonce.href}
          className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 font-semibold underline-offset-2 transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {annonce.lienLabel}
          <ArrowRight aria-hidden className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
