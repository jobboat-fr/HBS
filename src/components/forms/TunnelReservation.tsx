"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Building2, UserRound, Landmark, Minus, Plus, Lock, ShieldCheck, Loader2, AlertTriangle, CalendarClock } from "lucide-react";
import { PRODUIT, RETRACTATION_JOURS, echeancier, montantsEcheances, euros, type Profil } from "@/lib/commande";

type Choix = Profil | "financeur";

const PROFILS: { id: Choix; titre: string; texte: string; icon: typeof Building2 }[] = [
  { id: "particulier", titre: "Pour moi", texte: "Indépendant, salarié à titre personnel, en reconversion", icon: UserRound },
  { id: "entreprise", titre: "Pour mon entreprise", texte: "Une ou plusieurs places, facture à la société", icon: Building2 },
  { id: "financeur", titre: "Avec un financeur", texte: "OPCO ou France Travail : nous montons le dossier", icon: Landmark },
];

/**
 * Le tunnel d'achat tient sur un écran : un profil, (une quantité), une case, un bouton — puis
 * la page de paiement Stripe. Tout ce que Stripe sait collecter (nom, adresse, TVA, carte) n'est
 * pas redemandé ici : chaque champ en plus avant le paiement est un visiteur en moins.
 */
export function TunnelReservation({ ouverte }: { ouverte: boolean }) {
  const params = useSearchParams();
  const initial = (params.get("profil") as Choix) || "particulier";
  const [profil, setProfil] = useState<Choix>(PROFILS.some((p) => p.id === initial) ? initial : "particulier");
  const [quantite, setQuantite] = useState(1);
  const [cgv, setCgv] = useState(false);
  const [accordEcheancier, setAccordEcheancier] = useState(false);
  const [busy, setBusy] = useState(false);
  const [erreur, setErreur] = useState<string | null>(params.get("annule") ? "Paiement interrompu — votre place n'est pas encore réservée." : null);

  const plan = useMemo(() => {
    const m = montantsEcheances(PRODUIT.prixUnitaire);
    return echeancier(new Date()).map((e, i) => ({
      ...e,
      montant: m[i],
      libelle: e.date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", timeZone: "Europe/Paris" }),
    }));
  }, []);

  const total = PRODUIT.prixUnitaire * (profil === "entreprise" ? quantite : 1);
  const pret = cgv && (profil !== "particulier" || accordEcheancier);

  async function payer() {
    if (profil === "financeur") return;
    setBusy(true);
    setErreur(null);
    try {
      const r = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profil, quantite: profil === "entreprise" ? quantite : 1, cgv, echeancier: accordEcheancier }),
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.url) {
        window.location.href = d.url;
        return;
      }
      if (d.fallback) {
        window.location.href = `${d.fallback}?profil=${profil}`;
        return;
      }
      setErreur(d.error || "Une erreur est survenue.");
    } catch {
      setErreur("Connexion impossible. Réessayez.");
    }
    setBusy(false);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr]">
      <div className="space-y-6">
        {/* 1. Profil */}
        <fieldset>
          <legend className="font-display text-lg font-bold text-ink">1. Vous réservez…</legend>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {PROFILS.map(({ id, titre, texte, icon: I }) => {
              const actif = profil === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setProfil(id)}
                  aria-pressed={actif}
                  className={`flex min-h-[120px] flex-col items-start gap-2 rounded-2xl border-2 p-4 text-left transition ${
                    actif ? "border-teal-500 bg-teal-50 shadow-card" : "border-mist bg-white hover:border-teal-300"
                  }`}
                >
                  <I size={22} className={actif ? "text-teal-600" : "text-ink-muted"} aria-hidden />
                  <span className="font-display font-bold text-ink">{titre}</span>
                  <span className="text-xs leading-snug text-ink-soft">{texte}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {profil === "financeur" ? (
          <div className="rounded-2xl border border-mist bg-cloud p-6">
            <p className="font-display text-lg font-bold text-ink">Pas de paiement en ligne : votre financeur règle la place.</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              HBS FORMATION est certifiée Qualiopi au titre des actions de formation. Salarié, votre OPCO peut financer
              la formation ; demandeur d&apos;emploi, France Travail peut la prendre en charge selon votre projet. Faites
              votre demande : nous vous envoyons le devis et le programme sous 48 heures ouvrées.
            </p>
            <Link href="/preinscription?financement=1" className="bouton-neon mt-5 inline-flex min-h-[48px] items-center gap-2 rounded-full px-6 font-bold">
              Demander mon devis <ArrowRight size={18} aria-hidden />
            </Link>
          </div>
        ) : (
          <>
            {/* 2. Détail */}
            {profil === "entreprise" ? (
              <fieldset>
                <legend className="font-display text-lg font-bold text-ink">2. Nombre de places</legend>
                <div className="mt-4 flex items-center gap-4">
                  <button type="button" aria-label="Retirer une place" onClick={() => setQuantite((q) => Math.max(1, q - 1))}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-mist bg-white text-ink hover:border-teal-400 disabled:opacity-40" disabled={quantite <= 1}>
                    <Minus size={18} />
                  </button>
                  <span className="min-w-[3ch] text-center font-display text-3xl font-extrabold text-ink" aria-live="polite">{quantite}</span>
                  <button type="button" aria-label="Ajouter une place" onClick={() => setQuantite((q) => Math.min(PRODUIT.placesMax, q + 1))}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-mist bg-white text-ink hover:border-teal-400 disabled:opacity-40" disabled={quantite >= PRODUIT.placesMax}>
                    <Plus size={18} />
                  </button>
                  <span className="text-sm text-ink-soft">× {euros(PRODUIT.prixUnitaire)}</span>
                </div>
                <p className="mt-3 text-xs text-ink-muted">
                  Raison sociale, adresse de facturation et n° de TVA sont demandés sur la page de paiement. Facture émise
                  par HBS FORMATION, convention de formation envoyée ensuite.
                </p>
              </fieldset>
            ) : (
              <fieldset>
                <legend className="font-display text-lg font-bold text-ink">2. Votre paiement, en toute sérénité</legend>
                <div className="mt-4 rounded-2xl border border-mist bg-white p-5">
                  <p className="flex items-center gap-2 font-semibold text-ink">
                    <CalendarClock size={18} className="text-teal-600" aria-hidden /> 0 € aujourd&apos;hui
                  </p>
                  <p className="mt-1 text-sm text-ink-soft">
                    Vous enregistrez votre carte. Rien n&apos;est prélevé pendant vos {RETRACTATION_JOURS} jours de rétractation.
                  </p>
                  <ol className="mt-4 space-y-2 text-sm">
                    {plan.map((e) => (
                      <li key={e.rang} className="flex justify-between gap-4 border-t border-mist pt-2">
                        <span className="text-ink-soft">Échéance {e.rang} · {e.libelle}</span>
                        <span className="font-semibold text-ink">{euros(e.montant)}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </fieldset>
            )}

            {/* 3. Accord */}
            <fieldset className="space-y-3">
              <legend className="font-display text-lg font-bold text-ink">3. Validation</legend>
              <label className="flex cursor-pointer items-start gap-3 text-sm text-ink-soft">
                <input type="checkbox" checked={cgv} onChange={(e) => setCgv(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-teal-600" />
                <span>
                  J&apos;accepte les <Link href="/cgv" target="_blank" className="font-semibold text-teal-700 underline">conditions générales de vente</Link> et
                  le traitement de mes données pour ma commande et mon inscription (<Link href="/confidentialite" target="_blank" className="underline">confidentialité</Link>).
                </span>
              </label>
              {profil === "particulier" ? (
                <label className="flex cursor-pointer items-start gap-3 text-sm text-ink-soft">
                  <input type="checkbox" checked={accordEcheancier} onChange={(e) => setAccordEcheancier(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 accent-teal-600" />
                  <span>
                    J&apos;autorise HBS FORMATION à prélever les trois échéances ci-dessus sur la carte que j&apos;enregistre, après
                    la fin de mon délai de rétractation.
                  </span>
                </label>
              ) : null}
            </fieldset>

            {erreur ? (
              <p className="flex items-start gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                <AlertTriangle size={16} className="mt-0.5 shrink-0" /> {erreur}
              </p>
            ) : null}

            <button
              type="button"
              onClick={payer}
              disabled={!pret || busy}
              className="bouton-neon flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full px-6 text-lg font-bold disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? <Loader2 size={20} className="animate-spin" /> : <Lock size={18} aria-hidden />}
              {!ouverte
                ? "Réserver ma place"
                : profil === "entreprise"
                  ? `Payer ${euros(total)}`
                  : "Réserver — 0 € aujourd'hui"}
              {!busy ? <ArrowRight size={18} aria-hidden /> : null}
            </button>
            <p className="flex items-center justify-center gap-2 text-xs text-ink-muted">
              <ShieldCheck size={14} aria-hidden /> Paiement sécurisé par Stripe · vos données de carte ne nous sont jamais transmises
            </p>
          </>
        )}
      </div>

      {/* Récapitulatif */}
      <aside className="lg:sticky lg:top-[calc(var(--entete)+1.5rem)] lg:self-start">
        <div className="cadre-neon">
          <div className="p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-red-600">Votre réservation</p>
            <p className="mt-2 font-display text-2xl font-extrabold text-ink">{PRODUIT.nom}</p>
            <p className="text-sm text-ink-soft">{PRODUIT.session.libelle} · à distance, en direct</p>
            <ul className="mt-4 space-y-1.5 text-sm text-ink-soft">
              <li>✓ 21 h · 6 ateliers pratiques</li>
              <li>✓ Outils IA inclus : agents, automatisations, assistant de réunion…</li>
              <li>✓ Test de positionnement et Certificat IA 360</li>
              <li>✓ Suivi à 3 mois</li>
            </ul>
            <div className="mt-5 flex items-baseline justify-between border-t border-mist pt-4">
              <span className="text-sm text-ink-soft">
                {profil === "entreprise" ? `${quantite} place${quantite > 1 ? "s" : ""}` : "1 place"}
              </span>
              <span className="font-display text-3xl font-extrabold text-ink">{profil === "financeur" ? "Pris en charge" : euros(total)}</span>
            </div>
            <p className="mt-1 text-right text-xs text-ink-muted">TTC</p>
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-ink-muted">
          Organisme certifié Qualiopi — actions de formation · <Link href="/faq#tarif" className="underline">questions sur le paiement</Link>
        </p>
      </aside>
    </div>
  );
}
