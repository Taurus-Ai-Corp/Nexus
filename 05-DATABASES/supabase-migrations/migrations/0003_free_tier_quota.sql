-- 0003_free_tier_quota.sql
--
-- Adds the free tier: a generation that consumes an allowance but earns nothing.
--
-- 0002 assumed one question answered both: `billable` decided whether a job
-- decremented credits AND whether it was revenue. The free tier splits them.
-- A FREE job spends one of two monthly generations and produces no revenue, so
-- gating the decrement on `billable` left free users with an uncapped tier that
-- only looked capped.
--
--   billable / billed_credits -> did this EARN money?
--   quota_credits             -> did this USE UP what the tenant was given?

alter table generation_jobs
  add column if not exists quota_credits integer not null default 0
    check (quota_credits >= 0);

comment on column generation_jobs.quota_credits is
  'Allowance consumed. Equals billed_credits for a paying tenant; non-zero with '
  'billed_credits = 0 for a free one. Refunds are computed from this, so a failed '
  'free generation returns the attempt rather than silently costing it.';

-- 'free' joins the payer enum. The existing check constraint is replaced rather
-- than dropped-and-forgotten: an unconstrained payer column would let any string
-- through and the enum is what makes the margin view trustworthy.
alter table generation_jobs drop constraint if exists generation_jobs_payer_check;
alter table generation_jobs
  add constraint generation_jobs_payer_check
    check (payer in ('managed', 'byok', 'internal', 'free'));

-- Revenue still may not attach to a non-billable job. 0002 enforced this and it
-- matters MORE now: quota_credits gives free work a non-zero number, and without
-- this a mistake could quietly book free generations as income.
-- (Recreated only if absent, so re-running is safe.)
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'billed_only_when_billable'
  ) then
    alter table generation_jobs
      add constraint billed_only_when_billable check (billable or billed_credits = 0);
  end if;
end $$;

-- A free job must consume quota. Without this, a FREE row with quota_credits = 0
-- is an uncapped free generation — the exact failure this migration exists to
-- close — and nothing else in the schema would object to it.
alter table generation_jobs drop constraint if exists free_must_consume_quota;
alter table generation_jobs
  add constraint free_must_consume_quota
    check (payer <> 'free' or quota_credits > 0 or status = 'failed');

-- The free tier's monthly reset needs no scheduled job. Grants carry the
-- idempotency key 'free:<email>:<YYYY-MM>' and credit_ledger.idempotency_key is
-- already UNIQUE (0001), so the same email can be granted at most once per month
-- and a new month is simply a key never seen before. Nothing to schedule means
-- nothing that can silently stop running and hand out unlimited free access.
--
-- This index makes "how much has the free tier cost us" answerable, which the
-- generation_margin view cannot express: it groups by workflow and payer and
-- reads billed_credits, so free work correctly shows zero revenue and is
-- otherwise invisible.
create index if not exists generation_jobs_free_tier_idx
  on generation_jobs (payer, created_at desc)
  where payer = 'free';
