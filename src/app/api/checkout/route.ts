import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import type Stripe from "stripe";
import { stripe, surCompte, commission, venteOuverte, compteConnecte } from "@/lib/stripe";
import { FORMATIONS, PLACES_MAX, RETRACTATION_JOURS, CGV_VERSION, echeancier, montantsEcheances, euros, sessionParCode, libelleSemaine, type CodeFormation } from "@/lib/commande";
import { checkRateLimit } from "@/lib/rateLimit";
import { log, errMsg } from "@/lib/log";
import { site } from "@/lib/site";

export const runtime = "nodejs";

const schema = z.object({
  formation: z.enum(["DATA360", "CONTENT360", "MKT360", "IA360"]),
  session: z.string().max(40),
  profil: z.enum(["entreprise", "particulier"]),
  quantite: z.number().int().min(1).max(PLACES_MAX),
  cgv: z.literal(true, { message: "Les conditions générales de vente doivent être acceptées" }),
  // Particulier : l'échéancier et l'autorisation de prélèvement sont acceptés explicitement.
  echeancier: z.boolean().optional(),
});

/**
 * Crée la session Stripe Checkout. Deux régimes, qui ne se ressemblent pas :
 *
 * - **Entreprise** : paiement immédiat de `quantite × prix de la formation`, facture émise par Stripe au
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
      { error: "Le paiement en ligne est momentanément indisponible. Réessayez dans quelques minutes." },
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

  // La session est recalculée depuis le planning : un code inventé, une semaine passée ou
  // complète, ou la session d'une autre formation ne passent pas.
  const creneau = sessionParCode(data.session);
  if (!creneau || creneau.formation !== data.formation || creneau.statut !== "ouvert") {
    return NextResponse.json({ error: "Cette session n'est plus ouverte à la réservation. Choisissez une autre semaine." }, { status: 409 });
  }
  const f = FORMATIONS[data.formation as CodeFormation];
  const semaine = `semaine ${libelleSemaine(creneau)}`;

  const origine = process.env.NEXT_PUBLIC_SITE_URL || site.url;
  const total = f.prix * data.quantite;
  const acceptees = new Date().toISOString();
  const metadata = {
    produit: f.code,
    session_code: creneau.code,
    session_debut: creneau.debut,
    session_fin: creneau.fin,
    profil: data.profil,
    quantite: String(data.quantite),
    cgv_version: CGV_VERSION,
    cgv_acceptees_le: acceptees,
  };

  const commun: Stripe.Checkout.SessionCreateParams = {
    locale: "fr",
    success_url: `${origine}/reserver/merci?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origine}/reserver?formation=${f.code}&session=${creneau.code}&profil=${data.profil}&annule=1`,
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
                currency: "eur",
                unit_amount: f.prix,
                tax_behavior: "inclusive",
                product_data: {
                  name: `${f.nom} — ${semaine}`,
                  description: `${f.accroche}. 21 heures de formation en direct.`,
                  metadata: { produit: f.code },
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
              description: `${f.nom} — ${semaine} — ${data.quantite} place(s)`,
              footer: "HBS FORMATION — organisme de formation, déclaration d'activité n° 28760809976 (préfet de région Normandie). Certifié Qualiopi — actions de formation.",
              metadata,
            },
          },
          payment_intent_data: {
            description: `${f.nom} — ${data.quantite} place(s)`,
            statement_descriptor_suffix: "FORMATION",
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
      const [m1, m2, m3] = montantsEcheances(f.prix);
      const [e1, e2, e3] = echeancier(new Date(), creneau).map((e) =>
        e.date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", timeZone: "Europe/Paris" }),
      );
      session = await stripe().checkout.sessions.create(
        {
          ...commun,
          mode: "setup",
          currency: "eur",
          customer_creation: "always",
          payment_method_types: ["card"],
          setup_intent_data: { metadata, description: `${f.nom} — ${semaine} — échéancier particulier` },
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

    log.info("checkout.cree", { formation: f.code, session: creneau.code, profil: data.profil, quantite: data.quantite, connect: Boolean(compteConnecte()) });
    return NextResponse.json({ url: session.url });
  } catch (e) {
    log.error("checkout.erreur", { err: errMsg(e) });
    return NextResponse.json({ error: "Le paiement n'a pas pu être préparé. Réessayez dans un instant." }, { status: 502 });
  }
}
