import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { paper, gradePaper, configured, LearnError } from "@/lib/learn";
import { log, errMsg } from "@/lib/log";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rateLimit";

/**
 * Le test de positionnement, pour quelqu'un qui n'a pas encore de compte.
 *
 * L'indicateur 8 demande à l'organisme d'établir le niveau du candidat **avant** de
 * l'inscrire, donc le test doit être passable sans compte. Le jeton d'usage unique dans
 * l'URL tient lieu d'identité pour cette seule opération : LEARN n'en stocke que
 * l'empreinte, il expire, et il est brûlé à la correction.
 *
 * La correction n'a lieu ni ici ni dans le navigateur. Un score calculé là où le candidat
 * peut l'atteindre est un score que le candidat a choisi.
 */

/**
 * `question_id` est volontairement une chaîne bornée et non un UUID strict. Le navigateur
 * ne fait que renvoyer l'identifiant que la copie lui a donné : le site n'a rien à vérifier
 * de sa version RFC, et le faire ne peut produire que des refus injustifiés — c'est ce qui
 * est arrivé la première fois que le tunnel a été parcouru de bout en bout. LEARN reste
 * l'autorité : un identifiant inconnu ne rapporte simplement aucun point, un identifiant
 * malformé est refusé par la base et remonte traduit.
 */
const answersSchema = z.object({
  answers: z
    .array(
      z.object({
        question_id: z.string().min(1).max(64),
        given: z.array(z.string().max(40)).max(20),
      }),
    )
    .max(200),
});

function refuse(error: unknown, where: string) {
  if (error instanceof LearnError) {
    const message =
      error.code === "invalid_or_expired_token"
        ? "Ce lien n'est plus valable. Demandez-en un nouveau à l'organisme."
        : error.code === "no_positioning_assessment"
          ? "Aucun test de positionnement n'est encore publié pour cette formation."
          : error.message;
    log.warn(`${where}.learn_refused`, { code: error.code, status: error.status });
    return NextResponse.json(
      { error: message, code: error.code },
      { status: error.status >= 500 ? 503 : error.status },
    );
  }
  log.error(`${where}.error`, { err: errMsg(error) });
  return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
}

function unavailable() {
  return NextResponse.json(
    { error: "Le test de positionnement n'est pas encore ouvert." },
    { status: 503 },
  );
}

export async function GET(_request: NextRequest, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  if (!configured()) return unavailable();
  try {
    return NextResponse.json(await paper(token));
  } catch (error) {
    return refuse(error, "positionnement.get");
  }
}

export async function POST(request: NextRequest, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  if (!configured()) return unavailable();
  try {
    // Le jeton est à usage unique côté LEARN, donc ce limiteur ne protège pas la copie —
    // il protège contre quelqu'un qui essaierait des jetons au hasard.
    if (
      !(await checkRateLimit(
        request,
        "positionnement",
        RATE_LIMITS.positionnement.windowSeconds,
        RATE_LIMITS.positionnement.limit,
      ))
    ) {
      return NextResponse.json({ error: "Trop de tentatives. Réessayez plus tard." }, { status: 429 });
    }

    const { answers } = answersSchema.parse(await request.json());
    const graded = await gradePaper(token, answers);
    log.info("positionnement.graded", { level: graded.level });
    // `lead_id` ne sort pas d'ici : le candidat n'a aucun usage de l'identifiant interne de
    // sa demande, et le lui donner l'expose sans rien apporter.
    const { lead_id: _leadId, ...visible } = graded;
    return NextResponse.json(visible);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Le candidat ne peut rien y faire, mais nous si — donc on trace ce qui a été refusé.
      log.warn("positionnement.invalid_payload", { issues: error.issues });
      return NextResponse.json({ error: "Réponses invalides." }, { status: 400 });
    }
    return refuse(error, "positionnement.post");
  }
}
