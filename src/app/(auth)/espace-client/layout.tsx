import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EspaceSidebar } from "@/components/espace/EspaceSidebar";

export default async function EspaceClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  return (
    <div className="min-h-[100svh] bg-cloud pt-[72px]">
      <div className="container-page flex flex-col gap-8 py-8 lg:flex-row">
        <EspaceSidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
