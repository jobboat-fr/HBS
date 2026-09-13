import { faqs } from "@/lib/site";

/**
 * La FAQ complète, par thème — alimente `/faq` et son balisage FAQPage.
 *
 * `faqs` (site.ts) reste la sélection courte de l'accueil ; ses réponses sont reprises ici
 * par identifiant, pour qu'une même question n'ait jamais deux réponses différentes selon la
 * page. Toute réponse doit être vraie aujourd'hui : pas de délai, de taux ni de garantie que
 * l'organisme ne tient pas. Les conditions de paiement renvoient aux CGV, qui font foi.
 */

const court = (id: (typeof faqs)[number]["id"]) => {
  const f = faqs.find((x) => x.id === id)!;
  return { q: f.q, a: f.a };
};

export type Theme = { id: string; titre: string; questions: { q: string; a: string }[] };

export const faqComplete: Theme[] = [
  {
    id: "formation",
    titre: "La formation",
    questions: [
      court("ia-360"),
      {
        q: "Que contient le programme ?",
        a: "Trois journées. Connaissance : ce que fait réellement un modèle d'IA, ses limites, le coût réel d'un usage. Conformité : vérifier les résultats, protéger les données, RGPD et règlement européen sur l'IA. Déploiement : agents et automatisations construits sur votre propre cas. Chaque journée compte deux ateliers pratiques de 3 h 30.",
      },
      court("prerequis"),
      court("distance"),
      {
        q: "Comment la formation est-elle organisée dans le temps ?",
        a: "21 heures sur trois journées de 7 heures : une journée par semaine pendant trois semaines, ou trois jours consécutifs selon la session. Le calendrier exact figure dans votre convention ou votre contrat.",
      },
      {
        q: "Combien de participants par session ?",
        a: "De 4 à 12 participants. Au-delà, la pratique individuelle n'est plus possible ; en deçà de 4, la session peut être reportée et vous êtes intégralement remboursé si la nouvelle date ne vous convient pas.",
      },
      {
        q: "De quel matériel ai-je besoin ?",
        a: "Un ordinateur et une connexion Internet qui permet la visioconférence. Aucun logiciel payant à acheter : les outils utilisés pendant la formation sont inclus dans la place.",
      },
      {
        q: "Dois-je apporter mes propres documents ?",
        a: "Oui, c'est le principe : environ vingt documents réels et représentatifs de votre activité. Ils restent sur votre poste, et aucune donnée personnelle réelle n'est déposée dans un outil d'IA pendant la session — on les anonymise avant, au besoin ensemble.",
      },
      {
        q: "Qu'est-ce que le Certificat IA 360 ?",
        a: "Le certificat délivré par HBS FORMATION à l'issue de la formation, après une épreuve pratique de 45 minutes notée sur 20 (seuil 12) et une revue croisée de votre dossier. C'est un certificat propre à l'organisme : ce n'est ni un diplôme d'État, ni une certification enregistrée au RNCP ou au répertoire spécifique.",
      },
      {
        q: "La formation est-elle accessible aux personnes en situation de handicap ?",
        a: "Oui. Signalez votre besoin dès le test de positionnement (une question y est consacrée) ou par le formulaire de contact : l'aménagement — rythme, supports, outils d'accessibilité — est étudié avec vous avant l'entrée en formation.",
      },
    ],
  },
  {
    id: "outils",
    titre: "Les outils IA inclus",
    questions: [
      court("outils"),
      {
        q: "Les outils remplacent-ils la formation ?",
        a: "Non, ils la prolongent. La formation vous apprend à vérifier ce qu'une IA produit et à décider où elle a sa place ; les outils vous permettent de mettre en œuvre ces usages dans votre activité dès la fin des ateliers.",
      },
      {
        q: "À qui s'adresse le moteur de recherche d'emploi automatisé ?",
        a: "Aux participants en recherche d'emploi ou en reconversion, notamment ceux dont la place est financée par France Travail : il automatise la veille des offres et la préparation des candidatures, que vous gardez sous votre contrôle.",
      },
    ],
  },
  {
    id: "tarif",
    titre: "Tarif et paiement",
    questions: [
      court("tarif"),
      {
        q: "Comment payer en tant qu'entreprise ?",
        a: "En ligne, par carte, au moment de la réservation : vous choisissez le nombre de places, indiquez votre raison sociale et votre numéro de TVA, et recevez la facture de HBS FORMATION par courriel. La convention de formation vous est ensuite adressée.",
      },
      {
        q: "Comment payer à titre personnel ?",
        a: "Vous réservez en ligne et enregistrez une carte, sans aucun prélèvement ce jour-là. Rien n'est prélevé avant la fin de votre délai de rétractation de 14 jours ; ensuite 30 % du prix, puis le solde en deux échéances pendant la formation. Le détail est dans nos conditions générales de vente.",
      },
      {
        q: "Ma formation peut-elle être financée par mon OPCO ?",
        a: "Oui, si vous êtes salarié : HBS FORMATION est certifiée Qualiopi au titre des actions de formation, condition pour qu'un OPCO finance. L'accord dépend des critères de votre OPCO et de votre entreprise ; nous vous aidons à monter la demande avant toute inscription.",
      },
      {
        q: "Et par France Travail, si je suis demandeur d'emploi ?",
        a: "C'est possible, notamment par l'aide individuelle à la formation (AIF), si la formation s'inscrit dans votre projet validé avec votre conseiller. Demandez-nous un devis : il sert de base à la demande que votre conseiller instruit.",
      },
      {
        q: "Puis-je utiliser mon CPF ?",
        a: "Non. Le compte personnel de formation ne finance que des formations menant à une certification enregistrée au RNCP ou au répertoire spécifique, ce qui n'est pas le cas du Certificat IA 360.",
      },
      {
        q: "Puis-je réserver plusieurs places pour mon équipe ?",
        a: "Oui, en choisissant le nombre de places lors de la réservation entreprise. Pour un groupe de 8 à 12 personnes, une session dédiée — à distance ou dans vos locaux — est aussi possible : écrivez-nous.",
      },
      {
        q: "Le paiement en ligne est-il sécurisé ?",
        a: "Oui. Le paiement est traité par Stripe, prestataire de paiement agréé ; vos données de carte ne transitent jamais par nos serveurs et ne nous sont pas communiquées.",
      },
    ],
  },
  {
    id: "inscription",
    titre: "Inscription, rétractation, annulation",
    questions: [
      {
        q: "Comment se passe l'inscription ?",
        a: "Trois étapes : vous réservez votre place en ligne, vous passez un court test de positionnement (environ 20 minutes) qui nous permet d'adapter la formation à votre niveau et à votre cas, puis vous recevez la confirmation de session avec votre convention ou votre contrat.",
      },
      court("prochaine-session"),
      court("delai"),
      {
        q: "Puis-je me rétracter ?",
        a: "À titre personnel, oui : vous disposez de 14 jours à compter de la réservation pour vous rétracter, sans motif et sans frais, par simple courriel. Aucune somme n'étant prélevée pendant ce délai, vous n'avez rien à vous faire rembourser.",
      },
      {
        q: "Que se passe-t-il si je ne peux plus suivre la session ?",
        a: "Vous pouvez reporter votre place sur une session suivante, ou — pour une entreprise — remplacer le participant. En cas d'empêchement de force majeure, seules les heures effectivement suivies restent dues. Les conditions complètes sont dans nos CGV.",
      },
      {
        q: "Et si la session est annulée ?",
        a: "Si HBS FORMATION annule ou reporte une session, vous choisissez entre la nouvelle date et le remboursement intégral des sommes versées, sous 14 jours.",
      },
    ],
  },
  {
    id: "organisme",
    titre: "L'organisme",
    questions: [
      {
        q: "HBS FORMATION est-elle certifiée Qualiopi ?",
        a: "Oui, au titre de la catégorie « actions de formation ». La certification ne couvre ni le bilan de compétences, ni la VAE, ni l'apprentissage.",
      },
      {
        q: "Où est situé l'organisme ?",
        a: "À Rouen, en Normandie. La Formation IA 360 se suit à distance, en direct, partout en France ; elle peut aussi être organisée en présentiel dans votre entreprise.",
      },
      court("autres"),
    ],
  },
  {
    id: "ia-conformite",
    titre: "IA et obligations des entreprises",
    questions: [
      {
        q: "Le règlement européen sur l'IA oblige-t-il à former ses salariés ?",
        a: "Depuis le 2 février 2025, l'article 4 du règlement européen sur l'intelligence artificielle impose aux entreprises qui utilisent des systèmes d'IA de prendre des mesures pour assurer un niveau suffisant de maîtrise de l'IA de leur personnel. C'est une obligation de moyens : former les équipes concernées en est la mesure la plus directe, et la Formation IA 360 y consacre sa journée Conformité.",
      },
      {
        q: "Utiliser ChatGPT ou un autre outil d'IA est-il compatible avec le RGPD ?",
        a: "Cela dépend des données que vous y mettez et des réglages de l'outil. La formation apprend précisément à distinguer ce qu'on peut confier à une IA, à anonymiser un document et à documenter ses usages dans un registre.",
      },
    ],
  },
];

export const toutesLesQuestions = faqComplete.flatMap((t) => t.questions);
