-- ============================================================================
-- Nova Website — Genesis Program (V1.3)
-- Migration 0002: genesis_profiles + genesis_points_events
--
-- Approved schema (Owner review, 2026-09-06). Minimal data. Independent from
-- early_access_applications (Early Access is FROZEN and untouched).
--
-- NOT a token program:
--   Genesis Points are participation points only. They do not represent,
--   guarantee, or promise any future token allocation.
--   This phase enables ONLY the REGISTER event (+20 points).
--   Minimal data only — no secrets, no wallet storage, no identity documents,
--   no referral codes, no other PII.
--
-- Accounting invariant:
--   genesis_points_events is the FACT/audit source.
--   genesis_profiles.points_balance is a performance cache.
--   Every points change must: 1) insert a points event, 2) atomically update
--   points_balance, 3) both in the same transaction, 4) roll back on failure.
--   A REGISTER profile must satisfy: points_balance == SUM(events.points)
--   (== 20 for the single REGISTER event).
--
-- RLS: enabled on both tables, NO anon policies (browser cannot write).
--      Write path is server-only (service role / security-definer function).
-- ============================================================================

create table if not exists public.genesis_profiles (
  id               uuid        primary key default gen_random_uuid(),
  email            text        not null,
  email_normalized text        not null unique,
  nova_id          text        not null unique,
  points_balance   integer     not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),

  constraint genesis_profiles_points_not_negative check (points_balance >= 0),
  constraint genesis_profiles_email_normalized_not_empty check (length(email_normalized) > 0),
  constraint genesis_profiles_nova_id_format check (
    nova_id ~ '^NV-GEN-[0-9]{6}$'
  )
);

create table if not exists public.genesis_points_events (
  id         uuid        primary key default gen_random_uuid(),
  profile_id uuid        not null references public.genesis_profiles (id) on delete cascade,
  event_type text        not null,
  points     integer     not null,
  created_at timestamptz not null default now(),

  -- Phase 1 allows only REGISTER
  constraint genesis_events_type_allowed check (
    event_type in ('REGISTER')
  ),
  constraint genesis_events_points_positive check (points > 0)
);

-- One REGISTER reward per profile (prevents duplicate registration points).
create unique index if not exists genesis_events_one_register
  on public.genesis_points_events (profile_id)
  where event_type = 'REGISTER';

create index if not exists genesis_events_profile_created_idx
  on public.genesis_points_events (profile_id, created_at);

-- ============================================================================
-- Row Level Security (deny anon everything)
-- ============================================================================
alter table public.genesis_profiles enable row level security;
alter table public.genesis_points_events enable row level security;

-- ============================================================================
-- Atomic registration (REGISTER +20)
--   - normalize email (trim + lowercase)
--   - email_normalized UNIQUE is the duplicate authority
--   - nova_id NV-GEN-###### generated server-side (secure random), UNIQUE fallback
--   - profile insert + event insert + points_balance update all in one transaction
--   - duplicate email never earns a second +20
--   - any failure rolls back the whole registration
-- ============================================================================
create or replace function public.genesis_register(p_email text)
returns table (status text, nova_id text, points_balance integer)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text;
  v_id    uuid;
  v_nova  text;
  v_bytes bytea;
  v_try   int;
begin
  v_email := lower(trim(p_email));
  if v_email = '' then
    raise exception 'invalid_email' using errcode = '22000';
  end if;

  -- Duplicate authority: UNIQUE(email_normalized)
  if exists (select 1 from public.genesis_profiles where email_normalized = v_email) then
    return query select 'duplicate'::text, null::text, 0::integer;
    return;
  end if;

  -- nova_id generation with collision retry; UNIQUE(nova_id) is the final guard.
  -- Numeric part is derived from CSPRNG bytes (gen_random_bytes), not random().
  v_nova := null;
  for v_try in 1..5 loop
    begin
      v_bytes := extensions.gen_random_bytes(3);
      v_nova := 'NV-GEN-' || lpad(
        ((get_byte(v_bytes, 0) * 65536 + get_byte(v_bytes, 1) * 256 + get_byte(v_bytes, 2)) % 1000000)::text,
        6,
        '0'
      );
      insert into public.genesis_profiles (email, email_normalized, nova_id, points_balance)
      values (v_email, v_email, v_nova, 0)
      returning id into v_id;
      exit;
    exception when unique_violation then
      -- Email conflict surfaced here too (recheck) → duplicate, never second reward
      if exists (select 1 from public.genesis_profiles where email_normalized = v_email) then
        return query select 'duplicate'::text, null::text, 0::integer;
        return;
      end if;
      v_nova := null; -- nova_id collision → retry
    end;
  end loop;

  if v_nova is null then
    raise exception 'nova_id_generation_failed' using errcode = '22000';
  end if;

  -- Fact/audit event + balance cache in the SAME transaction
  insert into public.genesis_points_events (profile_id, event_type, points)
  values (v_id, 'REGISTER', 20);

  update public.genesis_profiles
     set points_balance = 20,
         updated_at = now()
   where id = v_id;

  return query select 'registered'::text, v_nova::text, 20::integer;
end;
$$;

-- Only the server (service role) may invoke the RPC; anon/authenticated denied.
revoke execute on function public.genesis_register(text) from public, anon, authenticated;
grant execute on function public.genesis_register(text) to service_role;

-- ============================================================================
-- Accounting verification (run in Supabase SQL after applying; expect 0 rows):
--   select g.email_normalized, g.points_balance, coalesce(sum(e.points),0) as sum_events
--   from genesis_profiles g
--   left join genesis_points_events e on e.profile_id = g.id
--   group by g.id
--   having g.points_balance <> coalesce(sum(e.points), 0)
--      or count(e.id) <> 1
--      or min(e.event_type) <> 'REGISTER'
--      or min(e.points) <> 20;
--
-- Rollback (design note — explicit reviewed migration only):
--   drop function public.genesis_register(text);
--   drop table public.genesis_points_events;
--   drop table public.genesis_profiles;
-- ============================================================================
