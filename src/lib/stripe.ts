import "server-only";
import Stripe from "stripe";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Stripe, en mode plateforme Connect.
 *
 * Le compte dont la clé est `STRIPE_SECRET_KEY` est la plateforme (AZZ&CO LABS). La vente,
 * elle, appartient à HBS FORMATION — l'organisme qui détient la déclaration d'activité, la
 * certification Qualiopi et qui émet les factures. D'où les **charges directes** sur le compte
 * connecté `STRIPE_CONNECT_ACCOUNT` : HBS est le marchand, son nom figure sur le relevé et sur
 * la facture, et la plateforme prélève sa commission (`STRIPE_APPLICATION_FEE_BPS`, en points
 * de base) sur chaque paiement.
 *
 * Sans compte connecté configuré, le module fonctionne sur le compte de la clé : c'est le mode
 * des tests. `venteOuverte()` refuse ce cas en production — encaisser la vente de HBS sur un
 * autre compte que le sien n'est pas une configuration, c'est une erreur.
 */

let client: Stripe | null = null;

export function stripe() {
  const cle = process.env.STRIPE_SECRET_KEY;
  if (!cle) throw new Error("STRIPE_SECRET_KEY absente");
  client ??= new Stripe(cle, { appInfo: { name: "hbs-formation" } });
  return client;
}

export const compteConnecte = () => process.env.STRIPE_CONNECT_ACCOUNT || undefined;

/**
 * Options de requête : toute opération de vente se fait sur le compte de HBS.
 * Jamais un objet vide — stripe-node le prend pour un argument inconnu et refuse l'appel.
 */
export const options = (compte?: string | null, extra: Stripe.RequestOptions = {}): Stripe.RequestOptions => ({
  maxNetworkRetries: 2,
  ...(compte ? { stripeAccount: compte } : {}),
  ...extra,
});
export const surCompte = (): Stripe.RequestOptions => options(compteConnecte());

export const modeTest = () => (process.env.STRIPE_SECRET_KEY ?? "").startsWith("sk_test_");

/** La réservation en ligne est-elle ouverte ici ? */
export function venteOuverte(): { ouverte: boolean; raison?: string } {
  if (!process.env.STRIPE_SECRET_KEY) return { ouverte: false, raison: "cle_absente" };
  const production = process.env.VERCEL_ENV === "production";
  if (production && modeTest()) return { ouverte: false, raison: "cle_de_test_en_production" };
  if (production && !compteConnecte()) return { ouverte: false, raison: "compte_hbs_non_connecte" };
  return { ouverte: true };
}

/** Commission de la plateforme sur un montant (centimes). */
export function commission(montant: number) {
  const bps = Number(process.env.STRIPE_APPLICATION_FEE_BPS ?? 0);
  if (!compteConnecte() || !Number.isFinite(bps) || bps <= 0) return undefined;
  return Math.round((montant * bps) / 10_000);
}

// ── Liens signés (rétractation) ───────────────────────────────────────────────────────
// Le lien envoyé au particulier doit suffire à se rétracter, sans compte ni mot de passe :
// l'identifiant de commande est signé, et la signature ne se devine pas.

const secret = () => {
  const s = process.env.COMMANDE_SIGNING_SECRET;
  if (!s) throw new Error("COMMANDE_SIGNING_SECRET absente");
  return s;
};

export function signer(id: string) {
  return createHmac("sha256", secret()).update(`retractation:${id}`).digest("base64url");
}

export function signatureValide(id: string, sig: string) {
  const attendu = Buffer.from(signer(id));
  const recu = Buffer.from(sig);
  return attendu.length === recu.length && timingSafeEqual(attendu, recu);
}
