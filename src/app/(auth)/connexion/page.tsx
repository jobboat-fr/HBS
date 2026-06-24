"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input, Label, FieldError } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export default function ConnexionPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("Identifiants incorrects. Vérifiez votre email et votre mot de passe.");
      return;
    }
    router.push("/espace-client");
    router.refresh();
  }

  return (
    <div className="flex min-h-[100svh] items-center justify-center bg-cloud px-5 py-32">
      <GlassCard className="w-full max-w-md p-8 md:p-10">
        <h1 className="font-display text-3xl font-bold text-ink">Connexion</h1>
        <p className="mt-2 text-sm text-ink-soft">Accédez à votre espace client HBS FORMATION.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <FieldError>{error}</FieldError>
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? <Loader2 size={18} className="animate-spin" /> : "Se connecter"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-soft">
          Pas encore de compte ?{" "}
          <Link href="/inscription" className="font-semibold text-teal-600 hover:underline">
            Créer un compte
          </Link>
        </p>
      </GlassCard>
    </div>
  );
}
