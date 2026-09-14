/**
 * Le catalogue vendu en ligne, le planning des sessions et les règles de la commande —
 * partagés par les pages, le tunnel, le webhook, la tâche des échéances et les CGV. Une seule
 * source, pour que le calendrier affiché, le prix payé et les prélèvements ne divergent jamais.
 *
 * Aucune dépendance serveur ici : ce module est aussi importé par des composants client.
 */

// ── Les formations 360 ────────────────────────────────────────────────────────────────

export type CodeFormation = "DATA360" | "CONTENT360" | "MKT360" | "IA360";

export type Formation = {
  code: CodeFormation;
  slug: string;
  nom: string;
  accroche: string;
  /** En centimes, toutes taxes comprises. */
  prix: number;
  couleur: { texte: string; fond: string; bord: string; degrade: string };
  resume: string;
  pourQui: string;
  prerequis: string;
  objectifs: string[];
  inclus: string[];
  /** Page détaillée. */
  href: string;
};

const commun = {
  duree: "21 heures sur la semaine",
  modalite: "À distance, en direct (présentiel possible en entreprise)",
  effectif: "4 à 12 participants",
};
export const FORMAT = commun;

export const FORMATIONS: Record<CodeFormation, Formation> = {
  DATA360: {
    code: "DATA360",
    slug: "data-analyse-360",
    nom: "Data Analyse 360",
    accroche: "Lire entre les chiffres",
    prix: 180_000,
    couleur: { texte: "text-cyan-700", fond: "bg-cyan-50", bord: "border-cyan-300", degrade: "from-cyan-500 to-sky-600" },
    resume:
      "Transformer vos tableaux en décisions : poser les bonnes questions à vos données, les nettoyer, construire vos indicateurs et analyser avec l'IA sans vous laisser tromper par les chiffres.",
    pourQui: "Dirigeants, managers, fonctions commerciales, RH, finance ou logistique, indépendants et personnes en reconversion.",
    prerequis: "Savoir utiliser un tableur (ouvrir, trier, filtrer). Aucune compétence en statistiques ni en programmation.",
    objectifs: [
      "Formuler une question métier à laquelle les données peuvent répondre",
      "Nettoyer, structurer et fiabiliser un jeu de données réel",
      "Construire des indicateurs et un tableau de bord lisible",
      "Analyser avec l'IA et vérifier chaque conclusion avant de décider",
      "Repérer les pièges : biais, corrélations trompeuses, moyennes qui mentent",
      "Présenter une recommandation chiffrée et défendable",
    ],
    inclus: ["Vos propres données comme matière, anonymisées", "Modèles de tableaux de bord réutilisables", "Attestation de fin de formation"],
    href: "/formations/data-analyse-360",
  },
  CONTENT360: {
    code: "CONTENT360",
    slug: "content-making-360",
    nom: "Content Making 360",
    accroche: "Votre prochaine tendance",
    prix: 120_000,
    couleur: { texte: "text-fuchsia-700", fond: "bg-fuchsia-50", bord: "border-fuchsia-300", degrade: "from-fuchsia-500 to-pink-600" },
    resume:
      "Repérer les tendances avant qu'elles passent, bâtir une ligne éditoriale et produire textes, visuels et vidéos courtes avec l'IA — à un rythme tenable, sans perdre votre voix.",
    pourQui: "Indépendants, commerçants, chargés de communication, créateurs, entreprises qui veulent exister sur les réseaux.",
    prerequis: "Utiliser un smartphone et un ordinateur. Aucune compétence en graphisme ou en montage.",
    objectifs: [
      "Repérer les tendances et les formats qui fonctionnent dans votre secteur",
      "Définir une ligne éditoriale et un ton qui vous ressemblent",
      "Produire textes, visuels et vidéos courtes avec l'IA",
      "Organiser un calendrier et une chaîne de production tenables",
      "Respecter droit d'auteur, droit à l'image et transparence sur l'IA",
      "Mesurer ce qui marche et ajuster",
    ],
    inclus: ["Un mois de contenus planifiés à la sortie", "Modèles de scripts et de publications", "Attestation de fin de formation"],
    href: "/formations/content-making-360",
  },
  MKT360: {
    code: "MKT360",
    slug: "marketing-360",
    nom: "Marketing 360",
    accroche: "Du premier clic au client fidèle",
    prix: 150_000,
    couleur: { texte: "text-amber-700", fond: "bg-amber-50", bord: "border-amber-300", degrade: "from-amber-500 to-orange-600" },
    resume:
      "Construire un marketing qui vend : votre client, votre proposition de valeur, votre tunnel, vos campagnes et leur automatisation par l'IA — avec des chiffres pour savoir ce qui rapporte.",
    pourQui: "Dirigeants de TPE-PME, indépendants, commerciaux, responsables marketing débutants ou en reconversion.",
    prerequis: "Aucun prérequis technique. Venir avec une offre, un produit ou un projet réel.",
    objectifs: [
      "Définir sa cible et une proposition de valeur claire",
      "Cartographier le parcours client et construire son tunnel de vente",
      "Lancer des campagnes : référencement, réseaux sociaux, emailing, publicité",
      "Automatiser la prospection et le suivi avec l'IA",
      "Prospecter dans les règles : RGPD et consentement",
      "Piloter par les indicateurs et le retour sur investissement",
    ],
    inclus: ["Votre plan marketing sur 90 jours", "Séquences d'emails et modèles de campagnes", "Attestation de fin de formation"],
    href: "/formations/marketing-360",
  },
  IA360: {
    code: "IA360",
    slug: "ia-360",
    nom: "Formation IA 360",
    accroche: "Mettez l'IA au travail",
    prix: 130_000,
    couleur: { texte: "text-red-700", fond: "bg-red-50", bord: "border-red-300", degrade: "from-red-500 to-rose-600" },
    resume:
      "Comprendre ce que fait réellement l'IA, la faire travailler de façon fiable sur vos documents, et repartir avec vos agents, vos automatisations et votre dossier IA.",
    pourQui: "Particuliers, indépendants, salariés et entreprises — aucune compétence technique.",
    prerequis: "Aucun prérequis technique. Venir avec un cas réel de votre activité.",
    objectifs: [
      "Comprendre le fonctionnement et les limites des outils d'IA",
      "Vérifier et fiabiliser les résultats d'une IA",
      "Protéger les données : RGPD et règlement européen sur l'IA",
      "Déployer agents et automatisations sur un cas réel",
    ],
    inclus: ["Outils IA inclus : agents, automatisations, secrétariat, assistant de réunion…", "Dossier IA de 9 pièces datées", "Certificat IA 360"],
    href: "/formations",
  },
};

export const ORDRE: CodeFormation[] = ["DATA360", "CONTENT360", "MKT360", "IA360"];

// ── Le planning ───────────────────────────────────────────────────────────────────────
//
// Chaque semaine a son thème. Dans un mois : le 1er lundi Data Analyse, le 2e Content Making,
// le 3e Marketing, et le **dernier lundi toujours la Formation IA 360**. Un mois à cinq lundis
// laisse sa 4e semaine sans session publique (sessions dédiées aux entreprises).
//
// Tout ce qui commence avant le lancement officiel du 26 octobre 2026 est complet.

export const LANCEMENT = "2026-10-26";
export const PLACES_MAX = 12;

export type Session = {
  code: string;
  formation: CodeFormation;
  debut: string; // lundi, AAAA-MM-JJ
  fin: string; // vendredi
  statut: "complet" | "ouvert" | "passee";
};

const iso = (d: Date) => d.toISOString().slice(0, 10);
const utc = (a: number, m: number, j: number) => new Date(Date.UTC(a, m, j));

export function lundisDuMois(annee: number, mois: number) {
  const out: Date[] = [];
  const d = utc(annee, mois, 1);
  while (d.getUTCDay() !== 1) d.setUTCDate(d.getUTCDate() + 1);
  while (d.getUTCMonth() === mois) {
    out.push(new Date(d));
    d.setUTCDate(d.getUTCDate() + 7);
  }
  return out;
}

/** Les sessions de `mois` mois, à partir du mois de `depuis`. */
export function planning(depuis = new Date(), mois = 6): Session[] {
  const aujourdhui = iso(depuis);
  const sessions: Session[] = [];
  for (let k = 0; k < mois; k++) {
    const ref = utc(depuis.getUTCFullYear(), depuis.getUTCMonth() + k, 1);
    const lundis = lundisDuMois(ref.getUTCFullYear(), ref.getUTCMonth());
    const themes: (CodeFormation | null)[] = lundis.map((_, i) =>
      i === lundis.length - 1 ? "IA360" : i === 0 ? "DATA360" : i === 1 ? "CONTENT360" : i === 2 ? "MKT360" : null,
    );
    lundis.forEach((lundi, i) => {
      const formation = themes[i];
      if (!formation) return;
      const debut = iso(lundi);
      const vendredi = new Date(lundi);
      vendredi.setUTCDate(vendredi.getUTCDate() + 4);
      const statut = debut <= aujourdhui ? "passee" : debut < LANCEMENT ? "complet" : "ouvert";
      sessions.push({ code: `${formation}-${debut}`, formation, debut, fin: iso(vendredi), statut });
    });
  }
  return sessions;
}

/** Retrouve une session par son code, recalculée — un code inventé ne correspond à rien. */
export function sessionParCode(code: string, depuis = new Date()): Session | null {
  const m = /^(DATA360|CONTENT360|MKT360|IA360)-(\d{4})-(\d{2})-(\d{2})$/.exec(code);
  if (!m) return null;
  const debut = utc(Number(m[2]), Number(m[3]) - 1, 1);
  const moisEcart = (debut.getUTCFullYear() - depuis.getUTCFullYear()) * 12 + debut.getUTCMonth() - depuis.getUTCMonth();
  if (moisEcart < 0 || moisEcart > 12) return null;
  return planning(depuis, moisEcart + 1).find((s) => s.code === code) ?? null;
}

export const prochaineSession = (formation: CodeFormation, depuis = new Date()) =>
  planning(depuis, 3).find((s) => s.formation === formation && s.statut === "ouvert") ?? null;

/** « 1er » et non « 1 » : la typographie française du premier jour du mois. */
const premier = (s: string) => s.replace(/^1(?=\s|$)/, "1er");

export const dateCourte = (isoDate: string) =>
  premier(new Date(`${isoDate}T12:00:00Z`).toLocaleDateString("fr-FR", { day: "numeric", month: "long", timeZone: "Europe/Paris" }));

export const libelleSemaine = (s: Pick<Session, "debut" | "fin">) => {
  const d = new Date(`${s.debut}T12:00:00Z`);
  const f = new Date(`${s.fin}T12:00:00Z`);
  const memeMois = d.getUTCMonth() === f.getUTCMonth();
  const jour = (x: Date, avecMois: boolean) =>
    premier(x.toLocaleDateString("fr-FR", { day: "numeric", ...(avecMois ? { month: "long" } : {}), timeZone: "Europe/Paris" }));
  return `du ${jour(d, !memeMois)} au ${jour(f, true)} ${f.getUTCFullYear()}`;
};

// ── Compatibilité : la Formation IA 360 et sa session de lancement ────────────────────

export const PRODUIT = {
  code: "IA360",
  nom: FORMATIONS.IA360.nom,
  description: "21 heures de formation en direct, 6 ateliers pratiques, outils IA inclus.",
  prixUnitaire: FORMATIONS.IA360.prix,
  devise: "eur",
  session: { code: `IA360-${LANCEMENT}`, debut: LANCEMENT, fin: "2026-10-30", libelle: "session du 26 octobre 2026" },
  placesMax: PLACES_MAX,
} as const;

// ── Règles de la commande ─────────────────────────────────────────────────────────────

export type Profil = "entreprise" | "particulier";

/** Version des CGV acceptée — conservée sur la commande ; à changer avec la page /cgv. */
export const CGV_VERSION = "2026-09-14";

/** 14 jours : les 10 de L6353-5 du Code du travail et les 14 du Code de la consommation. */
export const RETRACTATION_JOURS = 14;

const JOUR = 86_400_000;
const midi = (isoDate: string) => new Date(`${isoDate}T12:00:00+01:00`);

/**
 * L'échéancier du particulier (art. L6353-6 du Code du travail) :
 * rien avant la fin de la rétractation, 30 % au plus à son terme, le solde échelonné au fil
 * de la formation (premier et dernier jour). Si la commande est tardive, chaque échéance glisse
 * au jour suivant la précédente plutôt que de tomber avant la fin du délai.
 */
export function echeancier(commandeLe: Date, session: { debut: string; fin: string } = PRODUIT.session) {
  const finRetractation = new Date(commandeLe.getTime() + RETRACTATION_JOURS * JOUR);
  const e1 = new Date(finRetractation.getTime() + JOUR);
  const e2 = new Date(Math.max(midi(session.debut).getTime(), e1.getTime() + JOUR));
  const e3 = new Date(Math.max(midi(session.fin).getTime(), e2.getTime() + JOUR));
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
