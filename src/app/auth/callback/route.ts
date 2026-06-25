import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Callback OAuth (Google / Apple) — échange le code contre une session puis redirige. */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/espace-client";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }
  return NextResponse.redirect(`${origin}/connexion?error=oauth`);
}
