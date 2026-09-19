"use client";

import { useEffect, useState } from "react";

/**
 * Une console où l'on voit un agent travailler.
 *
 * Elle illustre ce que font les outils inclus dans la place — lire, extraire, rédiger,
 * trier — et elle est **étiquetée « démonstration »** : ce sont des exemples de tâches,
 * pas des résultats ni des chiffres d'activité. Aucun nombre n'y figure, précisément pour
 * qu'on ne puisse pas les lire comme des statistiques.
 *
 * Une étape sur deux s'arrête sur « en attente de votre validation » : c'est ce que la
 * formation enseigne, et la démonstration ne doit pas enseigner le contraire.
 *
 * ── Pourquoi les cinq lignes sont toujours dans la page ─────────────────────────────
 *
 * La version précédente n'affichait que les `n` premières étapes (`ETAPES.slice(0, n)`).
 * La boîte grandissait donc d'une ligne toutes les 1,8 seconde puis retombait d'un coup à
 * une seule : le héros changeait de hauteur cinq fois par cycle, et toute la page en
 * dessous montait et descendait avec lui. Les boutons « Je choisis ma formation » et
 * « Voir les dates » se déplaçaient sous le curseur de la personne qui allait cliquer.
 *
 * Ici, les cinq lignes sont rendues en permanence : la boîte a sa taille définitive dès le
 * premier rendu, et l'animation ne touche plus qu'à `opacity`, qui ne déclenche aucun
 * recalcul de mise en page. Réserver la place avec le vrai contenu — plutôt qu'avec une
 * hauteur fixe en pixels — est ce qui fait tenir la solution à toutes les largeurs : à
 * 360 px les lignes passent sur deux lignes, et la hauteur réservée suit toute seule.
 *
 * Le cycle se termine par une pause sur la liste complète, puis un fondu : l'œil a le
 * temps de lire la dernière ligne avant que ça reparte. Un retour brutal à une ligne
 * ramenait le regard en haut et cassait la lecture du titre.
 */

const ETAPES: { outil: string; action: string; statut: string }[] = [
  { outil: "Agent", action: "lecture des factures du mois", statut: "extraites vers le tableur" },
  { outil: "Secrétariat", action: "relances clients rédigées", statut: "en attente de votre validation" },
  { outil: "Réunion", action: "synthèse et actions préparées", statut: "envoyées aux participants" },
  { outil: "Emploi", action: "offres triées selon le profil", statut: "candidatures à relire" },
  { outil: "Automatisation", action: "devis entrant détecté", statut: "en attente de votre validation" },
];

const CADENCE_MS = 1800;
/** Le temps de lire la liste entière avant que le cycle reparte. */
const PAUSE_FINALE_MS = 2800;

export function ConsoleAgent() {
  // `n` = nombre de lignes visibles. 0 pendant le fondu de fin de cycle.
  const [n, setN] = useState(1);
  const [reduit, setReduit] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduit(true);
      setN(ETAPES.length);
      return;
    }
    // Le compte est tenu ici, pas dans le `setN` : planifier un minuteur depuis une
    // fonction de mise à jour la rendrait impure, et React la rejoue en développement —
    // on se retrouverait avec deux boucles qui avancent la même console.
    let courant = 1;
    let minuteur: ReturnType<typeof setTimeout>;
    const delai = (v: number) =>
      v === 0 ? 700 : v === ETAPES.length ? PAUSE_FINALE_MS : CADENCE_MS;
    const avancer = () => {
      courant = courant >= ETAPES.length ? 0 : courant + 1;
      setN(courant);
      minuteur = setTimeout(avancer, delai(courant));
    };
    minuteur = setTimeout(avancer, CADENCE_MS);
    return () => clearTimeout(minuteur);
  }, []);

  return (
    <div className="verre overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <span className="font-mono text-[11px] tracking-wide text-white/55">vigil · démonstration</span>
      </div>

      {/* `aria-live="off"` : une démonstration décorative n'a pas à être annoncée en boucle.
          Le contenu entier reste lisible par un lecteur d'écran, qui ignore l'opacité. */}
      <ul className="space-y-2.5 px-4 py-4 font-mono text-[12.5px] leading-relaxed sm:text-[13px]" aria-live="off">
        {ETAPES.map((e, i) => {
          const attente = e.statut.includes("validation");
          const visible = i < n;
          const derniere = i === n - 1 && !reduit;
          return (
            <li
              key={e.outil}
              className="flex flex-col transition-opacity duration-500 motion-reduce:transition-none"
              style={{ opacity: visible ? 1 : 0 }}
            >
              <span className="text-white/90">
                <span className="text-cyan-300">›</span>{" "}
                <span className="text-[#9cc0ff]">{e.outil}</span> · {e.action}
              </span>
              <span className={attente ? "pl-3 text-amber-300" : "pl-3 text-emerald-300"}>
                {attente ? "◷" : "✓"} {e.statut}
                {derniere && <span className="curseur ml-1 text-white/70">▍</span>}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
