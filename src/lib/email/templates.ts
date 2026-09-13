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
function esc(v: unknown): string {
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
