"use client";

import { useState } from "react";
import { Plus, ChevronLeft, ChevronRight, Trash2, Bot } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type Card = { id: string; column_key: string; title: string; notes?: string; position?: number; created_by?: string };

const COLUMNS: { key: string; label: string; accent: string }[] = [
  { key: "idees", label: "💡 Idées", accent: "border-t-sun" },
  { key: "a_faire", label: "À faire", accent: "border-t-coral" },
  { key: "en_cours", label: "En cours", accent: "border-t-teal-400" },
  { key: "fait", label: "Fait", accent: "border-t-teal-600" },
];
const ORDER = COLUMNS.map((c) => c.key);

export function KanbanBoard({ userId, initialCards }: { userId: string; initialCards: Card[] }) {
  const supabase = createClient();
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  async function addCard(col: string) {
    const title = (drafts[col] ?? "").trim();
    if (!title) return;
    setDrafts((d) => ({ ...d, [col]: "" }));
    const { data } = await supabase
      .from("hbs_board_cards")
      .insert({ user_id: userId, column_key: col, title, created_by: "owner" })
      .select("id, column_key, title, notes, position, created_by")
      .single();
    if (data) setCards((c) => [...c, data]);
  }

  async function move(card: Card, dir: -1 | 1) {
    const idx = ORDER.indexOf(card.column_key);
    const next = ORDER[idx + dir];
    if (!next) return;
    setCards((c) => c.map((x) => (x.id === card.id ? { ...x, column_key: next } : x)));
    await supabase.from("hbs_board_cards").update({ column_key: next }).eq("id", card.id);
  }

  async function remove(id: string) {
    setCards((c) => c.filter((x) => x.id !== id));
    await supabase.from("hbs_board_cards").delete().eq("id", id);
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {COLUMNS.map((col) => {
        const colCards = cards.filter((c) => c.column_key === col.key);
        return (
          <div key={col.key} className={cn("rounded-2xl border border-t-4 border-mist bg-cloud/60 p-3", col.accent)}>
            <div className="flex items-center justify-between px-1 pb-2">
              <h3 className="text-sm font-bold text-ink">{col.label}</h3>
              <span className="text-xs text-ink-muted">{colCards.length}</span>
            </div>
            <div className="space-y-2">
              {colCards.map((card) => {
                const idx = ORDER.indexOf(card.column_key);
                return (
                  <div key={card.id} className="rounded-xl border border-mist bg-white p-3 shadow-soft">
                    <p className="text-sm text-ink">{card.title}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex gap-1">
                        <button disabled={idx === 0} onClick={() => move(card, -1)} aria-label="Reculer" className="text-ink-muted hover:text-teal-600 disabled:opacity-30">
                          <ChevronLeft size={16} />
                        </button>
                        <button disabled={idx === ORDER.length - 1} onClick={() => move(card, 1)} aria-label="Avancer" className="text-ink-muted hover:text-teal-600 disabled:opacity-30">
                          <ChevronRight size={16} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        {card.created_by === "agent" && <Bot size={13} className="text-teal-500" aria-label="Ajouté par l'agent" />}
                        <button onClick={() => remove(card.id)} aria-label="Supprimer" className="text-ink-muted hover:text-coral-dark">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-2 flex items-center gap-1 rounded-xl border border-dashed border-mist bg-white px-2 py-1.5">
              <input
                value={drafts[col.key] ?? ""}
                onChange={(e) => setDrafts((d) => ({ ...d, [col.key]: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && addCard(col.key)}
                placeholder="Ajouter…"
                className="w-full bg-transparent px-1 py-1 text-sm text-ink placeholder:text-ink-muted focus:outline-none"
              />
              <button onClick={() => addCard(col.key)} aria-label="Ajouter" className="text-teal-600 hover:text-teal-700">
                <Plus size={18} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
