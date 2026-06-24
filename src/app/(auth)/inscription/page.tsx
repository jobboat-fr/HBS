"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Input, Label, Select, FieldError } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export default function InscriptionPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    type: "particulier",
    companyName: "",
    phone: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (signUpError) {
      setLoading(false);
      setError(signUpError.message);
      return;
    }

    if (data.user) {
      const { error: clientError } = await supabase.from("hbs_clients").insert({
        user_id: data.user.id,
        full_name: form.fullName,
        type: form.type,
        company_name: form.type === "entreprise" ? form.companyName || null : null,
        phone: form.phone || null,
      });
      if (clientError) console.error("hbs_clients insert:", clientError.message);
    }

    setLoading(false);

    // Si la confirmation email est activée, aucune session n'est créée : on l'indique.
    if (data.session) {
      router.push("/espace-client");
      router.refresh();
    } else {
      setDone(true);
    }
  }

  if (done) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-cloud px-5 py-32">
        <GlassCard className="w-full max-w-md p-10 text-center">
          <CheckCircle2 size={48} className="mx-auto text-teal-500" />
          <h1 className="mt-4 font-display text-2xl font-bold text-ink">Compte créé</h1>
          <p className="mt-3 text-sm text-ink-soft">
            Vérifiez votre boîte mail pour confirmer votre adresse, puis connectez-vous.
          </p>
          <div className="mt-6">
            <Button href="/connexion" size="md">
              Aller à la connexion
            </Button>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="flex min-h-[100svh] items-center justify-center bg-cloud px-5 py-32">
      <GlassCard className="w-full max-w-md p-8 md:p-10">
        <h1 className="font-display text-3xl font-bold text-ink">Créer un compte</h1>
        <p className="mt-2 text-sm text-ink-soft">Suivez vos demandes et vos formations.</p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div>
            <Label htmlFor="fullName">Nom complet</Label>
            <Input id="fullName" value={form.fullName} onChange={set("fullName")} required />
          </div>
          <div>
            <Label htmlFor="type">Vous êtes</Label>
            <Select id="type" value={form.type} onChange={set("type")}>
              <option value="particulier">Un particulier</option>
              <option value="entreprise">Une entreprise</option>
            </Select>
          </div>
          {form.type === "entreprise" && (
            <div>
              <Label htmlFor="companyName">Nom de l&apos;entreprise</Label>
              <Input id="companyName" value={form.companyName} onChange={set("companyName")} />
            </div>
          )}
          <div>
            <Label htmlFor="phone">Téléphone</Label>
            <Input id="phone" value={form.phone} onChange={set("phone")} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={form.email} onChange={set("email")} required />
          </div>
          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={set("password")}
              minLength={8}
              required
            />
          </div>
          <FieldError>{error}</FieldError>
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? <Loader2 size={18} className="animate-spin" /> : "Créer mon compte"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-soft">
          Déjà inscrit ?{" "}
          <Link href="/connexion" className="font-semibold text-teal-600 hover:underline">
            Se connecter
          </Link>
        </p>
      </GlassCard>
    </div>
  );
}
