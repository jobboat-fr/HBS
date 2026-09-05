"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft, Loader2, Award, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * Le test de positionnement, côté candidat.
 *
 * Ce composant ne sait pas ce qu'est une bonne réponse, et c'est le point : les questions
 * arrivent sans elles, la correction se fait dans la base, et le composant n'affiche qu'un
 * résultat déjà calculé. Rien de ce que le candidat peut ouvrir dans son navigateur ne
 * contient de quoi tricher.
 */

type Question = {
  id: string;
  kind: string;
  prompt: string;
  options: { key: string; label: string }[];
  points: number;
};

type Graded = {
  score: number;
  max_score: number;
  percent: number | null;
  level: string | null;
  next: string;
};

const LEVELS: Record<string, string> = {
  debutant: "Débutant",
  intermediaire: "Intermédiaire",
  avance: "Avancé",
};

export function PositionnementQuiz({
  token,
  title,
  durationMinutes,
  questions,
}: {
  token: string;
  title: string;
  durationMinutes: number;
  questions: Question[];
}) {
  const [index, setIndex] = useState(0);
  const [given, setGiven] = useState<Record<string, string[]>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [graded, setGraded] = useState<Graded | null>(null);

  const q = questions[index];
  const isLast = index === questions.length - 1;
  const answered = Object.keys(given).length;

  function choose(key: string) {
    setGiven((prev) => {
      if (q.kind === "multi") {
        const current = prev[q.id] ?? [];
        return {
          ...prev,
          [q.id]: current.includes(key) ? current.filter((k) => k !== key) : [...current, key],
        };
      }
      return { ...prev, [q.id]: [key] };
    });
  }

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/learn/positionnement/${encodeURIComponent(token)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: Object.entries(given).map(([question_id, g]) => ({ question_id, given: g })),
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "La correction a échoué.");
      setGraded(body as Graded);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue.");
    } finally {
      setBusy(false);
    }
  }

  if (graded) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-mist bg-white p-8 text-center shadow-card md:p-12">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
          <Award size={28} />
        </span>
        <h2 className="mt-6 font-display text-2xl font-bold text-ink">Test terminé</h2>
        <p className="mt-2 text-4xl font-bold text-teal-600">
          {graded.level ? (LEVELS[graded.level] ?? graded.level) : "Niveau à préciser"}
        </p>
        <p className="mt-3 text-sm text-ink-muted">
          {graded.score} / {graded.max_score} points
          {graded.percent !== null ? ` · ${graded.percent} %` : ""}
        </p>
        <p className="mt-6 leading-relaxed text-ink-soft">{graded.next}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/formations" size="md">
            Découvrir les formations
          </Button>
          <Button href="/contact" variant="outline" size="md">
            Parler à un conseiller
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-mist bg-white p-6 shadow-card md:p-10">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-xl font-bold text-ink">{title}</h2>
        <span className="text-xs font-medium text-ink-muted">
          environ {durationMinutes} min · {questions.length} questions
        </span>
      </div>

      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-mist">
        <div
          className="h-full rounded-full bg-teal-500 transition-all duration-300"
          style={{ width: `${((index + 1) / questions.length) * 100}%` }}
        />
      </div>

      <p className="mt-8 text-sm font-medium text-ink-muted">
        Question {index + 1} sur {questions.length}
      </p>
      <p className="mt-2 font-display text-lg font-semibold leading-snug text-ink">{q.prompt}</p>

      <div className="mt-6 space-y-3">
        {q.options.map((opt) => {
          const selected = (given[q.id] ?? []).includes(opt.key);
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => choose(opt.key)}
              aria-pressed={selected}
              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                selected
                  ? "border-teal-400 bg-teal-50 text-ink"
                  : "border-mist bg-cloud text-ink-soft hover:border-teal-300 hover:bg-white"
              }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-semibold ${
                  selected ? "bg-teal-500 text-white" : "bg-white text-ink-muted"
                }`}
              >
                {opt.key.toUpperCase()}
              </span>
              {opt.label}
            </button>
          );
        })}
      </div>

      {q.kind === "multi" ? (
        <p className="mt-3 text-xs text-ink-muted">Plusieurs réponses possibles.</p>
      ) : null}

      {error ? (
        <p className="mt-6 flex items-start gap-2 rounded-xl bg-coral/10 px-4 py-3 text-sm text-coral-dark">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          {error}
        </p>
      ) : null}

      <div className="mt-8 flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0 || busy}
        >
          <ArrowLeft size={16} /> Précédent
        </Button>

        {isLast ? (
          <Button type="button" size="md" onClick={submit} disabled={busy || answered === 0}>
            {busy ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Correction…
              </>
            ) : (
              <>
                Terminer <ArrowRight size={16} />
              </>
            )}
          </Button>
        ) : (
          <Button
            type="button"
            size="md"
            onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
            disabled={busy}
          >
            Suivant <ArrowRight size={16} />
          </Button>
        )}
      </div>

      <p className="mt-6 text-xs text-ink-muted">
        Ce lien ne fonctionne qu&apos;une fois : vos réponses sont corrigées et le lien est
        clos. Il n&apos;y a pas de bonne ou de mauvaise issue — le test sert à vous orienter
        vers le parcours adapté.
      </p>
    </div>
  );
}
