import "server-only";
import type Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe, signer, options } from "@/lib/stripe";
import { FORMATIONS, PACK, RETRACTATION_JOURS, echeancier, montantsEcheances, euros, libelleDates, type CodeFormation } from "@/lib/commande";
import { submitDemande, catalogue, configured as learnConfigured } from "@/lib/learn";
import { buildCommandeClient, buildCommandeOrganisme, type CommandeMail } from "@/lib/email/templates";
import { log, errMsg } from "@/lib/log";
import { archiverPdf } from "@/lib/coffre";
import { site } from "@/lib/site";

const origine = () => process.env.NEXT_PUBLIC_SITE_URL || site.url;

export const dateFr = (d: Date | string) =>
  new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" });

/** Un courriel transactionnel. Ne lève jamais : un envoi raté se journalise, il ne défait pas une commande. */
export async function envoyer(to: string | string[], subject: string, html: string, replyTo?: string) {
  const cle = process.env.RESEND_API_KEY;
  // Domaines réservés (RFC 2606) : jamais d'envoi — un rebond abîme la réputation de l'expéditeur.
  const reserve = /@(?:[^@]+\.)?(example\.(com|net|org)|[^@]+\.(test|invalid|example|localhost))$/i;
  const dest = (Array.isArray(to) ? to : [to]).filter((a) => a && !reserve.test(a));
  if (!cle || !dest.length) return false;
  try {
    const { Resend } = await import("resend");
    const r = await new Resend(cle).emails.send({
      from: process.env.CONTACT_FROM || "HBS FORMATION <contact@vtlvs.com>",
      to: dest,
      subject,
      html,
      replyTo,
    });
    if (r.error) {
      log.error("commande.email.echec", { subject, err: r.error.message });
      return false;
    }
    return true;
  } catch (e) {
    log.error("commande.email.exception", { subject, err: errMsg(e) });
    return false;
  }
}

export const destinatairesOrganisme = () =>
  (process.env.CONTACT_NOTIFY_TO || site.email).split(",").map((a) => a.trim()).filter(Boolean);

/** Le lien de rétractation signé, valable sans compte. */
export const lienRetractation = (id: string) =>
  `${origine()}/reserver/retractation?c=${id}&s=${signer(id)}`;

/**
 * `checkout.session.completed` d'une réservation. Idempotent : la contrainte unique sur
 * `stripe_session_id` absorbe la seconde livraison d'un même événement.
 */
export async function enregistrerCommande(sessionId: string, compte?: string) {
  const opts: Stripe.RequestOptions = options(compte);
  const s = await stripe().checkout.sessions.retrieve(
    sessionId,
    { expand: ["setup_intent", "invoice"] },
    opts,
  );
  const md = s.metadata ?? {};
  // Une formation, ou le Pack 360 : ses quatre sessions sont dans `sessions` (codes séparés
  // par des virgules), et ses dates vont du premier jour de la première au dernier de la dernière.
  const estPack = md.produit === PACK.code;
  const formation = estPack
    ? { code: PACK.code, nom: PACK.nom, prix: PACK.prix }
    : FORMATIONS[md.produit as CodeFormation];
  if (!formation || !md.session_debut || !md.session_fin) return { ignore: true };
  const session = { debut: md.session_debut, fin: md.session_fin };
  const semaine = libelleDates(session);
  const sessionsCommandees = estPack
    ? (md.sessions ?? "").split(",").filter(Boolean).map((code) => ({ code, nom: FORMATIONS[code.split("-")[0] as CodeFormation]?.nom }))
    : [{ code: md.session_code, nom: formation.nom }];

  const db = createAdminClient();
  const { data: existante } = await db.from("hbs_commandes").select("id").eq("stripe_session_id", s.id).maybeSingle();
  if (existante) return { deja: true };

  const profil = md.profil === "particulier" ? "particulier" : "entreprise";
  const quantite = Number(md.quantite ?? 1);
  const total = formation.prix * quantite;
  const client = s.customer_details;
  const raison = s.custom_fields?.find((f) => f.key === "raison_sociale")?.text?.value ?? null;
  const siret = s.custom_fields?.find((f) => f.key === "siret")?.text?.value ?? null;
  const setup = typeof s.setup_intent === "object" ? s.setup_intent : null;
  const pm = !setup?.payment_method ? null : typeof setup.payment_method === "string" ? setup.payment_method : setup.payment_method.id;
  const facture = typeof s.invoice === "object" ? s.invoice : null;
  const commandeLe = new Date((s.created ?? Date.now() / 1000) * 1000);
  const finRetractation = new Date(commandeLe.getTime() + RETRACTATION_JOURS * 86_400_000);

  // Le particulier : la carte devient le moyen par défaut du client, pour les prélèvements
  // hors session que la tâche des échéances fera sans lui.
  if (profil === "particulier" && pm && typeof s.customer === "string") {
    await stripe().customers.update(s.customer, { invoice_settings: { default_payment_method: pm } }, opts).catch((e) =>
      log.warn("commande.pm_defaut", { err: errMsg(e) }),
    );
  }

  const { data: cmd, error } = await db
    .from("hbs_commandes")
    .insert({
      profil,
      statut: profil === "entreprise" ? (s.payment_status === "paid" ? "payee" : "en_attente") : "carte_enregistree",
      produit: formation.code,
      session_code: md.session_code,
      quantite,
      montant_total: total,
      email: client?.email ?? null,
      nom: client?.name ?? null,
      raison_sociale: raison,
      telephone: client?.phone ?? null,
      stripe_account: compte ?? null,
      stripe_session_id: s.id,
      stripe_customer_id: typeof s.customer === "string" ? s.customer : s.customer?.id ?? null,
      stripe_payment_method_id: pm,
      stripe_payment_intent_id: typeof s.payment_intent === "string" ? s.payment_intent : s.payment_intent?.id ?? null,
      stripe_invoice_id: facture?.id ?? null,
      retractation_fin: profil === "particulier" ? finRetractation.toISOString() : null,
      cgv_version: md.cgv_version ?? "inconnue",
      cgv_acceptees_le: md.cgv_acceptees_le ?? new Date().toISOString(),
      meta: { siret, tax_ids: client?.tax_ids ?? [], adresse: client?.address ?? null, livemode: s.livemode },
    })
    .select("id")
    .single();

  if (error) {
    // 23505 : une livraison concurrente du même événement a gagné la course.
    if (error.code === "23505") return { deja: true };
    throw new Error(`hbs_commandes: ${error.message}`);
  }

  let echeances: { date: string; montant: string }[] = [];
  if (profil === "particulier") {
    const montants = montantsEcheances(total);
    const plan = echeancier(commandeLe, session).map((e, i) => ({
      commande_id: cmd.id,
      rang: e.rang,
      montant: montants[i],
      due_le: e.date.toISOString(),
    }));
    const { error: errE } = await db.from("hbs_echeances").insert(plan);
    if (errE) log.error("commande.echeances", { err: errE.message, commande: cmd.id });
    echeances = plan.map((p) => ({ date: dateFr(p.due_le), montant: euros(p.montant) }));
  }

  // La demande dans LEARN : c'est elle qui crée le test de positionnement (indicateur 8).
  let positionnement: string | null = null;
  if (learnConfigured() && client?.email) {
    const cat = await catalogue().catch(() => null);
    // Une demande par session commandée : le Pack 360 en ouvre quatre, une par formation.
    for (const sc of sessionsCommandees) {
      try {
        const programme = cat?.programmes.find((p) => p.title.toLowerCase() === (sc.nom ?? "").toLowerCase());
        const r = await submitDemande({
          full_name: client.name || raison || client.email,
          email: client.email,
          phone: client.phone ?? null,
          company: raison,
          message: `Commande en ligne ${profil}${estPack ? " — Pack 360" : ""} — ${quantite} participant(s) — ${sc.code ?? ""}`,
          program_id: programme?.id ?? null,
          session_id: programme?.sessions?.find((x) => x.code === sc.code)?.id ?? null,
          campaign: "commande-en-ligne",
        });
        if (r.positionnement_path && !positionnement) positionnement = new URL(r.positionnement_path, origine()).toString();
      } catch (e) {
        log.warn("commande.learn", { err: errMsg(e), session: sc.code });
      }
    }
    if (positionnement) await db.from("hbs_commandes").update({ learn_positionnement: positionnement }).eq("id", cmd.id);
  }

  // La facture de la commande entreprise, au coffre de l'organisme, rattachée à la session.
  let factureUrl = facture?.hosted_invoice_url ?? null;
  if (facture?.id) {
    const f = await stripe().invoices.retrieve(facture.id, {}, opts).catch(() => null);
    factureUrl = f?.hosted_invoice_url ?? factureUrl;
    if (f?.invoice_pdf) {
      await archiverPdf({ url: f.invoice_pdf, filename: `facture-${f.number ?? f.id}.pdf`, kind: "facture", sessionCode: md.session_code, ref: `stripe:${f.id}` });
    }
  }

  const mail: CommandeMail = {
    profil,
    nom: client?.name,
    email: client?.email,
    raisonSociale: raison,
    telephone: client?.phone,
    quantite,
    montant: euros(total),
    formation: formation.nom,
    session: semaine,
    positionnement,
    retractation: profil === "particulier" ? { lien: lienRetractation(cmd.id), fin: dateFr(finRetractation) } : null,
    echeances,
    facture: factureUrl,
  };

  if (client?.email) {
    await envoyer(client.email, `Votre réservation — ${formation.nom}`, buildCommandeClient(mail), destinatairesOrganisme()[0]);
  }
  await envoyer(
    destinatairesOrganisme(),
    `Commande en ligne — ${raison ?? client?.name ?? client?.email} — ${euros(total)}`,
    buildCommandeOrganisme(mail),
    client?.email ?? undefined,
  );

  log.info("commande.enregistree", { id: cmd.id, profil, quantite, livemode: s.livemode });
  return { id: cmd.id };
}
