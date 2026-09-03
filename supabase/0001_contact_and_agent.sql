-- HBS FORMATION — nouvelle base Supabase (projet "HBS", ref tdabohyicldueniapsvp)
-- Portée volontairement réduite : uniquement ce qui débloque le formulaire de contact
-- et le chat "Hub" en production. Catalogue de formations / espace client / quiz : pas
-- migrés maintenant (le quiz deviendra un lien de redirection externe plus tard).

create extension if not exists pgcrypto;

create table if not exists hbs_contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  company text,
  formation text,
  financement text,
  message text not null,
  ip_address text,
  created_at timestamptz not null default now()
);

create table if not exists hbs_agent_messages (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  role text not null check (role in ('user', 'agent')),
  content text not null,
  page text,
  handled boolean,
  created_at timestamptz not null default now()
);

create index if not exists hbs_agent_messages_session_idx on hbs_agent_messages (session_id, created_at);

alter table hbs_contact_submissions enable row level security;
alter table hbs_agent_messages enable row level security;

-- Le site écrit avec la clé anon (visiteur non authentifié) via les routes serveur
-- /api/contact et /api/agent — insertion publique, aucune lecture publique (les deux
-- tables ne sont lisibles que par service_role, qui contourne la RLS de toute façon).
create policy hbs_contact_submissions_public_insert on hbs_contact_submissions
  for insert to anon with check (true);

create policy hbs_agent_messages_public_insert on hbs_agent_messages
  for insert to anon with check (true);
