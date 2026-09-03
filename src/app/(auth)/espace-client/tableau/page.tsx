import { createClient } from "@/lib/supabase/server";
import { KanbanBoard } from "@/components/espace/KanbanBoard";

export default async function TableauPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: cards } = await supabase
    .from("hbs_board_cards")
    .select("id, column_key, title, notes, position, created_by")
    .order("position");

  return (
    <div>
      <p className="text-sm font-semibold text-teal-600">Mon tableau</p>
      <h1 className="mt-1 font-display text-display-md font-extrabold text-ink">Tableau de réflexion</h1>
      <p className="mt-2 text-ink-soft">
        Organisez vos idées et votre projet de formation. Vos notes restent privées ; votre conseiller HBS peut les enrichir.
      </p>
      <div className="mt-8">
        <KanbanBoard userId={user!.id} initialCards={cards ?? []} />
      </div>
    </div>
  );
}
