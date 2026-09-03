import Link from "next/link";
import { ArrowRight, GraduationCap, Trophy, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/espace/ProgressBar";

export default async function EspaceClientPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: client } = await supabase
    .from("hbs_clients")
    .select("full_name")
    .eq("user_id", user!.id)
    .maybeSingle();

  const { data: enrollments } = await supabase
    .from("hbs_enrollments")
    .select("id, status, progress, course:hbs_courses(slug, title, cover_url, category)")
    .order("enrolled_at", { ascending: false });

  const list = enrollments ?? [];
  const enCours = list.filter((e) => e.status === "en_cours" || e.status === "inscrit").length;
  const termines = list.filter((e) => e.status === "termine" || e.status === "certifie").length;

  const firstName = client?.full_name?.split(" ")[0] ?? "";

  return (
    <div>
      <p className="text-sm font-semibold text-teal-600">Espace client</p>
      <h1 className="mt-1 font-display text-display-md font-extrabold text-ink">
        Bonjour{firstName ? ` ${firstName}` : ""} 👋
      </h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat icon={GraduationCap} value={list.length} label="formations" />
        <Stat icon={Clock} value={enCours} label="en cours" />
        <Stat icon={Trophy} value={termines} label="terminées" />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-ink">Mes formations</h2>
        <Link href="/espace-client/formations" className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:underline">
          Explorer le catalogue <ArrowRight size={15} />
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-mist bg-white p-10 text-center">
          <p className="text-ink-soft">Vous n&apos;êtes inscrit·e à aucune formation pour le moment.</p>
          <div className="mt-5">
            <Button href="/espace-client/formations" size="md">Parcourir le catalogue</Button>
          </div>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {list.map((e) => {
            const course = e.course as unknown as { slug: string; title: string; cover_url?: string; category?: string };
            return (
              <Link
                key={e.id}
                href={`/espace-client/formations/${course.slug}`}
                className="group overflow-hidden rounded-2xl border border-mist bg-white shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
              >
                <div className="p-5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-teal-600">{course.category}</span>
                  <h3 className="mt-1 font-display text-lg font-bold text-ink">{course.title}</h3>
                  <div className="mt-4">
                    <ProgressBar value={e.progress ?? 0} />
                  </div>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600">
                    {e.progress ? "Continuer" : "Commencer"} <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Stat({ icon: Icon, value, label }: { icon: typeof GraduationCap; value: number; label: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-mist bg-white p-5 shadow-card">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
        <Icon size={22} />
      </span>
      <div>
        <div className="font-display text-2xl font-extrabold text-ink">{value}</div>
        <div className="text-sm text-ink-muted">{label}</div>
      </div>
    </div>
  );
}
