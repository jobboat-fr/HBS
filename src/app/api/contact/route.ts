import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { contactSchema } from "@/lib/validation/contact";
import { buildNotificationEmail, buildConfirmationEmail } from "@/lib/email/templates";
import { log, errMsg } from "@/lib/log";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = contactSchema.parse(body);

    const financement = data.financement ? data.financement : null;
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

    // 1) Enregistrement dans Supabase (table hbs_contact_submissions, RLS insert public)
    const supabase = createClient();
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
