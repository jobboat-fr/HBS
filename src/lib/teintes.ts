/**
 * Une teinte par domaine de compétences, reprise partout où le domaine apparaît.
 *
 * Module ordinaire, et non `"use client"` : une page serveur qui importerait une constante
 * depuis un composant client ne recevrait pas l'objet mais une référence client, et chaque
 * `TEINTE_DC[code]` vaudrait `undefined` au rendu.
 */
export const TEINTE_DC: Record<string, { barre: string; texte: string; fond: string }> = {
  DC1: { barre: "bg-[#2e5fe0]", texte: "text-[#2e5fe0]", fond: "from-[#2e5fe0]/10" },
  DC2: { barre: "bg-[#0e8574]", texte: "text-[#0e8574]", fond: "from-[#0e8574]/10" },
  DC3: { barre: "bg-[#7a3e9d]", texte: "text-[#7a3e9d]", fond: "from-[#7a3e9d]/10" },
};
