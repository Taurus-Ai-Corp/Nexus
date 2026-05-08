"use client";

import { useActionState, useState } from "react";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { adminLogin } from "./actions";

export function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(adminLogin, { error: "" });
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-base">
      <div className="w-full max-w-sm rounded-2xl border border-border-default bg-surface p-8">
        <div className="mb-6 text-center">
          <Lock className="mx-auto mb-3 size-8 text-accent-default" />
          <h1 className="font-heading text-xl font-bold text-text-primary">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Mater Maria Investor Analytics
          </p>
        </div>
        <form action={formAction} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter admin password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-border-default bg-bg-base px-4 py-3 pr-10 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-default/50 focus:outline-none focus:ring-1 focus:ring-accent-default/30"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {state.error && (
            <p className="text-xs text-red-400">{state.error}</p>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent-default py-3 text-sm font-semibold text-text-inverse transition-colors hover:bg-accent-dark disabled:opacity-60"
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            Access Dashboard
          </button>
        </form>
      </div>
    </main>
  );
}
