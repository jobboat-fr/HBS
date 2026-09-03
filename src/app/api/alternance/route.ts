import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { log, errMsg } from "@/lib/log";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const maxDuration = 30;

type Offer = {
  id: string;
  title: string;
  company: string;
  location: string;
  contract: string;
  apply_url: string;
  salary_min: number | null;
  salary_max: number | null;
};

async function search(q: string, loc: string) {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("hbs_search_alternance", { p_q: q, p_loc: loc, p_limit: 24 });
  if (error) {
    log.error("alternance.rpc", { err: error.message });
    return null;
  }
  return (data ?? []) as Offer[];
}

/** VIGIL/agent : extrait métier + lieu d'une requête en langage naturel (route secondaire si non comprise). */
async function vigilParse(query: string): Promise<{ q: string; loc: string } | null> {
  const key = process.env.LLM_API_KEY;
  if (!key) return null;
  const base = (process.env.LLM_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const model = process.env.LLM_MODEL || "gpt-4o-mini";
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 14000);
    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      signal: controller.signal,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        temperature: 0,
        max_tokens: 120,
        messages: [
          { role: "system", content: 'Extrais le métier et le lieu d\'une recherche d\'alternance. Réponds UNIQUEMENT en JSON: {"q":"<métier/mots-clés>","loc":"<ville ou région, vide si absent>"}.' },
          { role: "user", content: query },
        ],
      }),
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const data = await res.json();
    const txt: string = data?.choices?.[0]?.message?.content ?? "";
    const m = txt.match(/\{[\s\S]*\}/);
    if (!m) return null;
    const parsed = JSON.parse(m[0]);
    return { q: String(parsed.q ?? "").trim(), loc: String(parsed.loc ?? "").trim() };
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await checkRateLimit(request, "alternance", RATE_LIMITS.alternance.windowSeconds, RATE_LIMITS.alternance.limit))) {
      return NextResponse.json({ offers: [], error: "Trop de recherches. Réessayez plus tard." }, { status: 429 });
    }

    const body = await request.json();
    const query = String(body.query ?? "").trim();
    const location = String(body.location ?? "").trim();

    // 1) Primaire : recherche directe jobboat (rapide, fiable)
    let offers = await search(query, location);
    let source: "jobboat" | "vigil" = "jobboat";

    // 2) Secondaire : si rien trouvé et requête libre, demander à l'agent VIGIL de ré-extraire
    if (offers && offers.length === 0 && query) {
      const parsed = await vigilParse(query);
      if (parsed && (parsed.q || parsed.loc)) {
        const retry = await search(parsed.q || query, parsed.loc || location);
        if (retry && retry.length) {
          offers = retry;
          source = "vigil";
        }
      }
    }

    log.info("alternance.search", { q: query, loc: location, n: offers?.length ?? 0, source });
    return NextResponse.json({ offers: offers ?? [], source });
  } catch (e) {
    log.error("alternance.error", { err: errMsg(e) });
    return NextResponse.json({ offers: [], error: "Recherche indisponible." }, { status: 200 });
  }
}
