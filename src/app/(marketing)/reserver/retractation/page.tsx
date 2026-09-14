"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

function Retractation() {
  const p = useSearchParams();
  const [etat, setEtat] = useState<"attente" | "envoi" | "ok" | "erreur">("attente");
  const [message, setMessage] = useState("");

  async function confirmer() {
    setEtat("envoi");
    const r = await fetch("/api/commande/retractation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ c: p.get("c"), s: p.get("s") }),
    }).catch(() => null);
    const d = r ? await r.json().catch(() => ({})) : {};
    if (r?.ok) setEtat("ok");
    else {
      setEtat("erreur");
      setMessage(d.error || "Une erreur est survenue. Écrivez-nous à contact@hbs-formation.fr.");
    }
  }

  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-mist bg-white p-8 text-center shadow-card">
      {etat === "ok" ? (
        <>
          <h1 className="font-display text-2xl font-bold text-ink">Rétractation enregistrée</h1>
          <p className="mt-3 text-ink-soft">Aucune somme n&apos;a été ni ne sera prélevée. Une confirmation vous est envoyée par courriel.</p>
          <Link href="/" className="mt-6 inline-block font-semibold text-teal-700 underline">Retour à l&apos;accueil</Link>
        </>
      ) : (
        <>
          <h1 className="font-display text-2xl font-bold text-ink">Vous rétracter de votre formation</h1>
          <p className="mt-3 text-ink-soft">
            Votre réservation sera annulée et aucun prélèvement ne sera effectué. Cette action est définitive.
          </p>
          {etat === "erreur" ? <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{message}</p> : null}
          <button
            type="button"
            onClick={confirmer}
            disabled={etat === "envoi" || !p.get("c") || !p.get("s")}
            className="mt-6 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-ink px-6 font-bold text-white disabled:opacity-50"
          >
            {etat === "envoi" ? <Loader2 size={18} className="animate-spin" /> : null}
            Confirmer ma rétractation
          </button>
          <p className="mt-4 text-xs text-ink-muted">
            Vous avez changé d&apos;avis ? Fermez simplement cette page : votre réservation est conservée.
          </p>
        </>
      )}
    </div>
  );
}

export default function RetractationPage() {
  return (
    <section className="bg-cloud pb-20 pt-[calc(var(--entete)+3rem)]">
      <div className="container-page">
        <Suspense>
          <Retractation />
        </Suspense>
      </div>
    </section>
  );
}
