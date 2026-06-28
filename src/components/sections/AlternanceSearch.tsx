"use client";

import { useState } from "react";
import { Search, MapPin, Building2, ExternalLink, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

type Offer = {
  id: string;
  title: string;
  company: string;
  location: string;
  contract: string;
  apply_url: string;
  salary_min: number | null;
  salary_max: number | null;
};

export function AlternanceSearch() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [offers, setOffers] = useState<Offer[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState<string>("");

  async function run(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/alternance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, location }),
      });
      const data = await res.json();
      setOffers(data.offers ?? []);
      setSource(data.source ?? "");
    } catch {
      setOffers([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={run} className="rounded-2xl border border-mist bg-white p-3 shadow-card sm:flex sm:items-center sm:gap-2">
        <div className="flex flex-1 items-center gap-2 px-3">
          <Search size={18} className="shrink-0 text-teal-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Métier ou mots-clés (ex. développeur web, commercial…)"
            className="w-full bg-transparent py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none"
          />
        </div>
        <div className="flex flex-1 items-center gap-2 border-t border-mist px-3 sm:border-l sm:border-t-0">
          <MapPin size={18} className="shrink-0 text-teal-500" />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Lieu (ex. Rouen)"
            className="w-full bg-transparent py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none"
          />
        </div>
        <Button type="submit" className="mt-2 w-full sm:mt-0 sm:w-auto" disabled={loading}>
          {loading ? <Loader2 size={16} className="animate-spin" /> : "Rechercher"}
        </Button>
      </form>

      {offers !== null && (
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-ink-muted">
              {offers.length} offre{offers.length > 1 ? "s" : ""} d&apos;alternance
            </p>
            {source === "vigil" && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-teal-600">
                <Sparkles size={13} /> affiné par l&apos;IA
              </span>
            )}
          </div>

          {offers.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-mist bg-white p-8 text-center text-ink-soft">
              Aucune offre pour cette recherche. Élargissez les mots-clés ou contactez-nous : nous vous aidons à trouver votre alternance.
            </div>
          ) : (
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {offers.map((o) => (
                <li key={o.id} className="rounded-2xl border border-mist bg-white p-5 shadow-card">
                  <h3 className="font-display text-base font-bold text-ink">{o.title}</h3>
                  <div className="mt-2 space-y-1 text-sm text-ink-soft">
                    {o.company && <p className="flex items-center gap-1.5"><Building2 size={14} className="text-teal-500" /> {o.company}</p>}
                    {o.location && <p className="flex items-center gap-1.5"><MapPin size={14} className="text-teal-500" /> {o.location}</p>}
                  </div>
                  {o.apply_url && (
                    <a href={o.apply_url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 hover:underline">
                      Voir l&apos;offre <ExternalLink size={14} />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
