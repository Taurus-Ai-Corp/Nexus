"use client";

import { useCurrency } from "@/lib/currency-context";
import { CURRENCIES, type CurrencyCode } from "@/lib/investor-constants";

export function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="inline-flex items-center rounded-full border border-border-default bg-surface/80 p-1 backdrop-blur-sm">
      {CURRENCIES.map((c) => (
        <button
          key={c.code}
          onClick={() => setCurrency(c.code as CurrencyCode)}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
            currency.code === c.code
              ? "bg-accent-default/15 text-accent-default shadow-sm"
              : "text-text-muted hover:text-text-secondary"
          }`}
          aria-label={`Show prices in ${c.label}`}
          aria-pressed={currency.code === c.code}
        >
          {c.symbol} {c.label}
        </button>
      ))}
    </div>
  );
}
