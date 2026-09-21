import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { contactSchema } from "@/lib/validation/contact";
import { log, errMsg } from "@/lib/log";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rateLimit";
import { site } from "@/lib/site";
import { domaineRecoitDuCourrier } from "@/lib/email/mx";

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

    if (!(await domaineRecoitDuCourrier(data.email))) {
      return NextResponse.json(
        { error: "Cette adresse e-mail ne peut pas recevoir de courrier. Vérifiez-la." },
        { status: 400 },
      );
    }

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

    // 2) Les courriels.
    //
    // La demande est déjà enregistrée : un envoi qui échoue ne doit pas faire échouer la
    // soumission du visiteur. Mais il ne doit pas non plus passer inaperçu, et c'est
    // exactement ce qui se produisait avant — `Promise.allSettled` appelé sans que son
    // résultat soit lu, puis « envoyé » journalisé quoi qu'il arrive.
    //
    // Ce n'était pas théorique : `CONTACT_FROM` a longtemps valu `onboarding@resend.dev`,
    // l'expéditeur bac à sable de Resend, qui ne peut écrire qu'au titulaire du compte.
    // Toutes les notifications vers contact@hbs-formation.fr étaient refusées, en silence,
    // pendant que le visiteur lisait « message envoyé ». D'où la règle qu'on garde ici :
    // on lit le résultat de chaque envoi, et un avis interne perdu se journalise en erreur.
    // Tout part par LEARN : liste de suppression, préférences, désinscription et journal.
    // Le SDK Resend n'est plus appelé d'ici — il contournait tout cela, et une adresse en
    // rebond continuait d'être sollicitée à chaque demande.
    const { envoyer, envoyerA } = await import("@/lib/email/learn");

    // Sans destinataire configuré, la notification *interne* — avec le message et les
    // coordonnées du visiteur — partait au visiteur lui-même. Repli : l'adresse du site.
    const notifyTo = (process.env.CONTACT_NOTIFY_TO || site.email)
      .split(",").map((addr) => addr.trim()).filter(Boolean);

    const [avis, accuse] = await Promise.all([
      envoyerA(notifyTo, {
        cle: "vitrine_contact_avis",
        ctx: {
          nom: data.name,
          email: data.email,
          telephone: data.phone ?? null,
          structure: data.company ?? null,
          formation: data.formation ?? null,
          financement: data.financement ?? null,
          message: data.message,
        },
        relatedKind: "contact",
      }),
      envoyer({
        email: data.email,
        cle: "vitrine_contact_accuse",
        ctx: { organisme: site.name, nom: data.name },
        relatedKind: "contact",
      }),
    ]);

    // L'avis interne est le seul qui compte pour l'organisme : sans lui, la demande dort
    // dans une table que personne ne consulte. Il se journalise en erreur.
    const avisPerdu = avis.filter((r) => !r.envoye && !r.differe);
    if (avisPerdu.length) {
      log.error("contact.email.notification_echec", {
        to: notifyTo, err: avisPerdu.map((r) => r.raison).join(" · "),
      });
    } else {
      log.info("contact.email.notification_ok", {
        to: notifyTo, differe: avis.some((r) => r.differe),
      });
    }
    if (!accuse.envoye) {
      log.warn("contact.email.confirmation_echec", { err: accuse.raison, differe: accuse.differe });
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
