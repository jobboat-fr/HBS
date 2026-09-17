import { site, legal } from "@/lib/site";

/**
 * Les courriels transactionnels du site.
 *
 * Deux choses à savoir avant de modifier ce fichier.
 *
 * **L'échappement n'est pas décoratif.** Tout ce qui arrive ici vient d'un formulaire public.
 * Interpoler `${d.message}` tel quel dans du HTML laisse un visiteur écrire du balisage dans
 * le courriel que lit l'organisme — un faux lien « cliquez ici », une fausse signature. Le
 * destinataire est un humain qui fait confiance à ce qu'il voit dans sa boîte. Tout passe
 * donc par `esc()`, sans exception, y compris les champs qui « ne peuvent pas » contenir de
 * chevrons.
 *
 * **La charte est celle du site, pas celle d'avant.** Ces gabarits sont restés en noir et or
 * après le passage du site au bleu marine sur blanc : un prospect recevait une confirmation
 * qui ne ressemblait pas à la page qu'il venait de quitter.
 */

export type ContactPayload = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  formation?: string;
  financement?: string;
  message: string;
};

export type InscriptionPayload = {
  full_name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  message?: string | null;
  /** Lien absolu vers le test de positionnement, quand la plateforme en a créé un. */
  positionnement?: string | null;
};

/** Neutralise le HTML d'une valeur saisie par un visiteur. */
export function esc(v: unknown): string {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Même gabarit que les e-mails de la plateforme VTLVS (hbs-backend app/learn/mail/gabarit.py) :
// logo et nom de l'organisme sur un filet à sa couleur, corps, mentions légales, puis
// « Envoyé avec VTLVS ». Mise en page en tableaux et styles en ligne pour les messageries.
const ENCRE = "#0B2239";
const MARINE = "#1D3FAE";
const NUAGE = "#F4F6FA";
const DOUX = "#41506A";
const GRIS = "#5B6B7F";
const LOGO_ORGANISME = `${site.url}/logo.png`;
const LOGO_VTLVS = "https://app.vtlvs.com/logo-lockup.png";

const wrap = (inner: string) => `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${NUAGE}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${NUAGE}"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="600" align="center" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;font-family:Arial,Helvetica,sans-serif">
<tr><td style="padding:24px 32px;border-bottom:3px solid ${MARINE}">
<img src="${esc(LOGO_ORGANISME)}" alt="${esc(site.name)}" height="44" style="display:block;height:44px;max-width:220px;border:0">
</td></tr>
<tr><td style="padding:28px 32px 8px;color:${ENCRE}">${inner}</td></tr>
<tr><td style="padding:22px 32px 26px;font-size:12px;line-height:1.5;color:${GRIS}">
${esc(legal.raisonSociale)} · ${esc(legal.siege)} · NDA ${esc(legal.numeroDeclarationActivite)} · SIRET ${esc(legal.siret)}<br>
${esc(site.email)} · ${esc(site.phone)} — l'enregistrement de la déclaration d'activité ne vaut pas agrément de l'État.
</td></tr>
</table>
<table role="presentation" width="600" align="center" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;margin:0 auto"><tr>
<td align="center" style="padding:18px 12px;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:${GRIS}">
<a href="https://vtlvs.com" style="text-decoration:none;color:${GRIS}">
<img src="${LOGO_VTLVS}" alt="VTLVS" height="18" style="display:block;margin:0 auto 6px;height:18px;border:0">
Envoyé avec VTLVS</a></td></tr></table>
</td></tr></table></body></html>`;

// Même titre que le gabarit VTLVS : Arial, 22 px, encre.
const titre = (t: string) =>
  `<h1 style="font-family:Arial,Helvetica,sans-serif;font-weight:700;font-size:22px;line-height:1.3;color:${ENCRE};margin:0 0 18px">${esc(t)}</h1>`;

const para = (html: string) =>
  `<p style="line-height:1.65;color:${DOUX};margin:0 0 12px">${html}</p>`;

const ligne = (label: string, value?: string | null) =>
  value
    ? `<p style="margin:6px 0;color:${ENCRE}"><strong style="color:${MARINE}">${esc(label)} :</strong> ${esc(value)}</p>`
    : "";

const bouton = (href: string, label: string) => `
  <p style="margin:22px 0">
    <a href="${esc(href)}" style="display:inline-block;background:${MARINE};color:#ffffff;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:999px">${esc(label)}</a>
  </p>`;

// ─────────────────────────────────────────────────────────── formulaire de contact

export function buildNotificationEmail(d: ContactPayload) {
  return wrap(`
    ${titre("Nouvelle demande de contact")}
    ${ligne("Nom", d.name)}
    ${ligne("Email", d.email)}
    ${ligne("Téléphone", d.phone)}
    ${ligne("Structure", d.company)}
    ${ligne("Formation souhaitée", d.formation)}
    ${ligne("Financement envisagé", d.financement)}
    <p style="margin:18px 0 6px;color:${ENCRE}"><strong style="color:${MARINE}">Message :</strong></p>
    <p style="white-space:pre-wrap;line-height:1.65;color:${DOUX};margin:0">${esc(d.message)}</p>
  `);
}

export function buildConfirmationEmail(d: ContactPayload) {
  return wrap(`
    ${titre("Nous avons bien reçu votre demande")}
    ${para(`Bonjour ${esc(d.name)},`)}
    ${para(
      `Merci de votre intérêt pour ${esc(site.name)}. Un conseiller étudie votre demande et revient vers vous sous 48&nbsp;heures ouvrées pour échanger sur votre projet.`,
    )}
    ${para("À très bientôt,<br />L'équipe " + esc(site.name))}
  `);
}

// ─────────────────────────────────────────────────────────── demande d'inscription

export function buildInscriptionNotification(d: InscriptionPayload) {
  return wrap(`
    ${titre("Nouvelle demande d'inscription")}
    ${ligne("Nom", d.full_name)}
    ${ligne("Email", d.email)}
    ${ligne("Téléphone", d.phone)}
    ${ligne("Structure", d.company)}
    ${d.message
      ? `<p style="margin:18px 0 6px;color:${ENCRE}"><strong style="color:${MARINE}">Message :</strong></p>
         <p style="white-space:pre-wrap;line-height:1.65;color:${DOUX};margin:0">${esc(d.message)}</p>`
      : ""}
    ${para(
      d.positionnement
        ? "Un test de positionnement a été créé pour cette personne. La demande est visible dans la plateforme."
        : "Aucun test de positionnement n'a été créé pour cette demande — à vérifier dans la plateforme.",
    )}
  `);
}

export function buildPositionnementNotification(d: {
  titre: string;
  lead_id: string;
  score: number;
  max_score: number;
  level: string | null;
  lignes: { question: string; reponse: string }[];
}) {
  const rep = d.lignes
    .map(
      (l) => `<p style="margin:14px 0 2px;color:${MARINE};font-weight:600">${esc(l.question)}</p>
              <p style="margin:0;white-space:pre-wrap;line-height:1.6;color:${l.reponse ? DOUX : "#9AA6B8"}">${l.reponse ? esc(l.reponse) : "— sans réponse"}</p>`,
    )
    .join("");
  return wrap(`
    ${titre(d.titre)}
    ${ligne("Niveau", d.level ?? "à préciser")}
    ${ligne("Aisance numérique", `${d.score} / ${d.max_score}`)}
    ${ligne("Demande", d.lead_id)}
    ${rep}
    ${para("Les réponses sont conservées dans la plateforme avec la demande (indicateur 8).")}
  `);
}

export function buildInscriptionConfirmation(d: InscriptionPayload) {
  return wrap(`
    ${titre("Votre demande d'inscription est enregistrée")}
    ${para(`Bonjour ${esc(d.full_name)},`)}
    ${para(
      `Nous avons bien reçu votre demande auprès de ${esc(site.name)}. Prochaine étape : un court test de positionnement, qui nous permet de vous orienter vers le parcours adapté et d'adapter la formation à votre niveau.`,
    )}
    ${
      d.positionnement
        ? bouton(d.positionnement, "Faire le test de positionnement") +
          para(
            "Ce lien vous est personnel. Si vous l'avez déjà commencé dans votre navigateur, vous pouvez reprendre où vous en étiez.",
          )
        : para(
            "Un conseiller vous transmettra le lien du test et reviendra vers vous sous 48&nbsp;heures ouvrées.",
          )
    }
    ${para("À très bientôt,<br />L'équipe " + esc(site.name))}
  `);
}

// ─────────────────────────────────────────────────────────── commandes en ligne

export type CommandeMail = {
  profil: "entreprise" | "particulier";
  formation: string;
  nom?: string | null;
  email?: string | null;
  raisonSociale?: string | null;
  telephone?: string | null;
  quantite: number;
  montant: string;
  session: string;
  positionnement?: string | null;
  retractation?: { lien: string; fin: string } | null;
  echeances?: { date: string; montant: string }[];
  facture?: string | null;
};

export function buildCommandeClient(d: CommandeMail) {
  const etapes = d.profil === "entreprise"
    ? `${para(`Votre paiement de <strong>${esc(d.montant)}</strong> pour ${d.quantite} participant${d.quantite > 1 ? "s" : ""} à ${esc(d.formation)} (${esc(d.session)}) est confirmé.`)}
       ${d.facture ? bouton(d.facture, "Télécharger la facture") : para("Votre facture vous parvient par un courriel séparé.")}
       ${para("<strong>Prochaines étapes :</strong> nous vous adressons la convention de formation à signer, puis vous nous communiquez le nom des participants au plus tard 7 jours avant la session. Chaque participant passe un court test de positionnement.")}`
    : `${para(`Votre inscription à ${esc(d.formation)} (${esc(d.session)}) est réservée. Votre carte est enregistrée : <strong>rien n'a été prélevé</strong>.`)}
       ${d.echeances?.length ? `<p style="margin:16px 0 6px;color:${ENCRE}"><strong style="color:${MARINE}">Votre échéancier (${esc(d.montant)} au total)</strong></p>
         ${d.echeances.map((e) => `<p style="margin:4px 0;color:${DOUX}">${esc(e.date)} — ${esc(e.montant)}</p>`).join("")}
         ${para("Vous recevez un rappel quelques jours avant chaque prélèvement.")}` : ""}
       ${d.retractation ? para(`Vous pouvez vous rétracter sans motif ni frais jusqu'au <strong>${esc(d.retractation.fin)}</strong> :`) + bouton(d.retractation.lien, "Me rétracter") : ""}
       ${para("Votre contrat de formation vous est adressé avant le début de la session.")}`;
  return wrap(`
    ${titre("Votre réservation est confirmée")}
    ${para(`Bonjour${d.nom ? " " + esc(d.nom) : ""},`)}
    ${etapes}
    ${d.positionnement ? para("Dernière étape avant la session : le test de positionnement, environ 20 minutes. Il nous permet d'adapter les ateliers à votre niveau et à votre cas réel.") + bouton(d.positionnement, "Faire le test de positionnement") : ""}
    ${para(`Une question ? Répondez simplement à ce courriel.<br />L'équipe ${esc(site.name)}`)}
  `);
}

export function buildCommandeOrganisme(d: CommandeMail) {
  return wrap(`
    ${titre(`Nouvelle commande en ligne — ${d.profil === "entreprise" ? "entreprise" : "particulier"}`)}
    ${ligne("Client", d.raisonSociale ? `${d.raisonSociale} (${d.nom ?? ""})` : d.nom)}
    ${ligne("Email", d.email)}
    ${ligne("Téléphone", d.telephone)}
    ${ligne("Places", String(d.quantite))}
    ${ligne("Montant", d.montant)}
    ${ligne("Formation", d.formation)}
    ${ligne("Session", d.session)}
    ${d.profil === "particulier"
      ? para(`Carte enregistrée, aucun prélèvement avant la fin de la rétractation (${esc(d.retractation?.fin ?? "")}). Échéances : ${esc((d.echeances ?? []).map((e) => `${e.date} ${e.montant}`).join(" · "))}.`) +
        para("À faire : adresser le contrat de formation (L6353-3).")
      : para("Paiement encaissé. À faire : adresser la convention de formation et demander le nom des participants.")}
    ${para(d.positionnement ? "Un test de positionnement a été créé et envoyé." : "Aucun test de positionnement n'a pu être créé : à envoyer depuis la plateforme.")}
  `);
}

export function buildRappelEcheance(d: { nom?: string | null; montant: string; date: string; rang: number; formation: string }) {
  return wrap(`
    ${titre("Rappel : prochaine échéance")}
    ${para(`Bonjour${d.nom ? " " + esc(d.nom) : ""},`)}
    ${para(`L'échéance n° ${d.rang} de votre formation ${esc(d.formation)}, d'un montant de <strong>${esc(d.montant)}</strong>, sera prélevée le <strong>${esc(d.date)}</strong> sur la carte enregistrée lors de votre réservation.`)}
    ${para("Rien à faire de votre côté. Si votre carte a changé, répondez à ce courriel avant cette date.")}
  `);
}

export function buildEcheanceEchec(d: { nom?: string | null; montant: string; rang: number; lien: string; formation: string }) {
  return wrap(`
    ${titre("Votre échéance n'a pas pu être prélevée")}
    ${para(`Bonjour${d.nom ? " " + esc(d.nom) : ""},`)}
    ${para(`Le prélèvement de l'échéance n° ${d.rang} (${esc(d.montant)}) de votre formation ${esc(d.formation)} n'a pas abouti — votre banque a peut-être demandé une confirmation. Vous pouvez la régler en ligne en une minute :`)}
    ${bouton(d.lien, "Régler l'échéance")}
    ${para("Sans régularisation sous 8 jours, l'accès à la formation peut être suspendu, conformément à nos conditions générales de vente.")}
  `);
}

export function buildFactureEcheance(d: { nom?: string | null; formation: string; rang: number; montant: string; lien: string }) {
  return wrap(`
    ${titre("Votre facture")}
    ${para(`Bonjour${d.nom ? " " + esc(d.nom) : ""},`)}
    ${para(`L'échéance n° ${d.rang} de votre formation ${esc(d.formation)} (${esc(d.montant)}) a bien été réglée. Votre facture est disponible :`)}
    ${bouton(d.lien, "Voir et télécharger la facture")}
  `);
}

export function buildRetractationConfirmee(d: { nom?: string | null; formation: string }) {
  return wrap(`
    ${titre("Votre rétractation est enregistrée")}
    ${para(`Bonjour${d.nom ? " " + esc(d.nom) : ""},`)}
    ${para(`Votre rétractation à ${esc(d.formation)} est bien prise en compte. Aucune somme n'a été prélevée et aucun prélèvement ne le sera. Votre carte n'est plus utilisée pour cette commande.`)}
    ${para(`Si vous changez d'avis, vous pouvez réserver à nouveau à tout moment.<br />L'équipe ${esc(site.name)}`)}
  `);
}

export function buildAlerteOrganisme(titreTexte: string, lignes: (string | null | undefined)[]) {
  return wrap(`${titre(titreTexte)}${lignes.filter(Boolean).map((l) => para(esc(l))).join("")}`);
}
