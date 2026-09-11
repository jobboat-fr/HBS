/**
 * Contenu et configuration centralisés du site HBS FORMATION.
 * Toutes les informations légales proviennent de l'extrait Kbis (RCS Rouen, 23/03/2026).
 */

export const site = {
  name: "HBS FORMATION",
  shortName: "HBS",
  baseline: "La montée en compétences des particuliers et des entreprises",
  // Pas de canal de financement annoncé ici : CPF, OPCO, France Travail et Région supposent
  // tous la certification Qualiopi, qui n'est pas encore obtenue. Une méta-description est
  // ce que les moteurs citent — c'est le dernier endroit où laisser une éligibilité fausse.
  description:
    "HBS FORMATION, organisme de formation à Rouen : formation à l'intelligence artificielle, formations certifiantes, bilan de compétences, VAE et e-learning. Pour les particuliers comme pour les entreprises, en ligne ou en présentiel.",
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
  qualiopi: false, // passer à true une fois la certification Qualiopi obtenue
};

export const navLinks = [
  { label: "Formations", href: "/formations" },
  { label: "Formation IA", href: "/formations#ia-360" },
  { label: "Certifications", href: "/certifications" },
  { label: "Financement", href: "/financement" },
  { label: "Entreprises", href: "/entreprises" },
  { label: "À propos", href: "/a-propos" },
  { label: "Contact", href: "/contact" },
] as const;

/**
 * L'annonce affichée en bandeau sur toutes les pages.
 *
 * `date` est la date réelle d'ouverture, pas un artifice commercial : elle est affichée au
 * visiteur et elle engage l'organisme. `iso` sert au balisage et au tri ; il n'y a qu'une
 * seule source pour les deux afin qu'elles ne puissent pas diverger.
 */
/**
 * Le titre remis à l'issue de la Formation IA 360.
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
  nom: "Certificat IA 360",
  emetteur: "HBS FORMATION",
  mention: "Certificat délivré par l'organisme",
  // Ce qui rend le certificat sérieux, et qu'il faut dire à sa place.
  obtention: "Épreuve finale de 1 h 30, notée sur 20, seuil de réussite à 12",
  preuve: "Remis avec les livrables datés produits pendant la formation",
  // La phrase qui accompagne le certificat partout où il est affiché.
  precision:
    "Certificat propre à HBS FORMATION. Il n'est pas enregistré au RNCP ni au répertoire spécifique, et ne constitue pas un diplôme d'État.",
} as const;

export const annonce = {
  actif: true,
  iso: "2026-10-26",
  dateLisible: "26 octobre 2026",
  titre: "Formation IA 360",
  texte: "Première session le 26 octobre 2026 — inscriptions ouvertes.",
  href: "/formations#ia-360",
  lienLabel: "Voir le programme",
} as const;

/** Piliers de formation — affichés en page d'accueil (3) et détaillés sur /formations. */
export const formations = [
  {
    slug: "ia-360",
    icon: "Sparkles",
    title: "Formation IA 360",
    tagline: "Connaissance, conformité, déploiement — 21 heures",
    description:
      "Trois journées pour comprendre ce que fait réellement l'IA, produire un travail fiable sur ses propres documents, et repartir avec le dossier IA de son activité : registre des risques, règles d'usage, feuille de route chiffrée. Ouverte aux particuliers comme aux entreprises.",
    features: [
      "Certificat IA 360 délivré par HBS FORMATION",
      "Première session le 26 octobre 2026",
      "21 h — 3 journées de 7 h, 6 ateliers",
      "Particuliers, indépendants et entreprises",
      "Épreuve finale notée — seuil 12/20",
      "Chaque journée produit un livrable daté",
    ],
  },
  {
    slug: "formations-certifiantes",
    icon: "GraduationCap",
    title: "Formations certifiantes & continues",
    tagline: "Montez en compétences, faites reconnaître votre expertise",
    description:
      "Des parcours certifiants et de formation continue ouverts aux particuliers, aux indépendants et aux entreprises, en présentiel ou à distance.",
    features: [
      "Parcours certifiants reconnus",
      "Présentiel, distanciel ou mixte (FOAD)",
      "Sessions inter et intra-entreprise",
      "Évaluation et attestation de fin de formation",
    ],
  },
  {
    slug: "bilan-de-competences",
    icon: "Compass",
    title: "Bilan de compétences",
    tagline: "Faites le point, construisez votre projet",
    description:
      "Un accompagnement individuel pour analyser vos compétences, vos aptitudes et vos motivations afin de définir un projet professionnel cohérent.",
    features: [
      "Entretiens individuels confidentiels",
      "Analyse des compétences et aptitudes",
      "Définition d'un projet réaliste",
      // Le bilan est une prestation que le CPF peut financer, mais la prise en charge
      // suppose un organisme certifié Qualiopi. Tant qu'elle n'est pas obtenue, écrire
      // « éligible au CPF » sur une carte produit est une promesse que le dossier démentira.
      "Particuliers, salariés et entreprises",
    ],
  },
  {
    slug: "vae",
    icon: "Award",
    title: "Validation des Acquis (VAE)",
    tagline: "Transformez votre expérience en diplôme",
    description:
      "Faites reconnaître officiellement les compétences acquises par votre expérience grâce à un accompagnement structuré tout au long de votre VAE.",
    features: [
      "Étude de recevabilité",
      "Accompagnement à la rédaction du dossier",
      "Préparation au jury",
      "Suivi personnalisé",
    ],
  },
  {
    slug: "e-learning-foad",
    icon: "MonitorPlay",
    title: "E-learning & FOAD",
    tagline: "Apprendre où vous voulez, quand vous voulez",
    description:
      "Des contenus pédagogiques digitaux, classes virtuelles et tutorat en ligne pour une formation ouverte et à distance pleinement encadrée.",
    features: [
      "Plateforme digitale dédiée",
      "Classes virtuelles & tutorat en ligne",
      "Contenus pédagogiques sur mesure",
      "Suivi de progression",
    ],
  },
  {
    slug: "conseil-ingenierie",
    icon: "Lightbulb",
    title: "Conseil & ingénierie pédagogique",
    tagline: "Concevons ensemble vos dispositifs de formation",
    description:
      "Conseil, accompagnement et ingénierie pédagogique auprès des entreprises et des organismes pour bâtir des dispositifs de formation efficaces.",
    features: [
      "Audit des besoins en compétences",
      "Conception de parcours sur mesure",
      "Création de contenus pédagogiques",
      "Mise à disposition de formateurs",
    ],
  },
] as const;

/** Les 3 piliers mis en avant en page d'accueil. */
export const featuredFormationSlugs = [
  "ia-360",
  "formations-certifiantes",
  "bilan-de-competences",
] as const;

export const processSteps = [
  {
    step: "01",
    title: "Échange & positionnement",
    description:
      "Nous analysons votre besoin, votre niveau et vos objectifs pour vous orienter vers le parcours adapté.",
  },
  {
    step: "02",
    title: "Montage & financement",
    description:
      "Nous construisons votre dossier et identifions ce qui est réellement mobilisable pour vous : financement par votre entreprise, ou à titre personnel.",
  },
  {
    step: "03",
    title: "Formation",
    description:
      "Vous suivez votre parcours en présentiel, à distance ou en mixte, encadré par nos formateurs experts.",
  },
  {
    step: "04",
    title: "Certification & suivi",
    description:
      "Évaluation, attestation ou certification, puis suivi post-formation pour ancrer durablement les acquis.",
  },
] as const;

export const stats = [
  { value: "6", suffix: "", label: "domaines de formation" },
  { value: "100", suffix: "%", label: "parcours personnalisés" },
  { value: "48", suffix: "h", label: "pour une réponse à votre demande" },
  { value: "3", suffix: "", label: "modalités : présentiel, distance, mixte" },
] as const;

/** Modes de financement mobilisables (formulaire de contact). */
export const financements = [
  { value: "cpf", label: "CPF (Compte Personnel de Formation)" },
  { value: "opco", label: "OPCO (via mon employeur)" },
  { value: "entreprise", label: "Plan de développement des compétences (entreprise)" },
  { value: "france_travail", label: "France Travail" },
  { value: "personnel", label: "Financement personnel" },
  { value: "region", label: "Région" },
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
    q: "Les formations HBS FORMATION sont-elles éligibles au CPF ?",
    a: "Pas à ce jour, et nous préférons le dire avant que vous construisiez votre projet dessus. Mobiliser le CPF suppose deux conditions réunies : un organisme certifié Qualiopi, et une formation conduisant à une certification enregistrée au RNCP ou au répertoire spécifique. Notre démarche de certification est engagée. En attendant, nos actions se financent par l'entreprise sur ses fonds propres ou à titre personnel.",
  },
  {
    q: "Peut-on suivre une formation à distance ?",
    a: "Oui. Nos formations sont proposées en présentiel, à distance (FOAD, classes virtuelles) ou en format mixte, pour s'adapter à votre rythme et à vos contraintes.",
  },
  {
    q: "Comment financer ma formation ?",
    a: "Aujourd'hui, par votre entreprise sur ses fonds propres ou à titre personnel : ces deux voies ne demandent aucune certification et sont ouvertes dès maintenant. Les dispositifs mutualisés — CPF, OPCO, France Travail, aides de la Région — supposent la certification Qualiopi, que nous n'avons pas encore obtenue. Dites-nous votre situation et nous regarderons ensemble ce qui est réellement mobilisable.",
  },
  {
    q: "Quand démarre la formation à l'intelligence artificielle ?",
    a: "La première session de la Formation IA 360 ouvre le 26 octobre 2026. Elle dure 21 heures réparties sur trois journées et s'adresse autant aux particuliers et aux indépendants qu'aux entreprises. Chaque journée produit un livrable daté que vous emportez : cartographie de vos usages, registre des risques, puis feuille de route chiffrée à 90 jours.",
  },
  {
    q: "Comment se déroule un bilan de compétences ?",
    a: "Le bilan de compétences se déroule en entretiens individuels et confidentiels : analyse de vos compétences et motivations, exploration des pistes, puis construction d'un projet professionnel réaliste. Le bilan est, par nature, une prestation que le CPF peut financer — mais la prise en charge suppose un organisme certifié Qualiopi, et notre certification est en cours. Chez nous, il se finance donc pour l'instant par l'entreprise ou à titre personnel.",
  },
  {
    q: "Où se situe HBS FORMATION ?",
    a: "HBS FORMATION est un organisme de formation basé à Rouen (50 Passage Saint-Étienne des Tonneliers, 76000 Rouen), intervenant en présentiel et partout en France à distance.",
  },
  {
    q: "Sous combien de temps suis-je recontacté·e ?",
    a: "Après votre demande, un conseiller vous recontacte sous 48 heures ouvrées pour étudier votre projet et vos possibilités de financement.",
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
    "ia-360": U("1677442136019-21780ecad995"),
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

/** Financeurs / dispositifs (libellés publics — pas de logos propriétaires). */
export const financeurs = [
  "CPF",
  "OPCO",
  "France Travail",
  "Plan de développement des compétences",
  "Région Normandie",
  "Financement personnel",
] as const;
