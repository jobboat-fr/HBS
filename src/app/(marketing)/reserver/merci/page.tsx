import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Mail, ClipboardList, FileSignature } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { stripe, surCompte } from "@/lib/stripe";
import { FORMATIONS, libelleSemaine, type CodeFormation } from "@/lib/commande";

export const metadata: Metadata = {
  title: "Réservation confirmée",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

/**
 * La page de retour de Stripe. Elle relit la session côté serveur plutôt que de croire
 * l'URL : `?session_id=` se recopie, un statut « payé » affiché à tort ne doit pas l'être.
 * Elle n'enregistre rien — c'est le webhook qui fait foi, même si le visiteur ferme l'onglet.
 */
export default async function MerciPage({ searchParams }: { searchParams: Promise<{ session_id?: string; echeance?: string }> }) {
  const { session_id, echeance } = await searchParams;

  let profil: "entreprise" | "particulier" | null = null;
  let email: string | null = null;
  let valide = false;
  let nomFormation = "votre formation";
  let semaine = "";
  if (session_id && /^cs_(test|live)_[A-Za-z0-9]+$/.test(session_id)) {
    try {
      const s = await stripe().checkout.sessions.retrieve(session_id, {}, surCompte());
      const f = FORMATIONS[s.metadata?.produit as CodeFormation];
      valide = s.status === "complete" && Boolean(f);
      if (f) nomFormation = f.nom;
      if (s.metadata?.session_debut && s.metadata?.session_fin) {
        semaine = `semaine ${libelleSemaine({ debut: s.metadata.session_debut, fin: s.metadata.session_fin })}`;
      }
      profil = s.metadata?.profil === "particulier" ? "particulier" : "entreprise";
      email = s.customer_details?.email ?? null;
    } catch {
      valide = false;
    }
  }

  if (echeance) {
    return (
      <>
        <PageHeader eyebrow="Paiement" title="Échéance réglée, merci" subtitle="Votre paiement est enregistré. Vous recevez le reçu par courriel." />
        <section className="py-12 text-center">
          <Link href="/" className="font-semibold text-teal-700 underline">Retour à l&apos;accueil</Link>
        </section>
      </>
    );
  }

  if (!valide) {
    return (
      <>
        <PageHeader eyebrow="Réservation" title="Nous n'avons pas pu confirmer ce paiement" />
        <section className="py-12">
          <div className="container-page mx-auto max-w-xl text-center text-ink-soft">
            <p>Si vous venez de payer, la confirmation arrive par courriel dans quelques minutes. Sinon, vous pouvez reprendre votre réservation.</p>
            <Link href="/reserver" className="bouton-neon mt-6 inline-flex min-h-[48px] items-center rounded-full px-6 font-bold">Reprendre ma réservation</Link>
          </div>
        </section>
      </>
    );
  }

  const etapes = [
    { icon: Mail, titre: "Confirmation par courriel", texte: `Envoyée à ${email ?? "votre adresse"}${profil === "entreprise" ? ", avec votre facture" : ", avec votre échéancier et votre lien de rétractation"}.` },
    { icon: ClipboardList, titre: "Test de positionnement", texte: "Environ 20 minutes, depuis le lien du courriel : il adapte les ateliers à votre niveau et à votre cas réel." },
    { icon: FileSignature, titre: profil === "entreprise" ? "Convention de formation" : "Contrat de formation", texte: profil === "entreprise" ? "Nous vous l'adressons, puis vous nous indiquez le nom des participants." : "Vous le recevez avant le début de la session." },
  ];

  return (
    <>
      <PageHeader
        eyebrow="C'est réservé"
        title={<>Bienvenue en <span className="texte-lumiere">{nomFormation}</span></>}
        subtitle={profil === "particulier" ? "Votre place est réservée. Rien n'a été prélevé aujourd'hui." : "Votre paiement est confirmé."}
      />
      <section className="bg-cloud py-12 lg:py-16">
        <div className="container-page mx-auto max-w-3xl">
          <div className="flex items-center gap-3 rounded-2xl border border-teal-200 bg-white p-5">
            <CheckCircle2 size={28} className="shrink-0 text-teal-600" aria-hidden />
            <p className="text-ink">
              {nomFormation} — <b>{semaine}</b>
            </p>
          </div>
          <ol className="mt-8 space-y-4">
            {etapes.map(({ icon: I, titre, texte }, i) => (
              <li key={titre} className="verre-clair flex gap-4 rounded-2xl border border-mist p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-600 font-bold text-white">{i + 1}</span>
                <div>
                  <p className="flex items-center gap-2 font-display font-bold text-ink"><I size={18} aria-hidden /> {titre}</p>
                  <p className="mt-1 text-sm text-ink-soft">{texte}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-center text-sm text-ink-muted">
            Une question ? <Link href="/contact" className="underline">Écrivez-nous</Link> ·{" "}
            <Link href="/formations#programme" className="underline">revoir le programme</Link>
          </p>
        </div>
      </section>
    </>
  );
}
