import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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

  return <div className="min-h-[100svh] pt-28">{children}</div>;
}
