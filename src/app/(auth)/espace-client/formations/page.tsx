import { createClient } from "@/lib/supabase/server";
import { CourseCatalog, type CatalogCourse } from "@/components/espace/CourseCatalog";

export default async function CataloguePage() {
  const supabase = createClient();
  const { data: courses } = await supabase
    .from("hbs_courses")
    .select("slug, title, summary, category, modalite, duration_hours, cover_url, rncp_code, rncp_level")
    .eq("published", true)
    .order("position");

  const { data: enrollments } = await supabase.from("hbs_enrollments").select("course:hbs_courses(slug)");
  const enrolledSlugs = (enrollments ?? [])
    .map((e) => (e.course as unknown as { slug: string } | null)?.slug)
    .filter(Boolean) as string[];

  return (
    <div>
      <p className="text-sm font-semibold text-teal-600">Catalogue</p>
      <h1 className="mt-1 font-display text-display-md font-extrabold text-ink">Toutes nos formations</h1>
      <p className="mt-2 text-ink-soft">Recherchez, filtrez et inscrivez-vous en un clic.</p>
      <div className="mt-8">
        <CourseCatalog courses={(courses ?? []) as CatalogCourse[]} enrolledSlugs={enrolledSlugs} />
      </div>
    </div>
  );
}
