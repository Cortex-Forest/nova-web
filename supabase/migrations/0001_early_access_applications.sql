-- ============================================================================
-- Nova Website V1.1 — Early Access registration storage
-- Migration 0001: early_access_applications
--
-- Purpose:
--   Persist Early Access "ecosystem participation registration" submissions.
--   This is NOT a token sale / ICO / presale / investment system.
--
-- Privacy:
--   Minimal fields only (email, optional country, participation types).
--   No wallet / payment / identity / precise-location data.
--
-- RLS:
--   Row Level Security is ENABLED and NO policies are created for `anon`,
--   so anonymous (browser) roles get DENY on SELECT / INSERT / UPDATE / DELETE.
--   All writes happen server-side via the service role (bypasses RLS).
--
-- Duplicate protection:
--   UNIQUE(email_normalized) is the authoritative duplicate guard.
--   Normalization: trim(lower(email)) — computed application-side.
-- ============================================================================

create table if not exists public.early_access_applications (
  id                  uuid        primary key default gen_random_uuid(),
  email               text        not null,
  email_normalized    text        not null unique,
  country             text        null,
  participation_types text[]      not null default '{}',
  status              text        not null default 'pending',
  source              text        not null default 'website',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),

  -- participation_types whitelist (keep `node`; do not rename)
  constraint early_access_participation_types_allowed check (
    participation_types <@ array['creator','node','developer','community']::text[]
  ),
  -- status whitelist; website flow only ever writes 'pending'
  constraint early_access_status_allowed check (
    status in ('pending', 'approved', 'rejected', 'invited')
  ),
  -- basic sanity: normalized email must be non-empty
  constraint early_access_email_normalized_not_empty check (
    length(email_normalized) > 0
  )
);

-- Helpful index for admin/ops queries (creation time, newest first).
create index if not exists early_access_applications_created_at_idx
  on public.early_access_applications (created_at desc);

-- ============================================================================
-- Row Level Security
--   Enable RLS and deliberately create NO anon policies:
--   anon SELECT / INSERT / UPDATE / DELETE are all DENIED.
--   Writes flow only through the Next.js server route using the service role.
-- ============================================================================
alter table public.early_access_applications enable row level security;

-- Rollback (design note — not executed automatically):
--   drop table public.early_access_applications;
--   (Runs only as an explicit, reviewed migration; never run ad-hoc on prod.)
