-- 0001_credits.sql
--
-- Credit balances and the append-only movement log.
-- Schema as specified in docs/superpowers/plans/2026-07-28-supabase-credit-metering.md.

create table if not exists credits (
  customer_key       text primary key,
  stripe_customer_id text,
  balance            integer not null default 0 check (balance >= 0),
  plan               text,
  updated_at         timestamptz not null default now()
);

create table if not exists credit_ledger (
  id              bigserial   primary key,
  customer_key    text        not null,
  delta           integer     not null,
  reason          text        not null,
  idempotency_key text        unique,
  created_at      timestamptz not null default now()
);

create index if not exists credit_ledger_customer_idx
  on credit_ledger (customer_key, created_at desc);

-- `check (balance >= 0)` is a second line of defence: even if application logic
-- is bypassed, the database refuses to go negative.
