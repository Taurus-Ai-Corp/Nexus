"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  ArrowRight,
  MessageCircle,
  Mail,
  Phone,
  CheckCircle2,
  Loader2,
  Globe,
} from "lucide-react";
import { SectionWatermark } from "@/components/ui/section-watermark";
import { Container } from "@/components/ui/container";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { GhostWord } from "@/components/ui/ghost-word";
import {
  investorLeadSchema,
  type InvestorLeadFormData,
  INVESTMENT_TIERS,
} from "@/lib/investor-constants";
import { isFirebaseConfigured } from "@/lib/firebase/client";
import { posthog, Events } from "@/lib/posthog";

// Rajeev Abraham (Chairman) — primary investor contact
const WHATSAPP_NUMBER_UAE = "971505786471";
const WHATSAPP_NUMBER_INDIA = "919656463073";
const WHATSAPP_NUMBER = WHATSAPP_NUMBER_UAE; // default for WhatsApp CTA
const WHATSAPP_DISPLAY_UAE = "+971 50 578 6471";
const WHATSAPP_DISPLAY_INDIA = "+91 96564 63073";

const COUNTRIES = [
  "India",
  "United Arab Emirates",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Singapore",
  "Kuwait",
  "Qatar",
  "Bahrain",
  "Saudi Arabia",
  "Oman",
  "Germany",
  "Other",
];

export function LeadCapture() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<InvestorLeadFormData>({
    resolver: zodResolver(investorLeadSchema),
    defaultValues: {
      country: "India",
      tier: "diamond",
      isNRI: false,
    },
  });

  const selectedCountry = watch("country");
  const selectedTier = watch("tier");

  // Track tier selection changes
  const handleTierChange = (tier: string) => {
    posthog.capture(Events.TIER_SELECTED, { tier });
  };

  const onSubmit = useCallback(
    async (data: InvestorLeadFormData) => {
      setIsSubmitting(true);

      // Auto-detect NRI
      const isNRI = data.country !== "India";
      const leadData = { ...data, isNRI, source: "website" as const };

      try {
        const selectedTierData = INVESTMENT_TIERS.find((t) => t.id === leadData.tier);

        // Track lead submission
        posthog.capture(Events.LEAD_SUBMITTED, {
          tier: leadData.tier,
          country: leadData.country,
          is_nri: leadData.isNRI,
          source: leadData.source,
        });

        // Supabase write — graceful fallback if env vars missing
        if (
          process.env["NEXT_PUBLIC_SUPABASE_URL"] &&
          process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]
        ) {
          const { createClient } = await import("@/lib/supabase/client");
          const supabase = createClient();
          await supabase.from("investor_inquiries").insert({
            full_name: leadData.name,
            email: leadData.email,
            phone: leadData.phone,
            country: leadData.country,
            unit_type: leadData.tier,
            investment_amount: selectedTierData?.investment ?? 0,
            status: "new",
          });
        }

        // Firebase write — graceful fallback if env vars missing
        if (isFirebaseConfigured()) {
          const { getFirebaseDb } = await import("@/lib/firebase/client");
          const { collection, addDoc, serverTimestamp } = await import("firebase/firestore");
          await addDoc(collection(getFirebaseDb(), "investor_leads"), {
            name: leadData.name,
            email: leadData.email,
            phone: leadData.phone,
            country: leadData.country,
            tier: leadData.tier,
            isNRI: leadData.isNRI,
            source: leadData.source,
            status: "new",
            createdAt: serverTimestamp(),
          });
        }

        console.log("Lead captured:", leadData);

        // Success!
        setIsSubmitted(true);

        // Confetti celebration
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#d4a853", "#b8932c", "#f0d68a"],
        });

        // WhatsApp redirect after 2 seconds
        const tierName = selectedTierData?.name ?? "Diamond";
        const whatsappMsg = encodeURIComponent(
          `Hi, I'm ${data.name} and I'm interested in the ${tierName} tier investment (${selectedTierData?.investmentDisplay ?? ""}) at Mater Maria Sanctuary.`,
        );
        setTimeout(() => {
          window.open(
            `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`,
            "_blank",
          );
        }, 2500);
      } catch (err) {
        console.error("Lead capture failed:", err);
      } finally {
        setIsSubmitting(false);
      }
    },
    [],
  );

  return (
    <SectionWatermark
      className="relative overflow-hidden py-20 lg:py-28"
      id="lead-capture"
    >
      {/* Ghost typography behind form */}
      <GhostWord word="Begin" top="50%" />

      <Container size="md" className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="mb-2 font-heading text-sm font-medium uppercase tracking-[0.2em] text-accent-default">
            Get Started
          </p>
          <h2 className="mb-4 font-heading text-3xl font-bold sm:text-4xl lg:text-5xl text-gold-gradient">
            Begin Your Legacy
          </h2>
          <p className="mx-auto mb-10 max-w-lg text-text-secondary">
            Join the founding patrons of Mater Maria Sanctuary. Our team will
            reach out within 24 hours with a personalized investment proposal.
          </p>
        </motion.div>

        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto max-w-md rounded-2xl border border-border-accent bg-surface p-8 text-center"
          >
            <CheckCircle2 className="mx-auto mb-4 size-12 text-green-500" />
            <h3 className="mb-2 font-heading text-xl font-bold text-text-primary">
              Thank You!
            </h3>
            <p className="mb-4 text-sm text-text-secondary">
              Your interest has been registered. Redirecting you to WhatsApp to
              connect directly with our team...
            </p>
            <p className="text-xs text-text-muted">
              Our team will also reach out via email within 24 hours.
            </p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto max-w-lg space-y-5 rounded-2xl border border-border-default bg-surface p-6 lg:p-8"
          >
            {/* NRI badge */}
            <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-accent-default/30 bg-accent-default/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-default">
              <Globe className="size-3.5" />
              NRI Investment Friendly — UAE · US · UK
            </div>

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium text-text-primary"
              >
                Full Name
              </label>
              <input
                {...register("name")}
                id="name"
                placeholder="Enter your full name"
                className="w-full rounded-lg border border-border-default bg-bg-base px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-[rgba(212,175,55,0.5)] focus:outline-none focus:ring-0 focus:[box-shadow:0_0_0_3px_rgba(212,175,55,0.15)]"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
              )}
            </div>

            {/* Email + Phone — side by side on desktop */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-text-primary"
                >
                  Email
                </label>
                <input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-border-default bg-bg-base px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-[rgba(212,175,55,0.5)] focus:outline-none focus:ring-0 focus:[box-shadow:0_0_0_3px_rgba(212,175,55,0.15)]"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="mb-1.5 block text-sm font-medium text-text-primary"
                >
                  Phone
                </label>
                <input
                  {...register("phone")}
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="w-full rounded-lg border border-border-default bg-bg-base px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-[rgba(212,175,55,0.5)] focus:outline-none focus:ring-0 focus:[box-shadow:0_0_0_3px_rgba(212,175,55,0.15)]"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            {/* Country + Tier */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="country"
                  className="mb-1.5 block text-sm font-medium text-text-primary"
                >
                  Country
                </label>
                <select
                  {...register("country")}
                  id="country"
                  className="w-full rounded-lg border border-border-default bg-bg-base px-4 py-3 text-sm text-text-primary focus:border-[rgba(212,175,55,0.5)] focus:outline-none focus:ring-0 focus:[box-shadow:0_0_0_3px_rgba(212,175,55,0.15)]"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="tier"
                  className="mb-1.5 block text-sm font-medium text-text-primary"
                >
                  Investment Tier
                </label>
                <select
                  {...register("tier", { onChange: (e) => handleTierChange(e.target.value) })}
                  id="tier"
                  className="w-full rounded-lg border border-border-default bg-bg-base px-4 py-3 text-sm text-text-primary focus:border-[rgba(212,175,55,0.5)] focus:outline-none focus:ring-0 focus:[box-shadow:0_0_0_3px_rgba(212,175,55,0.15)]"
                >
                  {INVESTMENT_TIERS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} — {t.investmentDisplay}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* NRI indicator */}
            {selectedCountry !== "India" && (
              <div className="rounded-lg border border-accent-default/20 bg-accent-default/5 px-4 py-3">
                <p className="text-xs text-accent-default">
                  NRI Package — Our dedicated NRI concierge team will assist
                  with international payments, virtual tours, and documentation.
                </p>
              </div>
            )}

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="mb-1.5 block text-sm font-medium text-text-primary"
              >
                Message{" "}
                <span className="font-normal text-text-muted">
                  (optional)
                </span>
              </label>
              <textarea
                {...register("message")}
                id="message"
                rows={3}
                placeholder="Any questions or specific requirements..."
                className="w-full resize-none rounded-lg border border-border-default bg-bg-base px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-[rgba(212,175,55,0.5)] focus:outline-none focus:ring-0 focus:[box-shadow:0_0_0_3px_rgba(212,175,55,0.15)]"
              />
            </div>

            {/* Submit */}
            <motion.div whileTap={{ scale: 0.97 }}>
              <ShimmerButton
                type="submit"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    Submit & Connect on WhatsApp{" "}
                    <ArrowRight className="size-4" />
                  </>
                )}
              </ShimmerButton>
            </motion.div>

            <p className="text-center text-xs text-text-muted">
              Your information is secure and will only be used to contact you
              regarding your investment inquiry.
            </p>
          </motion.form>
        )}

        {/* Alt contact methods */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm"
        >
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-text-secondary transition-colors hover:text-accent-default"
          >
            <MessageCircle className="size-4" /> WhatsApp
          </a>
          <a
            href="mailto:Info@matermariahomes.com"
            className="flex items-center gap-2 text-text-secondary transition-colors hover:text-accent-default"
          >
            <Mail className="size-4" /> Info@matermariahomes.com
          </a>
          <a
            href="tel:+971505786471"
            className="flex items-center gap-2 text-text-secondary transition-colors hover:text-accent-default"
          >
            <Phone className="size-4" /> <span className="text-text-muted">UAE</span> {WHATSAPP_DISPLAY_UAE}
          </a>
          <a
            href="tel:+919656463073"
            className="flex items-center gap-2 text-text-secondary transition-colors hover:text-accent-default"
          >
            <Phone className="size-4" /> <span className="text-text-muted">India</span> {WHATSAPP_DISPLAY_INDIA}
          </a>
        </motion.div>
      </Container>
    </SectionWatermark>
  );
}
