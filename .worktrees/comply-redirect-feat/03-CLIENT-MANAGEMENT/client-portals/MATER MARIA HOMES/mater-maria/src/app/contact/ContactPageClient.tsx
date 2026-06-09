"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  CheckCircle2,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { VideoHeroSection } from "@/components/ui/video-hero-section";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import { SITE, FAQ_ITEMS } from "@/lib/constants";

/* ------------------------------------------------------------------ */
/*  Zod schema                                                         */
/* ------------------------------------------------------------------ */
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Phone must be at least 10 digits")
    .regex(/^[+\d\s()-]+$/, "Please enter a valid phone number"),
  preferredContact: z.enum(["call", "whatsapp", "email"]),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

/* ------------------------------------------------------------------ */
/*  Animation                                                          */
/* ------------------------------------------------------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export function ContactPageClient() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const formRef = useGsapReveal("[data-gsap-field]", {
    y: 40,
    stagger: 0.08,
    duration: 0.7,
    start: "top 80%",
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { preferredContact: "call" },
  });

  async function onSubmit(data: ContactFormData) {
    setSubmitError(null);
    try {
      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: "General / Residence Enquiry — Mater Maria Homes",
        message: `Preferred Contact Method: ${data.preferredContact}\n\n${data.message}`,
        from_name: "Mater Maria Homes Website",
        botcheck: false,
      };

      const res = await fetch("/api/web3forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok || result.error) {
        throw new Error(result.error || "Submission failed. Please try again.");
      }

      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  }

  return (
    <main id="main-content">
      {/* Video Hero */}
      <VideoHeroSection
        videoSrc="/assets-2025/videos/sanctuary-living.mp4"
        watermarkText="CONNECT"
      >
        <Container size="lg" className="pb-20 pt-40">
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm text-white/70">
            <Link href="/" className="transition-colors hover:text-white">Home</Link>
            <span className="text-white/40">/</span>
            <span className="font-medium text-white">Contact</span>
          </nav>
          <SectionHeading
            badge="Get in Touch"
            title="Contact Us"
            subtitle="We would love to hear from you. Reach out to ask questions or request more information about Mater Maria."
          />
        </Container>
      </VideoHeroSection>

      {/* Contact form + Info */}
      <section className="py-16" ref={formRef as React.RefObject<HTMLElement>}>
        <Container size="lg">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left: Form */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="rounded-xl border border-border-default bg-surface p-8"
            >
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <CheckCircle2 className="mb-4 size-16 text-green-500" />
                  <h3 className="font-heading mb-2 text-2xl font-bold text-text-primary">
                    Thank You!
                  </h3>
                  <p className="text-text-secondary">
                    Your message has been received. Our team will get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Name */}
                  <div data-gsap-field>
                    <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-text-primary">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      className="w-full rounded-lg border border-border-default bg-bg-base px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-accent-default focus:outline-none focus:ring-1 focus:ring-accent-default"
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div data-gsap-field>
                    <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-text-primary">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-border-default bg-bg-base px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-accent-default focus:outline-none focus:ring-1 focus:ring-accent-default"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div data-gsap-field>
                    <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-text-primary">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="w-full rounded-lg border border-border-default bg-bg-base px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-accent-default focus:outline-none focus:ring-1 focus:ring-accent-default"
                      {...register("phone")}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>
                    )}
                  </div>

                  {/* Preferred Contact */}
                  <fieldset data-gsap-field>
                    <legend className="mb-2 text-sm font-medium text-text-primary">
                      Preferred Contact Method
                    </legend>
                    <div className="flex gap-6">
                      {(["call", "whatsapp", "email"] as const).map((method) => (
                        <label key={method} className="flex cursor-pointer items-center gap-2 text-sm text-text-secondary">
                          <input
                            type="radio"
                            value={method}
                            className="accent-accent-default"
                            {...register("preferredContact")}
                          />
                          <span className="capitalize">{method}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  {/* Message */}
                  <div data-gsap-field>
                    <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-text-primary">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      placeholder="Tell us how we can help..."
                      className="w-full resize-none rounded-lg border border-border-default bg-bg-base px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted transition-colors focus:border-accent-default focus:outline-none focus:ring-1 focus:ring-accent-default"
                      {...register("message")}
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>
                    )}
                  </div>

                  {/* Error banner */}
                  {submitError && (
                    <p className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
                      {submitError}
                    </p>
                  )}

                  {/* Submit */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-accent-default text-text-inverse hover:bg-accent-dark"
                    size="lg"
                  >
                    <Send className="size-4" />
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              )}
            </motion.div>

            {/* Right: Info */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="space-y-8"
            >
              {/* Contact details */}
              <div className="rounded-xl border border-border-default bg-surface p-8">
                <h3 className="font-heading mb-6 text-xl font-bold text-text-primary">
                  Contact Information
                </h3>
                <ul className="space-y-5">
                  <li className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-default/10">
                      <Phone className="size-5 text-accent-default" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">Phone</p>
                      <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="text-sm text-text-secondary transition-colors hover:text-accent-default">
                        {SITE.phone}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-default/10">
                      <Mail className="size-5 text-accent-default" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">Email</p>
                      <a href={`mailto:${SITE.email}`} className="text-sm text-text-secondary transition-colors hover:text-accent-default">
                        {SITE.email}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-default/10">
                      <MapPin className="size-5 text-accent-default" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">Address</p>
                      <p className="text-sm text-text-secondary">{SITE.address}</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* WhatsApp CTA */}
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-xl border border-green-500/30 bg-green-500/10 p-6 transition-colors hover:bg-green-500/20"
              >
                <MessageCircle className="size-10 text-green-500" />
                <div>
                  <p className="font-semibold text-text-primary">Chat on WhatsApp</p>
                  <p className="text-sm text-text-secondary">
                    Get instant answers from our team
                  </p>
                </div>
              </a>

              {/* Map placeholder */}
              <div className="flex aspect-video items-center justify-center rounded-xl border border-border-default bg-surface">
                <div className="text-center">
                  <MapPin className="mx-auto mb-2 size-10 text-text-muted" />
                  <p className="text-sm text-text-muted">Interactive map coming soon</p>
                  <p className="text-xs text-text-muted">{SITE.address}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-16 pb-24">
        <Container size="md">
          <SectionHeading badge="FAQ" title="Frequently Asked Questions" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Accordion type="single" collapsible className="rounded-xl border border-border-default bg-surface p-2">
              {FAQ_ITEMS.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border-border-subtle px-4">
                  <AccordionTrigger className="text-text-primary hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-text-secondary">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </Container>
      </section>
    </main>
  );
}
