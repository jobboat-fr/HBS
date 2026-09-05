/**
 * Client serveur vers LEARN — le tunnel entre le site vitrine et la plateforme.
 *
 * Rien ici ne doit atteindre le navigateur. Les routes `/api/learn/*` appellent ce module
 * côté serveur, ce qui donne trois choses que le fetch direct depuis le client ne donnerait
 * pas : le limiteur de débit du site s'applique avant de sortir, l'adresse de LEARN n'est
 * pas publique, et l'identifiant de l'organisme (`LEARN_TENANT_SLUG`) ne peut pas être
 * remplacé par celui d'un autre organisme depuis la console du navigateur.
 *
 * Dégradation : sans `LEARN_API_URL`, `configured()` est faux et les routes répondent 503
 * avec un message lisible. La vitrine continue de fonctionner — c'est le tunnel qui est
 * fermé, pas le site.
 */

import "server-only";

const BASE = (process.env.LEARN_API_URL || "").replace(/\/$/, "");
const SLUG = process.env.LEARN_TENANT_SLUG || "hbs";
/** Optionnel : jeton partagé si la passerelle filtre l'origine des appels publics. */
const TOKEN = process.env.LEARN_API_TOKEN || "";
const TIMEOUT_MS = Number(process.env.LEARN_API_TIMEOUT_MS || 15000);

export function configured(): boolean {
  return BASE.length > 0;
}

export class LearnError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "LearnError";
  }
}

type Json = Record<string, unknown>;

async function call(path: string, init?: RequestInit): Promise<Json> {
  if (!configured()) {
    throw new LearnError(503, "learn_not_configured", "LEARN_API_URL n'est pas défini.");
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      ...init,
      signal: controller.signal,
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
        ...(init?.headers || {}),
      },
    });
  } catch {
    throw new LearnError(503, "learn_unreachable", "La plateforme est momentanément injoignable.");
  } finally {
    clearTimeout(timer);
  }

  const body = (await res.json().catch(() => ({}))) as Json;
  if (!res.ok) {
    // LEARN renvoie soit {detail: {error, detail}}, soit {detail: "..."} — on garde le code
    // machine quand il existe, parce que les routes s'en servent pour choisir le message.
    const detail = body.detail as Json | string | undefined;
    const code =
      typeof detail === "object" && detail !== null && typeof detail.error === "string"
        ? detail.error
        : "learn_error";
    const msg =
      typeof detail === "object" && detail !== null && typeof detail.detail === "string"
        ? detail.detail
        : typeof detail === "string"
          ? detail
          : "La plateforme a refusé la demande.";
    throw new LearnError(res.status, code, msg);
  }
  return body;
}

export type Programme = {
  id: string;
  title: string;
  duration_hours: number;
  modality: string;
  objectives: string | null;
  prerequisites: string | null;
  certifiante: boolean;
  rncp_code: string | null;
  next_session: string | null;
};

export type Catalogue = {
  organisme: string;
  slug: string;
  programmes: Programme[];
  /** Chaque taux publié avec la population qui l'a produit — indicateur 1. */
  indicateurs: {
    satisfaction: number | null;
    responses: number | null;
    response_rate: number | null;
    learners: number | null;
    year: number | null;
  } | null;
  mention: string;
  consent_text: string;
};

export function catalogue(): Promise<Catalogue> {
  return call(`/api/v1/learn/public/programs/${encodeURIComponent(SLUG)}`) as Promise<Catalogue>;
}

export type DemandeInput = {
  full_name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  message?: string | null;
  program_id?: string | null;
  campaign?: string | null;
};

export type DemandeResult = {
  status: string;
  created: boolean;
  /** Présent uniquement à la première soumission : le lien du test de positionnement. */
  positionnement_path?: string;
  next: string;
};

export function submitDemande(input: DemandeInput): Promise<DemandeResult> {
  return call(`/api/v1/learn/public/leads/${encodeURIComponent(SLUG)}`, {
    method: "POST",
    // `consent` est posé ici et non par l'appelant : la case a été cochée sur le formulaire
    // du site, et c'est le serveur qui l'atteste à LEARN.
    body: JSON.stringify({ ...input, consent: true }),
  }) as Promise<DemandeResult>;
}

export type Question = {
  id: string;
  kind: string;
  prompt: string;
  options: { key: string; label: string }[];
  points: number;
};

export type Paper = {
  assessment_id: string;
  title: string;
  duration_minutes: number;
  questions: Question[];
};

export function paper(token: string): Promise<Paper> {
  return call(`/api/v1/learn/public/positionnement/${encodeURIComponent(token)}`) as Promise<Paper>;
}

export type Graded = {
  lead_id: string;
  score: number;
  max_score: number;
  percent: number | null;
  level: string | null;
  next: string;
};

export function gradePaper(
  token: string,
  answers: { question_id: string; given: string[] }[],
): Promise<Graded> {
  return call(`/api/v1/learn/public/positionnement/${encodeURIComponent(token)}`, {
    method: "POST",
    body: JSON.stringify({ answers }),
  }) as Promise<Graded>;
}

export const LEVEL_LABELS: Record<string, string> = {
  debutant: "Débutant",
  intermediaire: "Intermédiaire",
  avance: "Avancé",
};
