"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { CheckCircle2, ArrowRight, Loader2, Mail, Sparkles } from "lucide-react";
import Link from "next/link";
import { Input, Textarea, Select, Label, FieldError } from "@/components/ui/Input";
import { PositionnementQuiz } from "@/components/forms/PositionnementQuiz";
import { Button } from "@/components/ui/Button";
import { annonce, certificat } from "@/lib/site";

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

/** La semaine choisie depuis le planning — voyage avec la demande jusqu'à l'organisme. */
export type Choix = { code: string; formation: string; semaine: string; prix: string };

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
  choix,
  sessionId,
}: {
  programmes: Programme[];
  consentText: string;
  defaultProgramId?: string;
  choix?: Choix | null;
  sessionId?: string | null;
}) {
  const [result, setResult] = useState<Result | null>(null);
  const [paper, setPaper] = useState<Paper | null>(null);
  const [paperError, setPaperError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const renderedAt = useRef(Date.now());

  const {
    register,
    handleSubmit,
    watch,
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

  // « Je ne sais pas encore » est la valeur vide, et c'est aujourd'hui le cas de presque
  // tout le monde : le catalogue public ne publie encore aucun programme, donc la liste
  // déroulante ne propose que cette option. Plutôt que de laisser partir une demande sans
  // objet, on oriente vers la formation qui ouvre — celle sur laquelle l'organisme est prêt.
  const sansChoix = !watch("program_id");

  const onSubmit = handleSubmit(async (values, event) => {
    setServerError(null);
    const honeypot = (event?.target as HTMLFormElement | undefined)?.website?.value;
    try {
      const res = await fetch("/api/learn/inscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          session_id: sessionId || undefined,
          // La plateforme ne reçoit pas encore la session : la semaine choisie part dans le
          // message (lu par l'organisme) et dans la campagne (filtrable dans LEARN).
          message: choix
            ? `Semaine souhaitée : ${choix.formation} — ${choix.semaine}${values.message ? `\n\n${values.message}` : ""}`
            : values.message,
          campaign:
            new URLSearchParams(window.location.search).get("utm_campaign") ||
            (choix ? `planning:${choix.code}` : undefined),
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

        {sansChoix && (
          <div className="cadre-neon mt-4">
            <div className="p-5">
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600">
                <Sparkles size={15} aria-hidden /> Notre recommandation
              </p>
              <h3 className="mt-2 font-display text-lg font-bold text-ink">
                Commencez par la Formation IA&nbsp;360
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Vous hésitez encore — c&apos;est le cas le plus fréquent, et c&apos;est une
                bonne raison de commencer par là. En une semaine, l&apos;IA&nbsp;360 part de
                votre activité réelle : vous repartez avec vos propres usages cartographiés, de
                quoi décider ensuite ce qu&apos;il vous faut vraiment.
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-ink-soft">
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-red-500" />
                  {certificat.nom} à la clé, épreuve finale notée
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-red-500" />
                  Prochaine session le {annonce.dateLisible}
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-red-500" />
                  Aucun prérequis technique — particuliers comme entreprises
                </li>
              </ul>
              <Link
                href="/formations#ia-360"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                Découvrir le programme
                <ArrowRight size={16} aria-hidden />
              </Link>
              <p className="mt-3 text-xs leading-relaxed text-ink-muted">
                Vous pouvez aussi envoyer votre demande telle quelle : un conseiller vous
                rappellera pour en parler.
              </p>
            </div>
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="message">Votre projet (facultatif)</Label>
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

      <button
        type="submit"
        disabled={isSubmitting}
        className="bouton-neon flex min-h-[56px] w-full items-center justify-center gap-2 rounded-full px-6 text-lg font-bold disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Envoi…
          </>
        ) : (
          <>
            {choix ? `Je réserve ma place — ${choix.formation}` : "Je réserve ma place"} <ArrowRight size={18} />
          </>
        )}
      </button>
      <p className="text-center text-xs font-semibold text-ink-soft">
        Gratuit et sans engagement · réponse sous 48 h ouvrées · 12 places par session
      </p>

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
