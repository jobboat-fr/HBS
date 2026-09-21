import "server-only";

import { createClient } from "@supabase/supabase-js";

/**
 * Envoyer par LEARN, et jamais directement par Resend.
 *
 * La vitrine expédiait par son propre SDK : quatre appels, chacun fabriquant son HTML, son
 * expéditeur et ses en-têtes. Aucun ne passait par ce que la plateforme a construit autour
 * de l'envoi — liste de suppression, préférences, consentement, désinscription, journal.
 * Concrètement : une adresse en rebond continuait d'être sollicitée à chaque commande, une
 * personne désinscrite recevait quand même, et personne ne pouvait dire si un message était
 * parti. Il n'y avait pas de trace à consulter.
 *
 * Tout passe désormais par `/api/v1/learn/interne/envoi`. Ce qui en découle sans code
 * supplémentaire : l'expéditeur devient `"HBS FORMATION" <…@hbs-formation.fr>` parce que le
 * domaine est enregistré comme vérifié côté LEARN, et chaque envoi laisse une ligne dans
 * `learn_notifications` — y compris quand il est refusé, avec la raison.
 *
 * **Le filet.** Ce que la vitrine envoie n'est pas interchangeable : une confirmation après
 * paiement, une facture, un échec de prélèvement. Si LEARN est injoignable, on dépose dans
 * `learn_vitrine_outbox` et le ramassage périodique rejoue. On ne perd pas une confirmation
 * de commande parce qu'un service redémarrait.
 *
 * L'appel ne jette jamais : une demande de contact enregistrée dont l'accusé n'est pas parti
 * vaut mieux qu'un formulaire qui affiche une erreur alors que tout a été pris en compte.
 */

type Charge = {
  email: string;
  cle: string;
  ctx: Record<string, unknown>;
  relatedKind?: string | null;
  relatedId?: string | null;
};

export type Resultat = { envoye: boolean; differe: boolean; raison?: string };

function config() {
  const base = (process.env.LEARN_API_URL || "https://api.vtlvs.com").replace(/\/$/, "");
  const jeton = process.env.HBS_API_TOKEN;
  const tenant = process.env.LEARN_TENANT_ID;
  const auNomDe = process.env.LEARN_ON_BEHALF_OF;
  return { base, jeton, tenant, auNomDe };
}

/** Le dépôt de secours, écrit avec la clé de service — la vitrine n'a pas de session. */
async function deposer(c: Charge, raison: string): Promise<Resultat> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const cle = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const tenant = process.env.LEARN_TENANT_ID;
  if (!url || !cle || !tenant) {
    console.error("[mail] envoi perdu : ni LEARN ni file de secours configurés", { cle: c.cle, raison });
    return { envoye: false, differe: false, raison };
  }
  try {
    const db = createClient(url, cle, { auth: { persistSession: false } });
    const { error } = await db.from("learn_vitrine_outbox").insert({
      tenant_id: tenant,
      email: c.email,
      cle: c.cle,
      ctx: c.ctx,
      related_kind: c.relatedKind ?? null,
      related_id: c.relatedId ?? null,
      erreur: raison.slice(0, 300),
    });
    if (error) throw error;
    return { envoye: false, differe: true, raison };
  } catch (e) {
    console.error("[mail] dépôt de secours impossible", { cle: c.cle, raison, e });
    return { envoye: false, differe: false, raison };
  }
}

export async function envoyer(c: Charge): Promise<Resultat> {
  const { base, jeton, tenant, auNomDe } = config();
  if (!jeton || !tenant || !auNomDe) {
    return deposer(c, "LEARN_API_URL / HBS_API_TOKEN / LEARN_TENANT_ID / LEARN_ON_BEHALF_OF absents");
  }

  try {
    const r = await fetch(`${base}/api/v1/learn/interne/envoi`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${jeton}`,
        "X-Learn-On-Behalf-Of": auNomDe,
      },
      body: JSON.stringify({
        tenant_id: tenant,
        email: c.email,
        cle: c.cle,
        ctx: c.ctx,
        related_kind: c.relatedKind ?? null,
        related_id: c.relatedId ?? null,
      }),
      // Au-delà, on préfère déposer : le visiteur n'a pas à attendre le courrier.
      signal: AbortSignal.timeout(12_000),
    });

    if (!r.ok) {
      const texte = await r.text().catch(() => "");
      // 4xx = LEARN a compris et refusé (modèle inconnu, hors périmètre). Rejouer à
      // l'identique donnerait le même refus, donc on ne dépose pas : on journalise.
      if (r.status >= 400 && r.status < 500) {
        console.error("[mail] refusé par LEARN", { cle: c.cle, status: r.status, texte: texte.slice(0, 200) });
        return { envoye: false, differe: false, raison: `LEARN ${r.status}` };
      }
      return deposer(c, `LEARN ${r.status}: ${texte.slice(0, 120)}`);
    }

    const rep = (await r.json()) as { statut?: string; erreur?: string | null };
    // « refusé par l'entonnoir » n'est pas une panne : désinscrit, adresse suspendue, sans
    // consentement. C'est une décision, et elle est déjà consignée côté LEARN.
    return { envoye: rep.statut === "sent", differe: false, raison: rep.erreur ?? undefined };
  } catch (e) {
    return deposer(c, e instanceof Error ? e.message : String(e));
  }
}

/** Plusieurs destinataires du même message — un envoi par personne, jamais un `Bcc`. */
export async function envoyerA(emails: string[], reste: Omit<Charge, "email">): Promise<Resultat[]> {
  return Promise.all(emails.filter(Boolean).map((email) => envoyer({ ...reste, email })));
}
