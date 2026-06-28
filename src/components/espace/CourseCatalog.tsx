"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { RncpBadge } from "@/components/ui/RncpBadge";

export type CatalogCourse = {
  slug: string;
  title: string;
  summary?: string;
  category?: string;
  modalite?: string;
  duration_hours?: number;
  cover_url?: string;
  rncp_code?: string | null;
  rncp_level?: string | null;
};

const MODALITE_LABEL: Record<string, string> = {
  presentiel: "Présentiel",
  distance: "À distance",
  mixte: "Mixte",
};

export function CourseCatalog({
  courses,
  enrolledSlugs,
}: {
  courses: CatalogCourse[];
  enrolledSlugs: string[];
}) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("Tous");
  const enrolled = new Set(enrolledSlugs);

  const categories = useMemo(
    () => ["Tous", ...Array.from(new Set(courses.map((c) => c.category).filter(Boolean) as string[]))],
    [courses],
  );

  const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const filtered = courses.filter((c) => {
    const okCat = cat === "Tous" || c.category === cat;
    const okQ = !q || norm(`${c.title} ${c.summary ?? ""} ${c.category ?? ""}`).includes(norm(q));
    return okCat && okQ;
  });

  return (
    <div>
      {/* Recherche */}
      <div className="flex items-center gap-2 rounded-2xl border border-mist bg-white px-4 py-2.5 shadow-card">
        <Search size={18} className="text-teal-500" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher une formation…"
          className="w-full bg-transparent py-1.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none"
        />
      </div>

      {/* Filtres catégorie */}
      <div className="mt-4 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              cat === c ? "bg-teal-500 text-white" : "border border-mist bg-white text-ink-soft hover:border-teal-300",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm text-ink-muted">{filtered.length} formation{filtered.length > 1 ? "s" : ""}</p>

      {/* Grille */}
      <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((c) => (
          <Link
            key={c.slug}
            href={`/espace-client/formations/${c.slug}`}
            className="group flex flex-col overflow-hidden rounded-2xl border border-mist bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
          >
            <div className="relative aspect-[16/9] overflow-hidden">
              {c.cover_url ? (
                <Image src={c.cover_url} alt={c.title} fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
              ) : null}
              {enrolled.has(c.slug) && (
                <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-teal-700">
                  <CheckCircle2 size={13} /> Inscrit
                </span>
              )}
              {c.rncp_code && (
                <div className="absolute left-3 top-3">
                  <RncpBadge code={c.rncp_code} level={c.rncp_level} />
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span className="text-teal-600">{c.category}</span>
                {c.modalite && <span className="text-ink-muted">· {MODALITE_LABEL[c.modalite] ?? c.modalite}</span>}
              </div>
              <h3 className="mt-1.5 font-display text-lg font-bold text-ink">{c.title}</h3>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-soft">{c.summary}</p>
              <div className="mt-4 flex items-center justify-between">
                {c.duration_hours ? (
                  <span className="inline-flex items-center gap-1.5 text-xs text-ink-muted"><Clock size={14} /> {c.duration_hours} h</span>
                ) : <span />}
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-teal-600">
                  Voir <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-6 rounded-2xl border border-dashed border-mist bg-white p-10 text-center text-ink-soft">
          Aucune formation ne correspond à votre recherche.
        </div>
      )}
    </div>
  );
}
