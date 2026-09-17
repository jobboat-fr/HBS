import { site } from "@/lib/site";

/**
 * Les familles d'e-mails — le même lexique que la plateforme VTLVS
 * (hbs-backend `app/learn/mail/lexique.py`). Une famille = une adresse d'expédition, un ton,
 * une règle. Un e-mail du site et un e-mail de la plateforme portent donc la même adresse
 * pour le même usage : une convocation vient toujours de `formation@`, une facture toujours de
 * `facturation@`.
 */
export type Famille =
  | "compte"
  | "securite"
  | "rappels"
  | "formation"
  | "documents"
  | "qualite"
  | "facturation"
  | "annonces"
  | "newsletter"
  | "plateforme";

export const FAMILLES: Record<Famille, { libelle: string; locale: string }> = {
  compte: { libelle: "Compte", locale: "noreply" },
  securite: { libelle: "Sécurité", locale: "securite" },
  rappels: { libelle: "Actions requises", locale: "rappels" },
  formation: { libelle: "Formation", locale: "formation" },
  documents: { libelle: "Documents", locale: "documents" },
  qualite: { libelle: "Qualité", locale: "qualite" },
  facturation: { libelle: "Facturation", locale: "facturation" },
  annonces: { libelle: "Annonces", locale: "annonces" },
  newsletter: { libelle: "Lettre d'information", locale: "newsletter" },
  plateforme: { libelle: "Plateforme VTLVS", locale: "plateforme" },
};

/**
 * Le domaine d'envoi vérifié chez Resend. `MAIL_DOMAIN` d'abord ; sinon celui de l'ancienne
 * adresse unique `CONTACT_FROM` (déjà vérifié sur le compte) ; sinon le domaine VTLVS.
 */
export function domaineEnvoi(): string {
  if (process.env.MAIL_DOMAIN) return process.env.MAIL_DOMAIN.trim().toLowerCase();
  const m = /@([a-z0-9.-]+)>?\s*$/i.exec(process.env.CONTACT_FROM || "");
  return (m?.[1] || "vtlvs.com").toLowerCase();
}

/** « "HBS FORMATION" <formation@domaine> » */
export function expediteur(famille: Famille): string {
  return `"${site.name.replace(/"/g, "'")}" <${FAMILLES[famille].locale}@${domaineEnvoi()}>`;
}

/** Objet au format VTLVS : « Objet — HBS FORMATION ». */
export const objet = (texte: string) => (texte.endsWith(`— ${site.name}`) ? texte : `${texte} — ${site.name}`);

export const entetes = (famille: Famille) => ({ "X-VTLVS-Category": famille });
