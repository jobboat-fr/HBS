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

const ENCRE = "#0B2239";
const MARINE = "#1D3FAE";
const NUAGE = "#F4F7FB";
const DOUX = "#41506A";

const wrap = (inner: string) => `
  <div style="font-family:Inter,Arial,sans-serif;background:${NUAGE};padding:40px 16px">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #E3EAF3;border-radius:16px;overflow:hidden">
      <div style="height:4px;background:${MARINE}"></div>
      <div style="padding:32px">
        <div style="font-family:Poppins,Arial,sans-serif;font-size:18px;font-weight:700;color:${MARINE};letter-spacing:0.08em;text-transform:uppercase">${esc(site.name)}</div>
        ${inner}
        <hr style="border:none;border-top:1px solid #E3EAF3;margin:28px 0" />
        <div style="font-size:12px;color:#6B7A90;line-height:1.6">
          ${esc(site.name)} — ${esc(site.city)} · ${esc(site.email)} · ${esc(site.phone)}<br />
          Déclaration d'activité n° ${esc(legal.numeroDeclarationActivite)} — cet enregistrement ne vaut pas agrément de l'État.
        </div>
      </div>
    </div>
  </div>`;

const titre = (t: string) =>
  `<h1 style="font-family:Poppins,Arial,sans-serif;font-weight:600;font-size:23px;line-height:1.25;color:${ENCRE};margin:18px 0 10px">${esc(t)}</h1>`;

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
    ? `${para(`Votre paiement de <strong>${esc(d.montant)}</strong> pour ${d.quantite} place${d.quantite > 1 ? "s" : ""} à la Formation IA 360 (${esc(d.session)}) est confirmé.`)}
       ${d.facture ? bouton(d.facture, "Télécharger la facture") : para("Votre facture vous parvient par un courriel séparé.")}
       ${para("<strong>Prochaines étapes :</strong> nous vous adressons la convention de formation à signer, puis vous nous communiquez le nom des participants au plus tard 7 jours avant la session. Chaque participant passe un court test de positionnement.")}`
    : `${para(`Votre place à la Formation IA 360 (${esc(d.session)}) est réservée. Votre carte est enregistrée : <strong>rien n'a été prélevé</strong>.`)}
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
    ${ligne("Session", d.session)}
    ${d.profil === "particulier"
      ? para(`Carte enregistrée, aucun prélèvement avant la fin de la rétractation (${esc(d.retractation?.fin ?? "")}). Échéances : ${esc((d.echeances ?? []).map((e) => `${e.date} ${e.montant}`).join(" · "))}.`) +
        para("À faire : adresser le contrat de formation (L6353-3).")
      : para("Paiement encaissé. À faire : adresser la convention de formation et demander le nom des participants.")}
    ${para(d.positionnement ? "Un test de positionnement a été créé et envoyé." : "Aucun test de positionnement n'a pu être créé : à envoyer depuis la plateforme.")}
  `);
}

export function buildRappelEcheance(d: { nom?: string | null; montant: string; date: string; rang: number }) {
  return wrap(`
    ${titre("Rappel : prochaine échéance")}
    ${para(`Bonjour${d.nom ? " " + esc(d.nom) : ""},`)}
    ${para(`L'échéance n° ${d.rang} de votre Formation IA 360, d'un montant de <strong>${esc(d.montant)}</strong>, sera prélevée le <strong>${esc(d.date)}</strong> sur la carte enregistrée lors de votre réservation.`)}
    ${para("Rien à faire de votre côté. Si votre carte a changé, répondez à ce courriel avant cette date.")}
  `);
}

export function buildEcheanceEchec(d: { nom?: string | null; montant: string; rang: number; lien: string }) {
  return wrap(`
    ${titre("Votre échéance n'a pas pu être prélevée")}
    ${para(`Bonjour${d.nom ? " " + esc(d.nom) : ""},`)}
    ${para(`Le prélèvement de l'échéance n° ${d.rang} (${esc(d.montant)}) de votre Formation IA 360 n'a pas abouti — votre banque a peut-être demandé une confirmation. Vous pouvez la régler en ligne en une minute :`)}
    ${bouton(d.lien, "Régler l'échéance")}
    ${para("Sans régularisation sous 8 jours, l'accès à la formation peut être suspendu, conformément à nos conditions générales de vente.")}
  `);
}

export function buildRetractationConfirmee(d: { nom?: string | null }) {
  return wrap(`
    ${titre("Votre rétractation est enregistrée")}
    ${para(`Bonjour${d.nom ? " " + esc(d.nom) : ""},`)}
    ${para("Votre rétractation à la Formation IA 360 est bien prise en compte. Aucune somme n'a été prélevée et aucun prélèvement ne le sera. Votre carte n'est plus utilisée pour cette commande.")}
    ${para(`Si vous changez d'avis, vous pouvez réserver à nouveau à tout moment.<br />L'équipe ${esc(site.name)}`)}
  `);
}

export function buildAlerteOrganisme(titreTexte: string, lignes: (string | null | undefined)[]) {
  return wrap(`${titre(titreTexte)}${lignes.filter(Boolean).map((l) => para(esc(l))).join("")}`);
}
