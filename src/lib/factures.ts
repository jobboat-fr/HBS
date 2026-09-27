import "server-only";
import { stripe, options } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { archiverPdf } from "@/lib/coffre";
import { doitEnvoyer, ligneFacture } from "@/lib/factures-ligne";
import { envoyerFacture } from "@/lib/email/learn";
import { log, errMsg } from "@/lib/log";

/**
 * Reflète une facture Stripe dans `learn_invoices` (et sa pièce au coffre). Stripe émet, la
 * plateforme reflète : ce module n'invente ni numéro, ni montant, ni TVA.
 *
 * - **Relue chez Stripe à chaque appel**, jamais prise dans l'événement : Stripe ne garantit pas
 *   l'ordre de livraison, et un `invoice.finalized` rejoué après le paiement ne doit pas ramener
 *   une facture payée à « ouverte ».
 * - **Idempotent** : une ligne par `stripe_invoice_id`, réécrite à chaque passage ; la pièce au
 *   coffre est dédoublonnée par `archiverPdf` (référence `stripe:<id>`).
 * - **Le débiteur n'est jamais écrit ici.** La base le rattache seule (migration 0064) : à
 *   l'insertion si la société ou la personne existe, à la naissance du profil sinon. `envoyee_le`
 *   n'est pas touché non plus : c'est l'envoi du courriel qui le pose.
 *
 * Ne lève pas pour une facture non reflétable (brouillon, sans adresse) : elle se journalise.
 * Lève sur une erreur de base, pour que Stripe réessaie l'événement.
 */
export async function refleterFacture(
  invoiceId: string,
  compte?: string | null,
  { rejouerSiEchec = false }: { rejouerSiEchec?: boolean } = {},
): Promise<{ id: string; envoi: string | null } | null> {
  const inv = await stripe().invoices.retrieve(invoiceId, {}, options(compte));
  const ligne = ligneFacture(inv);
  if (!ligne) {
    log.info("facture.ignoree", { id: invoiceId, statut: inv.status });
    return null;
  }

  const db = createAdminClient();
  const { data: tenant } = await db.from("learn_tenants").select("id").eq("slug", process.env.LEARN_TENANT_SLUG || "hbs").single();
  if (!tenant) throw new Error("organisme introuvable");

  // La commande : celle qui porte cette facture, sinon la plus récente du même client Stripe
  // (les échéances et les factures de relance n'ont pas d'autre lien).
  const client = typeof inv.customer === "string" ? inv.customer : inv.customer?.id ?? null;
  let commande: { id: string; session_code: string | null; email: string | null; profil: string | null } | null = null;
  // Les factures d'échéance portent leur commande en métadonnée (cron/echeances) : lien le plus sûr.
  const parMeta = inv.metadata?.commande_id;
  if (parMeta) {
    const { data } = await db.from("hbs_commandes").select("id, session_code, email, profil").eq("id", parMeta).maybeSingle();
    commande = data;
  }
  if (!commande) {
    const { data } = await db.from("hbs_commandes").select("id, session_code, email, profil").eq("stripe_invoice_id", inv.id).maybeSingle();
    commande = data;
  }
  if (!commande && client) {
    const { data } = await db
      .from("hbs_commandes")
      .select("id, session_code, email, profil")
      .eq("stripe_customer_id", client)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    commande = data;
  }

  const destinataire = ligne.destinataire_email ?? commande?.email ?? null;
  if (!destinataire) {
    log.warn("facture.sans_destinataire", { id: inv.id, numero: ligne.numero });
    return null;
  }

  // La session et son programme, depuis le code porté par la commande.
  let sessionId: string | null = null;
  let programId: string | null = null;
  if (commande?.session_code) {
    const { data: s } = await db
      .from("learn_sessions")
      .select("id, program_id")
      .eq("tenant_id", tenant.id)
      .eq("code", commande.session_code)
      .maybeSingle();
    sessionId = s?.id ?? null;
    programId = s?.program_id ?? null;
  }

  const vaultId = ligne.stripe_pdf_url
    ? await archiverPdf({
        url: ligne.stripe_pdf_url,
        filename: `facture-${ligne.numero ?? inv.id}.pdf`,
        kind: "facture",
        sessionCode: commande?.session_code ?? null,
        ref: `stripe:${inv.id}`,
      })
    : null;

  const { data, error } = await db
    .from("learn_invoices")
    .upsert(
      {
        ...ligne,
        tenant_id: tenant.id,
        destinataire_email: destinataire,
        // Seulement ce qui est connu : un passage qui ne retrouve pas la commande ne doit pas
        // effacer le lien qu'un passage précédent avait posé.
        ...(commande?.id ? { commande_id: commande.id } : {}),
        ...(sessionId ? { session_id: sessionId } : {}),
        ...(programId ? { program_id: programId } : {}),
        ...(vaultId ? { vault_object_id: vaultId } : {}),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "stripe_invoice_id" },
    )
    .select("id, a_rattacher")
    .single();
  if (error) throw new Error(`learn_invoices : ${error.message}`);

  log.info("facture.refletee", {
    id: inv.id, numero: ligne.numero, statut: ligne.statut, commande: commande?.id ?? null,
    a_rattacher: data.a_rattacher, coffre: vaultId,
  });

  // Au payeur, PDF joint (F4). LEARN n'envoie qu'une fois : rappeler est sans risque.
  let statutEnvoi: string | null = null;
  if (doitEnvoyer(ligne.statut, commande?.profil)) {
    const envoi = await envoyerFacture(ligne.stripe_invoice_id);
    statutEnvoi = envoi.statut;
    log.info("facture.envoi", { id: inv.id, statut: envoi.statut });
    if (envoi.aRejouer && rejouerSiEchec) {
      // Côté webhook : l'erreur fait répondre 500, et Stripe rejoue l'événement.
      throw new Error(`envoi de la facture ${inv.id} : ${envoi.statut}`);
    }
  }
  return { id: data.id as string, envoi: statutEnvoi };
}

/** Pour les appelants qui ne doivent pas échouer (commande, échéances) : journalise et continue. */
export async function refleterFactureSansEchec(invoiceId: string, compte?: string | null) {
  try {
    return await refleterFacture(invoiceId, compte);
  } catch (e) {
    log.error("facture.reflet_echec", { id: invoiceId, err: errMsg(e) });
    return null;
  }
}
