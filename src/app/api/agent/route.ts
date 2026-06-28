import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { localAnswer, suggestLink, type AssistantReply } from "@/lib/assistant";
import { aiAnswer } from "@/lib/llm";
import { log, errMsg } from "@/lib/log";
import { isSecretSeeking, redactSecrets, SAFE_REFUSAL } from "@/lib/guard";

export const runtime = "nodejs";
export const maxDuration = 30;

const schema = z.object({
  sessionId: z.string().min(6).max(64),
  message: z.string().min(1).max(2000),
  page: z.string().max(120).optional(),
});

/**
 * Pont de communication Hub (site HBS) <-> agent VIGIL/AZZ&CO.
 * - Journalise chaque message dans Supabase (hbs_agent_messages) pour que l'agent suive les conversations.
 * - Si AGENT_ENDPOINT_URL est défini, relaie le message à l'agent (OVH) et renvoie sa réponse.
 * - Sinon, répond via l'assistant guidé local.
 */
export async function POST(request: NextRequest) {
  try {
    const { sessionId, message, page } = schema.parse(await request.json());
    log.info("agent.request", { sessionId, page: page ?? null, len: message.length });

    const supabase = createClient();
    // Boîte de réception (l'agent lit via la clé service_role)
    await supabase.from("hbs_agent_messages").insert({
      session_id: sessionId,
      role: "user",
      content: message,
      page: page ?? null,
    });

    // Garde-fou anti prompt-injection : ne jamais transmettre une demande de secrets à l'agent.
    if (isSecretSeeking(message)) {
      log.warn("agent.blocked", { sessionId, page: page ?? null });
      await supabase.from("hbs_agent_messages").insert({
        session_id: sessionId,
        role: "agent",
        content: SAFE_REFUSAL.text,
        page: page ?? null,
        handled: false,
      });
      return NextResponse.json({ ...SAFE_REFUSAL, source: "guard" });
    }

    let reply: AssistantReply;
    let source: "agent" | "ai" | "local" = "local";

    // IA (LLM) si configurée, sinon assistant FAQ local.
    const aiOrLocal = async (): Promise<AssistantReply> => {
      const ai = await aiAnswer(message, page);
      if (ai) {
        source = "ai";
        const link = suggestLink(message);
        return { text: ai, links: link ? [link] : undefined };
      }
      source = "local";
      return localAnswer(message);
    };

    const endpoint = process.env.AGENT_ENDPOINT_URL;
    if (endpoint) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 12000);
        const res = await fetch(endpoint, {
          method: "POST",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            ...(process.env.AGENT_TOKEN ? { Authorization: `Bearer ${process.env.AGENT_TOKEN}` } : {}),
          },
          body: JSON.stringify({ sessionId, message, page, channel: "hub_chat", site: "hbs-formation" }),
        });
        clearTimeout(timer);
        if (res.ok) {
          const data = (await res.json()) as { reply?: string; text?: string; links?: AssistantReply["links"] };
          const text = data.reply ?? data.text;
          if (text) {
            reply = { text, links: data.links };
            source = "agent";
          } else {
            reply = await aiOrLocal();
          }
        } else {
          reply = await aiOrLocal();
        }
      } catch {
        reply = await aiOrLocal(); // repli IA/FAQ si l'agent ne répond pas
      }
    } else {
      reply = await aiOrLocal();
    }

    // Backstop : masquer tout secret éventuel dans la réponse (même si l'agent en renvoie).
    const safeText = redactSecrets(reply.text);
    if (safeText !== reply.text) log.warn("agent.redacted", { sessionId, source });

    await supabase.from("hbs_agent_messages").insert({
      session_id: sessionId,
      role: "agent",
      content: safeText,
      page: page ?? null,
      handled: source !== "local",
    });

    log.info("agent.reply", { source });
    return NextResponse.json({ ...reply, text: safeText, source });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
    }
    log.error("agent.error", { err: errMsg(error) });
    return NextResponse.json(
      { text: "Désolé, une erreur est survenue. Réessayez ou contactez-nous.", links: [{ label: "Contact", href: "/contact" }] },
      { status: 200 },
    );
  }
}
