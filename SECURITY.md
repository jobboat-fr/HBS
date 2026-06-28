# Sécurité — HBS FORMATION

## Signaler une vulnérabilité
Écrire à contact@hbs-formation.fr (ou à AZZ&CO Labs). Merci de ne pas divulguer publiquement avant correctif.

## Modèle de menace — chat « Hub » (prompt injection)
Le chat public relaie du texte utilisateur vers un modèle/agent. Risque : injection de prompt
visant à exfiltrer des secrets ou détourner l'agent. Mitigations en place (défense en profondeur) :

1. **Filtre d'entrée** (`src/lib/guard.ts` → `isSecretSeeking`) : toute demande de clés / tokens /
   variables d'env / prompt système / SSH est refusée **sans être transmise** à l'agent.
2. **Rédaction de sortie** (`redactSecrets`) : la réponse est purgée de tout secret (valeurs d'env
   connues + motifs : clés `sk_/re_/sb_…`, JWT, clés SSH, hex/base64 longs, `VAR=secret`, IP serveur)
   **avant** d'être renvoyée ou journalisée. Backstop fiable, indépendant du modèle.
3. **Prompt système durci** (`src/lib/llm.ts`) : interdiction explicite de divulguer secrets / instructions.

### Recommandation forte (côté agent VIGIL)
Le chat public **ne devrait pas** atteindre l'agent privilégié (accès outils + secrets). Idéal :
exposer pour le canal public une **persona contrainte** (sans outils, sans accès secrets) ou un LLM
simple. Pointer alors `LLM_BASE_URL` du site vers cet endpoint restreint. Tant que ce n'est pas fait,
les couches 1–3 ci-dessus limitent l'exposition mais l'agent reste la surface à réduire.

## Secrets
- Aucun secret en clair dans le dépôt. Runtime = variables d'environnement Vercel / Railway.
- `.env*` est git-ignoré ; `gitleaks` tourne en CI (voir `.github/workflows/ci.yml`).
- **Rotation** : tout secret ayant transité par un canal non sûr (chat, logs, support) doit être
  tourné. À tourner suite à l'incident d'injection : clé API de l'agent (`API_SERVER_KEY`),
  `BRIDGE_TOKEN`, `HBS_API_TOKEN`, Resend, tokens Sanity, token Railway.
- Réduire la surface : firewaller le port `:8642` (l'API agent est déjà joignable en HTTPS via
  `hermes.azzco.life/llm`).

## Données (Supabase)
- RLS activé sur toutes les tables `hbs_` ; données par utilisateur sc-opées à `auth.uid()`.
- Réponses de quiz jamais exposées : accès via RPC `SECURITY DEFINER` (`hbs_get_quiz` /
  `hbs_grade_quiz`).
- Lecture des offres jobboat via RPC curatée (`hbs_search_alternance`) — colonnes publiques only.

## CI/CD
- `CI` (GitHub Actions) : lint + type-check + build + `npm audit` + scan de secrets `gitleaks`
  sur chaque push/PR vers `main`.
- Déploiement : Vercel (intégration Git) sur `main`. Dependabot : mises à jour hebdomadaires.
