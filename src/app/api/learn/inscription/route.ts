import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { submitDemande, configured, LearnError } from "@/lib/learn";
import { log, errMsg } from "@/lib/log";
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
