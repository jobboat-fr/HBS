import "server-only";
import { resolveMx, resolve4 } from "node:dns/promises";

/**
 * Le domaine de l'adresse peut-il recevoir du courrier ?
 *
 * Pas une vérification de la boîte — seulement du domaine : un enregistrement MX, ou à
 * défaut une adresse A (RFC 5321 §5.1). Cela suffit à écarter `sfdgdd@tydsdq.vkl`, qui a
 * produit un rebond le 11/09/2026.
 *
 * En cas de doute on laisse passer : un résolveur lent ou en panne ne doit jamais bloquer
 * un vrai prospect. Seule une réponse DNS *négative* explicite refuse.
 */
export async function domaineRecoitDuCourrier(email: string): Promise<boolean> {
  const domaine = email.split("@").pop()?.trim().toLowerCase();
  if (!domaine) return false;
  const delai = <T,>(p: Promise<T>) =>
    Promise.race([p, new Promise<"delai">((r) => setTimeout(() => r("delai"), 2500))]);
  const negatif = (e: unknown) => {
    const code = (e as { code?: string })?.code;
    return code === "ENOTFOUND" || code === "ENODATA";
  };
  try {
    const mx = await delai(resolveMx(domaine));
    if (mx === "delai") return true;
    if (mx.length) return true;
  } catch (e) {
    if (!negatif(e)) return true;
  }
  try {
    const a = await delai(resolve4(domaine));
    return a === "delai" || a.length > 0;
  } catch (e) {
    return !negatif(e);
  }
}
