import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe, commission, options } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { envoyer, destinatairesOrganisme, dateFr } from "@/lib/commandes-serveur";
import { buildRappelEcheance, buildEcheanceEchec, buildAlerteOrganisme } from "@/lib/email/templates";
import { FORMATIONS, euros, type CodeFormation } from "@/lib/commande";
import { log, errMsg } from "@/lib/log";
import { archiverPdf } from "@/lib/coffre";
import { buildFactureEcheance } from "@/lib/email/templates";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const maxDuration = 60;

const JOUR = 86_400_000;

/**
 * Tâche quotidienne (vercel.json) : rappels à J-3, puis prélèvement des échéances dues.
 *
 * Garde-fous, dans l'ordre où ils comptent :
 * 1. jamais une commande rétractée, annulée ou remboursée ;
 * 2. jamais avant la fin du délai de rétractation, même si la date d'échéance est dépassée —
 *    le calcul de l'échéancier le garantit déjà, la tâche le revérifie ;
 * 3. une échéance n'est tentée qu'une fois : en cas d'échec (authentification bancaire,
 *    fonds), le client reçoit un lien de paiement plutôt qu'une série de refus sur sa carte.
 *
 * Clé d'idempotence Stripe par échéance : deux exécutions concurrentes ne prélèvent pas deux fois.
 */
export async function GET(request: NextRequest) {
  const attendu = process.env.CRON_SECRET;
  if (!attendu || request.headers.get("authorization") !== `Bearer ${attendu}`) {
    return NextResponse.json({ error: "non autorisé" }, { status: 401 });
  }

  const db = createAdminClient();
  const maintenant = new Date();
  const bilan = { rappels: 0, payees: 0, echecs: 0, ignorees: 0 };

  const { data: lignes, error } = await db
    .from("hbs_echeances")
    .select("id, rang, montant, due_le, statut, rappel_le, tentatives, commande:hbs_commandes(id, statut, produit, session_code, nom, email, stripe_account, stripe_customer_id, stripe_payment_method_id, retractation_fin)")
    .eq("statut", "a_prelever")
    .lte("due_le", new Date(maintenant.getTime() + 3 * JOUR).toISOString())
    .order("due_le");
  if (error) {
    log.error("echeances.lecture", { err: error.message });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  for (const l of lignes ?? []) {
    const c = (Array.isArray(l.commande) ? l.commande[0] : l.commande) as {
      id: string; statut: string; produit: string; session_code: string; nom: string | null; email: string | null; stripe_account: string | null;
      stripe_customer_id: string | null; stripe_payment_method_id: string | null; retractation_fin: string | null;
    } | null;
    if (!c || !["carte_enregistree", "impayee"].includes(c.statut)) {
      await db.from("hbs_echeances").update({ statut: "annulee" }).eq("id", l.id);
      bilan.ignorees++;
      continue;
    }

    const due = new Date(l.due_le);
    const nomFormation = FORMATIONS[c.produit as CodeFormation]?.nom ?? "votre formation";

    // Rappel à J-3 (ou dès que possible si la commande est plus récente).
    if (!l.rappel_le && c.email) {
      await envoyer(c.email, `Rappel : échéance du ${dateFr(due)} — ${nomFormation}`,
        buildRappelEcheance({ nom: c.nom, montant: euros(l.montant), date: dateFr(due), rang: l.rang, formation: nomFormation }));
      await db.from("hbs_echeances").update({ rappel_le: maintenant.toISOString() }).eq("id", l.id);
      bilan.rappels++;
    }

    if (due > maintenant) continue;
    if (c.retractation_fin && new Date(c.retractation_fin) > maintenant) continue;
    if (!c.stripe_customer_id || !c.stripe_payment_method_id) {
      log.error("echeances.sans_moyen", { echeance: l.id });
      continue;
    }

    const opts: Stripe.RequestOptions = options(c.stripe_account, { idempotencyKey: `echeance-${l.id}-${l.tentatives + 1}` });
    await db.from("hbs_echeances").update({ tentatives: l.tentatives + 1 }).eq("id", l.id);

    try {
      const pi = await stripe().paymentIntents.create(
        {
          amount: l.montant,
          currency: "eur",
          customer: c.stripe_customer_id,
          payment_method: c.stripe_payment_method_id,
          off_session: true,
          confirm: true,
          description: `${nomFormation} — échéance ${l.rang}/3`,
          statement_descriptor_suffix: "FORMATION",
          application_fee_amount: c.stripe_account ? commission(l.montant) : undefined,
          metadata: { produit: c.produit, commande_id: c.id, echeance_id: l.id, rang: String(l.rang) },
        },
        opts,
      );
      if (pi.status === "succeeded") {
        await db.from("hbs_echeances").update({ statut: "payee", payee_le: new Date().toISOString(), stripe_payment_intent_id: pi.id }).eq("id", l.id);
        bilan.payees++;
        // Facture de l'échéance : émise, marquée payée (le prélèvement vient d'aboutir), archivée, envoyée.
        try {
          const o = options(c.stripe_account, { idempotencyKey: `facture-${l.id}` });
          await stripe().invoiceItems.create({ customer: c.stripe_customer_id, amount: l.montant, currency: "eur", description: `${nomFormation} — échéance ${l.rang}/3` }, o);
          const brouillon = await stripe().invoices.create(
            { customer: c.stripe_customer_id, auto_advance: false, pending_invoice_items_behavior: "include", metadata: { commande_id: c.id, echeance_id: l.id, payment_intent: pi.id } },
            options(c.stripe_account, { idempotencyKey: `facture-doc-${l.id}` }),
          );
          const finale = await stripe().invoices.finalizeInvoice(brouillon.id!, { auto_advance: false }, options(c.stripe_account));
          const payee = await stripe().invoices.pay(finale.id!, { paid_out_of_band: true }, options(c.stripe_account));
          if (payee.invoice_pdf) {
            await archiverPdf({ url: payee.invoice_pdf, filename: `facture-${payee.number ?? payee.id}.pdf`, kind: "facture", sessionCode: c.session_code, ref: `stripe:${payee.id}` });
          }
          if (c.email && payee.hosted_invoice_url) {
            await envoyer(c.email, `Votre facture — ${nomFormation}, échéance ${l.rang}/3`,
              buildFactureEcheance({ nom: c.nom, formation: nomFormation, rang: l.rang, montant: euros(l.montant), lien: payee.hosted_invoice_url }));
          }
        } catch (e) {
          log.error("echeances.facture", { echeance: l.id, err: errMsg(e) });
        }
      } else {
        throw Object.assign(new Error(`statut ${pi.status}`), { payment_intent: pi });
      }
    } catch (e) {
      bilan.echecs++;
      const message = errMsg(e);
      await db.from("hbs_echeances").update({ statut: "echec", derniere_erreur: message.slice(0, 500) }).eq("id", l.id);
      await db.from("hbs_commandes").update({ statut: "impayee", updated_at: new Date().toISOString() }).eq("id", c.id);
      log.warn("echeances.echec", { echeance: l.id, err: message });

      // Lien de paiement pour régulariser : une session Checkout du montant exact.
      try {
        const origine = process.env.NEXT_PUBLIC_SITE_URL || site.url;
        const lien = await stripe().checkout.sessions.create(
          {
            mode: "payment",
            locale: "fr",
            customer: c.stripe_customer_id,
            line_items: [{ quantity: 1, price_data: { currency: "eur", unit_amount: l.montant, product_data: { name: `${nomFormation} — échéance ${l.rang}/3` } } }],
            payment_intent_data: {
              application_fee_amount: c.stripe_account ? commission(l.montant) : undefined,
              setup_future_usage: "off_session",
              metadata: { produit: c.produit, commande_id: c.id, echeance_id: l.id },
            },
            metadata: { produit: c.produit, commande_id: c.id, echeance_id: l.id, session_code: c.session_code },
            invoice_creation: { enabled: true, invoice_data: { description: `${nomFormation} — échéance ${l.rang}/3` } },
            success_url: `${origine}/reserver/merci?echeance=1`,
            cancel_url: `${origine}/contact`,
          },
          options(c.stripe_account),
        );
        if (c.email && lien.url) {
          await envoyer(c.email, `Votre échéance n'a pas pu être prélevée — ${nomFormation}`,
            buildEcheanceEchec({ nom: c.nom, montant: euros(l.montant), rang: l.rang, lien: lien.url, formation: nomFormation }));
        }
      } catch (e2) {
        log.error("echeances.lien", { echeance: l.id, err: errMsg(e2) });
      }
      await envoyer(destinatairesOrganisme(), `Échéance impayée — ${c.nom ?? c.email}`,
        buildAlerteOrganisme("Échéance impayée", [
          `Échéance ${l.rang}/3 (${euros(l.montant)}) de ${c.nom ?? ""} (${c.email ?? ""}).`,
          `Motif : ${message}`,
          "Un lien de paiement lui a été envoyé.",
        ]));
    }
  }

  // Commandes dont toutes les échéances sont payées → soldées.
  const { data: ouvertes } = await db.from("hbs_commandes").select("id, hbs_echeances(statut)").in("statut", ["carte_enregistree", "impayee"]);
  for (const o of ouvertes ?? []) {
    const e = (o as { hbs_echeances: { statut: string }[] }).hbs_echeances;
    if (e.length && e.every((x) => x.statut === "payee")) {
      await db.from("hbs_commandes").update({ statut: "soldee", updated_at: new Date().toISOString() }).eq("id", o.id);
    } else if (e.length && e.every((x) => x.statut === "payee" || x.statut === "a_prelever") ) {
      await db.from("hbs_commandes").update({ statut: "carte_enregistree" }).eq("id", o.id).eq("statut", "impayee");
    }
  }

  log.info("echeances.bilan", bilan);
  return NextResponse.json(bilan);
}
