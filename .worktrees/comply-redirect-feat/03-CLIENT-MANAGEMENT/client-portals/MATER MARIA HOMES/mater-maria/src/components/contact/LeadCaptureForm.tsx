"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LeadPayload, Source, Tier } from "@/lib/lead-schema";

interface LeadCaptureFormProps {
  source?: Source;
  defaultTier?: Tier;
  variant?: "compact" | "full";
}

export function LeadCaptureForm({
  source = "hero-mini",
  defaultTier = "undecided",
  variant = "full",
}: LeadCaptureFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const payload: LeadPayload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || "").replace(/\s/g, ""),
      tier: (formData.get("tier") as Tier) || defaultTier,
      message: String(formData.get("message") || ""),
      source,
    };

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.issues) {
          const errors: Record<string, string> = {};
          result.issues.forEach((issue: { field: string; message: string }) => {
            errors[issue.field] = issue.message;
          });
          setFieldErrors(errors);
        }
        setError(result.error || "Submission failed. Please try again.");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border border-[#FDC420]/30 bg-[#FDFBF7] p-8 text-center"
      >
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#FDC420]/20">
          <svg className="h-8 w-8 text-[#00103F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-heading text-2xl font-bold text-[#00103F] mb-2">
          Enquiry Received
        </h3>
        <p className="text-[#00103F]/70 mb-4">
          Thank you for your interest. Our team will respond within 2 hours.
        </p>
        <p className="text-sm text-[#00103F]/50">
          For urgent queries, call <a href="tel:+919447080356" className="text-[#00103F] font-semibold">+91 94470 80356</a>
        </p>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="space-y-5"
    >
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[#00103F] mb-1.5">
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className={`w-full rounded-lg border px-4 py-3 text-[#00103F] outline-none transition-all focus:ring-2 focus:ring-[#FDC420]/50 focus:border-[#FDC420] ${
            fieldErrors.name ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
          }`}
          placeholder="e.g. Thomas Kurian"
        />
        {fieldErrors.name && (
          <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[#00103F] mb-1.5">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className={`w-full rounded-lg border px-4 py-3 text-[#00103F] outline-none transition-all focus:ring-2 focus:ring-[#FDC420]/50 focus:border-[#FDC420] ${
            fieldErrors.email ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
          }`}
          placeholder="thomas@example.com"
        />
        {fieldErrors.email && (
          <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-[#00103F] mb-1.5">
          WhatsApp Number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          className={`w-full rounded-lg border px-4 py-3 text-[#00103F] outline-none transition-all focus:ring-2 focus:ring-[#FDC420]/50 focus:border-[#FDC420] ${
            fieldErrors.phone ? "border-red-400 bg-red-50" : "border-gray-200 bg-white"
          }`}
          placeholder="+91 98765 43210"
        />
        {fieldErrors.phone && (
          <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>
        )}
      </div>

      {variant === "full" && (
        <>
          <div>
            <label htmlFor="tier" className="block text-sm font-medium text-[#00103F] mb-1.5">
              I&apos;m Interested In
            </label>
            <select
              id="tier"
              name="tier"
              defaultValue={defaultTier}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-[#00103F] outline-none transition-all focus:ring-2 focus:ring-[#FDC420]/50 focus:border-[#FDC420]"
            >
              <option value="undecided">Residence for Parents</option>
              <option value="silver">Silver Tier — ₹10L</option>
              <option value="gold">Gold Tier — ₹20L</option>
              <option value="platinum">Platinum Tier — ₹30L</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-[#00103F] mb-1.5">
              Message (optional)
            </label>
            <textarea
              id="message"
              name="message"
              rows={3}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-[#00103F] outline-none transition-all focus:ring-2 focus:ring-[#FDC420]/50 focus:border-[#FDC420] resize-none"
              placeholder="Tell us about your requirements..."
            />
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-[#00103F] py-4 font-bold text-white transition-all hover:bg-[#00103F]/90 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Sending...
          </span>
        ) : (
          "Book My Visit"
        )}
      </button>

      <p className="text-center text-xs text-[#00103F]/40">
        Or call us — <a href="tel:+919447080356" className="text-[#00103F] font-semibold hover:underline">+91 94470 80356</a> · Mon–Sat, 9am–6pm IST
      </p>
    </motion.form>
  );
}
