/**
 * Geo-aware price display.
 *
 * Shows a visitor a price in their own currency WHERE A REAL PRICE EXISTS, and
 * is explicit about the charge currency everywhere else.
 *
 * ─── The rule this module exists to enforce ────────────────────────────────
 * A displayed price that differs from the charged price is false advertising,
 * not a nicety. api/stripe.js holds ONE Stripe Price per plan
 * (STRIPE_STARTER_MONTHLY_PRICE_ID, STRIPE_STUDIO_BASE_PRICE_ID), so checkout
 * charges USD regardless of what the page shows. Until those Prices carry
 * Stripe `currency_options`, any non-USD figure MUST be accompanied by "billed
 * in USD". This module never converts and never estimates: it only swaps in a
 * price someone has actually set.
 *
 * ─── What exists today ─────────────────────────────────────────────────────
 * USD only, for the canonical Starter ($99) and Studio ($399) plans. The AED
 * and INR figures elsewhere on /pricing belong to the per-engine regional
 * tiers, which are separate products sold through contact-sales — they are not
 * translations of $99/$399.
 *
 * So a visitor in Canada, the UK or Germany sees USD with a "billed in USD"
 * note. That is the honest state, not a bug. To add a currency, give the price
 * element a data-price-<code> attribute and add the code to SUPPORTED — no
 * other change, and no code here needs to know the rate.
 *
 * ─── Detection ─────────────────────────────────────────────────────────────
 * Cloudflare sets CF-IPCountry on every request and functions/api/[[route]].js
 * already forwards all headers, so a server-side hint can be injected later as
 * <meta name="x-geo-country">. Until then this reads the browser's own locale
 * and timezone, which needs no network call, no third-party geo service and no
 * IP handling — so nothing here carries a privacy or consent obligation.
 * A manual choice always wins and is remembered.
 */

/* global document */
// Only `document` needs declaring — localStorage, navigator and Intl are already
// in the eslint config's globals, and re-declaring them trips no-redeclare.

const STORAGE_KEY = 'neorm-currency';

// Only currencies with REAL prices. Adding a code here without adding a
// data-price-<code> to the markup is a no-op by design: the element falls back
// to USD rather than rendering an empty or invented figure.
const SUPPORTED = ['USD', 'AED', 'INR'];

// Charge currency. Everything else is display-only until Stripe Prices carry
// currency_options for it.
const CHARGE_CURRENCY = 'USD';

const COUNTRY_TO_CURRENCY = {
  AE: 'AED', SA: 'AED', KW: 'AED', QA: 'AED', BH: 'AED', OM: 'AED',
  IN: 'INR',
  // Deliberately absent: CA, GB, DE, FR, … They fall through to USD because no
  // CAD/GBP/EUR price has been set. Listing them here without a price would
  // show a visitor a currency symbol attached to a US number.
};

/** Best-effort country, cheapest signal first. Never throws. */
function detectCountry() {
  // 1. Server hint, if a Function ever injects one from CF-IPCountry.
  const meta = document.querySelector('meta[name="x-geo-country"]');
  if (meta?.content) return meta.content.toUpperCase();

  // 2. Locale region: "en-AE" -> AE. navigator.languages is ordered by
  //    preference, so the first entry carrying a region wins.
  for (const tag of navigator.languages ?? [navigator.language]) {
    const region = tag?.split('-')[1];
    if (region && region.length === 2) return region.toUpperCase();
  }

  // 3. Timezone as a last resort — coarse, but distinguishes Asia/Kolkata and
  //    Asia/Dubai, which are the two regions that actually have prices.
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
    if (tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta') return 'IN';
    if (tz === 'Asia/Dubai') return 'AE';
  } catch {
    /* Intl unavailable — fall through */
  }
  return null;
}

function preferredCurrency() {
  let stored = null;
  try {
    stored = localStorage.getItem(STORAGE_KEY);
  } catch {
    /* private mode / storage blocked — detection still works */
  }
  if (stored && SUPPORTED.includes(stored)) return stored;
  const country = detectCountry();
  return (country && COUNTRY_TO_CURRENCY[country]) || CHARGE_CURRENCY;
}

/**
 * Apply a currency to every [data-price] element.
 *
 * Markup contract:
 *   <span data-price data-price-usd="$99" data-price-aed="AED 363">$99</span>
 * An element with no attribute for the chosen currency keeps its USD text —
 * it does not blank, and it does not get converted.
 */
function render(currency) {
  // Track what was actually RENDERED, not what was requested. A visitor in the
  // UAE prefers AED, but if no element carries a data-price-aed they are still
  // looking at dollars — and a note reading "Shown in AED" over a $99 figure
  // would be exactly the display-vs-charge mismatch this module exists to
  // prevent, just inverted.
  let renderedNonCharge = false;

  for (const el of document.querySelectorAll('[data-price]')) {
    const wanted = el.dataset[`price${currency.charAt(0)}${currency.slice(1).toLowerCase()}`];
    const usd = el.dataset.priceUsd;
    if (wanted) {
      el.textContent = wanted;
      if (currency !== CHARGE_CURRENCY) renderedNonCharge = true;
    } else if (usd) {
      el.textContent = usd;
    }
  }

  // One honest sentence, keyed off what is on screen.
  for (const note of document.querySelectorAll('[data-currency-note]')) {
    note.textContent = renderedNonCharge
      ? `Shown in ${currency}. All plans are billed in ${CHARGE_CURRENCY}.`
      : `All plans are billed in ${CHARGE_CURRENCY}.`;
    note.hidden = false;
  }

  for (const btn of document.querySelectorAll('[data-currency-choice]')) {
    btn.setAttribute('aria-pressed', String(btn.dataset.currencyChoice === currency));
  }

  document.documentElement.dataset.currency = currency;
  return renderedNonCharge;
}

/**
 * Which currencies this PAGE can actually show, derived from the markup rather
 * than from SUPPORTED. A switcher offering a currency no element carries would
 * be a control that does nothing.
 */
function availableOnPage() {
  const found = new Set();
  for (const el of document.querySelectorAll('[data-price]')) {
    for (const code of SUPPORTED) {
      if (el.dataset[`price${code.charAt(0)}${code.slice(1).toLowerCase()}`]) found.add(code);
    }
  }
  return found;
}

function init() {
  if (!document.querySelector('[data-price]')) return; // no prices on this page

  // Hide the switcher unless at least two currencies are really present. Today
  // the canonical plans carry USD only, so it stays hidden — deliberately. It
  // reveals itself the moment a second currency is added to the markup, with no
  // code change here.
  const available = availableOnPage();
  for (const sw of document.querySelectorAll('[data-currency-switcher]')) {
    sw.hidden = available.size < 2;
  }
  for (const btn of document.querySelectorAll('[data-currency-choice]')) {
    if (!available.has(btn.dataset.currencyChoice)) btn.hidden = true;
  }

  render(preferredCurrency());

  for (const btn of document.querySelectorAll('[data-currency-choice]')) {
    btn.addEventListener('click', () => {
      const choice = btn.dataset.currencyChoice;
      if (!SUPPORTED.includes(choice)) return;
      try {
        localStorage.setItem(STORAGE_KEY, choice);
      } catch {
        /* not fatal: the choice still applies for this pageview */
      }
      render(choice);
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

export { detectCountry, preferredCurrency, SUPPORTED, CHARGE_CURRENCY, COUNTRY_TO_CURRENCY };
