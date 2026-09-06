"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle2, ArrowRight, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { Input, Textarea, Select, Label, FieldError } from "@/components/ui/Input";
import { PositionnementQuiz } from "@/components/forms/PositionnementQuiz";
import { Button } from "@/components/ui/Button";

/**
 * L'entrée du tunnel d'inscription.
 *
 * Elle ne crée pas de compte, et le dit. Ce qu'elle produit est une **demande** : le
 * candidat passe le test de positionnement, puis l'organisme décide. C'est l'ordre
 * qu'impose l'indicateur 8 — établir le niveau avant d'inscrire — et c'est aussi ce qui
 * évite qu'un formulaire ouvert serve à poser des noms sur la liste que lit un auditeur.
 *
 * Le test s'enchaîne ici même. Il occupait auparavant une autre page, atteinte par un
 * bouton : le candidat venait de remplir six champs, et on lui demandait de recommencer
 * ailleurs. Un lien de plus entre l'intention et l'acte est un endroit de plus où
 * l'abandonner — et l'indicateur 8 ne compte que les tests réellement passés.
 *
 * Le lien personnel reste affiché : il sert à reprendre plus tard, ou depuis un autre
 * appareil. Il n'est plus le seul chemin.
 */

type Programme = { id: string; title: string };

type Result =
  | { kind: "sent"; positionnement: string | null; next: string }
  | { kind: "known"; next: string };

/** La copie, telle que LEARN la sert — sans les bonnes réponses, par construction. */
type Paper = {
  title: string;
  duration_minutes: number;
  questions: {
    id: string;
    kind: string;
    prompt: string;
    options: { key: string; label: string }[];
    points: number;
  }[];
};

/** `/positionnement/<jeton>` → le jeton seul. */
function jetonDe(chemin: string | null): string | null {
  if (!chemin) return null;
  const m = chemin.match(/\/positionnement\/([^/?#]+)/);
  return m ? m[1] : null;
}

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
  const [paper, setPaper] = useState<Paper | null>(null);
  const [paperError, setPaperError] = useState<string | null>(null);
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

      // La copie est demandée tout de suite : le candidat vient de valider, c'est le seul
      // moment où on est sûr de l'avoir. Un échec ici n'annule pas la demande — elle est
      // déjà enregistrée — et le lien personnel reste affiché pour reprendre plus tard.
      const jeton = jetonDe(body.positionnement ?? null);
      if (body.created && jeton) {
        try {
          const r = await fetch(`/api/learn/positionnement/${encodeURIComponent(jeton)}`);
          const p = await r.json().catch(() => ({}));
          if (r.ok) setPaper(p as Paper);
          else setPaperError(p.error || "Le test n'a pas pu être ouvert.");
        } catch {
          setPaperError("Le test n'a pas pu être ouvert.");
        }
      }
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
    const jeton = jetonDe(result.positionnement);

    // Le test, enchaîné. Le composant ne connaît aucune bonne réponse : les questions
    // arrivent sans elles et la correction a lieu dans la base.
    if (paper && jeton) {
      return (
        <div className="space-y-6">
          <div className="flex items-start gap-3 rounded-xl border border-teal-200 bg-teal-50/60 p-4">
            <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-teal-600" />
            <div className="space-y-1">
              <p className="font-semibold text-ink">Demande enregistrée</p>
              <p className="text-sm text-ink-soft">
                Il reste une étape : ce court test situe votre niveau. Il adapte le contenu
                de la formation et n&apos;écarte personne.
              </p>
            </div>
          </div>
          <PositionnementQuiz
            token={jeton}
            title={paper.title}
            durationMinutes={paper.duration_minutes}
            questions={paper.questions}
          />
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <CheckCircle2 size={48} className="text-teal-500" />
        <h3 className="font-display text-2xl font-bold text-ink">Demande enregistrée</h3>
        <p className="max-w-md text-ink-soft">{result.next}</p>
        {paperError && (
          <p className="max-w-md text-sm text-ink-muted">{paperError}</p>
        )}
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
