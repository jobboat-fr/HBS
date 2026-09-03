import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Client Supabase service_role — contourne la RLS. Serveur uniquement, jamais exposé
 * au navigateur. Réservé aux opérations internes (rate limiting) qui n'ont pas besoin
 * du contexte d'un utilisateur authentifié.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}
