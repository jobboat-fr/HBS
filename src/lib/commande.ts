/**
 * Le catalogue vendu en ligne, le planning des sessions et les règles de la commande —
 * partagés par les pages, le tunnel, le webhook, la tâche des échéances et les CGV. Une seule
 * source, pour que le calendrier affiché, le prix payé et les prélèvements ne divergent jamais.
 *
 * Aucune dépendance serveur ici : ce module est aussi importé par des composants client.
 *
 * Les codes (`DATA360`, `CONTENT360`, `MKT360`, `IA360`) sont des identifiants internes —
 * sessions LEARN, métadonnées Stripe, commandes. Ils ne s'affichent jamais : le visiteur lit
 * `nom`.
 */

// ── Les quatre formations ────────────────────────────────────────────────────────────

export type CodeFormation = "DATA360" | "CONTENT360" | "MKT360" | "IA360";

export type Formation = {
  code: CodeFormation;
  slug: string;
  nom: string;
  accroche: string;
  /** Ce que la formation apporte aux trois autres. */
  role: string;
  jours: number;
  heures: number;
  /** En centimes, toutes taxes comprises. */
  prix: number;
  /** Remise appliquée dans le Pack 360 (0,15 = 15 %). */
  remisePack: number;
  couleur: { texte: string; fond: string; bord: string; degrade: string };
  resume: string;
  pourQui: string;
  prerequis: string;
  objectifs: string[];
  inclus: string[];
  /** Page détaillée. */
  href: string;
};

export const FORMAT = {
  modalite: "À distance, en direct (présentiel possible en entreprise)",
  effectif: "4 à 12 participants",
};

export const FORMATIONS: Record<CodeFormation, Formation> = {
  DATA360: {
    code: "DATA360",
    slug: "analyse-de-donnees",
    nom: "Analyse de données",
    accroche: "Lisez votre marché avant les autres",
    role: "Savoir à qui vendre",
    jours: 5,
    heures: 35,
    prix: 199_900,
    remisePack: 0.15,
    couleur: { texte: "text-cyan-700", fond: "bg-cyan-50", bord: "border-cyan-300", degrade: "from-cyan-500 to-sky-600" },
    resume: "Vos chiffres parlent. En 5 jours, vous apprenez à les faire parler — et à décider vite, sans vous tromper.",
    pourQui: "Dirigeants, indépendants, commerciaux, managers, personnes en reconversion.",
    prerequis: "Savoir ouvrir un tableur. Aucune statistique, aucun code.",
    objectifs: [
      "Poser la bonne question à vos données",
      "Nettoyer et fiabiliser un fichier réel",
      "Construire vos indicateurs et un tableau de bord clair",
      "Analyser avec l'IA et vérifier chaque conclusion",
      "Déjouer les pièges : biais, fausses corrélations, moyennes trompeuses",
      "Présenter une décision chiffrée qui convainc",
    ],
    inclus: ["Vos propres données comme matière", "Modèles de tableaux de bord réutilisables", "Attestation de fin de formation"],
    href: "/formations/analyse-de-donnees",
  },
  CONTENT360: {
    code: "CONTENT360",
    slug: "creation-de-contenu",
    nom: "Création de contenu",
    accroche: "Votre prochaine tendance, c'est vous",
    role: "Savoir quoi dire",
    jours: 5,
    heures: 35,
    prix: 185_000,
    remisePack: 0.15,
    couleur: { texte: "text-fuchsia-700", fond: "bg-fuchsia-50", bord: "border-fuchsia-300", degrade: "from-fuchsia-500 to-pink-600" },
    resume: "Textes, visuels, vidéos courtes : en 5 jours, vous produisez vite, bien, et chaque semaine — sans perdre votre voix.",
    pourQui: "Indépendants, commerçants, créateurs, chargés de communication, entreprises.",
    prerequis: "Un smartphone et un ordinateur. Aucun graphisme, aucun montage.",
    objectifs: [
      "Repérer les tendances et les formats qui marchent dans votre secteur",
      "Définir une ligne éditoriale et un ton reconnaissables",
      "Produire textes, visuels et vidéos courtes avec l'IA",
      "Tenir un calendrier de publication sans s'épuiser",
      "Respecter droit d'auteur, droit à l'image et transparence IA",
      "Mesurer ce qui marche et ajuster",
    ],
    inclus: ["Un mois de contenus planifiés à la sortie", "Modèles de scripts et de publications", "Attestation de fin de formation"],
    href: "/formations/creation-de-contenu",
  },
  MKT360: {
    code: "MKT360",
    slug: "marketing",
    nom: "Marketing",
    accroche: "Du premier clic au client fidèle",
    role: "Savoir vendre",
    jours: 3,
    heures: 21,
    prix: 150_000,
    remisePack: 0,
    couleur: { texte: "text-amber-700", fond: "bg-amber-50", bord: "border-amber-300", degrade: "from-amber-500 to-orange-600" },
    resume: "Votre cible, votre offre, vos campagnes : en 3 jours, vous construisez le tunnel qui transforme l'attention en ventes.",
    pourQui: "Dirigeants de TPE-PME, indépendants, commerciaux, porteurs de projet.",
    prerequis: "Aucun prérequis. Venez avec une offre ou un projet réel.",
    objectifs: [
      "Définir votre cible et une proposition de valeur nette",
      "Construire votre parcours client et votre tunnel de vente",
      "Lancer vos campagnes : référencement, réseaux, emailing, publicité",
      "Automatiser prospection et relances avec l'IA",
      "Prospecter dans les règles : RGPD et consentement",
      "Piloter au chiffre et au retour sur investissement",
    ],
    inclus: ["Votre plan marketing sur 90 jours", "Séquences d'emails et modèles de campagnes", "Attestation de fin de formation"],
    href: "/formations/marketing",
  },
  IA360: {
    code: "IA360",
    slug: "la-forge-ia",
    nom: "La Forge IA",
    accroche: "Mettez l'IA au travail",
    role: "Tout faire plus vite",
    jours: 3,
    heures: 21,
    prix: 130_000,
    remisePack: 0,
    couleur: { texte: "text-red-700", fond: "bg-red-50", bord: "border-red-300", degrade: "from-red-500 to-rose-600" },
    resume: "En 3 jours, l'IA travaille pour vous : agents, automatisations, documents fiables. Vous gagnez des heures dès la semaine suivante.",
    pourQui: "Particuliers, indépendants, salariés, entreprises — sans compétence technique.",
    prerequis: "Aucun prérequis technique. Venez avec un cas réel de votre activité.",
    objectifs: [
      "Comprendre ce que fait vraiment l'IA, et ses limites",
      "Vérifier et fiabiliser ses résultats",
      "Protéger vos données : RGPD et règlement européen sur l'IA",
      "Déployer agents et automatisations sur votre propre cas",
    ],
    inclus: ["Outils IA inclus dans votre forfait : agents, automatisations, assistant de réunion…", "Votre dossier IA de 9 pièces", "Certificat La Forge IA"],
    href: "/formations",
  },
};

export const ORDRE: CodeFormation[] = ["DATA360", "CONTENT360", "MKT360", "IA360"];

/** « 35 heures en 5 jours » */
export const duree = (f: Pick<Formation, "jours" | "heures">) => `${f.heures} heures en ${f.jours} jours`;
export const dureeCourte = (f: Pick<Formation, "jours" | "heures">) => `${f.jours} jours · ${f.heures} h`;

// ── Le Pack 360 : les quatre ensemble ────────────────────────────────────────────────

export const PACK = {
  code: "PACK360",
  nom: "Pack 360",
  accroche: "Lire, créer, vendre, automatiser",
  jours: ORDRE.reduce((n, c) => n + FORMATIONS[c].jours, 0),
  heures: ORDRE.reduce((n, c) => n + FORMATIONS[c].heures, 0),
  /** Prix de chaque formation dans le pack, remise appliquée (centimes). */
  prixDans: (c: CodeFormation) => Math.round(FORMATIONS[c].prix * (1 - FORMATIONS[c].remisePack)),
  get prix() {
    return ORDRE.reduce((n, c) => n + this.prixDans(c), 0);
  },
  get prixSepare() {
    return ORDRE.reduce((n, c) => n + FORMATIONS[c].prix, 0);
  },
  href: "/pack-360",
};

/** Le nom affiché d'un produit commandé : une formation ou le Pack 360. */
export const nomProduit = (code: string | null | undefined) =>
  code === PACK.code ? PACK.nom : FORMATIONS[code as CodeFormation]?.nom ?? "votre formation";

// ── Le planning ───────────────────────────────────────────────────────────────────────
//
// Chaque mois suit le même ordre : 1er lundi Analyse de données (5 jours), 2e Création de
// contenu (5 jours), 3e Marketing (3 jours, lundi–mercredi), et le dernier lundi du mois La
// Forge IA (3 jours, lundi–mercredi). Un mois à cinq lundis laisse sa 4e semaine libre
// (sessions dédiées aux entreprises).
//
// Tout ce qui commence avant le 26 octobre 2026 est complet.

export const LANCEMENT = "2026-10-26";
export const PLACES_MAX = 12;

export type Session = {
  code: string;
  formation: CodeFormation;
  debut: string; // lundi, AAAA-MM-JJ
  fin: string;
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
      const dernierJour = new Date(lundi);
      dernierJour.setUTCDate(dernierJour.getUTCDate() + FORMATIONS[formation].jours - 1);
      const statut = debut <= aujourdhui ? "passee" : debut < LANCEMENT ? "complet" : "ouvert";
      sessions.push({ code: `${formation}-${debut}`, formation, debut, fin: iso(dernierJour), statut });
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

/** La prochaine session ouverte, toutes formations confondues. */
export const prochaineSessionTous = (depuis = new Date()) =>
  planning(depuis, 3).find((s) => s.statut === "ouvert") ?? null;

export type CyclePack = { code: string; mois: string; sessions: Session[]; debut: string; fin: string };

/**
 * Les mois où le Pack 360 se réserve : les quatre sessions du mois sont ouvertes. Code
 * `PACK360-AAAA-MM`.
 */
export function cyclesPack(depuis = new Date(), mois = 6): CyclePack[] {
  const parMois = new Map<string, Session[]>();
  for (const s of planning(depuis, mois)) {
    const k = s.debut.slice(0, 7);
    parMois.set(k, [...(parMois.get(k) ?? []), s]);
  }
  const out: CyclePack[] = [];
  for (const [k, liste] of parMois) {
    const complet = ORDRE.every((c) => liste.some((s) => s.formation === c && s.statut === "ouvert"));
    if (!complet) continue;
    const sessions = ORDRE.map((c) => liste.find((s) => s.formation === c)!);
    out.push({ code: `PACK360-${k}`, mois: k, sessions, debut: sessions[0].debut, fin: sessions[sessions.length - 1].fin });
  }
  return out;
}

export function cycleParCode(code: string, depuis = new Date()): CyclePack | null {
  if (!/^PACK360-\d{4}-\d{2}$/.test(code)) return null;
  return cyclesPack(depuis, 13).find((c) => c.code === code) ?? null;
}

/** « 1er » et non « 1 » : la typographie française du premier jour du mois. */
const premier = (s: string) => s.replace(/^1(?=\s|$)/, "1er");

export const dateCourte = (isoDate: string) =>
  premier(new Date(`${isoDate}T12:00:00Z`).toLocaleDateString("fr-FR", { day: "numeric", month: "long", timeZone: "Europe/Paris" }));

export const nomMois = (aaaaMm: string) =>
  new Date(`${aaaaMm}-15T12:00:00Z`).toLocaleDateString("fr-FR", { month: "long", year: "numeric", timeZone: "Europe/Paris" });

/** « du 2 au 6 novembre 2026 » */
export const libelleSemaine = (s: Pick<Session, "debut" | "fin">) => {
  const d = new Date(`${s.debut}T12:00:00Z`);
  const f = new Date(`${s.fin}T12:00:00Z`);
  const memeMois = d.getUTCMonth() === f.getUTCMonth();
  const jour = (x: Date, avecMois: boolean) =>
    premier(x.toLocaleDateString("fr-FR", { day: "numeric", ...(avecMois ? { month: "long" } : {}), timeZone: "Europe/Paris" }));
  return `du ${jour(d, !memeMois)} au ${jour(f, true)} ${f.getUTCFullYear()}`;
};
export const libelleDates = libelleSemaine;

// ── Compatibilité : La Forge IA et sa première session ouverte ────────────────────────

export const PRODUIT = {
  code: "IA360",
  nom: FORMATIONS.IA360.nom,
  description: "21 heures en 3 jours, en direct, outils IA inclus dans votre forfait.",
  prixUnitaire: FORMATIONS.IA360.prix,
  devise: "eur",
  session: { code: `IA360-${LANCEMENT}`, debut: LANCEMENT, fin: "2026-10-28", libelle: "du 26 au 28 octobre 2026" },
  placesMax: PLACES_MAX,
} as const;

// ── Règles de la commande ─────────────────────────────────────────────────────────────

export type Profil = "entreprise" | "particulier";

/** Version des CGV acceptée — conservée sur la commande ; à changer avec la page /cgv. */
export const CGV_VERSION = "2026-09-16";

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

/** « 1 999 € », et « 1 572,50 € » quand il y a des centimes. */
export const euros = (centimes: number) =>
  (centimes / 100).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: centimes % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
