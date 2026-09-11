# PRD — Payments Phase 1: move credits into a real ledger

**Status:** proposed, not started · **Written** 2026-09-11 by Claude Opus 5
**Decision taken:** *ledger first, rail later* (owner, 2026-09-11)
**Supersedes nothing.** Complements `taurus-payment-substrate` Rev F page 09 (PRD),
which this scopes down to the one phase that is correct under every rail outcome.

---

## Why this phase, and why before choosing a rail

The owner's goal, stated 2026-09-11:

> build what will be novel and easy for clients to access any model modality with
> payments in any geographic location

Rail choice was deferred because it is **only high-stakes while credits live inside the
payment provider.** Today they do. That is the coupling, and it is also a live bug.

### What is actually true today (verified 2026-09-11, not assumed)

| Fact | Evidence |
|---|---|
| Credits are stored in **Stripe Customer metadata** | `platform/api/webhook.js:47-65` writes `metadata.credits_remaining`; `platform/api/stripe.js:150` reads it back |
| That write is **read-then-write with no compare-and-swap** | `webhook.js:49-59` — retrieve, `parseInt`, add, update |
| A failed credit grant is **swallowed and still returns 200** | `webhook.js:62-64` catches, logs, returns; Stripe therefore never retries |
| `platform/` has **no database at all** | zero `SUPABASE*` references under `platform/`; runtime deps are exactly `stripe`, `nodemailer` |
| A correct ledger **exists and is unwired** | `backend/services/ledger_supabase.py` — atomic `UPDATE … WHERE balance >= :n`, idempotency key, refund-on-failure |
| Its only callers are **its own tests** | no import from `main.py`, `backend/api/platform_core.py`, or any of the 7 specialized agents |
| The tables **already exist** | `05-DATABASES/supabase-migrations/migrations/0001_credits.sql`, `0002_generation_jobs.sql` |
| `SupabaseLedger` cannot be called from the edge | `__init__(self, engine: AsyncEngine)` — requires the FastAPI process |

**Consequence:** two credit systems. A racy counter inside Stripe that is in production,
and a correct ledger that nothing calls.

### The bug, concretely

Stripe does not guarantee single delivery. Two concurrent deliveries of a credit grant:

```
t0  A: retrieve -> credits_remaining = 10
t0  B: retrieve -> credits_remaining = 10
t1  A: update   -> 20
t1  B: update   -> 20        # customer paid for 30, has 20
```

There is no idempotency key on this path. `SIGNATURE_TOLERANCE_SECONDS = 300` limits
*replay of an old signature*; it does nothing about duplicate delivery of a fresh event.

---

## Goals

- **G1** — Credit balance has exactly one home, owned by us, not by a payment provider.
- **G2** — A credit grant is idempotent by construction. Replaying an event is a no-op,
  not a second grant.
- **G3** — A credit change is atomic. Concurrent writers cannot lose an update.
- **G4** — A failed credit grant fails *loudly* so the provider retries.
- **G5** — After this phase, swapping the payment rail touches only the code that parses
  the provider's webhook — not the credit model.

## Non-goals

- Choosing a payment rail. Explicitly deferred.
- Deploying the FastAPI backend. This phase must not require it.
- PQC-signing receipts (substrate Phase 2). Separate, and gated on patent counsel.
- Wiring `generation_jobs` / metered AI usage. That is Phase 1b — this phase covers the
  *purchase* side only, so it stays small enough to verify.
- Migrating existing balances. **There are zero paying subscribers.** If that changes
  before this ships, a backfill step becomes mandatory and this line must be revisited.

---

## Design decision: the atomic operations live in Postgres, not in application code

Two runtimes need the same invariant — the JS edge (`platform/`, Cloudflare Pages
Functions / Vercel) and the Python backend (`SupabaseLedger`). Implementing
"atomically decrement unless it would go negative" twice, in two languages, is how the
two drift apart silently.

**So it is implemented once, as `SECURITY DEFINER` Postgres functions, and both runtimes
call it.**

This also avoids three things we do not want:

1. A new npm dependency — `platform/` calls PostgREST with plain `fetch`, exactly as
   `api/stripe.js` already calls `api.stripe.com`.
2. A 13th file under `platform/api/`. **`platform/api/` is at exactly 12 functions**
   (9 top-level + `api/campaigns/index.js`, `api/omni/brief.js`, `api/omni/ingest.js`);
   `tests/deploy-safety.test.js:55-67` counts recursively and Vercel counts nested files
   as separate functions. New code goes in `platform/lib/` (not counted).
3. A hard dependency on the FastAPI deploy.

### Migration `0003_credit_functions.sql`

```sql
-- Atomic, idempotent credit grant. Returns the new balance.
-- Idempotency is enforced by credit_ledger.idempotency_key UNIQUE (0001).
create or replace function grant_credits(
  p_customer_key    text,
  p_delta           integer,
  p_reason          text,
  p_idempotency_key text,
  p_plan            text default null,
  p_stripe_customer_id text default null
) returns integer
language plpgsql
security definer
as $$
declare
  v_balance integer;
begin
  -- credit_ledger.idempotency_key is UNIQUE but NULLABLE, and Postgres permits
  -- unlimited NULLs in a unique column. `idempotency_key = NULL` is never true, so a
  -- NULL key would silently bypass the replay check below and double-grant. Refuse it.
  if p_idempotency_key is null or p_idempotency_key = '' then
    raise exception 'idempotency_key is required' using errcode = 'P0001';
  end if;

  -- Replay is a no-op that returns the CURRENT balance, never an error and never a
  -- second grant.
  if exists (select 1 from credit_ledger where idempotency_key = p_idempotency_key) then
    select balance into v_balance from credits where customer_key = p_customer_key;
    return coalesce(v_balance, 0);
  end if;

  insert into credits (customer_key, stripe_customer_id, balance, plan)
  values (p_customer_key, p_stripe_customer_id, greatest(0, p_delta), p_plan)
  on conflict (customer_key) do update
    set balance    = greatest(0, credits.balance + p_delta),
        plan       = coalesce(p_plan, credits.plan),
        stripe_customer_id =
          coalesce(p_stripe_customer_id, credits.stripe_customer_id),
        updated_at = now()
  returning balance into v_balance;

  insert into credit_ledger (customer_key, delta, reason, idempotency_key)
  values (p_customer_key, p_delta, p_reason, p_idempotency_key);

  return v_balance;
end;
$$;

-- Atomic spend. Raises if the balance would go negative, so the caller cannot
-- accidentally treat an overspend as success.
create or replace function consume_credits(
  p_customer_key    text,
  p_amount          integer,
  p_reason          text,
  p_idempotency_key text
) returns integer
language plpgsql
security definer
as $$
declare
  v_balance integer;
begin
  if p_idempotency_key is null or p_idempotency_key = '' then
    raise exception 'idempotency_key is required' using errcode = 'P0001';
  end if;

  if exists (select 1 from credit_ledger where idempotency_key = p_idempotency_key) then
    select balance into v_balance from credits where customer_key = p_customer_key;
    return coalesce(v_balance, 0);
  end if;

  update credits
     set balance = balance - p_amount, updated_at = now()
   where customer_key = p_customer_key
     and balance >= p_amount            -- the whole point: one conditional statement
  returning balance into v_balance;

  if v_balance is null then
    raise exception 'insufficient_credits' using errcode = 'P0001';
  end if;

  insert into credit_ledger (customer_key, delta, reason, idempotency_key)
  values (p_customer_key, -p_amount, p_reason, p_idempotency_key);

  return v_balance;
end;
$$;
```

`0001_credits.sql` already carries `check (balance >= 0)` and
`credit_ledger.idempotency_key text unique` — this migration relies on both rather than
re-implementing them.

> **Verified 2026-09-11:** `0001_credits.sql:7` declares `customer_key text primary key`,
> so `on conflict (customer_key)` is valid as written. Do not "fix" it by adding a second
> unique index.

### `platform/lib/credits.mjs` (new — `lib/`, so it does not count against the cap)

Raw `fetch` against Supabase PostgREST RPC. Mirrors `lib/stripe-client.mjs`:
reads env **at call time**, not module scope, because on Cloudflare Pages `process.env`
is populated inside `onRequest` — see `platform/functions/api/[[route]].js:51` and the
docstring in `lib/stripe-client.mjs:1-32`.

```
grantCredits({ customerKey, delta, reason, idempotencyKey, plan, stripeCustomerId })
consumeCredits({ customerKey, amount, reason, idempotencyKey })
getBalance(customerKey)
```

Throws on non-2xx. **Never swallows.**

New env vars — both owner-set, and this phase is inert until they exist:
`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`.

> The service-role key bypasses RLS. It must only ever be read server-side, never
> inlined into a page, and never logged. Add it to the Pages project as an encrypted
> variable. Do not commit it. `.env` writes are hook-blocked in this repo by design.

### Changes to existing files

| File | Change |
|---|---|
| `platform/api/webhook.js` | `updateCustomerCredits()` → `grantCredits()`. Idempotency key = the **Stripe event id**. On failure, return **5xx** so Stripe retries — delete the swallow at `:62-64`. |
| `platform/api/stripe.js` | `handleBalance` reads `getBalance()` instead of `customer.metadata.credits_remaining`. |

Stripe Customer metadata becomes **advisory only** — fine to keep writing for support
visibility, but nothing may *read* it as truth again.

---

## Acceptance criteria

Each must be demonstrated failing before the fix, then passing.

- **A1 — idempotent.** Post the same webhook event twice. Exactly one `credit_ledger`
  row; balance increases once.
- **A2 — atomic.** Fire N concurrent grants of +1 against one customer. Final balance
  is exactly N and `credit_ledger` has exactly N rows. *(This is the one that fails today.)*
- **A3 — loud.** With `SUPABASE_URL` unset, the webhook returns non-2xx and does not
  report success.
- **A4 — no overspend.** `consumeCredits` beyond balance raises, writes no ledger row,
  and leaves the balance unchanged.
- **A5 — single source of truth.** No production read path resolves a balance from
  Stripe metadata. Enforce with a test that greps for `credits_remaining` in a read
  position.
- **A6 — cap intact.** `tests/deploy-safety.test.js` still passes; recursive count under
  `platform/api/` is still 12.
- **A7 — rail-portability.** The only file that must change to accept a different
  provider's webhook is `api/webhook.js`. `lib/credits.mjs` contains no provider name.
- **A8 — no NULL idempotency bypass.** Calling `grant_credits` with a NULL or empty
  idempotency key raises and writes nothing. Without this guard the UNIQUE constraint
  gives no protection, because Postgres permits unlimited NULLs in a unique column.

## Test plan

New `platform/tests/credits.test.js`. **Break each test on purpose first** — this repo
has shipped two vacuous tests that could never fail, and both were caught only by
deliberately breaking them.

A2 needs a real concurrency test against a scratch Supabase schema, not a mock. A mocked
race does not test the thing that is broken.

---

## Division of labour

| Work | Owner | Why |
|---|---|---|
| `0003_credit_functions.sql` | **Claude** | The atomicity invariant is the whole point |
| `platform/lib/credits.mjs` | **Claude** | Env-at-call-time trap; mirrors `stripe-client.mjs` |
| Rewiring `webhook.js` / `stripe.js` | **Claude** | Touches live billing behaviour |
| `credits.test.js` incl. the concurrency harness | **Claude** | Must be seen to fail first |
| Applying the migration to Supabase | **Owner** | Needs the project's service-role credentials |
| Setting `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | **Owner** | Secrets |
| Deploy | **Claude, on an explicit verb** | `cd platform && wrangler pages deploy .` — from the repo root it silently drops `functions/` and kills `/api/*` |

Gemini is not assigned here: this is a small, high-consequence change to live billing
behaviour with a subtle concurrency requirement. Phases 5 and 6 remain Gemini's.

---

## What this phase deliberately leaves open

- **Rail choice.** Deferred by decision. When it is made, note that Polar runs on
  Stripe Connect (polar.sh/legal/payment-processor-partners, updated 2026-03-25) and so
  does not satisfy a strict no-Stripe reading; Paddle uses its own acquiring.
- **Canadian GST/HST under an MoR.** TAURUS is a Canadian resident corporation, so the
  non-resident simplified regime the MoR tax argument relies on does not apply.
  **Lawyer question, not an engineering one.**
- **EU/UK/India registration.** For a Canadian entity these trigger on the *first* B2C
  sale — there is no threshold runway. This is the strongest argument for an MoR on
  self-serve, and it does not affect B2B (reverse charge).
- **Metered model usage** (`generation_jobs`, `WORKFLOW_CREDITS`) — Phase 1b.
- **PQC receipts** — substrate Phase 2, gated on ARQ Quantum patent counsel before any
  public disclosure of the method.

## Open question for the owner

Sokin's published docs describe corporates, currency accounts, beneficiaries and
instructions — **no consumer card acceptance, hosted checkout or subscription billing is
documented.** Their public docs are thin and this could not be confirmed either way.
**Ask Sokin directly whether they can acquire consumer card payments for self-serve
SaaS.** If yes, the rail options change materially. If no, Sokin is the B2B invoice rail
and a separate card rail is needed for self-serve.
