/**
 * Une facture Stripe, traduite en ligne `learn_invoices`. Pur : aucun appel réseau, aucune base —
 * c'est ce qui permet de le tester sans Stripe (tests/factures-ligne.test.mts).
 *
 * Stripe émet, la plateforme reflète : le numéro, la TVA et le PDF viennent de Stripe tels quels,
 * rien n'est recalculé ici. Les montants restent des entiers en centimes, comme chez Stripe.
 */

export const STATUTS_FACTURE = ["draft", "open", "paid", "uncollectible", "void"] as const;
export type StatutFacture = (typeof STATUTS_FACTURE)[number];

/** Le sous-ensemble d'une `Stripe.Invoice` dont on a besoin (API 2025, SDK 18). */
export interface FactureStripe {
  id?: string | null;
  number?: string | null;
  status?: string | null;
  currency?: string | null;
  total?: number | null;
  total_excluding_tax?: number | null;
  subtotal?: number | null;
  customer_email?: string | null;
  customer_name?: string | null;
  invoice_pdf?: string | null;
  hosted_invoice_url?: string | null;
  status_transitions?: { finalized_at?: number | null; paid_at?: number | null } | null;
}

export interface LigneFacture {
  stripe_invoice_id: string;
  numero: string | null;
  statut: StatutFacture;
  montant_ht: number;
  montant_tva: number;
  montant_ttc: number;
  devise: string;
  destinataire_email: string | null;
  destinataire_nom: string | null;
  stripe_pdf_url: string | null;
  stripe_hosted_url: string | null;
  emise_le: string | null;
  payee_le: string | null;
}

/**
 * Faut-il envoyer la facture à son payeur (courriel dédié, PDF joint — décidé le 27/09) ?
 * Payée : oui. Ouverte : seulement pour une commande d'entreprise, réglée par virement, qui a
 * besoin de la pièce pour payer. Le reste (annulée, irrécouvrable) ne part pas.
 * LEARN garantit l'unicité : appeler deux fois ne l'envoie qu'une fois.
 */
export function doitEnvoyer(statut: StatutFacture, profil?: string | null): boolean {
  return statut === "paid" || (statut === "open" && profil === "entreprise");
}

const date = (s?: number | null) => (s ? new Date(s * 1000).toISOString() : null);
const entier = (n?: number | null) => (typeof n === "number" && Number.isFinite(n) ? Math.round(n) : 0);

/**
 * `null` quand la facture n'est pas encore une pièce : un brouillon n'a ni numéro ni valeur
 * comptable, et on ne le reflète pas.
 */
export function ligneFacture(inv: FactureStripe): LigneFacture | null {
  if (!inv.id) return null;
  const statut = STATUTS_FACTURE.find((s) => s === inv.status);
  if (!statut || statut === "draft") return null;
  const ttc = entier(inv.total);
  // `total_excluding_tax` est le HT de Stripe ; `subtotal` le remplace sur les factures sans taxe.
  const ht = entier(inv.total_excluding_tax ?? inv.subtotal ?? inv.total);
  return {
    stripe_invoice_id: inv.id,
    numero: inv.number ?? null,
    statut,
    montant_ht: ht,
    montant_tva: Math.max(0, ttc - ht),
    montant_ttc: ttc,
    devise: (inv.currency || "eur").toLowerCase(),
    destinataire_email: inv.customer_email?.trim() || null,
    destinataire_nom: inv.customer_name?.trim() || null,
    stripe_pdf_url: inv.invoice_pdf ?? null,
    stripe_hosted_url: inv.hosted_invoice_url ?? null,
    emise_le: date(inv.status_transitions?.finalized_at),
    payee_le: date(inv.status_transitions?.paid_at),
  };
}
