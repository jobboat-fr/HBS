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
 */

const ETAPES: { outil: string; action: string; statut: string }[] = [
  { outil: "Agent", action: "lecture des factures du mois", statut: "extraites vers le tableur" },
  { outil: "Secrétariat", action: "relances clients rédigées", statut: "en attente de votre validation" },
  { outil: "Réunion", action: "synthèse et actions préparées", statut: "envoyées aux participants" },
  { outil: "Emploi", action: "offres triées selon le profil", statut: "candidatures à relire" },
  { outil: "Automatisation", action: "devis entrant détecté", statut: "en attente de votre validation" },
];

export function ConsoleAgent() {
  const [n, setN] = useState(1);
  const [reduit, setReduit] = useState(false);

  useEffect(() => {
    const r = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduit(r);
    if (r) { setN(ETAPES.length); return; }
    const t = setInterval(() => setN((v) => (v >= ETAPES.length ? 1 : v + 1)), 1800);
    return () => clearInterval(t);
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

      <ul className="space-y-2.5 px-4 py-4 font-mono text-[12.5px] leading-relaxed sm:text-[13px]" aria-live="off">
        {ETAPES.slice(0, n).map((e, i) => {
          const attente = e.statut.includes("validation");
          const derniere = i === n - 1 && !reduit;
          return (
            <li key={e.outil + i} className="flex flex-col">
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
