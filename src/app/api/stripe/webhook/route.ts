import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { enregistrerCommande } from "@/lib/commandes-serveur";
import { createAdminClient } from "@/lib/supabase/admin";
import { log, errMsg } from "@/lib/log";

export const runtime = "nodejs";

/**
 * Webhook Stripe. Deux points d'entrée possibles côté Stripe — un pour la plateforme, un pour
 * les comptes connectés (`event.account` renseigné) — chacun avec son propre secret : d'où
 * `STRIPE_WEBHOOK_SECRET` qui accepte une liste séparée par des virgules.
 *
 * Refus sans signature valide. Réponse 200 dès que l'événement est traité ou volontairement
 * ignoré ; 500 seulement si le traitement a échoué, pour que Stripe réessaie.
 */
export async function POST(request: NextRequest) {
  const secrets = (process.env.STRIPE_WEBHOOK_SECRET ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  const signature = request.headers.get("stripe-signature");
  if (!secrets.length || !signature) {
    return NextResponse.json({ error: "non configuré" }, { status: 400 });
  }

  const corps = await request.text();
  let event: Stripe.Event | null = null;
  for (const s of secrets) {
    try {
      event = stripe().webhooks.constructEvent(corps, signature, s);
      break;
    } catch {
      /* secret suivant */
    }
  }
  if (!event) {
    log.warn("stripe.webhook.signature_invalide");
    return NextResponse.json({ error: "signature invalide" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const session = event.data.object as Stripe.Checkout.Session;
        // Règlement en ligne d'une échéance restée impayée (lien envoyé par la tâche quotidienne).
        if (session.metadata?.echeance_id) {
          if (session.payment_status === "paid") {
            await createAdminClient()
              .from("hbs_echeances")
              .update({
                statut: "payee",
                payee_le: new Date().toISOString(),
                stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : null,
              })
              .eq("id", session.metadata.echeance_id);
          }
          break;
        }
        if (session.mode === "payment" && session.payment_status !== "paid" && event.type === "checkout.session.completed") {
          // Paiement différé (virement, etc.) : on attend `async_payment_succeeded`.
          break;
        }
        await enregistrerCommande(session.id, event.account);
        break;
      }
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        const pi = typeof charge.payment_intent === "string" ? charge.payment_intent : null;
        if (pi && charge.refunded) {
          await createAdminClient().from("hbs_commandes").update({ statut: "remboursee", updated_at: new Date().toISOString() }).eq("stripe_payment_intent_id", pi);
        }
        break;
      }
      default:
        break;
    }
  } catch (e) {
    log.error("stripe.webhook.traitement", { type: event.type, id: event.id, err: errMsg(e) });
    return NextResponse.json({ error: "traitement" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
