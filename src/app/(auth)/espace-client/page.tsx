import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/Button";
import { SignOutButton } from "@/components/SignOutButton";
import { formatDate } from "@/lib/utils";

const STATUS_LABELS: Record<string, string> = {
  demande: "Demande reçue",
  positionnement: "Positionnement",
  inscrit: "Inscrit",
  en_formation: "En formation",
  termine: "Terminée",
  certifie: "Certifié",
  abandon: "Abandon",
};

export default async function EspaceClientPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: client } = await supabase
    .from("hbs_clients")
    .select("*")
    .eq("user_id", user!.id)
    .maybeSingle();

  const { data: inscriptions } = await supabase
    .from("hbs_inscriptions")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="container-page pb-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-teal-600">Espace client</p>
          <h1 className="mt-2 font-display text-display-md font-extrabold text-ink">
            Bonjour{client?.full_name ? `, ${client.full_name}` : ""}
          </h1>
        </div>
        <SignOutButton />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-mist bg-white p-8 shadow-card">
          <h2 className="font-display text-xl font-bold text-ink">Mon profil</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <Line label="Email" value={user!.email ?? "—"} />
            <Line label="Type" value={client?.type === "entreprise" ? "Entreprise" : "Particulier"} />
            {client?.company_name ? <Line label="Entreprise" value={client.company_name} /> : null}
            {client?.phone ? <Line label="Téléphone" value={client.phone} /> : null}
          </dl>
        </div>

        <div className="rounded-2xl border border-mist bg-white p-8 shadow-card lg:col-span-2">
          <h2 className="font-display text-xl font-bold text-ink">Mes formations</h2>
          {!inscriptions || inscriptions.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-mist bg-cloud p-8 text-center">
              <p className="text-ink-soft">Vous n&apos;avez pas encore de formation enregistrée.</p>
              <div className="mt-5">
                <Button href="/formations" variant="outline" size="sm">
                  Découvrir les formations
                </Button>
              </div>
            </div>
          ) : (
            <ul className="mt-6 space-y-4">
              {inscriptions.map((i) => (
                <li
                  key={i.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-mist bg-cloud p-5"
                >
                  <div>
                    <p className="font-semibold text-ink">{i.formation_title}</p>
                    <p className="text-xs text-ink-muted">Demande du {formatDate(i.created_at)}</p>
                  </div>
                  <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                    {STATUS_LABELS[i.status] ?? i.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-mist pb-2">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="text-right font-medium text-ink">{value}</dd>
    </div>
  );
}
