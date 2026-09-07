-- ============================================================================
-- Nova Website — Genesis Program (V2 wallet phase)
-- Migration 0004: wallet identity fields + genesis_wallet_nonces (Phase 2-B1)
--
-- Scope (Phase 2-B1 = nonce infrastructure only; NOT full wallet auth):
--   - genesis_profiles: add wallet identity fields (nullable) + make email
--     optional so a wallet-first Genesis registration is possible later.
--   - genesis_wallet_nonces: server-issued single-use signing nonces.
--   - genesis_wallet_issue_nonce(): SECURITY DEFINER RPC (issue only; NO
--     consume, NO profile creation, NO points).
--
-- Explicitly NOT in this phase (per owner freeze):
--   - no SIWE / signature verification / consume / session / cookie
--   - no wallet registration / no Genesis profile creation / no points changes
--   - no Nova chain id definition; `chain_id` below is ONLY the EVM
--     authentication signing context (metadata), never a Nova network id.
--
-- Identity model:
--   wallet_address  = primary identity  (canonical lowercase 0x… EVM address)
--   signature       = proof of wallet control  (Phase 2-B2)
--   chain_id        = authentication signing context (NOT part of identity key)
--   email           = optional recovery mechanism in future (nullable now)
--
-- Existing email flow (genesis_register(p_email) → REGISTER +20) is untouched;
-- email columns are only relaxed to nullable.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1) genesis_profiles — wallet identity fields (all nullable, backward compat)
-- ---------------------------------------------------------------------------
alter table public.genesis_profiles
  add column if not exists wallet_address    text        null,
  add column if not exists wallet_chain_id   bigint      null,
  add column if not exists wallet_verified_at timestamptz null;

-- Wallet-first registration must not require an email. Existing email rows are
-- unchanged; genesis_register(p_email) still supplies both columns.
alter table public.genesis_profiles alter column email drop not null;
alter table public.genesis_profiles alter column email_normalized drop not null;

-- Defensive format/positivity constraints (idempotent named adds)
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'genesis_profiles_wallet_address_format'
  ) then
    alter table public.genesis_profiles add constraint genesis_profiles_wallet_address_format check (
      wallet_address is null or wallet_address ~ '^0x[0-9a-f]{40}$'
    );
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'genesis_profiles_wallet_chain_id_positive'
  ) then
    alter table public.genesis_profiles add constraint genesis_profiles_wallet_chain_id_positive check (
      wallet_chain_id is null or wallet_chain_id > 0
    );
  end if;
end $$;

-- One wallet ↔ at most one Genesis Profile (NULL allowed for email-only rows).
create unique index if not exists genesis_profiles_wallet_address_unique
  on public.genesis_profiles (wallet_address)
  where wallet_address is not null;

-- ---------------------------------------------------------------------------
-- 2) genesis_wallet_nonces — server-issued, single-use signing nonces
-- ---------------------------------------------------------------------------
create table if not exists public.genesis_wallet_nonces (
  id            uuid        primary key default extensions.gen_random_uuid(),
  wallet_address text       not null,
  nonce         text        not null unique,          -- CSPRNG hex, ≥128-bit
  domain        text        not null,                 -- server-controlled
  chain_id      bigint      not null,                 -- signing context (>0)
  issued_at     timestamptz not null default now(),
  expires_at    timestamptz not null,                 -- short TTL (API default 300s)
  consumed_at   timestamptz null,                     -- set only in Phase 2-B2

  constraint genesis_wallet_nonces_wallet_address_format check (
    wallet_address ~ '^0x[0-9a-f]{40}$'
  ),
  constraint genesis_wallet_nonces_chain_id_positive check (chain_id > 0),
  -- Column-vs-column only; no volatile now() inside CHECK (time validity is
  -- enforced in the RPC/API layer, not here).
  constraint genesis_wallet_nonces_expires_after_issued check (expires_at > issued_at)
);

create index if not exists genesis_wallet_nonces_wallet_issued_idx
  on public.genesis_wallet_nonces (wallet_address, issued_at desc);

create index if not exists genesis_wallet_nonces_expires_idx
  on public.genesis_wallet_nonces (expires_at);

-- RLS on; NO anon/authenticated policies → client can never read/write nonces
-- directly. Only the SECURITY DEFINER RPC (owner) touches this table.
alter table public.genesis_wallet_nonces enable row level security;

-- ---------------------------------------------------------------------------
-- 3) genesis_wallet_issue_nonce() — issue only (Phase 2-B1)
-- ---------------------------------------------------------------------------
create or replace function public.genesis_wallet_issue_nonce(
  p_wallet_address text,
  p_chain_id       bigint,
  p_domain         text,
  p_ttl_seconds    integer default 300
)
returns table (status text, nonce text, issued_at timestamptz, expires_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_wallet  text;
  v_nonce   text;
  v_issued  timestamptz;
  v_expires timestamptz;
begin
  v_wallet := lower(btrim(p_wallet_address));

  if v_wallet !~ '^0x[0-9a-f]{40}$' then
    raise exception 'invalid_wallet_address' using errcode = '22000';
  end if;

  if p_chain_id is null or p_chain_id <= 0 then
    raise exception 'invalid_chain_id' using errcode = '22000';
  end if;

  if p_domain is null or btrim(p_domain) = '' then
    raise exception 'invalid_domain' using errcode = '22000';
  end if;

  if p_ttl_seconds is null or p_ttl_seconds <= 0 or p_ttl_seconds > 3600 then
    raise exception 'invalid_ttl' using errcode = '22000';
  end if;

  -- CSPRNG nonce (256-bit → 64 hex chars). Explicitly schema-qualified to
  -- avoid the search_path=public resolution issue (see 0002 hotfix history).
  v_nonce := encode(extensions.gen_random_bytes(32), 'hex');

  insert into public.genesis_wallet_nonces
    (wallet_address, nonce, domain, chain_id, expires_at)
  values
    (v_wallet, v_nonce, btrim(p_domain), p_chain_id, now() + make_interval(secs => p_ttl_seconds))
  returning issued_at, expires_at into v_issued, v_expires;

  return query select 'ok'::text, v_nonce::text, v_issued, v_expires;
end;
$$;

-- Only the server (service_role) may issue nonces; anon/authenticated denied.
revoke execute on function public.genesis_wallet_issue_nonce(text, bigint, text, integer) from public, anon, authenticated;
grant execute on function public.genesis_wallet_issue_nonce(text, bigint, text, integer) to service_role;

-- ============================================================================
-- Rollback (design note — explicit reviewed migration only):
--   drop function public.genesis_wallet_issue_nonce(text, bigint, text, integer);
--   drop table public.genesis_wallet_nonces;
--   drop index if exists public.genesis_profiles_wallet_address_unique;
--   alter table public.genesis_profiles drop constraint if exists genesis_profiles_wallet_address_format;
--   alter table public.genesis_profiles drop constraint if exists genesis_profiles_wallet_chain_id_positive;
--   alter table public.genesis_profiles drop column if exists wallet_verified_at;
--   alter table public.genesis_profiles drop column if exists wallet_chain_id;
--   alter table public.genesis_profiles drop column if exists wallet_address;
--   (email NOT NULL is intentionally NOT restored here — email stays optional.)
-- ============================================================================
