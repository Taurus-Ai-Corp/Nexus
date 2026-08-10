-- 0002_generation_jobs.sql
--
-- Extends the credit schema from 0001 with per-job cost attribution.
--
-- WHY THIS EXISTS: 0001's `credit_ledger` records `delta` (credits moved) but
-- never what the provider charged us. Credits alone cannot produce a margin
-- figure, and the cost is unrecoverable after the fact — the provider invoice
-- arrives aggregated. So every generation records BOTH sides here.
--
-- Depends on: 0001_credits.sql (credits.customer_key)

create table if not exists generation_jobs (
  job_id         uuid        primary key,
  tenant_id      text        not null,
  provider       text        not null,
  workflow       text        not null,

  -- 'managed' | 'byok' | 'internal' — mirrors services.tenancy.TenantMode
  payer          text        not null check (payer in ('managed', 'byok', 'internal')),
  billable       boolean     not null,

  status         text        not null default 'pending'
                             check (status in ('pending', 'succeeded', 'failed')),

  -- What WE paid the provider. Recorded for every mode, including byok and
  -- internal, so cost is always attributable even when nobody is billed.
  cost_cents     integer     not null default 0 check (cost_cents >= 0),

  -- What the CLIENT paid us, in credits. Zero unless billable.
  billed_credits integer     not null default 0 check (billed_credits >= 0),

  -- Set only for internal work, e.g. 'nexus-social', 'client-delivery'.
  cost_centre    text,

  error          text,
  created_at     timestamptz not null default now(),
  closed_at      timestamptz,

  -- A non-billable job must never carry a charge.
  constraint billed_only_when_billable
    check (billable or billed_credits = 0)
);

create index if not exists generation_jobs_tenant_idx
  on generation_jobs (tenant_id, created_at desc);

create index if not exists generation_jobs_costcentre_idx
  on generation_jobs (cost_centre, created_at desc)
  where cost_centre is not null;

-- Margin per workflow. Revenue counts succeeded jobs only; cost counts every
-- job, because a failed generation still bills us.
create or replace view generation_margin as
select
  workflow,
  payer,
  count(*)                                                     as jobs,
  sum(cost_cents)                                              as cost_cents,
  sum(case when status = 'succeeded' then billed_credits else 0 end)
                                                               as billed_credits
from generation_jobs
group by workflow, payer;
