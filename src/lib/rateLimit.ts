import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

function clientIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

/**
 * Limite le nombre de requêtes par IP et par route sur une fenêtre glissante, via la
 * fonction Postgres hbs_rate_limit_hit (atomique, contourne la RLS avec service_role).
 * Retourne true si la requête est autorisée. En cas d'erreur Supabase (base injoignable),
 * on laisse passer plutôt que de bloquer tout le site — le rate limiting est une défense
 * en profondeur, pas le seul rempart.
 */
export async function checkRateLimit(
  request: NextRequest,
  route: string,
  windowSeconds: number,
  limit: number,
): Promise<boolean> {
  const key = `${route}:${clientIp(request)}`;
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.rpc("hbs_rate_limit_hit", {
      p_key: key,
      p_window_seconds: windowSeconds,
      p_limit: limit,
    });
    if (error) return true;
    return data !== false;
  } catch {
    return true;
  }
}

export const RATE_LIMITS = {
  agent: { windowSeconds: 300, limit: 15 }, // 15 messages / 5 min / IP
  contact: { windowSeconds: 3600, limit: 5 }, // 5 soumissions / heure / IP
  alternance: { windowSeconds: 300, limit: 30 }, // 30 recherches / 5 min / IP
} as const;
