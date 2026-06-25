"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5h-1.9V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8a12 12 0 1 1 7.9-21l5.7-5.7A20 20 0 1 0 24 44c11 0 20-8 20-20 0-1.3-.1-2.3-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8A12 12 0 0 1 24 12c3 0 5.9 1.1 8 3l5.7-5.7A20 20 0 0 0 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A12 12 0 0 1 12.7 28l-6.6 5.1A20 20 0 0 0 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C40.9 36.4 44 30.8 44 24c0-1.3-.1-2.3-.4-3.5z" />
    </svg>
  );
}
function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 384 512" fill="currentColor" aria-hidden>
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  );
}

export function OAuthButtons() {
  const [loading, setLoading] = useState<"google" | "apple" | null>(null);

  async function oauth(provider: "google" | "apple") {
    setLoading(provider);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setLoading(null);
  }

  const btn =
    "flex w-full items-center justify-center gap-2.5 rounded-xl border border-mist bg-white px-4 py-3 text-sm font-medium text-ink transition-colors hover:bg-cloud disabled:opacity-50";

  return (
    <div className="space-y-3">
      <button type="button" onClick={() => oauth("google")} disabled={!!loading} className={btn}>
        {loading === "google" ? <Loader2 size={16} className="animate-spin" /> : <GoogleIcon />}
        Continuer avec Google
      </button>
      <button type="button" onClick={() => oauth("apple")} disabled={!!loading} className={btn}>
        {loading === "apple" ? <Loader2 size={16} className="animate-spin" /> : <AppleIcon />}
        Continuer avec Apple
      </button>
      <div className="flex items-center gap-3 py-1 text-xs text-ink-muted">
        <span className="h-px flex-1 bg-mist" /> ou <span className="h-px flex-1 bg-mist" />
      </div>
    </div>
  );
}
