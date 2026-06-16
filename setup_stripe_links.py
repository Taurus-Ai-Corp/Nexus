#!/usr/bin/env python3
"""
Create Stripe products, prices, and payment links for Nexus Creative.
Run after setting STRIPE_SECRET_KEY in ~/.env-secrets.
"""
import os
import sys

import stripe


def load_keys_from_env_secrets():
    import subprocess
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


def ensure_product(name: str, metadata: dict):
    # Search existing products by name
    products = stripe.Product.list(limit=10)
    for p in products.auto_paging_iter():
        if p.name == name:
            print(f"  Found existing product: {p.id}")
            return p
    print(f"  Creating product: {name}")
    return stripe.Product.create(name=name, metadata=metadata)


def ensure_price(product_id: str, amount_cents: int, currency: str = "usd", recurring: bool = False):
    prices = stripe.Price.list(product=product_id, limit=10)
    for pr in prices.auto_paging_iter():
        if pr.unit_amount == amount_cents and pr.currency == currency and bool(pr.get("recurring")) == recurring:
            print(f"  Found existing price: {pr.id}")
            return pr
    print(f"  Creating price: {amount_cents/100:.2f} {currency.upper()}")
    params = {"product": product_id, "unit_amount": amount_cents, "currency": currency}
    if recurring:
        params["recurring"] = {"interval": "month"}
    return stripe.Price.create(**params)


def create_payment_link(price_id: str):
    # Search existing payment links for this price
    links = stripe.PaymentLink.list(limit=10)
    for link in links.auto_paging_iter():
        if link.line_items and link.line_items.data and link.line_items.data[0].price.id == price_id:
            print(f"  Found existing payment link: {link.url}")
            return link
    print("  Creating payment link...")
    return stripe.PaymentLink.create(
        line_items=[{"price": price_id, "quantity": 1}],
        after_completion={"type": "redirect", "redirect": {"url": "https://nexus.taurusai.io/thanks.html"}},
    )


def main():
    keys = load_keys_from_env_secrets()
    key = keys.get("STRIPE_SECRET_KEY") or os.environ.get("STRIPE_SECRET_KEY")
    if not key:
        print("ERROR: STRIPE_SECRET_KEY not found in ~/.env-secrets or environment.")
        print("Add it with: echo \"export STRIPE_SECRET_KEY='sk_live_...'\" >> ~/.env-secrets")
        sys.exit(1)

    stripe.api_key = key
    print("Connected to Stripe. Setting up Nexus Creative products...\n")

    # Starter — $99 one-time
    starter_product = ensure_product("Nexus Creative — Starter Campaign", {"plan": "starter"})
    starter_price = ensure_price(starter_product.id, 9900, recurring=False)
    starter_link = create_payment_link(starter_price.id)

    # Studio — $399/month
    studio_product = ensure_product("Nexus Creative — Studio", {"plan": "studio"})
    studio_price = ensure_price(studio_product.id, 39900, recurring=True)
    studio_link = create_payment_link(studio_price.id)

    print("\n=== PAYMENT LINKS ===")
    print(f"Starter ($99): {starter_link.url}")
    print(f"Studio ($399/mo): {studio_link.url}")

    # Write to a local file for easy patching
    with open("stripe-links.env", "w") as f:
        f.write(f"export NEXUS_STARTER_PAYMENT_LINK='{starter_link.url}'\n")
        f.write(f"export NEXUS_STUDIO_PAYMENT_LINK='{studio_link.url}'\n")
    print("\nSaved to stripe-links.env")
    print("\nNext: paste these links into index.html pricing buttons, or run the patch command I provide.")


if __name__ == "__main__":
    main()
