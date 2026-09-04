# HBS FORMATION — engineering handoff

Written after a single long session (2026-09-02/03) that took this site from "old
deployment, unclear ownership" to "new domain, new Vercel account, new Supabase project,
security-hardened, on Next.js 16" — and started (but did not finish) a much bigger
initiative (HBS LEARN). This document exists so the next agent — human or AI — doesn't
have to reconstruct any of this from git archaeology.

**Read this whole file before touching infrastructure.** Section 2 (what's broken) and
section 6 (blocked initiatives) matter most — a lot of the site's own auth/course
features are currently non-functional, and that's expected, not a regression to "fix" by
reflex.

---

## 1. The two repos

| Repo | Path (this machine) | GitHub | What it is |
|---|---|---|---|
| `hbs-formation` | `C:\Users\azerr\OneDrive\Bureau\hbs-formation` | `jobboat-fr/HBS` | Next.js 16 App Router site — this repo |
| `hbs-backend` | `C:\Users\azerr\OneDrive\Bureau\hbs-backend` | `jobboat-fr/hbs-backend-` | FastAPI broker on Railway — chat/WhatsApp bridge to the Hermes agent on OVH |

**`hbs-backend` has dead, uncommitted local code.** Earlier in this session a full
Supabase-backed "HBS LEARN" role/quiz/exam API (`app/roles.py`, `app/supa.py`,
`app/routers/*`, `supabase/migrations/*`, `HBS_LEARN.md`) was built directly into
`hbs-backend`, then the whole HBS LEARN project was redirected to a different database
(Nile, see §6). That code was **never committed or pushed** — it's sitting locally
uncommitted in that repo's working tree. It's harmless (not deployed anywhere) but if you
open that repo and see it, know that it's superseded, not in-progress.

---

## 2. Current functional status — what works, what's broken

### Works, verified live in production (`https://hbs-formation.fr`)
- Homepage, all `(marketing)` static pages (formations, alternance, financement,
  entreprises, à-propos, contact, réalisations, mentions-légales, confidentialité)
- Contact form (`/contact` → `POST /api/contact`) — writes to Supabase, sends real email
  via Resend from `contact@hbs-formation.fr`
- Chat widget "Hub" (`POST /api/agent`) — Together AI (Llama 3.3 70B Turbo), logs to
  Supabase, rate-limited, falls back to a local FAQ if the LLM is unreachable
- `/quiz` — a "coming soon" placeholder page, **not** the real positioning quiz
- Sanity Studio at `/studio`
- Security headers, rate limiting (see §4)

### Broken — missing database tables, not a code bug
The **new** Supabase project (see §3) only has the tables that `/api/contact` and
`/api/agent` need. Everything under the `(auth)` route group and a couple of marketing
pages query tables that were never recreated on the new project:

| Route | Missing table(s)/RPC | What the user sees |
|---|---|---|
| `/inscription`, `/connexion` | `hbs_clients` | Supabase Auth signup/login itself works (it's a Supabase built-in), but the app-level profile insert/read fails |
| `/espace-client/*` (whole authenticated portal) | `hbs_clients`, `hbs_courses`, `hbs_modules`, `hbs_lessons`, `hbs_quizzes`, `hbs_enrollments`, `hbs_lesson_progress`, `hbs_certificates`, `hbs_board_cards` | Errors / empty states throughout |
| `/certifications` | `hbs_courses` | Renders, shows zero certifications (query returns empty, doesn't throw) |
| `/alternance` search | RPC `hbs_search_alternance` | Search silently returns zero results (error is caught) |
| `CoursePlayer` quiz | RPC `hbs_get_quiz`, `hbs_grade_quiz` | Would error if reached (unreachable anyway — no courses exist) |

**This was a deliberate scope decision, not an oversight**: the user said "no need for
courses or any that now" — the site's positioning quiz is going to become an external
redirect link eventually, and the auth/course/LMS-lite portal wasn't a priority for this
pass. If/when it becomes one, the exact column shapes are all recoverable from the
frontend code itself (every `.select("col1, col2, ...")` call names its columns) — start
from the `git grep 'from("hbs_'` call sites above rather than guessing a schema.

---

## 3. Infrastructure map — accounts, projects, what's connected to what

### Vercel
- **New account**: `azerrached2-1802` (personal, not the old jobboat-fr team account).
  Project `hbs` (`prj_KetpZ43tRubt8cOFsxFlofVKJD87`), git-connected to `jobboat-fr/HBS`
  main branch — **every push to main auto-deploys**. Live at `hbs-formation.fr`.
- **⚠️ There is a second, older Vercel project also auto-deploying from the same repo.**
  Proven via `gh api repos/jobboat-fr/HBS/deployments` — a separate deployment
  environment literally named `"Production"` (no `– hbs` suffix) with entries going back
  to June 2026, well before this session. I have **no access to it** (different
  account/team) and never audited its config, its Supabase wiring, or what domain (if
  any) actually serves it. The user said they'd handle/decommission it themselves —
  **status unconfirmed**. Don't assume `hbs-formation.fr` is the only live surface for
  this codebase until that's resolved.
- Vercel CLI access this session used a token pasted in chat — **rotate it** (see §7)
  before using `vercel` CLI again; get a fresh one from the Vercel dashboard.

### Domain — `hbs-formation.fr`
- Registered/managed at **OVH**. Nameservers are still OVH's own (`ns111.ovh.net` /
  `dns111.ovh.net`) — DNS was **not** delegated to Vercel's nameservers, just individual
  records were added.
- Records added this session: apex `A` → `76.76.21.21`, `www` `A` → `76.76.21.21` (www
  redirects 308 → apex, configured Vercel-side), `resend._domainkey` `TXT` (DKIM),
  `rsend` `CNAME` → `rsend-euw1.forge.rmta.net`, `send` `CNAME` → `send.forge.rmta.net`,
  `_dmarc` `TXT` (`v=DMARC1; p=none;`).
- **Do not add an MX record at the apex.** There are 4 pre-existing MX records
  (`mx0-3.mail.ovh.net`) — real inbound email already flows through OVH Mail for this
  domain. Resend's dashboard will suggest an MX record for its inbound-email feature;
  adding it at `@` would silently break existing mail. If inbound-via-Resend is ever
  wanted, it needs a subdomain, not the apex.
- OVH API access: app key + secret + a **validated** consumer key scoped to
  `/domain/*`, `/vps/*`, `/dedicated/server/*`, `/me`, `/order/*` (read+write on
  domain/vps/dedicated, read-only on me/order). Values live wherever the user is storing
  rotated credentials now — ask for current ones, don't reuse anything from this chat.
  Endpoint: `ovh-eu`. Useful pattern: the Python `ovh` package
  (`pip install ovh`), `ovh.Client(endpoint='ovh-eu', application_key=..., ...)`.

### Supabase — **brand new project**, not the old one
- Project ref `tdabohyicldueniapsvp`, URL `https://tdabohyicldueniapsvp.supabase.co`.
  This is **not** the old "jobboat" project (ref `qxnlfyuuufqkmulpgxbn`) referenced in
  older memory/docs — that one is unrelated to this site now.
- Region: the pooler hostname is `aws-1-eu-west-3.pooler.supabase.com:6543` — note the
  **`aws-1`** shard prefix, not the more common `aws-0`. Username for the pooler is
  `postgres.tdabohyicldueniapsvp`. This took real trial-and-error to find (Supabase
  doesn't expose region via the API keys) — if you need a direct Postgres connection
  again and don't have the exact host handy, don't assume `aws-0`.
- **Supabase's Management API (`api.supabase.com`) requires a separate personal access
  token** (`sbp_...`), which is different from the project's anon/service_role keys.
  Those project keys only authenticate PostgREST (data) and Auth — they cannot run DDL.
  To run schema changes, either use the Supabase dashboard's SQL editor, or a direct
  Postgres connection (`psycopg2`/`psql` against the pooler host above with the DB
  password) like this session did.
- Auth is Supabase's built-in system (magic link / password / OAuth via
  `supabase.auth.*`) — that part works out of the box regardless of the missing
  `hbs_clients` etc. tables; it's the app-level profile linkage that's missing.

### Resend
- Sending domain `hbs-formation.fr` is **verified** (DKIM/SPF/DMARC live). `CONTACT_FROM`
  is `HBS FORMATION <contact@hbs-formation.fr>`.
- Two Resend API keys were used this session — an initial one from the user, then a
  second one from Resend's native Vercel integration after the first didn't actually
  work (root cause: Resend's shared *testing* sender `onboarding@resend.dev` can only
  send to the account owner's own inbox — that's not a domain-verification issue, it's a
  hard Resend policy, worth knowing if this ever regresses). Whichever key is currently
  in `RESEND_API_KEY` on Vercel is the live one.

### Together AI
- Chat provider for the "Hub" widget. `LLM_BASE_URL=https://api.together.xyz/v1`,
  `LLM_MODEL=meta-llama/Llama-3.3-70B-Instruct-Turbo`. Code
  (`src/lib/llm.ts`) is generic OpenAI-compatible — swapping provider/model is just an
  env var change, no code change needed.

---

## 4. What's actually deployed on Vercel — env vars (names, not values)

Production (all also mirrored to Preview except where noted):

| Name | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | new Supabase project, client-safe |
| `SUPABASE_SERVICE_ROLE_KEY` | server-only, bypasses RLS — used by `src/lib/supabase/admin.ts` (rate limiting) |
| `NEXT_PUBLIC_SITE_URL` | `https://hbs-formation.fr` (apex — see §3, canonical is apex not www) |
| `RESEND_API_KEY`, `CONTACT_FROM`, `CONTACT_NOTIFY_TO` | contact form email (`CONTACT_NOTIFY_TO` is comma-separated, code splits it — see `src/app/api/contact/route.ts`) |
| `LLM_API_KEY`, `LLM_BASE_URL`, `LLM_MODEL` | Together AI for the chat widget (also used as a secondary fallback path by `/api/alternance`'s free-text search parser) |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`, `SANITY_API_TOKEN` | Sanity CMS — **pre-existing, never touched or re-verified this session**; if `/realisations` or `/studio` misbehave, check these first |

## 5. Database — what exists, how it got there, how to change it

**No migration tooling is set up.** The two migration files in `supabase/` were applied
by hand, directly, via a Python/psycopg2 script against the pooler connection — there is
no `supabase_migrations` history table, no CLI link, no automated apply-on-deploy. If you
add `supabase/0003_*.sql`, you must also actually run it against the DB yourself (dashboard
SQL editor, or the same direct-connection approach) — nothing does it for you.

- `supabase/0001_contact_and_agent.sql` — `hbs_contact_submissions`, `hbs_agent_messages`.
  RLS: `anon` can `INSERT` only, no `SELECT` policy for anyone but `service_role`.
  **Gotcha hit while building this**: `INSERT ... RETURNING` requires `SELECT`-RLS on the
  inserted row, so a policy that's insert-only will reject a `RETURNING` insert even
  though a plain insert succeeds. Supabase-js's `.insert(x)` (no `.select()` chained)
  doesn't request `RETURNING` by default, so the app code works — but if anyone adds
  `.select()` after `.insert()` on either table, it'll break with a confusing "violates
  row-level security policy" error that has nothing to do with the actual INSERT logic.
- `supabase/0002_rate_limits.sql` — `hbs_rate_limits` + `hbs_rate_limit_hit(key,
  window_seconds, limit)`, an atomic upsert-based fixed-window counter. Also RLS-enabled
  with zero policies (deny-all for anon/authenticated) — only reachable via
  `service_role` from `src/lib/rateLimit.ts`.

---

## 6. Two big initiatives — one replanned and unblocked, one still blocked

### HBS LEARN — **replanned 2026-09-04, no longer blocked**
A large, separate initiative — NOT the same as the site's existing course tables in §2.
Rescoped from "roles/quiz/exam system" to a **training-administration and compliance
platform** for an organisme de formation: planning/calendar, émargement in/out per
demi-journée, embedded courses, administrative documents, per-role archive/vault.

**The current plan is [`hbs-backend/PLAN_V2.md`](../hbs-backend/PLAN_V2.md). Read that,
not the two superseded documents below.**

Decisions taken 2026-09-04:
- **We are the SaaS vendor, not a SaaS customer.** No Digiforma/Dendreo/Edusign. HBS
  FORMATION is **tenant #1 and design partner**; the product is sold to other OFs. This
  makes an Art. 28 RGPD DPA a hard gate before a second tenant.
- **Self-hosted Supabase on OVH + `tenant_id`, multi-tenant from row one.** **Nile is
  dropped** — still public preview, and waiting on the account blocked this for ~2
  months. Self-hosting costs managed backups/PITR, so pgBackRest plus a tested restore
  drill is a Phase 0 deliverable.
- **Qualiopi gap analysis done** — the plan covered 3 of ~22 applicable indicators. The
  référentiel changes on **1 November 2026** (décret 2026-728); build to V10.
- **6 roles**: `super_admin > admin > formateur > entreprise > auditeur > apprenant`,
  with a second axis (`can_create_users`, `data_scope`, `is_read_only`) because a pure
  level hierarchy would let a read-only `auditeur` create learners.
- **Video: open source only** — self-hosted Jitsi (JWT auth + `event_sync` webhooks),
  BigBlueButton as the eventual target on its own machine. Zoom dropped (needs a paid
  plan HBS doesn't have).

Superseded, kept only for history — do **not** resume either:
- `C:\Users\azerr\.claude\plans\wild-marinating-sparrow.md` — the Nile plan.
- The dead uncommitted Supabase v0.1 in `hbs-backend` (`app/routers/`,
  `supabase/migrations/`, `HBS_LEARN.md`) — see §1. Its role-hierarchy trigger and
  exam-scoring logic are worth reusing; nothing else is.

### OVH Hermes agent migration
The user wants to migrate the existing Hermes agent ("Minizer" — see the
`hermes-agent-ovh` memory for its full internal layout) from its current OVH server
(`137.74.133.120`) to a **new** OVH server. **Blocked**: confirmed via the OVH API
(`GET /vps` and `GET /dedicated/server` both return empty arrays) that no such server has
been ordered yet. Nothing to migrate to. The old server is untouched and still running —
don't touch it until a new one exists and is verified working.

---

## 7. Security posture — what was hardened, what's still open

Done this session (see commits `9ec089d`, `3f9221c`, `c275a00` and the diagnostic
that preceded them):
- Rate limiting on `/api/agent` (15/5min/IP), `/api/contact` (5/hr/IP), `/api/alternance`
  (30/5min/IP) — Postgres-backed, fails open (allows the request) if Supabase is
  unreachable, since a broken rate limiter shouldn't take the whole site down.
- Contact form: honeypot field (`website`, visually hidden) + minimum-fill-time check
  (<2s between render and submit is treated as a bot) — both fail silently (200 OK, does
  nothing) rather than telling the bot it was caught.
- Real `Content-Security-Policy` + `Strict-Transport-Security` in `next.config.mjs`,
  scoped differently for `/studio` (Sanity needs a much looser policy than the public
  site). `vercel.json` header block was removed to avoid two layers fighting.
- `robots.ts` explicitly allows the major AI crawlers (GPTBot, ClaudeBot, PerplexityBot,
  Google-Extended, etc.) alongside the wildcard rule.
- Next.js 14.2.35 → 16.3.4 (React 18 → 19) specifically to fix known HIGH-severity CVEs
  in Next.js core (RSC deserialization DoS, HTTP request smuggling in rewrites,
  image-optimizer DoS) — no fix existed on the 14.x line.

**Still open / needs a decision**:
- **Every credential pasted into the chat this session needs rotating** — Vercel token,
  OVH app key/secret/consumer key, the new Supabase project's anon key + service_role key
  + database password, the Together AI key, both Resend API keys. The user said they'd
  handle this — **confirm it actually happened** before trusting any credential
  referenced anywhere in this document or in the session that produced it.
- `middleware.ts` triggers a Next 16 deprecation warning (wants `proxy.ts` instead) but
  is fully functional. Not renamed — the official codemod
  (`npx @next/codemod@canary middleware-to-proxy .`) refused to run over uncommitted
  changes, and hand-renaming auth-session-refresh logic without being able to verify the
  new API against docs felt like the wrong risk to take mid-session. Revisit when there's
  time to verify it properly.
- 19 npm vulnerabilities remain (`npm audit --production`), all inside Sanity's own CLI
  toolchain (`@sanity/cli`, `@architect/*`, `decompress`, `tar`) — admin-tooling-only,
  not the public runtime bundle. Blocked from `npm audit fix --force` by the same
  `next-sanity`/Next-16 peer conflict as below.
- `next-sanity@9.12.3`'s peer dependency range (`^14.2 || ^15.0.0-0`) doesn't officially
  list Next 16 yet. A `.npmrc` (`legacy-peer-deps=true`) makes installs succeed anyway
  (both locally and on Vercel — this was a real deploy-breaking issue, fixed in commit
  `c275a00`), and Sanity Studio was manually verified working under Next 16 (loads,
  renders its real login screen). Watch for Sanity-side breakage; drop the `.npmrc`
  workaround once `next-sanity` ships an update that lists Next 16 as a supported peer.
- Auth password policy is bare-minimum (8 chars, nothing else) — deliberately not
  hardened, since the whole auth/course system doesn't have its supporting tables yet
  (§2). Worth revisiting alongside whatever rebuilds that portal.
- No CAPTCHA/bot-protection service (e.g. Turnstile) — the honeypot+timing approach was
  chosen specifically because it needs no new third-party account. Fine for now, but a
  determined bot can defeat a honeypot; upgrade if contact-form spam becomes a real
  problem.

---

## 8. Branding / design system

The old brand was teal (`#10B8AA`) + coral (`#FF6B5B`). This session replaced it with
navy blue + black + white, at the user's request, after they shared a phone photo of the
**actual** HBS FORMATION logo (arch + "HBS" monogram + script "Formation" + a
digitalisé/moderne/accessible/pour-tous icon row + tagline). No real logo files were ever
provided — everything visual (`src/components/ui/Logo.tsx`: `LogoMark`, `LogoLockup`,
`HbsBadge`; the favicon; `public/logo.png`/`.svg`) is a hand-built SVG recreation from
that photo, not a traced/exported original. If real logo files ever surface, swap them in
— the recreation was always meant as a stand-in, not a final asset.

- Brand blue: `#1D3FAE` (sampled from the real logo, this is the Tailwind `teal-*` scale
  in `tailwind.config.ts` — the key name is a holdover from the old teal brand and
  intentionally wasn't renamed to avoid touching 40+ files' class names for a cosmetic
  reason; the *values* are the real brand color now).
- Real contact info now in `src/lib/site.ts`: phone `+33 2 32 08 11 07`, address in
  Rouen. These were placeholders before this session.

## 9. Chat assistant "Hub" — how it actually works

`src/lib/llm.ts` (`aiAnswer`) → Together AI, OpenAI-compatible Chat Completions. Falls
back to `src/lib/assistant.ts` (`localAnswer`, keyword-matched FAQ) if `LLM_API_KEY` is
unset or the call fails/times out (28s). `src/lib/guard.ts` runs before either path:
blocks secret-seeking prompts (`isSecretSeeking`) and redacts any secret-shaped string
from the *output* (`redactSecrets`) as a backstop independent of model behavior. The
system prompt (`src/lib/llm.ts`) was rewritten this session to sound like an actual
advisor (2–5 sentences, answers the question first, no "Bonne question!" filler) rather
than a terse FAQ bot — if response quality drifts, that prompt is the place to look, not
the model choice. `AGENT_ENDPOINT_URL`/`AGENT_TOKEN` (in `/api/agent/route.ts`) is a
*separate*, currently-unset escape hatch to proxy to an external agent (e.g. the OVH
Hermes agent) instead of using the LLM/local-FAQ path — not wired to anything right now.

---

## 10. Operational notes — how to actually do things here

- **Deploy = `git push origin main`.** The `hbs` Vercel project is git-connected; every
  push auto-deploys. Do **not** use `vercel deploy --prod` directly — this project's own
  history (and this session) confirms it doesn't reliably alias to production the same
  way. `vercel env add/rm/ls` is fine and was used extensively this session for env vars.
- **Vercel CLI env var gotcha**: `vercel env add NAME production preview` (multiple
  targets in one call) silently corrupts values — a value meant for one var landed in a
  completely different one during this session. Always set one target per command:
  `vercel env add NAME production`, then `vercel env add NAME preview` separately.
- **Vercel CLI env var gotcha #2**: for `NEXT_PUBLIC_*` variables specifically, plain
  `env add` piped via stdin sometimes hangs waiting on an interactive prompt about
  Config-vs-Secret type. Use the explicit non-interactive form:
  `vercel env add NAME production --type config --value "..." --yes`.
- **`vercel env ls`'s table view lies about Config-type values** — it shows some opaque
  internal token (looks like `eyJ2Ijoi...`), not the real value. Don't panic and assume
  corruption; `vercel env pull` decrypts and shows the true value for Config-type vars
  (Secret-type vars can't be pulled/read back at all, by design).
- **Any dependency/build change needs a truly clean-install test before pushing**,
  not just a local build. This session's Next 16 upgrade built fine locally (warm
  `node_modules`, forced peer-dep flags baked in) and then **failed on Vercel**, because
  Vercel always does a from-scratch `npm install` that re-validates peer deps. The fix
  (`.npmrc`) was only trusted after `rm -rf node_modules package-lock.json && npm
  install` reproduced success locally too. Don't trust "it built" without that.
- Windows/OneDrive quirk: a stale `.next/` directory from a previous dev-server run can
  make `next build` fail with `EINVAL: invalid argument, readlink ...`. Fix: `rm -rf
  .next` and rebuild.

---

## 11. Everything untouched / out of scope this session

- Sanity CMS content, schema, and env vars — not reviewed or verified working post-migration.
- Google/Apple OAuth (`src/components/auth/OAuthButtons.tsx`) — exists in code, provider
  config in Supabase never checked.
- The old OVH server (`137.74.133.120`) running the live Hermes agent — untouched.
- The `AGENTS.md` / `CLAUDE.md` files at the repo root are **auto-generated by `next
  dev`/`next build` itself** (Next 16's own convention for briefing AI coding agents on
  version-specific breaking changes) — not something this session wrote by hand, and
  they'll regenerate/update on their own. Don't treat them as this project's own docs.
