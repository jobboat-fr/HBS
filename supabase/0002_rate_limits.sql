-- Rate limiting store for /api/agent, /api/contact, /api/alternance.
-- Accessed only via service_role (bypasses RLS) from the server routes — never exposed
-- to anon/authenticated, so no policies are defined (RLS enabled = default deny for them).

create table if not exists hbs_rate_limits (
  bucket_key text primary key,
  count integer not null default 1,
  window_start timestamptz not null default now()
);

alter table hbs_rate_limits enable row level security;

-- Incrémente atomiquement le compteur de la fenêtre courante (ou la réinitialise si elle
-- est expirée) et renvoie true si la requête reste sous la limite. L'atomicité vient de
-- l'UPSERT sur la clé primaire — pas de race condition sous charge concurrente.
create or replace function hbs_rate_limit_hit(p_key text, p_window_seconds int, p_limit int)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int;
begin
  insert into hbs_rate_limits (bucket_key, count, window_start)
  values (p_key, 1, now())
  on conflict (bucket_key) do update
    set count = case
          when hbs_rate_limits.window_start < now() - (p_window_seconds || ' seconds')::interval
            then 1
          else hbs_rate_limits.count + 1
        end,
        window_start = case
          when hbs_rate_limits.window_start < now() - (p_window_seconds || ' seconds')::interval
            then now()
          else hbs_rate_limits.window_start
        end
  returning count into v_count;
  return v_count <= p_limit;
end;
$$;
