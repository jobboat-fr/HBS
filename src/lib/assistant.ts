import { faqs } from "@/lib/site";

export type AssistantLink = { label: string; href: string };
export type AssistantReply = { text: string; links?: AssistantLink[] };

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/** Assistant guidé local (repli quand l'agent VIGIL n'est pas joignable). */
export function localAnswer(input: string): AssistantReply {
  const t = norm(input);
  const has = (...k: string[]) => k.some((w) => t.includes(w));

  if (has("financ", "cpf", "opco", "prix", "cout", "tarif", "payer", "france travail"))
    return { text: faqs[2].a, links: [{ label: "Voir le financement", href: "/financement" }] };
  if (has("distance", "ligne", "foad", "e-learning", "elearning", "visio"))
    return { text: faqs[1].a, links: [{ label: "Découvrir les formations", href: "/formations" }] };
  if (has("altern", "apprentis", "cfa"))
    return { text: faqs[3].a, links: [{ label: "Tout sur l'alternance", href: "/alternance" }] };
  if (has("bilan"))
    return { text: faqs[4].a, links: [{ label: "Bilan de compétences", href: "/formations#bilan-de-competences" }] };
  if (has("vae", "acquis", "experience"))
    return {
      text: "La VAE permet de faire reconnaître officiellement les compétences acquises par votre expérience. Nous vous accompagnons de la recevabilité au jury.",
      links: [{ label: "En savoir plus sur la VAE", href: "/formations#vae" }],
    };
  if (has("entreprise", "equipe", "salarie", "intra", "collaborateur"))
    return {
      text: "Nous concevons des formations intra-entreprise sur mesure pour faire monter vos équipes en compétences, du diagnostic au suivi.",
      links: [{ label: "Offre entreprises", href: "/entreprises" }],
    };
  if (has("adresse", "rouen", "situe", "localisation"))
    return { text: faqs[5].a, links: [{ label: "Nous contacter", href: "/contact" }] };
  if (has("delai", "combien de temps", "reponse", "recontact", "rappel"))
    return { text: faqs[6].a, links: [{ label: "Faire une demande", href: "/contact" }] };
  if (has("conseiller", "contact", "devis", "rdv", "rendez", "parler", "telephone", "appeler", "humain"))
    return {
      text: "Avec plaisir ! Laissez-nous vos coordonnées et un conseiller vous recontacte sous 48 heures pour étudier votre projet.",
      links: [{ label: "Demander un devis", href: "/contact" }],
    };
  if (has("formation", "cours", "parcours", "certifi", "diplome", "apprendre"))
    return {
      text: "Nous proposons 6 domaines : formations certifiantes, bilan de compétences, VAE, alternance, e-learning et conseil. Dites-moi votre objectif et je vous oriente.",
      links: [{ label: "Voir les formations", href: "/formations" }],
    };

  return {
    text: "Bonne question ! Le plus simple est d'en parler avec un conseiller : il étudiera votre projet et vos financements sous 48 heures.",
    links: [{ label: "Parler à un conseiller", href: "/contact" }],
  };
}
