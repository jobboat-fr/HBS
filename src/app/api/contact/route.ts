import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { contactSchema } from "@/lib/validation/contact";
import { buildNotificationEmail, buildConfirmationEmail } from "@/lib/email/templates";
import { log, errMsg } from "@/lib/log";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rateLimit";

// En dessous de ce délai entre le rendu du formulaire et sa soumission, on considère que
// c'est un script (un humain ne remplit jamais un formulaire de contact en < 2s).
const MIN_FILL_TIME_MS = 2000;

export async function POST(request: NextRequest) {
  try {
    if (!(await checkRateLimit(request, "contact", RATE_LIMITS.contact.windowSeconds, RATE_LIMITS.contact.limit))) {
      return NextResponse.json({ error: "Trop de demandes. Réessayez plus tard." }, { status: 429 });
    }

    const body = await request.json();

    // Anti-bot : champ piège rempli, ou soumission trop rapide -> on répond succès sans
    // rien faire (ne pas donner de signal au bot qu'il a été détecté).
    const honeypotFilled = typeof body.website === "string" && body.website.trim().length > 0;
    const tooFast =
      typeof body.renderedAt === "number" && Date.now() - body.renderedAt < MIN_FILL_TIME_MS;
    if (honeypotFilled || tooFast) {
      log.warn("contact.bot_blocked", { honeypotFilled, tooFast });
      return NextResponse.json({ success: true });
    }

    const data = contactSchema.parse(body);

    const financement = data.financement ? data.financement : null;
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

    // 1) Enregistrement dans Supabase (table hbs_contact_submissions, RLS insert public)
    const supabase = await createClient();
    const { error: dbError } = await supabase.from("hbs_contact_submissions").insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      company: data.company || null,
      formation: data.formation || null,
      financement,
      message: data.message,
      ip_address: ip,
    });

    if (dbError) {
      log.error("contact.db", { err: dbError.message });
      return NextResponse.json({ error: "Enregistrement impossible." }, { status: 500 });
    }
    log.info("contact.saved", { email: data.email, formation: data.formation || null });

    // 2) Emails via Resend.
    //
    // La demande est déjà enregistrée : un envoi qui échoue ne doit pas faire échouer la
    // soumission du visiteur. Mais il ne doit pas non plus passer inaperçu, et c'est
    // exactement ce qui se produisait. `Promise.allSettled` était appelé sans que son
    // résultat soit lu, puis « contact.email.sent » était journalisé quoi qu'il arrive.
    //
    // Deux façons distinctes d'échouer, et il fallait les deux : la promesse peut être
    // rejetée (réseau, clé absente), et le SDK Resend peut aussi *résoudre* en portant une
    // erreur d'API dans `{ error }` plutôt qu'en levant. Un envoi refusé arrivait donc ici
    // sous la forme d'une promesse tenue.
    //
    // Ce n'était pas théorique. `CONTACT_FROM` valait `onboarding@resend.dev`, l'expéditeur
    // bac à sable de Resend, qui ne peut écrire qu'au titulaire du compte : *toutes* les
    // notifications vers contact@hbs-formation.fr étaient refusées, en silence, pendant que
    // le visiteur lisait « message envoyé ». Le défaut par défaut pointe désormais vers le
    // domaine réellement vérifié sur le compte.
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const { Resend } = await import("resend");
      const resend = new Resend(resendKey);
      const from = process.env.CONTACT_FROM || "HBS FORMATION <contact@vtlvs.com>";
      const notifyTo = process.env.CONTACT_NOTIFY_TO
        ? process.env.CONTACT_NOTIFY_TO.split(",").map((addr) => addr.trim()).filter(Boolean)
        : [data.email];

      const [notification, confirmation] = await Promise.allSettled([
        resend.emails.send({
          from,
          to: notifyTo,
          subject: `Nouvelle demande — ${data.name}${data.company ? ` (${data.company})` : ""}`,
          replyTo: data.email,
          html: buildNotificationEmail(data),
        }),
        resend.emails.send({
          from,
          to: data.email,
          subject: "Nous avons bien reçu votre demande — HBS FORMATION",
          html: buildConfirmationEmail(data),
        }),
      ]);

      const echec = (r: PromiseSettledResult<{ error?: { message?: string } | null }>) =>
        r.status === "rejected"
          ? errMsg(r.reason)
          : r.value?.error?.message ?? null;

      const echecNotif = echec(notification);
      const echecConfirm = echec(confirmation);

      // La notification est la seule qui compte pour l'organisme : sans elle, la demande
      // dort dans une table que personne ne consulte. Elle se journalise en erreur.
      if (echecNotif) {
        log.error("contact.email.notification_echec", { to: notifyTo, from, err: echecNotif });
      } else {
        log.info("contact.email.notification_ok", { to: notifyTo });
      }
      if (echecConfirm) {
        log.warn("contact.email.confirmation_echec", { err: echecConfirm });
      }
    } else {
      log.error("contact.email.skipped", { reason: "RESEND_API_KEY absente" });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation échouée", details: error.issues },
        { status: 400 },
      );
    }
    log.error("contact.error", { err: errMsg(error) });
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}
