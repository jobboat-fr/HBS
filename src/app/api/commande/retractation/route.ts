import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { signatureValide } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { envoyer, destinatairesOrganisme } from "@/lib/commandes-serveur";
import { buildRetractationConfirmee, buildAlerteOrganisme } from "@/lib/email/templates";
import { log } from "@/lib/log";
import { FORMATIONS, type CodeFormation } from "@/lib/commande";

export const runtime = "nodejs";

const schema = z.object({ c: z.string().uuid(), s: z.string().min(20).max(100) });

/**
 * Rétractation en un clic depuis le lien reçu par courriel.
 *
 * POST et non GET : les antivirus de messagerie ouvrent les liens des courriels pour les
 * analyser. Un GET qui rétracte ferait rétracter les clients par leur propre filtre anti-spam.
 * Le lien mène à une page, la page demande une confirmation, la confirmation poste ici.
 */
export async function POST(request: NextRequest) {
  let d: z.infer<typeof schema>;
  try {
    d = schema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: "Lien invalide." }, { status: 400 });
  }
  if (!signatureValide(d.c, d.s)) return NextResponse.json({ error: "Lien invalide." }, { status: 403 });

  const db = createAdminClient();
  const { data: c } = await db.from("hbs_commandes").select("id, statut, produit, nom, email, retractation_fin").eq("id", d.c).maybeSingle();
  if (!c) return NextResponse.json({ error: "Commande introuvable." }, { status: 404 });
  if (c.statut === "retractee") return NextResponse.json({ ok: true, deja: true });
  if (!c.retractation_fin || new Date(c.retractation_fin) < new Date()) {
    return NextResponse.json(
      { error: "Le délai de rétractation est expiré. Écrivez-nous : les conditions de report ou d'abandon s'appliquent." },
      { status: 409 },
    );
  }

  const maintenant = new Date().toISOString();
  await db.from("hbs_commandes").update({ statut: "retractee", retractee_le: maintenant, updated_at: maintenant }).eq("id", c.id);
  await db.from("hbs_echeances").update({ statut: "annulee" }).eq("commande_id", c.id).neq("statut", "payee");

  if (c.email) await envoyer(c.email, "Votre rétractation est enregistrée — HBS FORMATION", buildRetractationConfirmee({ nom: c.nom, formation: FORMATIONS[c.produit as CodeFormation]?.nom ?? "votre formation" }));
  await envoyer(destinatairesOrganisme(), `Rétractation — ${c.nom ?? c.email}`,
    buildAlerteOrganisme("Rétractation", [
      `${c.nom ?? ""} (${c.email ?? ""}) s'est rétracté(e) le ${new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" })}.`,
      "Échéances annulées, aucun prélèvement effectué.",
    ]));

  log.info("commande.retractee", { id: c.id });
  return NextResponse.json({ ok: true });
}
