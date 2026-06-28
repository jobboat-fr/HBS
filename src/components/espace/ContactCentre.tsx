"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Input, Textarea, Label, FieldError } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export function ContactCentre({ name, email }: { name: string; email: string }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (message.trim().length < 10) {
      setError("Votre message doit comporter au moins 10 caractères.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || "Client connecté",
          email,
          message: subject ? `[${subject}] ${message}` : message,
        }),
      });
      if (!res.ok) throw new Error();
      setDone(true);
    } catch {
      setError("Une erreur est survenue. Réessayez.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <CheckCircle2 size={44} className="text-teal-500" />
        <h2 className="font-display text-xl font-bold text-ink">Message envoyé</h2>
        <p className="max-w-sm text-sm text-ink-soft">Merci ! Notre équipe vous répond sous 48 heures ouvrées.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <Label htmlFor="subject">Sujet</Label>
        <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Ex. Financement CPF, planning…" />
      </div>
      <div>
        <Label htmlFor="message">Votre message *</Label>
        <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Décrivez votre demande…" />
        <FieldError>{error}</FieldError>
      </div>
      <p className="text-xs text-ink-muted">Envoyé depuis votre espace client ({email}).</p>
      <Button type="submit" size="lg" className="w-full" disabled={busy}>
        {busy ? <><Loader2 size={18} className="animate-spin" /> Envoi…</> : "Envoyer au centre"}
      </Button>
    </form>
  );
}
