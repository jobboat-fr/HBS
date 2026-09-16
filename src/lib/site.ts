/**
 * Contenu et configuration centralisés du site HBS FORMATION.
 * Toutes les informations légales proviennent de l'extrait Kbis (RCS Rouen, 23/03/2026).
 */

export const site = {
  name: "HBS FORMATION",
  shortName: "HBS",
  baseline: "Lire, créer, vendre, automatiser",
  // Aucun dispositif de financement annoncé ici : c'est la phrase que les moteurs citent.
  description:
    "Quatre formations courtes et concrètes : Analyse de données (5 jours), Création de contenu (5 jours), Marketing (3 jours) et La Forge IA (3 jours), ou les quatre dans le Pack 360. HBS FORMATION, organisme de formation à Rouen, certifié Qualiopi.",
  // Apex, pas www : www.hbs-formation.fr redirige (308) vers l'apex côté Vercel.
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://hbs-formation.fr",
  email: "contact@hbs-formation.fr",
  phone: "+33 2 32 08 11 07",
  city: "Rouen",
};

/** Mentions légales issues de l'extrait Kbis. */
export const legal = {
  raisonSociale: "HBS FORMATION",
  formeJuridique: "Société par actions simplifiée (SAS)",
  capital: "1 000 €",
  rcs: "Rouen 102 535 820",
  siren: "102 535 820",
  siret: "102 535 820 00017",
  naf: "8559A — Formation continue d'adultes",
  euid: "FR7608.102535820",
  greffe: "Greffe du Tribunal de Commerce de Rouen",
  siege: "50 Passage Saint-Étienne des Tonneliers, 76000 Rouen",
  president: "Yohan Ferroudj",
  immatriculation: "23 mars 2026",
  // Récépissé de déclaration d'activité — DREETS Normandie, 16/04/2026.
  numeroDeclarationActivite: "28760809976",
  declarationAutorite: "préfet de la région Normandie",
  declarationDate: "16 avril 2026",
  // Vérifié sur la liste publique des organismes de formation (DGEFP), 14/09/2026 :
  // certifié pour la seule catégorie « actions de formation » — pas le bilan de
  // compétences, pas la VAE, pas l'apprentissage. Toute mention doit citer la catégorie.
  qualiopi: true,
  qualiopiCategorie: "actions de formation",
  // Médiateur de la consommation (L612-1 C. conso) — obligatoire pour vendre aux particuliers.
  // À renseigner dès l'adhésion : « Nom — adresse — site ».
  mediateur: null as string | null,
};

export const navLinks = [
  { label: "Nos produits", href: "/produits" },
  { label: "Formations", href: "/#formations" },
  { label: "Pack 360", href: "/pack-360" },
  { label: "Planning", href: "/planning" },
  { label: "Tarifs", href: "/financement" },
  { label: "Entreprises", href: "/entreprises" },
  { label: "Contact", href: "/contact" },
] as const;

/**
 * Le titre remis à l'issue de La Forge IA.
 *
 * **Ce n'est pas un diplôme, et le mot ne doit pas être employé.** Un diplôme est délivré
 * au nom de l'État par un établissement habilité. HBS FORMATION est un organisme de
 * formation déclaré — l'enregistrement de sa déclaration d'activité « ne vaut pas agrément
 * de l'État » — et ne détient aucune certification enregistrée au RNCP ou au répertoire
 * spécifique.
 *
 * Ce que l'organisme peut délivrer, et qui a une valeur réelle : un **certificat qui lui est
 * propre**, adossé à une épreuve notée et à des livrables datés. C'est licite, c'est
 * vérifiable, et c'est défendable devant un auditeur. Le présenter comme un diplôme ne
 * l'améliorerait pas — cela le rendrait attaquable, et un candidat qui découvre la nuance
 * en entretien d'embauche se retourne contre l'organisme, pas contre le formateur.
 */
export const certificat = {
  nom: "Certificat La Forge IA",
  emetteur: "HBS FORMATION",
  mention: "Certificat délivré par l'organisme",
  // Ce qui rend le certificat sérieux, et qu'il faut dire à sa place.
  obtention: "Épreuve pratique de 45 min notée sur 20 (seuil 12) et revue croisée du dossier",
  preuve: "Remis avec les livrables datés produits pendant la formation",
  // La phrase qui accompagne le certificat partout où il est affiché.
  precision:
    "Certificat propre à HBS FORMATION. Il n'est pas enregistré au RNCP ni au répertoire spécifique, et ne constitue pas un diplôme d'État.",
} as const;

export const annonce = {
  actif: true,
  iso: "2026-10-26",
  dateLisible: "26 octobre 2026",
  titre: "La Forge IA",
  // « Prochaine » et jamais « première » : l'organisme ne se présente pas comme débutant. Le
  // bandeau calcule la prochaine session réelle depuis le planning ; ceci est le repli.
  texte: "Prochaine session le 26 octobre 2026.",
  href: "/planning",
  lienLabel: "Je réserve",
} as const;

/**
 * Le prix d'une place. Un seul tarif, outils compris.
 *
 * Aucune mention de régime de TVA tant qu'il n'est pas confirmé : l'exonération de
 * l'article 261-4-4°a porte sur la formation professionnelle continue, et une place qui
 * inclut l'accès à des outils logiciels peut ne pas relever entièrement de ce régime.
 * Mieux vaut ne rien affirmer qu'afficher un traitement fiscal que le comptable démentira.
 */
export const tarif = {
  montant: "1 300 €",
  unite: "par personne",
  resume: "21 heures en 3 jours, outils IA inclus dans votre forfait",
} as const;

/** Ce que comprend le forfait La Forge IA, au-delà des 21 heures de formation. */
export const outilsInclus = [
  { titre: "Agents IA", texte: "Des agents prêts à travailler sur vos tâches réelles." },
  { titre: "Couches d'automatisation", texte: "Vos enchaînements répétitifs confiés à la machine, sous contrôle." },
  { titre: "Recherche d'emploi automatisée", texte: "Un moteur qui trouve, trie et prépare les candidatures pertinentes." },
  { titre: "Secrétariat & gestion", texte: "Courriers, relances, dossiers : l'administratif pris en charge." },
  { titre: "Assistant de réunion", texte: "Notes, synthèse et suivi des actions après chaque réunion." },
  { titre: "Et d'autres outils", texte: "La boîte à outils s'enrichit à mesure que vos usages évoluent." },
] as const;

/** Piliers de formation — affichés en page d'accueil (3) et détaillés sur /formations. */
export const formations = [
  {
    slug: "la-forge-ia",
    disponible: true,
    icon: "Sparkles",
    title: "La Forge IA",
    tagline: "21 heures en 3 jours",
    description:
      "3 jours pour mettre l'IA au travail sur vos vrais dossiers : agents, automatisations, documents fiables — outils inclus dans votre forfait.",
    features: [
      "21 heures en 3 jours",
      "Outils IA inclus dans votre forfait",
      "Particuliers, indépendants et entreprises",
      "Certificat La Forge IA délivré par HBS FORMATION",
    ],
  },
  {
    slug: "formations-certifiantes",
    disponible: false,
    icon: "GraduationCap",
    title: "Formations certifiantes & continues",
    tagline: "Bientôt disponible",
    description: "Des parcours de montée en compétences pour les particuliers et les entreprises.",
    features: ["Bientôt disponible"],
  },
  {
    slug: "bilan-de-competences",
    disponible: false,
    icon: "Compass",
    title: "Bilan de compétences",
    tagline: "Bientôt disponible",
    description: "Un accompagnement individuel pour faire le point et construire votre projet.",
    features: ["Bientôt disponible"],
  },
  {
    slug: "vae",
    disponible: false,
    icon: "Award",
    title: "Validation des acquis (VAE)",
    tagline: "Bientôt disponible",
    description: "Faire reconnaître les compétences acquises par l'expérience.",
    features: ["Bientôt disponible"],
  },
  {
    slug: "e-learning-foad",
    disponible: false,
    icon: "MonitorPlay",
    title: "E-learning & FOAD",
    tagline: "Bientôt disponible",
    description: "Des contenus à distance, à suivre à votre rythme.",
    features: ["Bientôt disponible"],
  },
  {
    slug: "conseil-ingenierie",
    disponible: false,
    icon: "Lightbulb",
    title: "Conseil & ingénierie pédagogique",
    tagline: "Bientôt disponible",
    description: "Concevoir avec les organisations des dispositifs de formation sur mesure.",
    features: ["Bientôt disponible"],
  },
] as const;

/**
 * Le programme de La Forge IA, tel qu'il figure au document d'information du public
 * (IA360_00, v2). Toute modification se fait d'abord dans le programme, puis ici.
 */
export const programme = {
  fiche: [
    { label: "Durée", valeur: "21 heures", detail: "en 3 jours · ateliers de 3 h 30" },
    { label: "Rythme", valeur: "Lundi → mercredi", detail: "7 heures par jour, en direct" },
    { label: "Modalité", valeur: "À distance, en direct", detail: "présentiel possible en entreprise" },
    { label: "Effectif", valeur: "4 à 12", detail: "participants par session" },
    { label: "Horaires", valeur: "9h00 – 17h00", detail: "pause 12h30 – 13h30" },
    { label: "Prérequis", valeur: "Aucun technique", detail: "venir avec un cas réel de son activité" },
  ],
  domaines: [
    { code: "DC1", nom: "Comprendre l'IA et ses défaillances" },
    { code: "DC2", nom: "Produire de façon fiable, traçable et licite" },
    { code: "DC3", nom: "Décider, encadrer et engager" },
  ],
  journees: [
    {
      jour: "Journée 1", nom: "Connaissance", dc: "DC1",
      pieces: ["Grille de licéité", "Registre des risques", "Classification des données"],
      ateliers: [
        { code: "A1", titre: "Ouvrir la machine",
          objectif: "Expliquer ce que fait un modèle de langage quand il répond, et écarter les usages illicites avant toute conception.",
          notions: ["Le jeton, unité découpée et facturée", "Le contexte : sa vue, pas sa mémoire", "L'absence de mémoire entre deux tours", "La prédiction, cause mécanique de l'invention"] },
        { code: "A2", titre: "Défaillances, sécurité et gouvernance",
          objectif: "Identifier erreur, fuite et détournement, et produire le registre des risques et la procédure d'incident.",
          notions: ["L'hallucination et le biais d'automatisation", "L'IA de l'ombre dans l'entreprise", "L'injection de consigne", "La classification des données"] },
      ],
    },
    {
      jour: "Journée 2", nom: "Conformité", dc: "DC2",
      pieces: ["Jeu de référence mesuré", "Registre de traitement", "Charte d'usage"],
      ateliers: [
        { code: "A3", titre: "Produire un travail vérifiable",
          objectif: "Obtenir un résultat exact sur une tâche réelle, et prouver qu'il est exact.",
          notions: ["La consigne comme commande de travail", "Le contexte prime sur la formulation", "Les critères d'acceptation écrits avant", "Le jeu de référence"] },
        { code: "A4", titre: "Gouverner ses données et ses documents",
          objectif: "Faire travailler l'IA sur vos documents, et encadrer cet usage par une charte.",
          notions: ["Le « RAG » sans jargon", "La reconnaissance de texte", "Le schéma d'extraction", "La chaîne de traitement complète"] },
      ],
    },
    {
      jour: "Journée 3", nom: "Déploiement", dc: "DC3",
      pieces: ["Spécification encadrée", "Feuille de route 90 jours chiffrée", "Dossier complet"],
      ateliers: [
        { code: "A5", titre: "Cartographier et déléguer",
          objectif: "Décomposer un processus réel, décider ce qui relève de l'IA, et le spécifier.",
          notions: ["Cartographier un processus", "Génératif ou déterministe", "Ce qu'est vraiment un agent", "Pourquoi un agent est lent"] },
        { code: "A6", titre: "Chiffrer et engager",
          objectif: "Chiffrer un cas d'usage vérification comprise, et produire la feuille de route 90 jours.",
          notions: ["Le coût au jeton", "Le coût complet, vérification comprise", "Cache, raisonnement, traitements en lot", "Le retour sur investissement chiffré"] },
      ],
    },
  ],
  evaluation: [
    { quand: "Avant l'entrée", quoi: "Test de positionnement", seuil: "oriente votre parcours", clef: false },
    { quand: "Chaque atelier", quoi: "Pièce datée et grille", seuil: "tous les critères remplis", clef: false },
    { quand: "Jour 3", quoi: "Épreuve pratique · 45 min", seuil: "12 / 20 minimum", clef: true },
    { quand: "Jour 3", quoi: "Revue croisée des dossiers", seuil: "4 critères sur 5", clef: true },
    { quand: "Fin de session", quoi: "Questionnaire à chaud", seuil: "satisfaction", clef: false },
    { quand: "À 3 mois", quoi: "Questionnaire à froid", seuil: "ce qui a été déployé", clef: false },
  ],
} as const;

/** Les 3 piliers mis en avant en page d'accueil. */
export const featuredFormationSlugs = ["la-forge-ia"] as const;

export const processSteps = [
  { step: "01", title: "Vous choisissez",
    description: "Une formation ou les quatre avec le Pack 360. Vous réservez en deux minutes." },
  { step: "02", title: "On vous positionne",
    description: "Un test de 15 minutes : on part de votre niveau et de votre projet réel." },
  { step: "03", title: "Vous pratiquez",
    description: "3 ou 5 jours en direct, sur vos propres dossiers. Pas de théorie inutile." },
  { step: "04", title: "Vous appliquez",
    description: "Vous repartez avec vos outils et un plan d'action. On fait le point à 3 mois." },
] as const;

export const stats = [
  { value: "4", suffix: "", label: "formations complémentaires" },
  { value: "3 à 5", suffix: " jours", label: "par formation, en direct" },
  { value: "12", suffix: "", label: "places au plus par session" },
  { value: "5", suffix: "+", label: "outils IA inclus dans vos formations" },
  { value: "577,35", suffix: " €", label: "économisés avec le Pack 360" },
] as const;

/** Modes de financement mobilisables (formulaire de contact). */
export const financements = [
  { value: "entreprise", label: "Mon entreprise finance ma formation" },
  { value: "opco", label: "OPCO (via mon employeur)" },
  { value: "france_travail", label: "France Travail (demandeur d'emploi)" },
  { value: "personnel", label: "Je finance ma formation" },
  { value: "autre", label: "Autre / je ne sais pas encore" },
] as const;

export const social = {
  linkedin: "https://www.linkedin.com/company/hbs-formation",
  instagram: "https://www.instagram.com/hbs.formation",
};

/**
 * Foire aux questions — alimente la section FAQ et le balisage FAQPage (JSON-LD).
 * Pensée pour les moteurs de réponse IA (AEO) : questions réelles, réponses factuelles.
 */
export const faqs = [
  {
    id: "formations",
    q: "Quelles formations proposez-vous ?",
    a: "Quatre formations qui se complètent : Analyse de données (35 heures en 5 jours), Création de contenu (35 heures en 5 jours), Marketing (21 heures en 3 jours) et La Forge IA (21 heures en 3 jours). Ou les quatre ensemble avec le Pack 360.",
  },
  {
    id: "pack",
    q: "Qu'est-ce que le Pack 360 ?",
    a: "Les quatre formations d'un même mois, dans un seul forfait : vous lisez votre marché, créez votre contenu, le vendez et automatisez le tout. 6 071,65 € au lieu de 6 649 € : −15 % sur Analyse de données et Création de contenu.",
  },
  {
    id: "tarif",
    q: "Combien coûtent les formations ?",
    a: "Analyse de données : 1 999 €. Création de contenu : 1 850 €. Marketing : 1 500 €. La Forge IA : 1 300 €, outils IA inclus dans votre forfait. Pack 360 : 6 071,65 €. Règlement par votre entreprise, à titre personnel, ou prise en charge par un OPCO ou France Travail selon leurs critères : HBS FORMATION est certifiée Qualiopi au titre des actions de formation.",
  },
  {
    id: "prochaine-session",
    q: "Quand ont lieu les prochaines sessions ?",
    a: "Chaque mois, dans le même ordre : Analyse de données, Création de contenu, Marketing, puis La Forge IA. Prochaine session le 26 octobre 2026 avec La Forge IA. Toutes les dates sont sur la page Planning. 12 places par session.",
  },
  {
    id: "outils",
    q: "Quels outils sont inclus avec La Forge IA ?",
    a: "Agents IA, automatisations, recherche d'emploi automatisée, assistance au secrétariat, assistant de réunion, et d'autres encore. Tous inclus dans votre forfait.",
  },
  {
    id: "prerequis",
    q: "Faut-il des connaissances techniques ?",
    a: "Non. Venez avec un projet ou un cas réel de votre activité : c'est la matière des ateliers. Un test de positionnement de 15 minutes précède l'entrée.",
  },
  {
    id: "distance",
    q: "Les formations se suivent-elles à distance ?",
    a: "Oui, en direct avec le formateur. Elles peuvent aussi être organisées en présentiel dans votre entreprise.",
  },
  {
    id: "delai",
    q: "Sous combien de temps suis-je recontacté·e ?",
    a: "Sous 48 heures ouvrées après votre demande.",
  },
] as const;

/**
 * Médias (photos d'illustration libres de droits — Unsplash).
 * À remplacer par les visuels définitifs de HBS FORMATION.
 */
const U = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const media = {
  heroPerson: U("1531123897727-8f129e1688ce", 1100),
  heroSecondary: U("1522202176988-66273c2fd55f", 700),
  ctaImage: U("1542744173-8e7e53415bb0", 1100),
  aboutTeam: U("1521737604893-d14cc237f11d", 1100),
  entreprises: U("1600880292203-757bb62b4baf", 1100),
  // Vidéos auto-hébergées (stock Pexels, licence libre — à remplacer par les vidéos HBS).
  heroVideo: "/media/videos/hero.mp4",
  heroVideoPoster: U("1522202176988-66273c2fd55f", 900),
  showcaseVideo: "/media/videos/classroom.mp4",
  showcasePoster: U("1524178232363-1fb2b075b655", 1200),
  formationImages: {
    "formations-certifiantes": U("1517245386807-bb43f82c33c4"),
    "bilan-de-competences": U("1454165804606-c3d57bc86b40"),
    vae: U("1434030216411-0b793f4b4173"),
    "la-forge-ia": U("1677442136019-21780ecad995"),
    "e-learning-foad": U("1516321318423-f06f85e504b3"),
    "conseil-ingenierie": U("1552664730-d307ca884978"),
  } as Record<string, string>,
};

/**
 * Vigil — la mascotte / persona IA de HBS FORMATION.
 * Histoire : Vigil a porté toutes les casquettes (formateur en costume, créatif, terrain…)
 * avant de comprendre que la meilleure formation s'adapte à chacun. Il change donc de style
 * selon l'univers de la page — et vous accompagne dans le chat.
 */
export const mascot = {
  name: "Vigil",
  tagline: "votre copilote formation",
  greeting: "Bonjour, moi c'est Vigil, votre copilote formation. Comment puis-je vous aider ?",
};

/** Studio / agence ayant conçu le site. */
export const azzco = {
  name: "AZZ&CO Labs",
  url: "https://www.azzcolabs.business",
  credit: "Conçu & développé par AZZ&CO Labs",
};

