import "server-only";
import { createHash, randomUUID } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { log, errMsg } from "@/lib/log";

/**
 * Dépose une pièce (facture Stripe…) dans le coffre LEARN de l'organisme.
 *
 * Même projet Supabase que la plateforme : la clé service_role du site écrit directement dans
 * le bucket `learn-vault` et dans `learn_vault_objects`, avec le même chemin que les dépôts
 * de l'application (`<organisme>/<année>/<uuid>.pdf`). La pièce est rattachée à la session
 * quand son code est connu, et conservée 10 ans (base `legal`, pièce comptable).
 *
 * Ne lève jamais : une facture non archivée se journalise, elle ne défait pas un paiement.
 */
export async function archiverPdf(p: {
  url: string;
  filename: string;
  kind: string;
  sessionCode?: string | null;
  ref: string;
}) {
  try {
    const db = createAdminClient();
    const { data: tenant } = await db.from("learn_tenants").select("id").eq("slug", process.env.LEARN_TENANT_SLUG || "hbs").single();
    if (!tenant) throw new Error("organisme introuvable");

    const { data: existant } = await db.from("learn_vault_objects").select("id").eq("tenant_id", tenant.id).eq("imported_from", p.ref).maybeSingle();
    if (existant) return existant.id as string;

    const res = await fetch(p.url);
    if (!res.ok) throw new Error(`téléchargement ${res.status}`);
    const octets = Buffer.from(await res.arrayBuffer());

    const annee = new Date().getFullYear();
    const chemin = `${tenant.id}/${annee}/${randomUUID()}.pdf`;
    const { error: errUp } = await db.storage.from("learn-vault").upload(chemin, octets, { contentType: "application/pdf", upsert: false });
    if (errUp) throw new Error(`stockage : ${errUp.message}`);

    let sessionId: string | null = null;
    if (p.sessionCode) {
      const { data: s } = await db.from("learn_sessions").select("id").eq("tenant_id", tenant.id).eq("code", p.sessionCode).maybeSingle();
      sessionId = s?.id ?? null;
    }

    const { data, error } = await db
      .from("learn_vault_objects")
      .insert({
        tenant_id: tenant.id,
        kind: p.kind,
        filename: p.filename,
        original_filename: p.filename,
        storage_path: chemin,
        mime: "application/pdf",
        bytes: octets.length,
        sha256: createHash("sha256").update(octets).digest("hex"),
        retention_basis: "legal",
        retention_until: `${annee + 10}-12-31`,
        visibility: "tenant",
        session_id: sessionId,
        provenance: "imported",
        imported_from: p.ref,
      })
      .select("id")
      .single();
    if (error) {
      await db.storage.from("learn-vault").remove([chemin]);
      throw new Error(`coffre : ${error.message}`);
    }
    log.info("coffre.archive", { ref: p.ref, kind: p.kind, session: p.sessionCode ?? null });
    return data.id as string;
  } catch (e) {
    log.error("coffre.archive_echec", { ref: p.ref, err: errMsg(e) });
    return null;
  }
}
