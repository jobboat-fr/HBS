import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { submitDemande, configured, LearnError } from "@/lib/learn";
import { log, errMsg } from "@/lib/log";
import { site } from "@/lib/site";
import {
  buildInscriptionNotification,
  buildInscriptionConfirmation,
} from "@/lib/email/templates";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rateLimit";

/**
 * L'entrée du tunnel : une demande de place, transmise à LEARN.
 *
 * Ce n'est pas le formulaire de contact avec un autre libellé. `/api/contact` enregistre un
 * message dans `hbs_contact_submissions` et prévient l'organisme ; celui-ci crée une
 * **demande d'inscription** dans la plateforme, qui déclenche le test de positionnement et
 * finit, si l'organisme l'accepte, par une inscription sur une session. Les deux existent
 * parce qu'un visiteur qui pose une question et un visiteur qui demande une place ne sont
 * pas au même endroit du parcours.
 *
 * Trois défenses avant de sortir, dans cet ordre : le limiteur par IP du site, le piège à
 * robots, puis la validation. LEARN a les siennes — un étranglement par organisme et par
 * adresse, et un index d'unicité — mais elles protègent la plateforme, pas le site.
 */

const MIN_FILL_TIME_MS = 2000;

const demandeSchema = z.object({
  full_name: z.string().trim().min(2, "Nom trop court").max(200),
  email: z.string().trim().email("Adresse e-mail invalide").max(320),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  company: z.string().trim().max(200).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  program_id: z.string().uuid().optional().or(z.literal("")),
  campaign: z.string().trim().max(120).optional().or(z.literal("")),
  // Le consentement est coché ici ; c'est le serveur qui l'atteste ensuite à LEARN, avec
  // le texte exact affiché, stocké côté plateforme.
  consent: z.literal(true, { message: "Le consentement est requis" }),
});

export async function POST(request: NextRequest) {
  try {
    if (!configured()) {
      return NextResponse.json(
        { error: "Les inscriptions en ligne ne sont pas encore ouvertes." },
        { status: 503 },
      );
    }

    if (
      !(await checkRateLimit(
        request,
        "inscription",
        RATE_LIMITS.inscription.windowSeconds,
        RATE_LIMITS.inscription.limit,
      ))
    ) {
      return NextResponse.json({ error: "Trop de demandes. Réessayez plus tard." }, { status: 429 });
    }

    const body = await request.json();

    // Piège à robots : on répond succès sans rien faire, pour ne pas signaler la détection.
    const honeypotFilled = typeof body.website === "string" && body.website.trim().length > 0;
    const tooFast =
      typeof body.renderedAt === "number" && Date.now() - body.renderedAt < MIN_FILL_TIME_MS;
    if (honeypotFilled || tooFast) {
      log.warn("inscription.bot_blocked", { honeypotFilled, tooFast });
      return NextResponse.json({ success: true, created: false });
    }

    const data = demandeSchema.parse(body);

    const result = await submitDemande({
      full_name: data.full_name,
      email: data.email,
      phone: data.phone || null,
      company: data.company || null,
      message: data.message || null,
      program_id: data.program_id || null,
      campaign: data.campaign || null,
    });

    log.info("inscription.submitted", { created: result.created, status: result.status });

    // Les courriels de la demande d'inscription.
    //
    // La plateforme n'en envoie aucun, et c'est délibéré de sa part : elle rend le lien de
    // positionnement à l'appelant plutôt que de l'expédier. Sans cet envoi-ci, le lien
    // n'existait donc que dans l'onglet ouvert — un visiteur qui ferme la page avant la fin
    // du test perdait son parcours sans aucun moyen d'y revenir, et l'organisme n'était
    // prévenu de rien.
    //
    // L'envoi ne conditionne pas la réponse : la demande est déjà créée côté plateforme, et
    // la faire échouer parce qu'un courriel n'est pas parti ferait recommencer le visiteur
    // pour rien — la seconde tentative serait refusée par l'index d'unicité.
    if (result.created && process.env.RESEND_API_KEY) {
      const lienAbsolu = result.positionnement_path
        ? new URL(result.positionnement_path, process.env.NEXT_PUBLIC_SITE_URL || site.url).toString()
        : null;
      const charge = {
        full_name: data.full_name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        message: data.message || null,
        positionnement: lienAbsolu,
      };

      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        const from = process.env.CONTACT_FROM || "HBS FORMATION <contact@vtlvs.com>";
        const notifyTo = process.env.CONTACT_NOTIFY_TO
          ? process.env.CONTACT_NOTIFY_TO.split(",").map((a) => a.trim()).filter(Boolean)
          : [];

        const envois = await Promise.allSettled([
          notifyTo.length
            ? resend.emails.send({
                from,
                to: notifyTo,
                subject: `Demande d'inscription — ${data.full_name}`,
                replyTo: data.email,
                html: buildInscriptionNotification(charge),
              })
            : Promise.resolve({ error: { message: "CONTACT_NOTIFY_TO absente" } }),
          resend.emails.send({
            from,
            to: data.email,
            subject: "Votre demande d'inscription — HBS FORMATION",
            html: buildInscriptionConfirmation(charge),
          }),
        ]);

        // Le SDK Resend *résout* en portant l'erreur d'API dans `{ error }` : une promesse
        // tenue ne veut pas dire un courriel parti.
        const echec = (r: PromiseSettledResult<{ error?: { message?: string } | null }>) =>
          r.status === "rejected" ? errMsg(r.reason) : r.value?.error?.message ?? null;

        const [notif, confirm] = envois.map(echec);
        if (notif) log.error("inscription.email.notification_echec", { to: notifyTo, err: notif });
        if (confirm) log.error("inscription.email.confirmation_echec", { err: confirm });
        if (!notif && !confirm) log.info("inscription.email.ok", { lien: Boolean(lienAbsolu) });
      } catch (e) {
        log.error("inscription.email.exception", { err: errMsg(e) });
      }
    }

    return NextResponse.json({
      success: true,
      created: result.created,
      // Chemin relatif : la page du test vit sur ce site, pas sur celui de la plateforme.
      positionnement: result.positionnement_path ?? null,
      next: result.next,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation échouée", details: error.issues },
        { status: 400 },
      );
    }
    if (error instanceof LearnError) {
      // 429 remonte tel quel : l'étranglement de LEARN dit la même chose que le nôtre, et
      // le transformer en 500 ferait réessayer le visiteur en boucle.
      const status = error.status === 429 ? 429 : error.status >= 500 ? 503 : error.status;
      log.warn("inscription.learn_refused", { code: error.code, status: error.status });
      return NextResponse.json({ error: error.message, code: error.code }, { status });
    }
    log.error("inscription.error", { err: errMsg(error) });
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}
