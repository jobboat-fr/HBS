import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { annonce } from "@/lib/site";
import { FORMATIONS, dateCourte, prochaineSessionTous } from "@/lib/commande";

/**
 * Bandeau d'annonce, au-dessus de l'en-tête et sur toutes les pages : la prochaine session,
 * calculée depuis le planning — jamais une date saisie à la main qui resterait affichée trois
 * semaines après son début. `annonce` (site.ts) garde l'interrupteur et le repli.
 *
 * **Deux mises en page.** Sur un téléphone de 375 px, une ligne unique en `whitespace-nowrap`
 * coupait le bouton, seule raison d'être du bandeau. Sur mobile, la bande entière est donc le
 * lien, avec un texte court ; à partir de `sm`, la mise en page complète revient.
 *
 * La hauteur reste `h-10` dans les deux cas : l'en-tête est fixe et les sections compensent sa
 * hauteur avec `--entete` (112 px, `layout.tsx`). Une bande qui grandirait décalerait tout le site.
 */
export function AnnonceBanner() {
  if (!annonce.actif) return null;

  const s = prochaineSessionTous();
  const nom = s ? FORMATIONS[s.formation].nom : annonce.titre;
  const iso = s?.debut ?? annonce.iso;
  const date = s ? dateCourte(s.debut) : annonce.dateLisible;
  const href = s ? `/reserver?formation=${s.formation}&session=${s.code}` : annonce.href;

  return (
    <div className="h-10 bg-ink text-white">
      {/* ── Mobile : la bande entière est le lien ─────────────────────────── */}
      <Link
        href={href}
        className="flex h-full items-center justify-center gap-2 px-3 text-[13px] transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-white sm:hidden"
      >
        <Sparkles aria-hidden className="h-3.5 w-3.5 shrink-0 text-teal-200" />
        <span className="truncate">
          <span className="text-white/85">Prochaine session le </span>
          <time dateTime={iso} className="font-semibold">
            {date}
          </time>
        </span>
        <ArrowRight aria-hidden className="h-3.5 w-3.5 shrink-0" />
      </Link>

      {/* ── À partir de sm : la mise en page complète ─────────────────────── */}
      <div className="mx-auto hidden h-full max-w-7xl items-center justify-center gap-x-3 px-4 text-center text-sm sm:flex">
        {/* teal-200 et non coral : dans ce thème « coral » est du noir, invisible sur l'encre. */}
        <Sparkles aria-hidden className="h-4 w-4 shrink-0 text-teal-200" />
        <span className="truncate text-white/85">
          Prochaine session : <span className="font-semibold text-white">{nom}</span>, le{" "}
          <time dateTime={iso} className="font-semibold text-white">
            {date}
          </time>
          <span className="hidden lg:inline"> — 12 places seulement.</span>
        </span>
        <Link
          href={href}
          className="inline-flex shrink-0 items-center gap-1 rounded-full bg-white/10 px-3 py-1 font-semibold transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {annonce.lienLabel}
          <ArrowRight aria-hidden className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
