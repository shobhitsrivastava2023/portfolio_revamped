-- Proof of Work (PoW) hot storage for Neon Postgres
-- Keep only last 4 days via cron hitting /api/pow/retention

create extension if not exists pgcrypto;

create table if not exists public.pow_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  occurred_at timestamptz not null,
  source text not null,
  repo text not null,
  event_type text not null,
  url text not null,
  dedupe_key text not null unique,
  meta jsonb
);

create index if not exists pow_events_occurred_at_idx
  on public.pow_events (occurred_at desc);

create index if not exists pow_events_repo_idx
  on public.pow_events (repo);

