"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Circle, Lock, PlayCircle, FileQuestion, Award, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "./ProgressBar";

export type Lesson = { id: string; title: string; content?: string; video_url?: string; duration_min?: number; position: number };
export type CourseModule = { id: string; title: string; position: number; lessons: Lesson[]; quiz: { id: string; title: string; pass_score: number } | null };
type Course = { id: string; slug: string; title: string; summary?: string; category?: string; cover_url?: string };

type QuizQ = { id: string; question: string; choices: string[]; pos: number };

export function CoursePlayer({
  userId,
  course,
  modules,
  enrolled: enrolledInit,
  initialCompleted,
}: {
  userId: string;
  course: Course;
  modules: CourseModule[];
  enrolled: boolean;
  initialCompleted: string[];
}) {
  const supabase = createClient();
  const allLessons = useMemo(() => modules.flatMap((m) => m.lessons), [modules]);
  const [enrolled, setEnrolled] = useState(enrolledInit);
  const [completed, setCompleted] = useState<Set<string>>(new Set(initialCompleted));
  const [active, setActive] = useState<{ type: "lesson" | "quiz"; id: string }>(
    () => (allLessons[0] ? { type: "lesson", id: allLessons[0].id } : { type: "quiz", id: modules.find((m) => m.quiz)?.quiz?.id ?? "" }),
  );
  const [busy, setBusy] = useState(false);
  const [certCode, setCertCode] = useState<string | null>(null);

  const progress = allLessons.length ? Math.round((completed.size / allLessons.length) * 100) : 0;

  async function enroll() {
    setBusy(true);
    await supabase.from("hbs_enrollments").upsert(
      { user_id: userId, course_id: course.id, status: "inscrit", progress: 0 },
      { onConflict: "user_id,course_id" },
    );
    setEnrolled(true);
    setBusy(false);
  }

  async function syncProgress(next: Set<string>) {
    const p = allLessons.length ? Math.round((next.size / allLessons.length) * 100) : 0;
    const status = p >= 100 ? "termine" : "en_cours";
    await supabase
      .from("hbs_enrollments")
      .update({ progress: p, status, completed_at: p >= 100 ? new Date().toISOString() : null })
      .eq("user_id", userId)
      .eq("course_id", course.id);
  }

  async function markComplete(lessonId: string) {
    setBusy(true);
    await supabase.from("hbs_lesson_progress").upsert(
      { user_id: userId, lesson_id: lessonId },
      { onConflict: "user_id,lesson_id" },
    );
    const next = new Set(completed).add(lessonId);
    setCompleted(next);
    await syncProgress(next);
    // avancer à la leçon suivante
    const idx = allLessons.findIndex((l) => l.id === lessonId);
    if (allLessons[idx + 1]) setActive({ type: "lesson", id: allLessons[idx + 1].id });
    setBusy(false);
  }

  async function getCertificate() {
    setBusy(true);
    const code = `HBS-${course.slug.slice(0, 4).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    const { error } = await supabase.from("hbs_certificates").upsert(
      { user_id: userId, course_id: course.id, code },
      { onConflict: "user_id,course_id" },
    );
    if (!error) {
      await supabase.from("hbs_enrollments").update({ status: "certifie" }).eq("user_id", userId).eq("course_id", course.id);
      const { data } = await supabase.from("hbs_certificates").select("code").eq("course_id", course.id).maybeSingle();
      setCertCode(data?.code ?? code);
    }
    setBusy(false);
  }

  const activeLesson = active.type === "lesson" ? allLessons.find((l) => l.id === active.id) : null;
  const activeQuiz = active.type === "quiz" ? modules.find((m) => m.quiz?.id === active.id)?.quiz ?? null : null;

  return (
    <div>
      {/* En-tête cours */}
      <div className="rounded-2xl border border-mist bg-white p-6 shadow-card">
        <span className="text-xs font-semibold uppercase tracking-wide text-teal-600">{course.category}</span>
        <h1 className="mt-1 font-display text-2xl font-extrabold text-ink">{course.title}</h1>
        {course.summary && <p className="mt-2 text-ink-soft">{course.summary}</p>}
        {enrolled ? (
          <div className="mt-4 max-w-sm"><ProgressBar value={progress} /></div>
        ) : (
          <div className="mt-4">
            <Button onClick={enroll} disabled={busy}>
              {busy ? <Loader2 size={16} className="animate-spin" /> : "S'inscrire à cette formation"}
            </Button>
          </div>
        )}
        {enrolled && progress >= 100 && (
          <div className="mt-4 rounded-xl bg-teal-50 p-4">
            {certCode ? (
              <p className="flex items-center gap-2 text-sm font-semibold text-teal-700">
                <Award size={18} /> Attestation délivrée — code {certCode}
              </p>
            ) : (
              <Button onClick={getCertificate} variant="secondary" disabled={busy}>
                <Award size={16} /> Obtenir mon attestation
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* Sommaire */}
        <div className="space-y-4">
          {modules.map((m) => (
            <div key={m.id} className="overflow-hidden rounded-2xl border border-mist bg-white shadow-card">
              <div className="border-b border-mist px-4 py-3 font-display text-sm font-bold text-ink">{m.title}</div>
              <ul>
                {m.lessons.map((l) => {
                  const done = completed.has(l.id);
                  const isActive = active.type === "lesson" && active.id === l.id;
                  return (
                    <li key={l.id}>
                      <button
                        disabled={!enrolled}
                        onClick={() => setActive({ type: "lesson", id: l.id })}
                        className={cn(
                          "flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm transition-colors disabled:opacity-60",
                          isActive ? "bg-teal-50 text-teal-700" : "text-ink-soft hover:bg-cloud",
                        )}
                      >
                        {!enrolled ? <Lock size={15} className="text-ink-muted" /> : done ? <CheckCircle2 size={15} className="text-teal-500" /> : <Circle size={15} className="text-ink-muted" />}
                        <span className="flex-1">{l.title}</span>
                        {l.duration_min ? <span className="text-xs text-ink-muted">{l.duration_min}m</span> : null}
                      </button>
                    </li>
                  );
                })}
                {m.quiz && (
                  <li>
                    <button
                      disabled={!enrolled}
                      onClick={() => setActive({ type: "quiz", id: m.quiz!.id })}
                      className={cn(
                        "flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm transition-colors disabled:opacity-60",
                        active.type === "quiz" && active.id === m.quiz.id ? "bg-teal-50 text-teal-700" : "text-ink-soft hover:bg-cloud",
                      )}
                    >
                      <FileQuestion size={15} className="text-coral" />
                      <span className="flex-1">{m.quiz.title}</span>
                    </button>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>

        {/* Contenu */}
        <div className="rounded-2xl border border-mist bg-white p-6 shadow-card lg:p-8">
          {!enrolled ? (
            <div className="py-10 text-center text-ink-soft">
              <PlayCircle size={40} className="mx-auto text-teal-500" />
              <p className="mt-3">Inscrivez-vous pour accéder au contenu de la formation.</p>
            </div>
          ) : activeLesson ? (
            <article>
              <h2 className="font-display text-xl font-bold text-ink">{activeLesson.title}</h2>
              {activeLesson.video_url && (
                <video className="mt-4 w-full rounded-xl" controls src={activeLesson.video_url} />
              )}
              <div className="mt-4 whitespace-pre-wrap leading-relaxed text-ink-soft">{activeLesson.content}</div>
              <div className="mt-6">
                {completed.has(activeLesson.id) ? (
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600">
                    <CheckCircle2 size={18} /> Leçon terminée
                  </span>
                ) : (
                  <Button onClick={() => markComplete(activeLesson.id)} disabled={busy}>
                    {busy ? <Loader2 size={16} className="animate-spin" /> : "Marquer comme terminé"}
                  </Button>
                )}
              </div>
            </article>
          ) : activeQuiz ? (
            <Quiz quizId={activeQuiz.id} title={activeQuiz.title} />
          ) : (
            <p className="text-ink-soft">Sélectionnez une leçon.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function Quiz({ quizId, title }: { quizId: string; title: string }) {
  const supabase = createClient();
  const [questions, setQuestions] = useState<QuizQ[] | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const { data } = await supabase.rpc("hbs_get_quiz", { p_quiz_id: quizId });
    setQuestions((data ?? []) as QuizQ[]);
    setLoading(false);
  }

  async function submit() {
    setLoading(true);
    const { data } = await supabase.rpc("hbs_grade_quiz", { p_quiz_id: quizId, p_answers: answers });
    const row = Array.isArray(data) ? data[0] : data;
    if (row) setResult({ score: row.score, passed: row.passed });
    setLoading(false);
  }

  if (!questions) {
    return (
      <div className="py-8 text-center">
        <FileQuestion size={36} className="mx-auto text-coral" />
        <h2 className="mt-3 font-display text-xl font-bold text-ink">{title}</h2>
        <p className="mt-1 text-sm text-ink-soft">Testez vos connaissances. Correction instantanée.</p>
        <div className="mt-5">
          <Button onClick={load} disabled={loading}>{loading ? <Loader2 size={16} className="animate-spin" /> : "Démarrer le quiz"}</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-display text-xl font-bold text-ink">{title}</h2>
      <div className="mt-5 space-y-6">
        {questions.map((qq, i) => (
          <div key={qq.id}>
            <p className="font-medium text-ink">{i + 1}. {qq.question}</p>
            <div className="mt-2 space-y-2">
              {qq.choices.map((ch, idx) => (
                <label key={idx} className={cn(
                  "flex cursor-pointer items-center gap-2.5 rounded-xl border px-4 py-2.5 text-sm",
                  answers[qq.id] === idx ? "border-teal-400 bg-teal-50 text-teal-800" : "border-mist text-ink-soft hover:border-teal-200",
                )}>
                  <input type="radio" name={qq.id} className="accent-teal-500" checked={answers[qq.id] === idx} onChange={() => setAnswers((a) => ({ ...a, [qq.id]: idx }))} />
                  {ch}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      {result ? (
        <div className={cn("mt-6 rounded-xl p-4 text-sm font-semibold", result.passed ? "bg-teal-50 text-teal-700" : "bg-coral-light text-coral-dark")}>
          {result.passed ? `Réussi ! Score : ${result.score}%` : `Score : ${result.score}% — réessayez pour valider.`}
        </div>
      ) : (
        <div className="mt-6">
          <Button onClick={submit} disabled={loading || Object.keys(answers).length < questions.length}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Valider mes réponses"}
          </Button>
        </div>
      )}
    </div>
  );
}
