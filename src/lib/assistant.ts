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
  if (has("inscri", "reserv", "place", "session")) return { label: "Réserver ma place", href: "/preinscription" };
  if (has("contact", "conseiller", "rdv", "rendez", "parler")) return { label: "Nous contacter", href: "/contact" };
  return { label: "Formation IA 360", href: "/formations" };
}

/** Assistant guidé local (repli quand l'IA n'est pas joignable). */
export function localAnswer(input: string): AssistantReply {
  const t = norm(input);
  const has = (...k: string[]) => k.some((w) => t.includes(w));

  if (has("cpf", "compte personnel"))
    return { text: "La Formation IA 360 n'est pas finançable par ce dispositif. Elle se règle par votre entreprise ou à titre personnel : 1 300 € par place, outils IA inclus.", links: [{ label: "Voir le tarif", href: "/financement" }] };
  if (has("prix", "cout", "tarif", "combien", "financ", "payer", "opco", "france travail"))
    return { text: faq("tarif"), links: [{ label: "Voir le tarif", href: "/financement" }] };
  if (has("outil", "agent", "automatis", "emploi", "secretari", "reunion", "inclus"))
    return { text: faq("outils"), links: [{ label: "Les outils inclus", href: "/formations" }] };
  if (has("quand", "date", "session", "octobre", "commence", "demarre"))
    return { text: faq("prochaine-session"), links: [{ label: "Réserver ma place", href: "/preinscription" }] };
  if (has("prerequis", "niveau", "technique", "debutant", "connaissance"))
    return { text: faq("prerequis"), links: [{ label: "Voir le programme", href: "/formations#programme" }] };
  if (has("distance", "ligne", "visio", "presentiel", "lieu"))
    return { text: faq("distance"), links: [{ label: "Voir le programme", href: "/formations#programme" }] };
  if (has("bilan", "vae", "certifi", "e-learning", "elearning", "foad", "autre formation"))
    return { text: faq("autres"), links: [{ label: "Formation IA 360", href: "/formations" }] };
  if (has("entreprise", "equipe", "salarie", "intra", "collaborateur"))
    return { text: "La Formation IA 360 peut être organisée pour vos collaborateurs, sur vos propres processus, avec les outils IA inclus dans chaque place.", links: [{ label: "Offre entreprises", href: "/entreprises" }] };
  if (has("delai", "combien de temps", "reponse", "recontact", "rappel"))
    return { text: faq("delai"), links: [{ label: "Faire une demande", href: "/contact" }] };
  if (has("conseiller", "contact", "devis", "rdv", "rendez", "parler", "telephone", "appeler", "humain"))
    return { text: "Avec plaisir. Laissez vos coordonnées : un conseiller vous recontacte sous 48 heures ouvrées.", links: [{ label: "Nous contacter", href: "/contact" }] };
  if (has("ia", "intelligence artificielle", "chatgpt", "formation", "programme", "atelier"))
    return { text: faq("ia-360"), links: [{ label: "Voir la Formation IA 360", href: "/formations" }] };

  return {
    text: "Je peux vous parler du programme de la Formation IA 360, des outils inclus, du tarif ou de la prochaine session. Que souhaitez-vous savoir ?",
    links: [{ label: "Formation IA 360", href: "/formations" }],
  };
}
