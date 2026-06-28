/**
 * Garde-fous de sécurité pour le chat public (anti prompt-injection / exfiltration).
 * - blockSecretSeeking : refuse les demandes visant des secrets / le prompt système.
 * - redactSecrets      : masque tout secret éventuel dans une réponse (backstop fiable,
 *   indépendant du comportement du modèle/agent).
 */

// Valeurs secrètes connues (env) — masquées si jamais elles apparaissent en sortie.
const SECRET_ENV_KEYS = [
  "LLM_API_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "RESEND_API_KEY",
  "SANITY_API_TOKEN",
  "AGENT_TOKEN",
  "BRIDGE_TOKEN",
  "HBS_API_TOKEN",
];

function knownSecretValues(): string[] {
  const vals = SECRET_ENV_KEYS.map((k) => process.env[k]).filter(
    (v): v is string => typeof v === "string" && v.length >= 12,
  );
  // hôte interne de l'agent — à ne jamais divulguer
  vals.push("137.74.133.120");
  return vals;
}

// Motifs de secrets génériques (clés, tokens, JWT, clés SSH, hex/base64 longs…).
const SECRET_PATTERNS: RegExp[] = [
  /\b(sk|rk|re|sb|pk|ghp|gho|ghs|ghr)[-_][A-Za-z0-9_-]{12,}\b/gi,
  /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{4,}\b/g, // JWT
  /\bssh-(ed25519|rsa)\s+[A-Za-z0-9+/=]{20,}/g,
  /\bAAAA[A-Za-z0-9+/=]{24,}\b/g, // corps de clé SSH
  /\bBearer\s+[A-Za-z0-9._-]{16,}/gi,
  /\b[A-Fa-f0-9]{32,}\b/g, // hex long (clés)
  /\b[A-Z0-9_]{4,}_(KEY|TOKEN|SECRET|PASSWORD)\s*[:=]\s*\S+/gi, // VAR=secret
];

const MASK = "[information confidentielle masquée]";

export function redactSecrets(text: string): string {
  if (!text) return text;
  let out = text;
  for (const s of knownSecretValues()) {
    if (s) out = out.split(s).join(MASK);
  }
  for (const p of SECRET_PATTERNS) out = out.replace(p, MASK);
  return out;
}

// Intentions d'exfiltration / manipulation (FR + EN), normalisées sans accents.
const SEEK_PATTERNS: RegExp[] = [
  /\b(api[\s_-]?key|cl[ée]s?\s+(api|secr|priv|de chiffrement))\b/i,
  /\b(token|jeton)\b/i,
  /\b(secret|mot de passe|password|credentials?|identifiants?\s+(api|technique|serveur))\b/i,
  /\b(env(ironnement)?\s+var|variable[s]?\s+d.environnement|\.env|fichier env)\b/i,
  /\b(system\s*prompt|prompt\s*syst|instructions?\s+syst|tes instructions|ignore (les|toutes|previous|above))\b/i,
  /\b(service[_\s]?role|clé service|supabase\s+key|anon\s+key)\b/i,
  /\b(ssh|cl[ée] privée|private key|root|sudo|serveur ovh|137\.74)\b/i,
];

export function isSecretSeeking(input: string): boolean {
  const t = input.toLowerCase();
  return SEEK_PATTERNS.some((p) => p.test(t));
}

export const SAFE_REFUSAL = {
  text:
    "Je ne peux pas partager d'informations techniques ou confidentielles (clés, identifiants, configuration). " +
    "En revanche, je suis là pour tout ce qui concerne vos formations, l'alternance ou le financement ! " +
    "Pour une demande spécifique, un conseiller peut vous répondre.",
  links: [{ label: "Contacter un conseiller", href: "/contact" }],
};
