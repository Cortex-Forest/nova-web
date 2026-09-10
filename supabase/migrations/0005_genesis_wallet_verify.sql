-- ============================================================================
-- Nova Website — Genesis Program (V2 wallet phase)
-- Migration 0005: wallet verification + atomic Genesis registration (Phase 2-B2)
--
-- Scope (Phase 2-B2): AFTER the API layer has verified the EIP-4361 (SIWE)
-- signature, this SECURITY DEFINER function atomically:
--   1. locks + validates the nonce (exists / unused / unexpired / wallet /
--      domain / chain match)
--   2. consumes the nonce (single-use)
--   3. find-or-create the genesis_profiles row keyed by wallet_address
--   4. on FIRST creation: inserts REGISTER +20 event AND sets points_balance=20
--      in the SAME transaction; on existing wallet: returns profile, +0.
--
-- The unique partial index (wallet_address) and the unique REGISTER-per-profile
-- index are the final DB guards against concurrent double-registration.
--
-- NOT in this phase (per owner freeze): session/cookie, Supabase Auth, email
-- recovery, points semantics changes, YAZIMAO chain id definition.
-- Signature verification itself is intentionally performed in the API layer
-- (viem); this function never trusts a client-supplied wallet on its own.
-- ============================================================================

create or replace function public.genesis_wallet_verify(
  p_nonce    text,
  p_chain_id bigint,
  p_domain   text,
  p_wallet   text
)
returns table (
  status           text,
  nova_id          text,
  points_balance   integer,
  wallet_address   text,
  wallet_chain_id  bigint,
  wallet_verified_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_input_wallet text;
  v_nonce_wallet text;
  v_nonce_domain text;
  v_nonce_chain  bigint;
  v_consumed     timestamptz;
  v_expires      timestamptz;
  v_id           uuid;
  v_nova         text;
  v_pts          integer;
  v_verified     timestamptz;
  v_bytes        bytea;
  v_try          int;
  v_constraint   text;
begin
  v_input_wallet := lower(btrim(p_wallet));

  -- Defense-in-depth input sanity (the API layer also validates).
  if v_input_wallet !~ '^0x[0-9a-f]{40}$' then
    raise exception 'invalid_wallet' using errcode = '22000';
  end if;
  if p_chain_id is null or p_chain_id <= 0 then
    raise exception 'invalid_chain_id' using errcode = '22000';
  end if;
  if btrim(p_domain) = '' then
    raise exception 'invalid_domain' using errcode = '22000';
  end if;

  -- 1) Atomic single-use nonce check (row lock serializes concurrent requests).
  select wallet_address, domain, chain_id, consumed_at, expires_at
    into v_nonce_wallet, v_nonce_domain, v_nonce_chain, v_consumed, v_expires
    from public.genesis_wallet_nonces
   where nonce = p_nonce
   for update;

  if not found then
    raise exception 'nonce_not_found' using errcode = '22000';
  end if;
  if v_consumed is not null then
    raise exception 'nonce_used' using errcode = '22000';
  end if;
  if v_expires <= now() then
    raise exception 'nonce_expired' using errcode = '22000';
  end if;
  if v_nonce_domain <> btrim(p_domain) then
    raise exception 'domain_mismatch' using errcode = '22000';
  end if;
  if v_nonce_chain <> p_chain_id then
    raise exception 'chain_mismatch' using errcode = '22000';
  end if;
  if v_nonce_wallet <> v_input_wallet then
    raise exception 'wallet_mismatch' using errcode = '22000';
  end if;

  -- 2) Consume the nonce (single-use, atomic with the rest of this function).
  update public.genesis_wallet_nonces
     set consumed_at = now()
   where nonce = p_nonce
     and consumed_at is null;

  -- 3) Existing wallet → existing profile login, +0 (never a second REGISTER).
  select id, nova_id, points_balance, wallet_verified_at
    into v_id, v_nova, v_pts, v_verified
    from public.genesis_profiles
   where wallet_address = v_input_wallet;

  if v_id is not null then
    return query select
      'existing'::text,
      v_nova::text,
      v_pts::integer,
      v_input_wallet::text,
      p_chain_id::bigint,
      coalesce(v_verified, now());
    return;
  end if;

  -- 4) First-time wallet → create profile + REGISTER +20 (atomic).
  v_nova := null;
  for v_try in 1..10 loop
    begin
      v_bytes := extensions.gen_random_bytes(3);
      v_nova := 'NV-GEN-' || lpad(
        ((get_byte(v_bytes, 0) * 65536 + get_byte(v_bytes, 1) * 256 + get_byte(v_bytes, 2)) % 1000000)::text,
        6,
        '0'
      );
      insert into public.genesis_profiles
        (email, email_normalized, nova_id, points_balance,
         wallet_address, wallet_chain_id, wallet_verified_at)
      values
        (null, null, v_nova, 0,
         v_input_wallet, p_chain_id, now())
      returning id into v_id;
      exit;
    exception when unique_violation then
      get stacked diagnostics v_constraint = constraint_name;
      if v_constraint = 'genesis_profiles_wallet_address_unique' then
        -- A concurrent request created this wallet first → existing login (+0).
        select id, nova_id, points_balance, wallet_verified_at
          into v_id, v_nova, v_pts, v_verified
          from public.genesis_profiles
         where wallet_address = v_input_wallet;
        if v_id is not null then
          return query select
            'existing'::text, v_nova::text, v_pts::integer,
            v_input_wallet::text, p_chain_id::bigint, coalesce(v_verified, now());
          return;
        end if;
      end if;
      -- Otherwise it was a nova_id collision → retry with a fresh id.
      v_nova := null;
    end;
  end loop;

  if v_nova is null then
    raise exception 'nova_id_generation_failed' using errcode = '22000';
  end if;

  -- REGISTER event + balance cache, same transaction as the profile insert.
  insert into public.genesis_points_events (profile_id, event_type, points)
  values (v_id, 'REGISTER', 20);

  update public.genesis_profiles
     set points_balance = 20,
         updated_at = now()
   where id = v_id;

  select wallet_verified_at into v_verified
    from public.genesis_profiles
   where id = v_id;

  return query select
    'created'::text,
    v_nova::text,
    20::integer,
    v_input_wallet::text,
    p_chain_id::bigint,
    v_verified;
end;
$$;

-- Only the server (service_role) may verify; anon/authenticated denied.
revoke execute on function public.genesis_wallet_verify(text, bigint, text, text) from public, anon, authenticated;
grant execute on function public.genesis_wallet_verify(text, bigint, text, text) to service_role;

-- ============================================================================
-- Rollback (design note — explicit reviewed migration only):
--   drop function public.genesis_wallet_verify(text, bigint, text, text);
-- ============================================================================
