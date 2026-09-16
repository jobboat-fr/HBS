import { faqs } from "@/lib/site";

/** Réponse de FAQ par identifiant, jamais par position : insérer une question ne doit pas
 *  décaler toutes les réponses suivantes, comme cela s'est déjà produit. */
const faq = (id: (typeof faqs)[number]["id"]) => faqs.find((f) => f.id === id)!.a;

export type AssistantLink = { label: string; href: string };
export type AssistantReply = { text: string; links?: AssistantLink[] };

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/** Suggère un lien pertinent à partir du message (utilisé pour enrichir une réponse IA). */
export function suggestLink(input: string): AssistantLink | undefined {
  const t = norm(input);
  const has = (...k: string[]) => k.some((w) => t.includes(w));
  if (has("prix", "cout", "tarif", "combien", "financ", "payer", "opco")) return { label: "Voir le tarif", href: "/financement" };
  if (has("programme", "atelier", "journee", "contenu")) return { label: "Voir le programme", href: "/formations#programme" };
  if (has("outil", "agent", "automatis", "emploi", "secretari", "reunion")) return { label: "Les outils inclus", href: "/formations" };
  if (has("entreprise", "equipe", "salarie", "intra")) return { label: "Offre entreprises", href: "/entreprises" };
  if (has("pack", "360", "quatre", "toutes")) return { label: "Le Pack 360", href: "/pack-360" };
  if (has("inscri", "reserv", "place", "session", "date", "planning", "quand")) return { label: "Voir les dates", href: "/planning" };
  if (has("contact", "conseiller", "rdv", "rendez", "parler")) return { label: "Nous contacter", href: "/contact" };
  return { label: "Nos 4 formations", href: "/#formations" };
}

/** Assistant guidé local (repli quand l'IA n'est pas joignable). */
export function localAnswer(input: string): AssistantReply {
  const t = norm(input);
  const has = (...k: string[]) => k.some((w) => t.includes(w));

  if (has("cpf", "compte personnel"))
    return { text: "Nos formations ne sont pas finançables par le CPF. Elles se règlent par votre entreprise, à titre personnel, ou via un OPCO ou France Travail.", links: [{ label: "Voir le tarif", href: "/financement" }] };
  if (has("prix", "cout", "tarif", "combien", "financ", "payer", "opco", "france travail"))
    return { text: faq("tarif"), links: [{ label: "Voir le tarif", href: "/financement" }] };
  if (has("outil", "agent", "automatis", "emploi", "secretari", "reunion", "inclus"))
    return { text: faq("outils"), links: [{ label: "Les outils inclus", href: "/formations" }] };
  if (has("quand", "date", "session", "octobre", "commence", "demarre"))
    return { text: faq("prochaine-session"), links: [{ label: "Voir le planning", href: "/planning" }] };
  if (has("prerequis", "niveau", "technique", "debutant", "connaissance"))
    return { text: faq("prerequis"), links: [{ label: "Voir le programme", href: "/formations#programme" }] };
  if (has("distance", "ligne", "visio", "presentiel", "lieu"))
    return { text: faq("distance"), links: [{ label: "Voir le programme", href: "/formations#programme" }] };
  if (has("pack", "360", "quatre", "toutes les formations"))
    return { text: faq("pack"), links: [{ label: "Le Pack 360", href: "/pack-360" }] };
  if (has("bilan", "vae", "e-learning", "elearning", "foad", "autre formation", "quelles formations", "catalogue"))
    return { text: faq("formations"), links: [{ label: "Nos 4 formations", href: "/#formations" }] };
  if (has("entreprise", "equipe", "salarie", "intra", "collaborateur"))
    return { text: "Nos 4 formations peuvent être organisées pour vos collaborateurs, sur vos propres dossiers, à distance ou dans vos locaux.", links: [{ label: "Offre entreprises", href: "/entreprises" }] };
  if (has("delai", "combien de temps", "reponse", "recontact", "rappel"))
    return { text: faq("delai"), links: [{ label: "Faire une demande", href: "/contact" }] };
  if (has("conseiller", "contact", "devis", "rdv", "rendez", "parler", "telephone", "appeler", "humain"))
    return { text: "Avec plaisir. Laissez vos coordonnées : un conseiller vous recontacte sous 48 heures ouvrées.", links: [{ label: "Nous contacter", href: "/contact" }] };
  if (has("ia", "intelligence artificielle", "chatgpt", "forge"))
    return { text: "IA 360 : 21 heures en 3 jours pour mettre l'IA au travail sur vos vrais dossiers, outils inclus dans votre forfait. 1 300 €.", links: [{ label: "Découvrir IA 360", href: "/formations" }] };
  if (has("formation", "programme", "atelier"))
    return { text: faq("formations"), links: [{ label: "Nos 4 formations", href: "/#formations" }] };

  return {
    text: "Je peux vous parler de nos 4 formations, du Pack 360, des tarifs ou des prochaines dates. Que souhaitez-vous savoir ?",
    links: [{ label: "Nos 4 formations", href: "/#formations" }],
  };
}
