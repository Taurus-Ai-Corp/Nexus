# Blast Radius & Rollout Design: `backend/main.py` Auth Function Shadowing

**Date:** 2026-08-10
**Repo:** `Taurus-Ai-Corp/Nexus`
**Scope:** `01-CORE-PLATFORM/nexus-backend/backend/main.py` and `backend/auth.py`
**Status:** Design only. No code changed in this stage.

All file paths below are relative to `01-CORE-PLATFORM/nexus-backend/` unless
stated otherwise. All line numbers were confirmed by direct read/grep against
the working tree on 2026-08-10; see the verification command next to each
claim below.

---

## 1. Root cause (confirmed)

`backend/main.py` imports four names from `backend/auth.py` at **lines 24–30**:

```python
from auth import (
    create_access_token,
    hash_password,
    verify_password,
    verify_telegram_auth,
    verify_token,
)
```

It then redefines all four (except `verify_telegram_auth`, which is not
redefined and stays live from `auth.py`) at **lines 388–426**. Python name
binding means the later `def` wins at module scope — every call site in
`main.py` resolves to the local (main.py) version, and `auth.py`'s versions
are unreachable dead code from `main.py`'s perspective.

### 1.1 Confirmed differences

| Function | `auth.py` (dead) | `main.py` (live) | Verified |
|---|---|---|---|
| `create_access_token` | `auth.py:70-82`. Default expiry `ACCESS_TOKEN_EXPIRE_MINUTES = 15` (`auth.py:25`); adds `"type": "access_token"` claim (`auth.py:79`) | `main.py:388-398`. Default expiry hardcoded `timedelta(hours=24)` (`main.py:394`); no `type` claim (`main.py:396`) | Read both functions directly |
| `verify_token` | `auth.py:85-122`. Rejects `payload.get("type") != "access_token"` (`auth.py:101-107`); sets `headers={"WWW-Authenticate": "Bearer"}` on all 401s (`auth.py:96-98, 105-107, 114-116, 119-121`) | `main.py:401-416`. No type check, no `WWW-Authenticate` header on any 401 (`main.py:409-411, 414-416`) | Read both functions directly |
| `hash_password` | `auth.py:125-129`. `salt = bcrypt.gensalt()` bound to a variable, then `bcrypt.hashpw(pw, salt)` | `main.py:419-421`. `bcrypt.hashpw(pw, bcrypt.gensalt())` inline, same two calls in the same order | **Functionally equivalent.** Both call `bcrypt.gensalt()` with no arguments (default cost factor) then `bcrypt.hashpw()` on the UTF-8-encoded password. The only difference is whether the salt is bound to a name first; there is no behavioral or security difference. |
| `verify_password` | `auth.py:132-134`. `bcrypt.checkpw(pw.encode(), hashed_password.encode())` | `main.py:424-426`. `bcrypt.checkpw(pw.encode(), hashed.encode())` | **Functionally equivalent.** Identical call, only the parameter name differs (`hashed_password` vs `hashed`). No behavioral difference. |

### 1.2 Additional confirmed finding — `auth.py`'s `verify_token` has a latent crash

`auth.py:117` reads `except jwt.JWTError:`. The installed library is PyJWT
2.13.0. Verified directly:

```
$ bootvenv/bin/python -c "import jwt; print(jwt.__version__, hasattr(jwt,'JWTError'), hasattr(jwt,'PyJWTError'), hasattr(jwt,'InvalidTokenError'), hasattr(jwt,'ExpiredSignatureError'))"
2.13.0 False True True True
```

PyJWT has no `JWTError` attribute (that name is python-jose's). On a
malformed or bad-signature token, the `jwt.decode()` call at `auth.py:88-90`
raises a subclass of `jwt.PyJWTError` — NOT `jwt.ExpiredSignatureError` — so
control falls through to `except jwt.JWTError:` at `auth.py:117`, which
itself raises `AttributeError: module 'jwt' has no attribute 'JWTError'`
while Python is evaluating the except clause. FastAPI's default exception
handling turns this into an unhandled-exception **500**, not the intended
**401**. `jwt.ExpiredSignatureError` (`auth.py:111`) is a real PyJWT name, so
the expiry branch is unaffected.

**Consequence for this ticket:** simply deleting the four `main.py`
duplicates does not restore correct behavior — it activates `auth.py`'s
`verify_token`, which now 500s on every invalid/malformed/tampered token
instead of correctly 401-ing. The line must change from `jwt.JWTError` to
`jwt.PyJWTError` (or `jwt.InvalidTokenError`) as part of this fix, not left
for a separate pass.

### 1.3 Additional confirmed finding — undocumented 10th auth site

`main.py:925-944`, the `/ws` WebSocket handler, decodes JWTs directly and
bypasses `verify_token` entirely:

```python
925: @app.websocket("/ws")
926: async def websocket_endpoint(websocket: WebSocket):
...
930:     token = websocket.query_params.get("token")
...
937:     payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
938:     user_id: str = payload.get("sub")
...
942:     except jwt.PyJWTError:
```

It uses the correct exception name (`jwt.PyJWTError`, not the buggy
`jwt.JWTError`), so it does not carry finding 1.2's crash. But because it
never calls `verify_token`, it will not get the `type` claim check even
after the fix ships, unless it is explicitly routed through the shared
verifier (or reimplements the check). It must be included in blast radius
and in the rollout, not left as-is silently diverging from the 9 REST
endpoints.

---

## 2. Blast radius (exhaustive)

All line numbers below verified via `grep -n` / direct read on 2026-08-10.

### 2.1 Duplicate definitions to remove from `main.py`

| # | File:Line | What | Disposition |
|---|---|---|---|
| 1 | `main.py:388-398` | `create_access_token` duplicate (24h expiry, no `type` claim) | Delete |
| 2 | `main.py:401-416` | `verify_token` duplicate (no type check, no `WWW-Authenticate` header) | Delete |
| 3 | `main.py:419-421` | `hash_password` duplicate (equivalent to auth.py's) | Delete |
| 4 | `main.py:424-426` | `verify_password` duplicate (equivalent to auth.py's) | Delete |

### 2.2 Related duplication (not in the ticket's 4, but same shape — decide disposition)

| File:Line | What | Decision needed |
|---|---|---|
| `main.py:92` `security = HTTPBearer()` | Duplicates `auth.py:28` | Collapse — see §2.2.1 |
| `main.py:93-97` `SECRET_KEY = os.getenv(...)` + guard | Duplicates `auth.py:19-23`, byte-for-byte identical logic | Collapse — see §2.2.1 |
| `main.py:98` `ALGORITHM = "HS256"` | Duplicates `auth.py:24` | Collapse — see §2.2.1 |

**2.2.1 Recommendation: collapse onto `auth.py`'s copies.** Once
`create_access_token`/`verify_token` are imported live from `auth.py`
(finding 1), `main.py`'s local `SECRET_KEY`/`ALGORITHM`/`security` become
unused by those two functions but are still referenced directly by the
WebSocket handler (`main.py:937`, `jwt.decode(token, SECRET_KEY,
algorithms=[ALGORITHM])`) and by nothing else. Keeping two independent
`os.getenv("JWT_SECRET_KEY")` reads is not a correctness bug today (same env
var, same value, both modules import cleanly), but it is exactly the kind of
duplication that caused this ticket — two copies that can silently diverge if
one is edited and not the other. Import `SECRET_KEY` and `ALGORITHM` from
`auth` in `main.py` instead of redeclaring them, and drop `main.py:92-98`.
`security = HTTPBearer()` at `main.py:92` can be deleted outright once
`verify_token` (imported from `auth.py`) is the only consumer of the
`Depends(security)` default, since `auth.py:85` already binds its own
`security` instance as the parameter default.

### 2.3 Token-issuance call sites (produce tokens — get `type` claim + new expiry once fixed)

| # | File:Line | Route | Endpoint |
|---|---|---|---|
| 5 | `main.py:520-522` | `POST /api/auth/register` (decorator at `main.py:483`) | `register` |
| 6 | `main.py:593-596` | `POST /api/auth/login` (decorator at `main.py:533`) | `login` |
| 7 | `main.py:677-680` | `POST /api/auth/telegram` (decorator at `main.py:616`) | `telegram_auth` |

### 2.4 Token-verification call sites — 9 REST endpoints using `Depends(verify_token)`

| # | File:Line | Route |
|---|---|---|
| 8 | `main.py:700` | `GET /api/agents` (decorator `main.py:699`) |
| 9 | `main.py:724` | `POST /api/agents/{agent_name}/task` (decorator `main.py:717`) |
| 10 | `main.py:820` | `GET /api/agents/task/{task_id}` (decorator `main.py:819`) |
| 11 | `main.py:853` | `POST /api/campaigns` (decorator `main.py:850`) |
| 12 | `main.py:897` | `GET /api/campaigns` (decorator `main.py:896`) |
| 13 | `main.py:978` | `GET /api/dashboard` (decorator `main.py:977`) |
| 14 | `main.py:1044` | `POST /api/knowledge/ingest` (decorator `main.py:1041`) |
| 15 | `main.py:1073` | `POST /api/knowledge/search` (decorator `main.py:1070`) |
| 16 | `main.py:1113` | `GET /api/knowledge/status` (decorator `main.py:1112`) |

Verification: `grep -n "Depends(verify_token)" backend/main.py` returns
exactly these 9 lines — no more, no fewer.

### 2.5 Token-verification call site NOT using `verify_token` (the 10th site)

| # | File:Line | What |
|---|---|---|
| 17 | `main.py:925-944` | `@app.websocket("/ws")` — decodes token directly via `jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])` at `main.py:937`, bypassing `verify_token` and therefore the `type` claim check |

### 2.6 Adjacent artifacts affecting rollout design

| File:Line | What | Relevance |
|---|---|---|
| `auth.py:117` | `except jwt.JWTError:` | Must be fixed to `jwt.PyJWTError` (or `jwt.InvalidTokenError`) as part of this change — see §1.2 |
| `main.py:249-253` | `class Token(BaseModel)`, field `expires_at: datetime` | Client-visible — API consumers currently see `expires_at` ≈ now+24h; after the fix, ≈ now+15min (or ramped value). No schema change needed, but the value shrinks and any client that treats the token as long-lived (e.g. does not handle re-auth) will start failing sooner. |
| `main.py:507` | `"token_version": 1,  # For session invalidation on password change"` written on every new user record | Written but never read anywhere in `backend/` (confirmed via `grep -rn "token_version" backend/`) — not wired to any invalidation logic today. **Not usable for this rollout as-is**; it would need a read-side check added to `verify_token` (compare `payload` version to the stored user record's `token_version`) to do anything. Out of scope for this ticket — note only. |

**Total confirmed blast-radius sites: 17** (4 duplicate defs + 3 duplicate
config values + 3 issuance sites + 9 `Depends(verify_token)` endpoints + 1
WebSocket bypass), plus the 2 correctness bugs (`auth.py:117` JWTError,
`main.py:249-253` client-visible expiry shrink) that ride along with the fix.

---

## 3. What breaks under a naive delete

Simply deleting `main.py:388-426` (the four duplicates) and doing nothing
else:

1. **Session lifetime drops 24h → 15min (96x) for all newly issued tokens.**
   `create_access_token` now resolves to `auth.py:70-82`, whose default is
   `ACCESS_TOKEN_EXPIRE_MINUTES = 15` (`auth.py:25`) vs. the deleted
   `timedelta(hours=24)` (`main.py:394`). No caller passes `expires_delta`
   explicitly at any of the 3 issuance sites (§2.3), so all 3 silently switch
   to 15 minutes with no user-facing warning.
2. **Every already-issued token becomes invalid immediately.** Every token
   issued before the change lacks a `type` claim (the old `main.py:388-398`
   never added one). Once `verify_token` resolves to `auth.py:85-122`, its
   check at `auth.py:101-107` (`if token_type != "access_token": raise
   HTTPException(401, ...)`) rejects every pre-existing token. All 9
   endpoints in §2.4 start returning 401 for currently-logged-in users at the
   moment of deploy — a hard cutover with zero grace period.
3. **Invalid/malformed tokens 500 instead of 401.** Per §1.2, `auth.py`'s
   `except jwt.JWTError:` at `auth.py:117` raises `AttributeError` on any
   input that is not `ExpiredSignatureError`-shaped (bad signature, malformed
   header, wrong algorithm, garbage string). This is a **new regression**
   introduced by the naive delete, not a pre-existing one — today's live
   `main.py:413` catches the correct `jwt.PyJWTError` and returns a clean
   401. Un-fixed, the naive delete converts a subset of 401s into 500s.
4. **`/ws` (finding 1.3) is unaffected by the delete** (it never calls
   `verify_token`), which means after a naive delete it is the *only* auth
   path still issuing/accepting type-less semantics — a silent divergence
   from the other 9 endpoints, not a crash, but a design inconsistency that
   must be resolved explicitly rather than left to chance.

None of this is hypothetical severity-guessing — each claim traces to a
specific confirmed code difference in §1 and §2.

---

## 4. Rollout design

### 4.1 Mechanism: env-var-gated compatibility flag

Add `AUTH_ACCEPT_LEGACY_TOKENS` (boolean env var, read once at module import
in `auth.py` alongside the existing `SECRET_KEY`/`ALGORITHM` constants).

- **Default for this cutover (initial deploy):** `true`. The type-claim
  check in `verify_token` (`auth.py:101-107`) becomes conditional: if
  `payload.get("type")` is `None` **and** `AUTH_ACCEPT_LEGACY_TOKENS` is
  true, treat the token as valid (legacy path) instead of 401-ing. If
  `type` is present, it must equal `"access_token"` regardless of the flag
  (no change to that branch).
- **Safe long-term default:** `false`. Once the deprecation window has
  drained (§4.4), the env var must be flipped to `false` (or removed and the
  legacy branch deleted in a follow-up PR) so type-less tokens are rejected
  again — this is the entire point of the original security finding, and
  leaving the flag permanently `true` defeats it.
- The flag is a single boolean, not a percentage/canary — the token
  population it's easing in is fixed-size (whatever was outstanding at
  deploy time) and decays to zero on its own as those tokens expire, so a
  binary on/off is sufficient; no gradual-rollout percentage logic is
  needed.

### 4.2 Distinguishing legacy vs. new tokens, and what to log

Distinguish by presence of the `type` claim, exactly as `auth.py:101`
already does — no new field needed on the token itself. Add a log line in
`verify_token`'s legacy branch (only when the legacy path is actually taken,
not on every request) at INFO level:

```
logger.info("legacy token accepted (no type claim) for sub=%s exp=%s", user_id, payload.get("exp"))
```

This gives the operator a single grep target — `grep "legacy token
accepted" <log output>` — whose rate should monotonically decay to zero as
old 24h tokens expire, and gives a `sub`/`exp` pair to correlate against
specific stuck sessions if the decay stalls (e.g., a client that never
re-authenticates).

### 4.3 Expiry ramp: staged, not immediate 15 minutes

**Recommendation: do not jump straight to 15 minutes.** A 96x cut with zero
warning is a user-visible regression on its own, independent of the
type-claim compatibility question — every active user session, even ones
using brand-new post-fix tokens, would need to re-authenticate every 15
minutes. This is compounded by a confirmed gap: **grep shows no refresh-token
endpoint anywhere in `main.py` or `auth.py`** (`auth.py:26` defines
`REFRESH_TOKEN_EXPIRE_DAYS = 7` but it is never read — no `/api/auth/refresh`
route exists). Without a refresh mechanism, a 15-minute access token means
full re-login every 15 minutes, which is a materially worse UX regression
than the type-claim change itself and is not what the ticket's stated
finding ("15 min is the intended, correct behavior") anticipated as a
day-one experience.

Staged ramp, gated by the same deploy that flips `AUTH_ACCEPT_LEGACY_TOKENS`:
- **Phase 1 (deploy day):** `ACCESS_TOKEN_EXPIRE_MINUTES` via a new env var
  override (default falls back to `auth.py`'s constant, 15, only if unset)
  set to `120` (2h) in the deploy config for this cutover. Legacy tokens
  still accepted per §4.1.
- **Phase 2 (~1 week later, human-triggered, not automatic):** lower the
  override to `30`.
- **Phase 3 (~2 weeks after Phase 1):** remove the override entirely, which
  reverts to `auth.py`'s canonical `15`.

This is a recommendation for this stage's design, not an implementation
detail to build now — flagged here because the ticket explicitly asks
whether 96x-with-no-warning is acceptable, and the confirmed absence of a
refresh endpoint is new information that argues against it. If product/eng
decides the 15-minute cut is acceptable given no refresh flow exists anyway
(i.e., users already re-auth relatively often), Phase 1–3 can be collapsed
back to going straight to 15; that is a product call this document is not
authorized to make unilaterally.

### 4.4 End-of-window action

A human must, no earlier than the point at which the legacy-token log line
(§4.2) has produced zero matches for a full `ACCESS_TOKEN_EXPIRE_MINUTES`-plus-margin
window (i.e., the longest-lived legacy token — the last 24h token issued
before deploy — has had time to expire naturally, so wait at least 24h after
cutover, longer if any 24h token could have been issued right before
deploy):

1. Grep the last 24h of application logs for `"legacy token accepted"` — a
   zero-match window at least as long as the max previous token lifetime
   (24h) confirms the pool has drained.
2. Set `AUTH_ACCEPT_LEGACY_TOKENS=false` in the deploy environment.
3. Remove the legacy branch's conditional in `verify_token` in a follow-up
   PR (do not leave dead conditional code indefinitely — the flag should be
   removable, not permanent).
4. Confirm via a synthetic type-less token (constructed in a test/staging
   environment only, never against prod user data) that it now correctly
   401s instead of being accepted.

---

## 5. Test plan

New test module, e.g. `backend/tests/test_auth_token_type.py` (no such file
exists today — `backend/tests/` currently contains only
`test_ledger_supabase.py` and `test_tenancy_metering.py`; `backend/tests/` is
not currently swept by `per-file-ignores` for S101, only `**/backend/tests/*.py`
is — confirmed at `pyproject.toml:16`, so this new file inherits that ignore
automatically).

**(a) New (post-fix) behavior:**
- `test_create_access_token_sets_type_claim` — token from `create_access_token`
  (now resolving to `auth.py`) decodes with `payload["type"] == "access_token"`.
- `test_verify_token_rejects_missing_type_when_legacy_flag_off` — with
  `AUTH_ACCEPT_LEGACY_TOKENS=false`, a manually constructed token with no
  `type` claim is rejected with 401.
- `test_verify_token_rejects_wrong_type` — a token with `type="refresh"` (or
  any non-`access_token` value) is rejected with 401 regardless of the
  legacy flag.
- `test_verify_token_invalid_signature_returns_401_not_500` — a token
  signed with a different secret raises the FastAPI 401 HTTPException, not
  an unhandled `AttributeError`/500. This is the regression test for the
  `jwt.JWTError` → `jwt.PyJWTError` fix (§1.2); it must be run against
  `auth.py`'s `verify_token` specifically, since that is the buggy one.
- `test_verify_token_expired_returns_401` — expired token still 401s with
  `"Token has expired"` (guards against the fix accidentally touching the
  already-correct `jwt.ExpiredSignatureError` branch).
- `test_websocket_rejects_type_less_token_post_migration` — once `/ws`
  (§2.5) is routed through the shared verifier or given an equivalent check,
  confirm it applies the same `type` rule as the REST endpoints.

**(b) Transitional (legacy-token acceptance window) behavior:**
- `test_verify_token_accepts_legacy_token_when_flag_on` — with
  `AUTH_ACCEPT_LEGACY_TOKENS=true`, a manually constructed token with no
  `type` claim (simulating a pre-cutover 24h token) is accepted and returns
  the correct `user_id`.
- `test_legacy_token_acceptance_is_logged` — accepting a legacy token
  produces the `"legacy token accepted"` log line (§4.2) with the expected
  `sub`/`exp` fields, captured via `caplog`.
- `test_new_token_does_not_trigger_legacy_log` — a token issued post-fix
  (with `type` claim) does NOT produce the legacy log line, so the drain
  metric in §4.4 isn't polluted by normal traffic.

**(c) Transition can be switched off:**
- `test_legacy_flag_off_rejects_type_less_token` — same construction as (b)'s
  first test, but with `AUTH_ACCEPT_LEGACY_TOKENS=false`; must 401. This is
  the proof that flipping the flag at end-of-window (§4.4 step 2) actually
  restores the original security finding's intended behavior.
- `test_legacy_flag_default_matches_documented_default` — asserts the
  compiled-in default of `AUTH_ACCEPT_LEGACY_TOKENS` when the env var is
  unset matches whichever default is live in the codebase at merge time
  (this test's expected value must be updated when the flag is flipped from
  `true` to `false` per §4.1 — call this out in the PR description so the
  test isn't silently stale).

---

## 6. `pyproject.toml` change

`F811` is currently listed, with a 15-line explanatory comment
(`pyproject.toml:18-33`), in the `per-file-ignores` entry for
`"**/backend/main.py"` at `pyproject.toml:34-35`:

```toml
"**/backend/main.py" = ["S105", "B904", "E402", "E722", "E501", "S110", "N806",
                        "N805", "S104", "F841", "B008", "F811"]
```

When this fix lands (duplicates at `main.py:388-426` removed, imports at
`main.py:24-30` become live), **`F811` and its entire explanatory comment
block (`pyproject.toml:18-33`) must be removed** from that ignore list —
the redefinition it was suppressing will no longer exist, so ruff will stop
flagging it and the ignore becomes not just unnecessary but stale/misleading
if left in place.

**Do not touch the other codes in that same ignore list** — they belong to
different, already-tracked workstreams:
- `E402` and `B008` are **permanent by design** — `E402` because the
  `sys.path` mutation at `main.py:56-58` structurally requires imports to
  follow it; `B008` because `Depends(...)` as a parameter default is the
  standard FastAPI idiom, not a bug.
- `E722`, `S110`, `F841`, `B904`, `N805`, `N806`, `S104` are being remediated
  in a **separate workstream** per the existing comment at
  `pyproject.toml:19-22` ("Still outstanding and worth a dedicated pass").
  Do not fix or remove these as a side effect of this ticket.
- `S105` and `E501` are also present in that same ignore list
  (`pyproject.toml:34`) but are not itemized in the existing comment or in
  this ticket's scope — leave them untouched; they are neither this
  ticket's target nor confirmed to belong to the separate workstream above,
  so changing them would be scope creep either way.

---

## 7. Leftovers / adjacent findings (not built, noted only)

1. `01-CORE-PLATFORM/nexus-backend/backend/main 2.py` exists on disk
   (confirmed via `ls`, 37994 bytes, modified 2026-08-09) as a near-duplicate
   of `main.py` with the same `token_version` line and overlapping but not
   identical content (`diff` shows real differences, not a byte-identical
   copy). It is unclear whether this is a stray editor artifact or an
   intentional backup; it was not investigated further as it is outside this
   ticket's scope, but it risks confusing a future `grep`/edit pass on
   `main.py` if not resolved. Recommend a follow-up to determine whether it
   should be deleted or is tracked deliberately.
2. `main.py:507`'s `token_version` field is written but never read anywhere
   in `backend/` (confirmed via `grep -rn "token_version" backend/` — only
   the one write site and its duplicate in `main 2.py` above). It is not
   wired into any invalidation path and cannot be used for this rollout
   without new read-side logic; noted for a possible future ticket
   ("wire token_version into verify_token for password-change invalidation"),
   not built here.
3. The WebSocket endpoint (§2.5) not being routed through the shared
   `verify_token` is flagged as part of blast radius per the briefing, but
   the actual refactor to route it through the shared verifier is
   implementation work for the next stage, not this design document.
