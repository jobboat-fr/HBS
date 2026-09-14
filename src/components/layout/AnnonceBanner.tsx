import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { annonce } from "@/lib/site";

/**
 * Bandeau d'annonce, au-dessus de l'en-tête et sur toutes les pages.
 *
 * Une seule source : `annonce` dans `site.ts`. La date lisible et la date ISO y sont
 * déclarées ensemble, si bien que le texte affiché et la date machine ne peuvent pas
 * diverger — c'est le genre d'écart qui laisse une session « ouverte » trois semaines après
 * son début. `actif: false` retire le bandeau sans toucher aux pages.
 *
 * **Deux mises en page, et c'est la correction d'un vrai défaut.** La version précédente
 * tenait sur une ligne avec `whitespace-nowrap` et `overflow-hidden` : sur un téléphone de
 * 375 px, le contenu mesurait 553 px. Cent soixante-dix-huit pixels étaient coupés, et le
 * bouton « Voir le programme » — la seule raison d'être du bandeau — tombait précisément
 * dans la partie invisible. La troncature ne se voyait pas : elle donnait une bande propre
 * et muette.
 *
 * Sur mobile, le bandeau **est** le lien : toute la bande est cliquable, avec un texte
 * court qui tient. À partir de `sm`, la mise en page complète revient avec son bouton.
 *
 * La hauteur reste `h-10` dans les deux cas, volontairement : l'en-tête est en position
 * fixe et les sections compensent sa hauteur avec la variable `--entete`, posée à 112 px
 * dans `layout.tsx`. Une bande qui grandirait sur mobile décalerait tout le site sans que
 * rien ne le signale.
 */
export function AnnonceBanner() {
  if (!annonce.actif) return null;

  return (
    <div className="h-10 bg-ink text-white">
      {/* ── Mobile : la bande entière est le lien ─────────────────────────── */}
      <Link
        href={annonce.href}
        className="flex h-full items-center justify-center gap-2 px-3 text-[13px] transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white sm:hidden"
      >
        <Sparkles aria-hidden className="h-3.5 w-3.5 shrink-0 text-teal-200" />
        <span className="truncate">
          {/* Texte court : « Formation IA 360 · prochaine session le 26 octobre » mesurait
              plus que la bande à 375 px et finissait en « 26 oct… », la date coupée. */}
          <span className="text-white/85">Lancement le </span>
          <time dateTime={annonce.iso} className="font-semibold">
            26 octobre
          </time>
          <span className="text-white/85"> · voir le planning</span>
        </span>
        <ArrowRight aria-hidden className="h-3.5 w-3.5 shrink-0" />
      </Link>

      {/* ── À partir de sm : la mise en page complète ─────────────────────── */}
      <div className="mx-auto hidden h-full max-w-7xl items-center justify-center gap-x-3 px-4 text-center text-sm sm:flex">
        {/* teal-200 (#96B6F7) et non coral : dans ce thème « coral » est du noir,
            invisible sur l'encre. Le bleu clair de la palette porte sur fond #0B2239. */}
        <Sparkles aria-hidden className="h-4 w-4 shrink-0 text-teal-200" />
        <span className="font-semibold">4 formations 360</span>
        <span className="truncate text-white/85">
          {/* La date machine sert aux lecteurs d'écran et aux moteurs ; le texte reste lisible. */}
          Lancement le{" "}
          <time dateTime={annonce.iso} className="font-semibold text-white">
            {annonce.dateLisible}
          </time>
          <span className="hidden lg:inline"> — puis chaque mois Data, Content, Marketing et IA.</span>
        </span>
        <Link
          href={annonce.href}
          className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white/10 px-3 py-1 font-semibold transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {annonce.lienLabel}
          <ArrowRight aria-hidden className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
