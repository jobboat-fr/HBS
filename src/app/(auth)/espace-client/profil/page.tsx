import { createClient } from "@/lib/supabase/server";
import { ProfileSettings } from "@/components/espace/ProfileSettings";

export default async function ProfilPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: client } = await supabase
    .from("hbs_clients")
    .select("full_name, type, company_name, phone, marketing_consent")
    .eq("user_id", user!.id)
    .maybeSingle();

  return (
    <div>
      <p className="text-sm font-semibold text-teal-600">Mon profil</p>
      <h1 className="mt-1 font-display text-display-md font-extrabold text-ink">Profil & paramètres</h1>
      <div className="mt-8">
        <ProfileSettings
          userId={user!.id}
          email={user!.email ?? ""}
          client={client ?? null}
        />
      </div>
    </div>
  );
}
