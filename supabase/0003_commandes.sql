-- Vitrine — 0003 — les commandes en ligne de la Formation IA 360 et l'échéancier des particuliers.
--
-- Écrites uniquement par le serveur (clé service_role, qui contourne la RLS) : webhook Stripe,
-- tâche quotidienne des échéances, lien de rétractation. La RLS est activée sans aucune
-- politique : la clé publique du site ne lit ni n'écrit rien ici.
--
-- Stripe reste la source de vérité du paiement ; ces tables sont ce que l'organisme exploite
-- (qui a commandé quoi, ce qui reste à prélever, qui s'est rétracté) et ce que la tâche des
-- échéances lit. `stripe_session_id` unique rend le webhook idempotent : Stripe peut livrer
-- deux fois le même événement.

create table if not exists hbs_commandes (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  profil             text not null check (profil in ('entreprise', 'particulier')),
  statut             text not null default 'en_attente'
                     check (statut in ('en_attente', 'payee', 'carte_enregistree', 'retractee',
                                       'soldee', 'impayee', 'annulee', 'remboursee')),
  produit            text not null default 'IA360',
  session_code       text not null,
  quantite           int  not null check (quantite between 1 and 12),
  montant_total      int  not null check (montant_total >= 0),          -- centimes
  devise             text not null default 'eur',
  email              text,
  nom                text,
  raison_sociale     text,
  telephone          text,
  stripe_account     text,                                               -- compte connecté, si Connect
  stripe_session_id  text unique,
  stripe_customer_id text,
  stripe_payment_method_id text,
  stripe_payment_intent_id  text,
  stripe_invoice_id  text,
  retractation_fin   timestamptz,
  retractee_le       timestamptz,
  learn_positionnement text,                                             -- lien du test, s'il a été créé
  cgv_version        text not null,
  cgv_acceptees_le   timestamptz not null,
  meta               jsonb not null default '{}'::jsonb
);

create index if not exists hbs_commandes_statut_idx on hbs_commandes (statut, created_at desc);
create index if not exists hbs_commandes_email_idx  on hbs_commandes (lower(email));

create table if not exists hbs_echeances (
  id             uuid primary key default gen_random_uuid(),
  commande_id    uuid not null references hbs_commandes(id) on delete cascade,
  rang           int  not null check (rang between 1 and 3),
  montant        int  not null check (montant > 0),                     -- centimes
  due_le         timestamptz not null,
  statut         text not null default 'a_prelever'
                 check (statut in ('a_prelever', 'rappel_envoye', 'payee', 'echec', 'annulee')),
  tentatives     int  not null default 0,
  rappel_le      timestamptz,
  payee_le       timestamptz,
  stripe_payment_intent_id text,
  derniere_erreur text,
  unique (commande_id, rang)
);

create index if not exists hbs_echeances_dues_idx on hbs_echeances (statut, due_le);

alter table hbs_commandes enable row level security;
alter table hbs_echeances enable row level security;
revoke all on hbs_commandes, hbs_echeances from anon, authenticated;
