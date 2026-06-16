# Stripe Integration Guide for Nexus Creative

## Why this is needed
The pricing buttons on `https://nexus.taurusai.io` currently open `mailto:` links. To convert the page into a self-serve funnel, each plan needs a Stripe Checkout link.

## Required Stripe account
You need a Stripe account in **TAURUS AI Corp.** or **FZCO** name. If you do not have one, create it at https://dashboard.stripe.com/register.

## Recommended products and prices

### Starter — $99 / campaign
- Product name: `Nexus Creative — Starter Campaign`
- Price: `99.00 USD` (one-time)
- Metadata: `plan=starter`

### Studio — $399 / month
- Product name: `Nexus Creative — Studio`
- Price: `399.00 USD` per month (recurring)
- Metadata: `plan=studio`

### Agency — Custom
- Do not create a Checkout link. Keep as `mailto:` inquiry.

## Option 1: Stripe Dashboard (fastest, no code)
1. Log in to https://dashboard.stripe.com
2. Go to **Products** → **Add product**
3. Create each product + price above
4. For each price, click the **•••** menu → **Create payment link**
5. Copy the payment link URL (looks like `https://buy.stripe.com/xxxxx`)
6. Paste the URLs into the table below and I will patch `index.html`

## Option 2: Stripe CLI (automation)
If you install Stripe CLI and provide the API key, I can create the products and payment links for you:

```bash
# Install Stripe CLI on macOS
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Test connection
stripe products list --limit 3
```

Then run the script in this repo:
```bash
python3 setup_stripe_links.py
```

## Integration checklist
- [ ] Stripe account created/confirmed
- [ ] Products + prices created
- [ ] Payment links generated
- [ ] `index.html` pricing buttons updated to `https://buy.stripe.com/...`
- [ ] Webhook endpoint added (optional) to notify on successful payment
- [ ] Post-purchase page created: `https://nexus.taurusai.io/thanks.html`

## Payment link URLs
Paste here once generated:

| Plan | Stripe payment link |
|------|---------------------|
| Starter ($99) | `PASTE_HERE` |
| Studio ($399/mo) | `PASTE_HERE` |

## Post-purchase flow
After payment, redirect buyers to `https://nexus.taurusai.io/thanks.html` with a form to submit their brief.

## Next step
Tell me which option you prefer:
- **A:** I create a no-code setup script and you paste the payment links.
- **B:** You share Stripe CLI access / API key and I create the links automatically.
- **C:** You log into Stripe, generate the links, and send them to me to patch the page.
