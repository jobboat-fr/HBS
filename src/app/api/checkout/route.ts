import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type Stripe from "stripe";
import { stripe, surCompte, commission, venteOuverte, compteConnecte } from "@/lib/stripe";
import { PRODUIT, RETRACTATION_JOURS, CGV_VERSION, echeancier, montantsEcheances, euros } from "@/lib/commande";
import { checkRateLimit } from "@/lib/rateLimit";
import { log, errMsg } from "@/lib/log";
import { site } from "@/lib/site";

export const runtime = "nodejs";

const schema = z.object({
  profil: z.enum(["entreprise", "particulier"]),
  quantite: z.number().int().min(1).max(PRODUIT.placesMax),
  cgv: z.literal(true, { message: "Les conditions générales de vente doivent être acceptées" }),
  // Particulier : l'échéancier et l'autorisation de prélèvement sont acceptés explicitement.
  echeancier: z.boolean().optional(),
});

/**
 * Crée la session Stripe Checkout. Deux régimes, qui ne se ressemblent pas :
 *
 * - **Entreprise** : paiement immédiat de `quantite × 1 300 €`, facture émise par Stripe au
 *   nom du compte de HBS, SIRET/TVA et adresse de facturation collectés.
 * - **Particulier** : mode `setup` — la carte est enregistrée, **rien n'est prélevé**. Le Code
 *   du travail interdit d'exiger une somme avant la fin de la rétractation (L6353-6) ; la
 *   tâche quotidienne `/api/cron/echeances` prélève ensuite 30 %, puis le solde en deux fois.
 *   Une place par commande : le contrat de formation est individuel.
 */
export async function POST(request: NextRequest) {
  const etat = venteOuverte();
  if (!etat.ouverte) {
    log.warn("checkout.ferme", { raison: etat.raison });
    return NextResponse.json(
      { error: "La réservation en ligne ouvre très bientôt. Demandez votre place : nous vous recontactons sous 48 h.", fallback: "/preinscription" },
      { status: 503 },
    );
  }
  if (!(await checkRateLimit(request, "checkout", 3600, 20))) {
    return NextResponse.json({ error: "Trop de tentatives. Réessayez plus tard." }, { status: 429 });
  }

  let data: z.infer<typeof schema>;
  try {
    data = schema.parse(await request.json());
  } catch (e) {
    const msg = e instanceof z.ZodError ? e.issues[0]?.message : "Requête invalide";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
  if (data.profil === "particulier") {
    if (data.quantite !== 1) {
      return NextResponse.json({ error: "Une commande par participant à titre personnel." }, { status: 400 });
    }
    if (!data.echeancier) {
      return NextResponse.json({ error: "L'échéancier de paiement doit être accepté." }, { status: 400 });
    }
  }

  const origine = process.env.NEXT_PUBLIC_SITE_URL || site.url;
  const total = PRODUIT.prixUnitaire * data.quantite;
  const acceptees = new Date().toISOString();
  const metadata = {
    produit: PRODUIT.code,
    session_code: PRODUIT.session.code,
    profil: data.profil,
    quantite: String(data.quantite),
    cgv_version: CGV_VERSION,
    cgv_acceptees_le: acceptees,
  };

  const commun: Stripe.Checkout.SessionCreateParams = {
    locale: "fr",
    success_url: `${origine}/reserver/merci?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origine}/reserver?profil=${data.profil}&annule=1`,
    billing_address_collection: "required",
    metadata,
    // Plus de 30 minutes de réflexion sur la page de paiement : on repart de la page de réservation.
    expires_at: Math.floor(Date.now() / 1000) + 60 * 60,
  };

  try {
    let session: Stripe.Checkout.Session;

    if (data.profil === "entreprise") {
      session = await stripe().checkout.sessions.create(
        {
          ...commun,
          mode: "payment",
          customer_creation: "always",
          // Stripe ne collecte le téléphone qu'en mode paiement ; le particulier le donne au test de positionnement.
          phone_number_collection: { enabled: true },
          line_items: [
            {
              quantity: data.quantite,
              price_data: {
                currency: PRODUIT.devise,
                unit_amount: PRODUIT.prixUnitaire,
                tax_behavior: "inclusive",
                product_data: {
                  name: `${PRODUIT.nom} — ${PRODUIT.session.libelle}`,
                  description: PRODUIT.description,
                  metadata: { produit: PRODUIT.code },
                },
              },
            },
          ],
          tax_id_collection: { enabled: true },
          custom_fields: [
            { key: "raison_sociale", label: { type: "custom", custom: "Raison sociale" }, type: "text" },
            { key: "siret", label: { type: "custom", custom: "SIRET (facultatif)" }, type: "text", optional: true },
          ],
          invoice_creation: {
            enabled: true,
            invoice_data: {
              description: `${PRODUIT.nom} — ${PRODUIT.session.libelle} — ${data.quantite} place(s)`,
              footer: "HBS FORMATION — organisme de formation, déclaration d'activité n° 28760809976 (préfet de région Normandie). Certifié Qualiopi — actions de formation.",
              metadata,
            },
          },
          payment_intent_data: {
            description: `${PRODUIT.nom} — ${data.quantite} place(s)`,
            statement_descriptor_suffix: "FORMATION IA",
            application_fee_amount: commission(total),
            metadata,
          },
          custom_text: {
            submit: { message: "Facture émise par HBS FORMATION. La convention de formation vous est adressée après le paiement." },
          },
        },
        surCompte(),
      );
    } else {
      const [m1, m2, m3] = montantsEcheances(PRODUIT.prixUnitaire);
      const [e1, e2, e3] = echeancier(new Date()).map((e) =>
        e.date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", timeZone: "Europe/Paris" }),
      );
      session = await stripe().checkout.sessions.create(
        {
          ...commun,
          mode: "setup",
          currency: PRODUIT.devise,
          customer_creation: "always",
          payment_method_types: ["card"],
          setup_intent_data: { metadata, description: `${PRODUIT.nom} — échéancier particulier` },
          custom_text: {
            submit: {
              message:
                `Aucun prélèvement aujourd'hui ni pendant votre délai de rétractation de ${RETRACTATION_JOURS} jours. ` +
                `Ensuite : ${euros(m1)} le ${e1}, ${euros(m2)} le ${e2}, ${euros(m3)} le ${e3}.`,
            },
          },
        },
        surCompte(),
      );
    }

    log.info("checkout.cree", { profil: data.profil, quantite: data.quantite, connect: Boolean(compteConnecte()) });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    log.error("checkout.erreur", { err: errMsg(e) });
    return NextResponse.json({ error: "Le paiement n'a pas pu être préparé. Réessayez dans un instant." }, { status: 502 });
  }
}
