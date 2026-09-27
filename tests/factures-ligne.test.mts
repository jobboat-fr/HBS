// node --experimental-strip-types --test tests/
// Hors du périmètre TypeScript de Next (extension .mts) : aucune dépendance de test à ajouter.
import { test } from "node:test";
import assert from "node:assert/strict";
import { doitEnvoyer, ligneFacture } from "../src/lib/factures-ligne.ts";

const base = {
  id: "in_123", number: "HBS-0001", status: "paid", currency: "EUR", total: 120000, total_excluding_tax: 100000,
  customer_email: " Compta@Entreprise.fr ", customer_name: "Entreprise", invoice_pdf: "https://pdf", hosted_invoice_url: "https://h",
  status_transitions: { finalized_at: 1_790_000_000, paid_at: 1_790_000_600 },
};

test("une facture payée devient une ligne, montants en centimes, TVA déduite de Stripe", () => {
  const l = ligneFacture(base);
  assert.ok(l);
  assert.equal(l.statut, "paid");
  assert.equal(l.montant_ttc, 120000);
  assert.equal(l.montant_ht, 100000);
  assert.equal(l.montant_tva, 20000);
  assert.equal(l.devise, "eur");
  assert.equal(l.destinataire_email, "Compta@Entreprise.fr");
  assert.equal(l.emise_le, new Date(1_790_000_000 * 1000).toISOString());
  assert.equal(l.payee_le, new Date(1_790_000_600 * 1000).toISOString());
});

test("un brouillon n'est pas une pièce : rien n'est reflété", () => {
  assert.equal(ligneFacture({ ...base, status: "draft" }), null);
});

test("un statut inconnu n'entre pas", () => {
  assert.equal(ligneFacture({ ...base, status: "deleted" }), null);
});

test("sans taxe, le HT est le sous-total et la TVA vaut zéro", () => {
  const l = ligneFacture({ ...base, total: 50000, total_excluding_tax: null, subtotal: 50000 });
  assert.ok(l);
  assert.equal(l.montant_ht, 50000);
  assert.equal(l.montant_tva, 0);
});

test("une facture ouverte n'a pas de date de paiement", () => {
  const l = ligneFacture({ ...base, status: "open", status_transitions: { finalized_at: 1_790_000_000 } });
  assert.ok(l);
  assert.equal(l.payee_le, null);
});

test("sans identifiant, rien", () => {
  assert.equal(ligneFacture({ ...base, id: null }), null);
});

test("envoi au payeur : payée toujours, ouverte seulement pour une entreprise", () => {
  assert.equal(doitEnvoyer("paid", "particulier"), true);
  assert.equal(doitEnvoyer("paid", null), true);
  assert.equal(doitEnvoyer("open", "entreprise"), true);
  assert.equal(doitEnvoyer("open", "particulier"), false);
  assert.equal(doitEnvoyer("open", null), false);
  assert.equal(doitEnvoyer("void", "entreprise"), false);
  assert.equal(doitEnvoyer("uncollectible", "entreprise"), false);
});
