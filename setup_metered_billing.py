#!/usr/bin/env python3
"""
Setup Stripe Metered Billing for Nexus Creative.

Creates:
  1. Products with metered billing enabled
  2. Base prices (flat fee: $99 starter / $399/mo studio)
  3. Metered prices ($0.00 base, metered usage for credits)
  4. Meter event definition (each credit = 1 campaign asset generation)

Run after setting STRIPE_SECRET_KEY in ~/.env-secrets or environment.

DO NOT run this script automatically. Run it once manually to set up
products/prices, then add the returned IDs to .env.local

Usage:
  python3 setup_metered_billing.py
"""

import os
import sys
import json
import subprocess


def load_key():
    """Load STRIPE_SECRET_KEY from ~/.env-secrets or environment."""
    script = """
set -a
source ~/.env-secrets 2>/dev/null || true
set +a
python3 - <<'PY'
import os, json
print(json.dumps({'STRIPE_SECRET_KEY': os.environ.get('STRIPE_SECRET_KEY','')}))
PY
"""
    res = subprocess.run(["bash", "-c", script], capture_output=True, text=True)
    for line in reversed(res.stdout.split("\n")):
        try:
            return json.loads(line)
        except Exception:
            continue
    return {}


def stripe_api(method, endpoint, params=None):
    """Call the Stripe REST API directly (no SDK dependency)."""
    key = os.environ.get("STRIPE_SECRET_KEY", "")
    if not key:
        raise RuntimeError("STRIPE_SECRET_KEY not set")

    import urllib.request
    import urllib.parse
    import base64

    base = "https://api.stripe.com/v1"
    url = f"{base}/{endpoint.lstrip('/')}"

    auth = base64.b64encode(f"{key}:".encode()).decode()

    if method == "GET" and params:
        url += "?" + urllib.parse.urlencode(params)
        req = urllib.request.Request(url, method="GET")
    elif method == "GET":
        req = urllib.request.Request(url, method="GET")
    else:
        body = urllib.parse.urlencode(params or {}).encode()
        req = urllib.request.Request(url, data=body, method="POST")

    req.add_header("Authorization", f"Basic {auth}")
    req.add_header("Content-Type", "application/x-www-form-urlencoded")

    try:
        with urllib.request.urlopen(req) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        error_body = json.loads(e.read().decode())
        raise RuntimeError(f"Stripe API error: {error_body}")


def find_or_create_product(name, metadata):
    """Find existing product by name or create a new one."""
    products = stripe_api("GET", "products", {"limit": "100"})

    for p in products.get("data", []):
        if p["name"] == name and p.get("active", True):
            print(f"  Found existing product: {p['id']} — {name}")
            return p

    print(f"  Creating product: {name}")
    params = {"name": name, "active": "true"}
    for k, v in metadata.items():
        params[f"metadata[{k}]"] = v

    return stripe_api("POST", "products", params)


def find_or_create_price(product_id, unit_amount, currency, recurring=None, metered=False, meter_id=None):
    """Find existing price or create a new one."""
    prices = stripe_api("GET", "prices", {"product": product_id, "limit": "100"})

    for p in prices.get("data", []):
        matches = (
            p["unit_amount"] == unit_amount
            and p["currency"] == currency
            and p.get("active", True)
        )
        if recurring and not metered:
            matches = matches and p.get("recurring", {}).get("interval") == recurring
        if metered:
            matches = matches and p.get("recurring", {}).get("usage_type") == "metered"
        elif not recurring:
            matches = matches and "recurring" not in p

        if matches:
            print(f"  Found existing price: {p['id']} — ${unit_amount/100:.2f}")
            return p

    print(f"  Creating price: ${unit_amount/100:.2f} {currency.upper()}")
    params = {
        "product": product_id,
        "unit_amount": str(unit_amount),
        "currency": currency,
        "active": "true",
    }

    if metered and recurring:
        params["recurring[interval]"] = recurring
        params["recurring[usage_type]"] = "metered"
        if meter_id:
            params["recurring[meter]"] = meter_id
    elif recurring:
        params["recurring[interval]"] = recurring

    return stripe_api("POST", "prices", params)


def create_meter(display_name, event_name):
    """Create a Stripe Meter for metered billing."""
    meters = stripe_api("GET", "billing/meters", {"limit": "100"})

    for m in meters.get("data", []):
        if m["display_name"] == display_name:
            print(f"  Found existing meter: {m['id']} — {display_name}")
            return m

    print(f"  Creating meter: {display_name}")
    params = {
        "display_name": display_name,
        "event_name": event_name,
        "default_aggregation": "sum",
    }
    return stripe_api("POST", "billing/meters", params)


def create_billing_portal():
    """Create or retrieve a Customer Portal configuration."""
    configs = stripe_api("GET", "billing_portal/configurations", {"limit": "10"})

    for c in configs.get("data", []):
        if c.get("active", False):
            print(f"  Found active portal config: {c['id']}")
            return c

    print("  Creating Customer Portal configuration...")
    # Enable subscription cancellation and payment method updates
    params = {
        "features[subscription_update][enabled]": "true",
        "features[subscription_cancel][enabled]": "true",
        "features[subscription_cancel][mode]": "at_period_end",
        "features[payment_method_update][enabled]": "true",
        "features[invoice_history][enabled]": "true",
    }

    return stripe_api("POST", "billing_portal/configurations", params)


def main():
    keys = load_key()
    key = keys.get("STRIPE_SECRET_KEY") or os.environ.get("STRIPE_SECRET_KEY")
    if not key:
        print("ERROR: STRIPE_SECRET_KEY not found in ~/.env-secrets or environment.")
        print("Add it with: echo \"export STRIPE_SECRET_KEY='***'\" >> ~/.env-secrets")
        sys.exit(1)

    os.environ["STRIPE_SECRET_KEY"] = key
    print("Connected to Stripe. Setting up Metered Billing...\n")

    results = {}

    # ── Create Meters ──
    print("=== METERS ===")
    starter_meter = create_meter("Nexus Creative Starter Credits", "starter_credit_consumed")
    starter_meter_id = starter_meter["id"]
    results["STRIPE_STARTER_METER_ID"] = starter_meter_id

    studio_meter = create_meter("Nexus Creative Studio Credits", "studio_credit_consumed")
    studio_meter_id = studio_meter["id"]
    results["STRIPE_STUDIO_METER_ID"] = studio_meter_id

    # ── Starter Plan ($99 one-time + 5 metered credits) ──
    print("\n=== STARTER PLAN ===")
    starter_product = find_or_create_product(
        "Nexus Creative — Starter (Metered)",
        {"plan": "starter", "billing_type": "metered"},
    )
    starter_product_id = starter_product["id"]
    results["STRIPE_STARTER_PRODUCT_ID"] = starter_product_id

    # Base price: $99 one-time
    starter_base = find_or_create_price(
        starter_product_id, 9900, "usd", recurring=None
    )
    results["STRIPE_STARTER_BASE_PRICE_ID"] = starter_base["id"]

    # Metered price: $0/mo per-unit metered (charged per credit consumed after included 5)
    starter_metered = find_or_create_price(
        starter_product_id, 0, "usd", recurring=None, metered=True, meter_id=starter_meter_id
    )
    results["STRIPE_STARTER_METERED_PRICE_ID"] = starter_metered["id"]

    # ── Studio Plan ($399/mo + 20 metered credits/mo) ──
    print("\n=== STUDIO PLAN ===")
    studio_product = find_or_create_product(
        "Nexus Creative — Studio (Metered)",
        {"plan": "studio", "billing_type": "metered"},
    )
    studio_product_id = studio_product["id"]
    results["STRIPE_STUDIO_PRODUCT_ID"] = studio_product_id

    # Base price: $399/mo recurring
    studio_base = find_or_create_price(
        studio_product_id, 39900, "usd", recurring="month"
    )
    results["STRIPE_STUDIO_BASE_PRICE_ID"] = studio_base["id"]

    # Metered price: $0/unit metered (each credit = 1 asset generation)
    studio_metered = find_or_create_price(
        studio_product_id, 0, "usd", recurring="month", metered=True, meter_id=studio_meter_id
    )
    results["STRIPE_STUDIO_METERED_PRICE_ID"] = studio_metered["id"]

    # ── Customer Portal ──
    print("\n=== CUSTOMER PORTAL ===")
    portal = create_billing_portal()
    results["STRIPE_PORTAL_CONFIG_ID"] = portal["id"]

    # ── Webhook Endpoint (instructions) ──
    print("\n=== WEBHOOK SETUP ===")
    print("IMPORTANT: Create a webhook endpoint in Stripe Dashboard:")
    print("  URL: https://nexus.taurusai.io/api/webhook")
    print("  Events to listen for:")
    print("    - checkout.session.completed")
    print("    - customer.subscription.updated")
    print("    - customer.subscription.deleted")
    print("    - invoice.payment_succeeded")
    print("  Copy the signing secret to STRIPE_WEBHOOK_SECRET in .env.local")

    # ── Output Results ──
    print("\n" + "=" * 60)
    print("ENVIRONMENT VARIABLES — Add to .env.local:")
    print("=" * 60)
    for key, value in results.items():
        print(f"{key}={value}")

    # Write results to a local file
    env_path = os.path.join(os.path.dirname(__file__), "metered-billing.env")
    with open(env_path, "w") as f:
        for key, value in results.items():
            f.write(f"{key}={value}\n")
    print(f"\nSaved to {env_path}")
    print("\nNext steps:")
    print("  1. Copy the env vars above into .env.local")
    print("  2. Set up the webhook endpoint in Stripe Dashboard")
    print("  3. Deploy to Vercel")
    print("  4. Test with: curl -X POST https://nexus.taurusai.io/api/credits")
    print('     -d \'{"customer_email":"test@example.com","plan":"starter"}\'')


if __name__ == "__main__":
    main()
