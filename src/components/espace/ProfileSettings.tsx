"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check, Download, ShieldAlert } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Input, Label, Select } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type Client = {
  full_name?: string;
  type?: string;
  company_name?: string;
  phone?: string;
  marketing_consent?: boolean;
} | null;

const OWNED_TABLES = [
  "hbs_clients",
  "hbs_enrollments",
  "hbs_lesson_progress",
  "hbs_quiz_attempts",
  "hbs_certificates",
  "hbs_board_cards",
] as const;

export function ProfileSettings({ userId, email, client }: { userId: string; email: string; client: Client }) {
  const supabase = createClient();
  const router = useRouter();
  const [form, setForm] = useState({
    full_name: client?.full_name ?? "",
    type: client?.type ?? "particulier",
    company_name: client?.company_name ?? "",
    phone: client?.phone ?? "",
  });
  const [consent, setConsent] = useState(!!client?.marketing_consent);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function save() {
    setBusy(true);
    setSaved(false);
    await supabase.from("hbs_clients").upsert(
      {
        user_id: userId,
        full_name: form.full_name,
        type: form.type,
        company_name: form.type === "entreprise" ? form.company_name || null : null,
        phone: form.phone || null,
        marketing_consent: consent,
      },
      { onConflict: "user_id" },
    );
    setBusy(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function exportData() {
    const out: Record<string, unknown> = { account: { id: userId, email }, exported_at: new Date().toISOString() };
    for (const t of OWNED_TABLES) {
      const { data } = await supabase.from(t).select("*");
      out[t] = data ?? [];
    }
    const blob = new Blob([JSON.stringify(out, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mes-donnees-hbs-formation.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function deleteAccount() {
    if (!confirm("Supprimer définitivement votre compte et toutes vos données ? Cette action est irréversible.")) return;
    setBusy(true);
    for (const t of OWNED_TABLES) {
      await supabase.from(t).delete().eq("user_id", userId);
    }
    await supabase.auth.signOut();
    router.push("/?compte=supprime");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {/* Informations */}
      <section className="rounded-2xl border border-mist bg-white p-6 shadow-card md:p-8">
        <h2 className="font-display text-lg font-bold text-ink">Mes informations</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="full_name">Nom complet</Label>
            <Input id="full_name" value={form.full_name} onChange={set("full_name")} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} disabled className="opacity-70" />
          </div>
          <div>
            <Label htmlFor="type">Profil</Label>
            <Select id="type" value={form.type} onChange={set("type")}>
              <option value="particulier">Particulier</option>
              <option value="entreprise">Entreprise</option>
            </Select>
          </div>
          {form.type === "entreprise" && (
            <div>
              <Label htmlFor="company_name">Entreprise</Label>
              <Input id="company_name" value={form.company_name} onChange={set("company_name")} />
            </div>
          )}
          <div>
            <Label htmlFor="phone">Téléphone</Label>
            <Input id="phone" value={form.phone} onChange={set("phone")} />
          </div>
        </div>
        <div className="mt-6 flex items-center gap-3">
          <Button onClick={save} disabled={busy}>
            {busy ? <Loader2 size={16} className="animate-spin" /> : "Enregistrer"}
          </Button>
          {saved && <span className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-600"><Check size={16} /> Enregistré</span>}
        </div>
      </section>

      {/* Consentement */}
      <section className="rounded-2xl border border-mist bg-white p-6 shadow-card md:p-8">
        <h2 className="font-display text-lg font-bold text-ink">Préférences de communication</h2>
        <label className="mt-4 flex items-start gap-3 text-sm text-ink-soft">
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 accent-teal-500" />
          <span>J&apos;accepte de recevoir des informations sur les formations et actualités de HBS FORMATION. Vous pouvez vous désinscrire à tout moment.</span>
        </label>
        <p className="mt-2 text-xs text-ink-muted">Pensez à cliquer sur « Enregistrer » ci-dessus pour appliquer ce choix.</p>
      </section>

      {/* RGPD */}
      <section className="rounded-2xl border border-mist bg-white p-6 shadow-card md:p-8">
        <h2 className="font-display text-lg font-bold text-ink">Mes données (RGPD)</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Conformément au RGPD, vous pouvez exporter l&apos;ensemble de vos données ou supprimer votre compte.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Button variant="outline" onClick={exportData}>
            <Download size={16} /> Exporter mes données
          </Button>
          <button
            onClick={deleteAccount}
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-coral/40 px-6 py-3 text-sm font-semibold text-coral-dark transition-colors hover:bg-coral-light disabled:opacity-50"
          >
            <ShieldAlert size={16} /> Supprimer mon compte
          </button>
        </div>
      </section>
    </div>
  );
}
