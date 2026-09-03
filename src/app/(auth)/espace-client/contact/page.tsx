import { Mail, Phone, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { site, legal } from "@/lib/site";
import { ContactCentre } from "@/components/espace/ContactCentre";

export default async function ContactCentrePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: client } = await supabase
    .from("hbs_clients")
    .select("full_name")
    .eq("user_id", user!.id)
    .maybeSingle();

  return (
    <div>
      <p className="text-sm font-semibold text-teal-600">Contacter le centre</p>
      <h1 className="mt-1 font-display text-display-md font-extrabold text-ink">Une question ? Écrivez-nous</h1>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-mist bg-white p-6 shadow-card text-sm">
            <h2 className="font-display text-base font-bold text-ink">Coordonnées</h2>
            <ul className="mt-4 space-y-3 text-ink-soft">
              <li className="flex items-start gap-2.5"><MapPin size={17} className="mt-0.5 shrink-0 text-teal-500" />{legal.siege}</li>
              <li className="flex items-center gap-2.5"><Mail size={17} className="shrink-0 text-teal-500" /><a href={`mailto:${site.email}`} className="hover:text-teal-600">{site.email}</a></li>
              <li className="flex items-center gap-2.5"><Phone size={17} className="shrink-0 text-teal-500" />{site.phone}</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-mist bg-teal-50 p-6 text-sm text-teal-800">
            Réponse sous 48 heures ouvrées. Pour une demande liée à une formation en cours, précisez-la dans votre message.
          </div>
        </div>
        <div className="rounded-2xl border border-mist bg-white p-6 shadow-card md:p-8">
          <ContactCentre name={client?.full_name ?? ""} email={user!.email ?? ""} />
        </div>
      </div>
    </div>
  );
}
