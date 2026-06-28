import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { CoursePlayer, type CourseModule } from "@/components/espace/CoursePlayer";

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: course } = await supabase
    .from("hbs_courses")
    .select("id, slug, title, summary, category, modalite, duration_hours, cover_url")
    .eq("slug", params.slug)
    .maybeSingle();
  if (!course) notFound();

  const { data: modules } = await supabase
    .from("hbs_modules")
    .select("id, title, position, lessons:hbs_lessons(id, title, content, video_url, duration_min, position), quiz:hbs_quizzes(id, title, pass_score)")
    .eq("course_id", course.id)
    .order("position");

  const mods = (modules ?? []).map((m) => ({
    ...m,
    lessons: [...((m.lessons as CourseModule["lessons"]) ?? [])].sort((a, b) => a.position - b.position),
    quiz: Array.isArray(m.quiz) ? m.quiz[0] ?? null : m.quiz,
  })) as CourseModule[];

  const { data: enrollment } = await supabase
    .from("hbs_enrollments")
    .select("id, status, progress")
    .eq("course_id", course.id)
    .maybeSingle();

  const lessonIds = mods.flatMap((m) => m.lessons.map((l) => l.id));
  const { data: progressRows } = lessonIds.length
    ? await supabase.from("hbs_lesson_progress").select("lesson_id").in("lesson_id", lessonIds)
    : { data: [] };
  const completed = (progressRows ?? []).map((r) => r.lesson_id as string);

  return (
    <div>
      <Link href="/espace-client/formations" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-teal-600">
        <ArrowLeft size={16} /> Catalogue
      </Link>
      <div className="mt-4">
        <CoursePlayer
          userId={user!.id}
          course={course}
          modules={mods}
          enrolled={!!enrollment}
          initialCompleted={completed}
        />
      </div>
    </div>
  );
}
