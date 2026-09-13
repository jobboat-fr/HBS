/**
 * Les règles de la commande — partagées par le tunnel, le webhook, le prélèvement des
 * échéances et les CGV. Une seule source, pour que la page juridique et les prélèvements ne
 * puissent pas diverger.
 *
 * Aucune dépendance serveur ici : ce module est aussi importé par des pages.
 */

export const PRODUIT = {
  code: "IA360",
  nom: "Formation IA 360",
  description: "21 heures de formation en direct, 6 ateliers pratiques, outils IA inclus.",
  /** En centimes. 1 300 € par place, toutes taxes comprises. */
  prixUnitaire: 130_000,
  devise: "eur",
  session: { code: "IA360-2026-10", debut: "2026-10-26", fin: "2026-11-09", libelle: "session du 26 octobre 2026" },
  placesMax: 12,
} as const;

export type Profil = "entreprise" | "particulier";

/** Version des CGV acceptée — conservée sur la commande ; à changer avec la page /cgv. */
export const CGV_VERSION = "2026-09-14";

/** 14 jours : les 10 de L6353-5 du Code du travail et les 14 du Code de la consommation. */
export const RETRACTATION_JOURS = 14;

const JOUR = 86_400_000;
const midi = (iso: string) => new Date(`${iso}T12:00:00+01:00`);

/**
 * L'échéancier du particulier (art. L6353-6 du Code du travail) :
 * rien avant la fin de la rétractation, 30 % au plus à son terme, le solde échelonné au fil
 * de la formation. Si la commande est tardive, chaque échéance glisse au jour suivant la
 * précédente plutôt que de tomber avant la fin du délai.
 */
export function echeancier(commandeLe: Date) {
  const finRetractation = new Date(commandeLe.getTime() + RETRACTATION_JOURS * JOUR);
  const e1 = new Date(finRetractation.getTime() + JOUR);
  const e2 = new Date(Math.max(midi(PRODUIT.session.debut).getTime(), e1.getTime() + JOUR));
  const e3 = new Date(Math.max(midi(PRODUIT.session.fin).getTime(), e2.getTime() + JOUR));
  const parts = [0.3, 0.35, 0.35] as const;
  return [e1, e2, e3].map((date, i) => ({ rang: i + 1, date, part: parts[i] }));
}

/** Montants en centimes ; le dernier absorbe l'arrondi pour que la somme soit exacte. */
export function montantsEcheances(total: number) {
  const a = Math.round(total * 0.3);
  const b = Math.round(total * 0.35);
  return [a, b, total - a - b];
}

export const euros = (centimes: number) =>
  (centimes / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR", minimumFractionDigits: 0 });
