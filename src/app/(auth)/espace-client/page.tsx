import { createClient } from "@/lib/supabase/server";
import { GlassCard } from "@/components/ui/GlassCard";
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
    <div className="container-luxury pb-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold">Espace client</p>
          <h1 className="mt-2 font-display text-display-md font-semibold">
            Bonjour{client?.full_name ? `, ${client.full_name}` : ""}
          </h1>
        </div>
        <SignOutButton />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {/* Profil */}
        <GlassCard className="p-8">
          <h2 className="font-display text-xl font-semibold">Mon profil</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <Line label="Email" value={user!.email ?? "—"} />
            <Line label="Type" value={client?.type === "entreprise" ? "Entreprise" : "Particulier"} />
            {client?.company_name ? <Line label="Entreprise" value={client.company_name} /> : null}
            {client?.phone ? <Line label="Téléphone" value={client.phone} /> : null}
          </dl>
        </GlassCard>

        {/* Inscriptions */}
        <GlassCard className="p-8 lg:col-span-2">
          <h2 className="font-display text-xl font-semibold">Mes formations</h2>
          {!inscriptions || inscriptions.length === 0 ? (
            <div className="mt-6 rounded-xl border border-dashed border-white/[0.12] p-8 text-center">
              <p className="text-white/55">Vous n&apos;avez pas encore de formation enregistrée.</p>
              <div className="mt-5">
                <Button href="/formations" variant="secondary" size="sm">
                  Découvrir les formations
                </Button>
              </div>
            </div>
          ) : (
            <ul className="mt-6 space-y-4">
              {inscriptions.map((i) => (
                <li
                  key={i.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-5"
                >
                  <div>
                    <p className="font-medium">{i.formation_title}</p>
                    <p className="text-xs text-white/45">
                      Demande du {formatDate(i.created_at)}
                    </p>
                  </div>
                  <span className="rounded-full bg-gold-muted px-3 py-1 text-xs text-gold">
                    {STATUS_LABELS[i.status] ?? i.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </GlassCard>
      </div>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-white/[0.06] pb-2">
      <dt className="text-white/45">{label}</dt>
      <dd className="text-right text-white/80">{value}</dd>
    </div>
  );
}
