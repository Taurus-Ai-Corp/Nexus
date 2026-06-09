#!/usr/bin/env bash
#
# post-cutover-verify.sh
#
# Verify matermariahomes.com DNS cutover from Squarespace/GCE → Vercel.
# Run this immediately after flipping the A records, then again at +1h and +24h.
#
# Exit codes:
#   0 = all checks passed
#   1 = at least one check failed
#
# Usage:
#   ./post-cutover-verify.sh                     # default: matermariahomes.com
#   DOMAIN=other.example.com ./post-cutover-verify.sh
#
# Requires: dig, curl, openssl (all macOS/Linux defaults)

set -u
DOMAIN="${DOMAIN:-matermariahomes.com}"
WWW="www.${DOMAIN}"

# Expected post-cutover state
EXPECTED_A="76.76.21.21"                     # Vercel anycast apex IP
EXPECTED_MX="1 smtp.google.com."             # Google Workspace mail
EXPECTED_SPF_INCLUDES=("_spf.google.com")    # SPF must still include Google

# Multi-resolver list — checks propagation across major recursive resolvers
RESOLVERS=("1.1.1.1" "8.8.8.8" "9.9.9.9" "208.67.222.222")

# Color output (degrades gracefully if not a TTY)
if [ -t 1 ]; then
  RED=$'\033[0;31m'; GRN=$'\033[0;32m'; YLW=$'\033[0;33m'; BLU=$'\033[0;34m'; NC=$'\033[0m'
else
  RED=""; GRN=""; YLW=""; BLU=""; NC=""
fi

PASS=0
FAIL=0
WARN=0

ok()    { echo "${GRN}✓${NC} $1";        PASS=$((PASS+1)); }
fail()  { echo "${RED}✗${NC} $1";        FAIL=$((FAIL+1)); }
warn()  { echo "${YLW}!${NC} $1";        WARN=$((WARN+1)); }
hdr()   { echo ""; echo "${BLU}── $1 ──${NC}"; }

# ─────────────────────────────────────────────────────────────────────────────
hdr "1. Apex A record — multi-resolver propagation"
# ─────────────────────────────────────────────────────────────────────────────
for r in "${RESOLVERS[@]}"; do
  result=$(dig @"$r" +short +time=3 +tries=1 "$DOMAIN" A 2>/dev/null | head -1)
  if [ "$result" = "$EXPECTED_A" ]; then
    ok "$r → $DOMAIN = $result"
  elif [ -z "$result" ]; then
    warn "$r → $DOMAIN = NO RESPONSE (may still be propagating)"
  else
    fail "$r → $DOMAIN = $result (expected $EXPECTED_A)"
  fi
done

# ─────────────────────────────────────────────────────────────────────────────
hdr "2. www A/CNAME — multi-resolver propagation"
# ─────────────────────────────────────────────────────────────────────────────
for r in "${RESOLVERS[@]}"; do
  cname=$(dig @"$r" +short +time=3 +tries=1 "$WWW" CNAME 2>/dev/null | head -1)
  a=$(dig @"$r" +short +time=3 +tries=1 "$WWW" A 2>/dev/null | head -1)
  if [ "$a" = "$EXPECTED_A" ]; then
    if [ -n "$cname" ]; then
      ok "$r → $WWW = $cname → $a"
    else
      ok "$r → $WWW = $a (direct A)"
    fi
  elif [ -z "$a" ]; then
    warn "$r → $WWW = NO RESPONSE"
  else
    fail "$r → $WWW = $a (expected resolution to $EXPECTED_A)"
  fi
done

# ─────────────────────────────────────────────────────────────────────────────
hdr "3. MX record — email integrity (must NOT have changed)"
# ─────────────────────────────────────────────────────────────────────────────
mx=$(dig +short "$DOMAIN" MX | sort | head -1)
if [ "$mx" = "$EXPECTED_MX" ]; then
  ok "MX = $mx"
else
  fail "MX = $mx (expected '$EXPECTED_MX' — EMAIL MAY BE BROKEN)"
fi

# ─────────────────────────────────────────────────────────────────────────────
hdr "4. SPF record — sender authorization preserved"
# ─────────────────────────────────────────────────────────────────────────────
spf=$(dig +short "$DOMAIN" TXT | grep -i 'v=spf1' | tr -d '"' | head -1)
if [ -z "$spf" ]; then
  fail "No SPF record found — outbound email will be marked spam"
else
  ok "SPF present: $spf"
  for inc in "${EXPECTED_SPF_INCLUDES[@]}"; do
    if echo "$spf" | grep -q "$inc"; then
      ok "  contains required include: $inc"
    else
      fail "  missing required include: $inc"
    fi
  done
fi

# ─────────────────────────────────────────────────────────────────────────────
hdr "5. DMARC + DKIM — email auth posture"
# ─────────────────────────────────────────────────────────────────────────────
dmarc=$(dig +short "_dmarc.$DOMAIN" TXT | tr -d '"' | head -1)
if [ -n "$dmarc" ]; then
  ok "DMARC: $dmarc"
else
  warn "No DMARC record — recommend adding 'v=DMARC1; p=none; rua=mailto:dmarc@$DOMAIN'"
fi

dkim=$(dig +short "google._domainkey.$DOMAIN" TXT | head -1)
if [ -n "$dkim" ]; then
  ok "Google Workspace DKIM present (google._domainkey)"
else
  warn "No google._domainkey TXT — Google Workspace DKIM not configured (or named differently)"
fi

# ─────────────────────────────────────────────────────────────────────────────
hdr "6. HTTPS certificate — Vercel Let's Encrypt provisioning"
# ─────────────────────────────────────────────────────────────────────────────
for host in "$DOMAIN" "$WWW"; do
  cert=$(echo | openssl s_client -servername "$host" -connect "${host}:443" -showcerts 2>/dev/null \
         | openssl x509 -noout -issuer -subject -dates 2>/dev/null)
  if [ -z "$cert" ]; then
    fail "$host — no TLS handshake (cert not yet provisioned, or DNS not propagated to your resolver)"
    continue
  fi

  issuer=$(echo "$cert" | grep '^issuer=' | head -1)
  subject=$(echo "$cert" | grep '^subject=' | head -1)
  notafter=$(echo "$cert" | grep '^notAfter=' | head -1)

  if echo "$issuer" | grep -qiE "let's encrypt|R3|R10|R11|E5|E6"; then
    ok "$host cert — issued by Let's Encrypt"
    echo "    $subject"
    echo "    $notafter"
  else
    warn "$host cert — issuer is not Let's Encrypt: $issuer"
  fi
done

# ─────────────────────────────────────────────────────────────────────────────
hdr "7. HTTP → HTTPS redirect"
# ─────────────────────────────────────────────────────────────────────────────
for host in "$DOMAIN" "$WWW"; do
  redirect=$(curl -sI -o /dev/null -w "%{http_code} %{redirect_url}" --max-time 10 "http://$host/" 2>/dev/null)
  code=$(echo "$redirect" | awk '{print $1}')
  target=$(echo "$redirect" | awk '{print $2}')
  if [ "$code" = "301" ] || [ "$code" = "308" ]; then
    if echo "$target" | grep -q "^https://"; then
      ok "http://$host → $code → $target"
    else
      fail "http://$host → $code but target is not HTTPS: $target"
    fi
  else
    warn "http://$host returned $code (no redirect — Vercel usually 308s)"
  fi
done

# ─────────────────────────────────────────────────────────────────────────────
hdr "8. HTTPS 200 — site is actually serving"
# ─────────────────────────────────────────────────────────────────────────────
for host in "$DOMAIN" "$WWW"; do
  code=$(curl -sI -o /dev/null -w "%{http_code}" --max-time 10 "https://$host/" 2>/dev/null)
  if [ "$code" = "200" ]; then
    ok "https://$host/ → 200"
  elif [ "$code" = "308" ] || [ "$code" = "301" ]; then
    next=$(curl -sIL -o /dev/null -w "%{http_code} %{url_effective}" --max-time 15 "https://$host/" 2>/dev/null)
    ok "https://$host/ → $code → followed → $next"
  else
    fail "https://$host/ → $code (expected 200)"
  fi
done

# ─────────────────────────────────────────────────────────────────────────────
hdr "9. Vercel served-by header — confirms Vercel edge is in front"
# ─────────────────────────────────────────────────────────────────────────────
served_by=$(curl -sI --max-time 10 "https://$DOMAIN/" 2>/dev/null | grep -iE "^(server|x-vercel|x-served-by):")
if echo "$served_by" | grep -qi "vercel"; then
  ok "Served by Vercel:"
  echo "$served_by" | sed 's/^/    /'
else
  warn "No Vercel headers detected — request may still be hitting old Google Cloud server"
  echo "$served_by" | sed 's/^/    /'
fi

# ─────────────────────────────────────────────────────────────────────────────
hdr "Summary"
# ─────────────────────────────────────────────────────────────────────────────
echo "  ${GRN}Passed:${NC} $PASS"
echo "  ${YLW}Warned:${NC} $WARN"
echo "  ${RED}Failed:${NC} $FAIL"
echo ""

if [ "$FAIL" -gt 0 ]; then
  echo "${RED}CUTOVER INCOMPLETE OR DEGRADED.${NC} Investigate failures above."
  echo "Rollback procedure: see MATER MARIA HOMES/devops/2026-05-06-domain-handoff.md § Rollback"
  exit 1
fi

if [ "$WARN" -gt 0 ]; then
  echo "${YLW}Cutover succeeded with warnings.${NC} Re-run in 1h to confirm warnings clear."
  exit 0
fi

echo "${GRN}All checks passed. Cutover complete.${NC}"
exit 0
