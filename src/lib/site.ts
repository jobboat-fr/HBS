/**
 * Contenu et configuration centralisés du site HBS FORMATION.
 * Toutes les informations légales proviennent de l'extrait Kbis (RCS Rouen, 23/03/2026).
 */

export const site = {
  name: "HBS FORMATION",
  shortName: "HBS",
  baseline: "L'excellence de la formation professionnelle",
  description:
    "Organisme de formation à Rouen : formations professionnelles certifiantes, bilans de compétences, VAE, apprentissage et e-learning. Un accompagnement sur mesure pour les entreprises et les particuliers.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.hbs-formation.fr",
  email: "contact@hbs-formation.fr",
  phone: "+33 2 00 00 00 00",
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
  { label: "Accueil", href: "/" },
  { label: "Formations", href: "/formations" },
  { label: "Réalisations", href: "/realisations" },
  { label: "À propos", href: "/a-propos" },
  { label: "Contact", href: "/contact" },
] as const;

/** Piliers de formation — affichés en page d'accueil (3) et détaillés sur /formations. */
export const formations = [
  {
    slug: "formations-certifiantes",
    icon: "GraduationCap",
    title: "Formations certifiantes & continues",
    tagline: "Montez en compétences, faites reconnaître votre expertise",
    description:
      "Des parcours certifiants et de formation continue conçus pour les professionnels et les entreprises, en présentiel ou à distance.",
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
      "Éligible au CPF",
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
    slug: "apprentissage-cfa",
    icon: "Building2",
    title: "Apprentissage & CFA",
    tagline: "Se former en alternant théorie et entreprise",
    description:
      "Des formations par apprentissage articulant centre de formation et terrain, pour acquérir un métier tout en étant rémunéré.",
    features: [
      "Alternance centre / entreprise",
      "Accompagnement administratif",
      "Suivi pédagogique des apprentis",
      "Lien renforcé écoles-entreprises",
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
  "formations-certifiantes",
  "bilan-de-competences",
  "vae",
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
      "Nous construisons votre dossier et identifions le financement mobilisable : CPF, OPCO, France Travail, entreprise.",
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
  { value: "3", suffix: "", label: "modalités : présentiel, distanciel, mixte" },
  { value: "2026", suffix: "", label: "année de création" },
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
