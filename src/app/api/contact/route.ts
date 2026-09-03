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

    // 2) Emails via Resend — ignorés proprement si la clé n'est pas configurée
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const { Resend } = await import("resend");
      const resend = new Resend(resendKey);
      const from = process.env.CONTACT_FROM || "onboarding@resend.dev";
      const notifyTo = process.env.CONTACT_NOTIFY_TO
        ? process.env.CONTACT_NOTIFY_TO.split(",").map((addr) => addr.trim()).filter(Boolean)
        : [data.email];

      await Promise.allSettled([
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
      log.info("contact.email.sent", { to: notifyTo });
    } else {
      log.warn("contact.email.skipped", { reason: "no RESEND_API_KEY" });
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
