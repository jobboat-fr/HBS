"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle2, ArrowRight, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { Input, Textarea, Select, Label, FieldError } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

/**
 * L'entrée du tunnel d'inscription.
 *
 * Elle ne crée pas de compte, et le dit. Ce qu'elle produit est une **demande** : le
 * visiteur passe ensuite un test de positionnement, puis l'organisme décide. C'est l'ordre
 * qu'impose l'indicateur 8 — établir le niveau avant d'inscrire — et c'est aussi ce qui
 * évite qu'un formulaire ouvert serve à poser des noms sur la liste que lit un auditeur.
 */

type Programme = { id: string; title: string };

type Result =
  | { kind: "sent"; positionnement: string | null; next: string }
  | { kind: "known"; next: string };

export function InscriptionForm({
  programmes,
  consentText,
  defaultProgramId,
}: {
  programmes: Programme[];
  consentText: string;
  defaultProgramId?: string;
}) {
  const [result, setResult] = useState<Result | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const renderedAt = useRef(Date.now());

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{
    full_name: string;
    email: string;
    phone?: string;
    company?: string;
    program_id?: string;
    message?: string;
    consent: boolean;
  }>({ defaultValues: { program_id: defaultProgramId ?? "" } });

  const onSubmit = handleSubmit(async (values, event) => {
    setServerError(null);
    const honeypot = (event?.target as HTMLFormElement | undefined)?.website?.value;
    try {
      const res = await fetch("/api/learn/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          campaign: new URLSearchParams(window.location.search).get("utm_campaign") || undefined,
          website: honeypot,
          renderedAt: renderedAt.current,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body.error || "Une erreur est survenue. Merci de réessayer.");
      }
      setResult(
        body.created
          ? { kind: "sent", positionnement: body.positionnement ?? null, next: body.next }
          : { kind: "known", next: body.next },
      );
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Erreur inconnue.");
    }
  });

  if (result?.kind === "known") {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <Mail size={44} className="text-teal-500" />
        <h3 className="font-display text-2xl font-bold text-ink">Demande déjà enregistrée</h3>
        <p className="max-w-sm text-ink-soft">{result.next}</p>
        <Button href="/contact" variant="outline" size="md">
          Contacter un conseiller
        </Button>
      </div>
    );
  }

  if (result?.kind === "sent") {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <CheckCircle2 size={48} className="text-teal-500" />
        <h3 className="font-display text-2xl font-bold text-ink">Demande enregistrée</h3>
        <p className="max-w-md text-ink-soft">{result.next}</p>
        {result.positionnement ? (
          <>
            <Button href={result.positionnement} size="md">
              Passer le test maintenant <ArrowRight size={16} />
            </Button>
            <p className="max-w-sm text-xs text-ink-muted">
              Ce lien est personnel et ne fonctionne qu&apos;une fois. Gardez cette page ouverte
              si vous préférez le passer plus tard.
            </p>
          </>
        ) : (
          <p className="text-sm text-ink-muted">
            L&apos;organisme vous transmettra le test de positionnement par e-mail.
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      {/* Champ piège anti-bot : hors écran et hors tabulation pour un humain. */}
      <div className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Site web</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="full_name">Nom complet *</Label>
          <Input
            id="full_name"
            autoComplete="name"
            placeholder="Nadia Cherif"
            {...register("full_name", {
              required: "Votre nom est requis",
              minLength: { value: 2, message: "Nom trop court" },
            })}
          />
          <FieldError>{errors.full_name?.message}</FieldError>
        </div>
        <div>
          <Label htmlFor="email">E-mail *</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="nadia@exemple.fr"
            {...register("email", { required: "Votre adresse est requise" })}
          />
          <FieldError>{errors.email?.message}</FieldError>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="phone">Téléphone</Label>
          <Input id="phone" autoComplete="tel" placeholder="06 12 34 56 78" {...register("phone")} />
        </div>
        <div>
          <Label htmlFor="company">Entreprise / financeur</Label>
          <Input id="company" placeholder="Delta Logistique" {...register("company")} />
        </div>
      </div>

      <div>
        <Label htmlFor="program_id">Formation souhaitée</Label>
        <Select id="program_id" {...register("program_id")}>
          <option value="">Je ne sais pas encore</option>
          {programmes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="message">Votre projet</Label>
        <Textarea
          id="message"
          placeholder="Quelques mots sur votre situation et ce que vous visez."
          {...register("message")}
        />
      </div>

      <label className="flex items-start gap-3 rounded-xl border border-mist bg-cloud p-4 text-sm text-ink-soft">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-mist text-teal-600 focus:ring-teal-400/40"
          {...register("consent", { required: "Le consentement est requis" })}
        />
        <span>{consentText}</span>
      </label>
      <FieldError>{errors.consent?.message}</FieldError>

      {serverError ? (
        <p className="rounded-xl bg-coral/10 px-4 py-3 text-sm text-coral-dark">{serverError}</p>
      ) : null}

      <Button type="submit" size="md" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Envoi…
          </>
        ) : (
          <>
            Demander une place <ArrowRight size={16} />
          </>
        )}
      </Button>

      <p className="text-xs text-ink-muted">
        Cette demande ne crée pas de compte. Un test de positionnement établit votre niveau,
        puis l&apos;organisme confirme votre inscription.{" "}
        <Link href="/confidentialite" className="underline hover:text-ink">
          Vos données
        </Link>
        .
      </p>
    </form>
  );
}
