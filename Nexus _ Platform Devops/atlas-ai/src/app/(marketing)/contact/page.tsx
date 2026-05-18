"use client";

import Link from "next/link";
import { useState } from "react";

interface ContactFormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  inquiryType: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  company?: string;
  message?: string;
}

const inquiryTypes = [
  { value: "", label: "Select inquiry type" },
  { value: "demo", label: "Schedule a Demo" },
  { value: "sales", label: "Sales & Pricing" },
  { value: "support", label: "Technical Support" },
  { value: "partnership", label: "Partnership Opportunities" },
  { value: "integration", label: "Custom Integration" },
  { value: "other", label: "Other" },
];

const contactMethods = [
  {
    title: "Sales & Demos",
    description: "Ready to see Atlas AI in action? Book a personalized demo.",
    icon: "💹",
    action: "Schedule Demo",
    href: "/signup",
    highlight: true
  },
  {
    title: "Customer Support",
    description: "Need help with your account or have technical questions?",
    icon: "💬",
    action: "Get Support",
    href: "mailto:support@atlas-ai.com",
    highlight: false
  },
  {
    title: "Enterprise Solutions",
    description: "Discuss custom solutions for your organization.",
    icon: "🏢",
    action: "Contact Enterprise",
    href: "mailto:enterprise@atlas-ai.com",
    highlight: false
  }
];

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    company: "",
    phone: "",
    inquiryType: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.company.trim()) {
      newErrors.company = "Company name is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters long";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSubmitted(true);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
          <p className="text-gray-400 mb-8">
            We've received your message and will get back to you within 24 hours. 
            Check your email for a confirmation.
          </p>
          <div className="space-y-4">
            <Link
              href="/signup"
              className="block px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200"
            >
              Start Free Trial
            </Link>
            <Link
              href="/"
              className="block px-6 py-3 border border-gray-700 text-gray-300 rounded-lg font-semibold hover:border-indigo-500 hover:text-indigo-400 transition-colors duration-200"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="px-6 py-20 text-center max-w-5xl mx-auto">
        <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight mb-6">
          Let&apos;s{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
            Connect
          </span>
        </h1>
        <p className="text-gray-300 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed mb-12">
          Ready to transform your marketing with AI? Get in touch with our team for a personalized demo, 
          technical support, or to discuss custom enterprise solutions.
        </p>
      </section>

      {/* Contact Methods */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {contactMethods.map((method, index) => (
              <div 
                key={index}
                className={`p-8 rounded-2xl border transition-all duration-200 hover:shadow-lg text-center ${
                  method.highlight 
                    ? "border-indigo-500 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 hover:border-indigo-400" 
                    : "border-gray-700 bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:border-gray-600"
                }`}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl">
                  {method.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{method.title}</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">{method.description}</p>
                <Link
                  href={method.href}
                  className={`inline-block px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    method.highlight
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                      : "border border-gray-700 hover:border-indigo-500 text-gray-300 hover:text-indigo-400"
                  }`}
                >
                  {method.action}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="px-6 py-20 bg-gradient-to-r from-gray-900/50 to-gray-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Send Us a Message</h2>
            <p className="text-gray-400 text-lg">
              Have a specific question or need? Fill out the form below and we'll get back to you within 24 hours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full rounded-lg border p-3 bg-gray-900 text-white transition-colors ${
                    errors.name 
                      ? "border-red-500 focus:ring-red-500" 
                      : "border-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                  }`}
                  placeholder="Your full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full rounded-lg border p-3 bg-gray-900 text-white transition-colors ${
                    errors.email 
                      ? "border-red-500 focus:ring-red-500" 
                      : "border-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                  }`}
                  placeholder="you@company.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium mb-2">
                  Company Name *
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className={`w-full rounded-lg border p-3 bg-gray-900 text-white transition-colors ${
                    errors.company 
                      ? "border-red-500 focus:ring-red-500" 
                      : "border-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                  }`}
                  placeholder="Your company name"
                />
                {errors.company && (
                  <p className="mt-1 text-sm text-red-400">{errors.company}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-700 p-3 bg-gray-900 text-white focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label htmlFor="inquiryType" className="block text-sm font-medium mb-2">
                  Inquiry Type
                </label>
                <select
                  id="inquiryType"
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-700 p-3 bg-gray-900 text-white focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                >
                  {inquiryTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="h-full flex flex-col">
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={12}
                  className={`w-full h-full min-h-[300px] rounded-lg border p-3 bg-gray-900 text-white transition-colors resize-none ${
                    errors.message 
                      ? "border-red-500 focus:ring-red-500" 
                      : "border-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
                  }`}
                  placeholder="Tell us about your marketing goals, current challenges, or any specific questions you have about Atlas AI. The more detail you provide, the better we can help you."
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-400">{errors.message}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending Message...
                  </div>
                ) : (
                  "Send Message"
                )}
              </button>
              <p className="text-center text-gray-500 text-sm mt-4">
                We typically respond within 24 hours during business days.
              </p>
            </div>
          </form>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 bg-gradient-to-r from-indigo-900/30 to-purple-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Don't wait to transform your marketing. Start your free trial today and see 
            the Atlas AI difference for yourself.
          </p>
          <Link 
            href="/signup"
            className="px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl text-xl font-semibold shadow-lg hover:shadow-indigo-500/25 transition-all duration-200"
          >
            Start Free Trial
          </Link>
          <p className="text-gray-500 text-sm mt-4">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  );
}