"use client";

import Link from "next/link";
import { useState } from "react";

interface FormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  marketingGoals: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  marketingGoals?: string;
}

export default function SignUpPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    phone: "",
    marketingGoals: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.company.trim()) {
      newErrors.company = "Company name is required";
    }

    if (!formData.marketingGoals.trim()) {
      newErrors.marketingGoals = "Please tell us about your marketing goals";
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

    // Simulate API call
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
          <h1 className="text-3xl font-bold mb-4">Welcome to Atlas AI!</h1>
          <p className="text-gray-400 mb-8">
            Thank you for signing up! We've sent you an email with next steps to get started with your 14-day free trial.
          </p>
          <div className="space-y-4">
            <Link
              href="/features"
              className="block px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200"
            >
              Explore Features
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
    <div className="pt-20 min-h-screen px-6 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Start Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Free Trial</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Join thousands of businesses using Atlas AI to automate their marketing and grow 10x faster.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700">
            <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl">✓</span>
            </div>
            <h3 className="font-semibold mb-2">14-Day Free Trial</h3>
            <p className="text-gray-400 text-sm">No credit card required</p>
          </div>
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl">⚡</span>
            </div>
            <h3 className="font-semibold mb-2">Instant Setup</h3>
            <p className="text-gray-400 text-sm">Get started in 5 minutes</p>
          </div>
          <div className="text-center p-6 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-xl">🎯</span>
            </div>
            <h3 className="font-semibold mb-2">Expert Support</h3>
            <p className="text-gray-400 text-sm">24/7 customer success team</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
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
                placeholder="Enter your full name"
                aria-invalid={errors.name ? "true" : "false"}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <p id="name-error" className="mt-1 text-sm text-red-400" role="alert">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Business Email *
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
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-400" role="alert">
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
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
                aria-invalid={errors.company ? "true" : "false"}
                aria-describedby={errors.company ? "company-error" : undefined}
              />
              {errors.company && (
                <p id="company-error" className="mt-1 text-sm text-red-400" role="alert">
                  {errors.company}
                </p>
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
          </div>

          <div>
            <label htmlFor="marketingGoals" className="block text-sm font-medium mb-2">
              What are your main marketing goals? *
            </label>
            <textarea
              id="marketingGoals"
              name="marketingGoals"
              value={formData.marketingGoals}
              onChange={handleChange}
              rows={4}
              className={`w-full rounded-lg border p-3 bg-gray-900 text-white transition-colors ${
                errors.marketingGoals 
                  ? "border-red-500 focus:ring-red-500" 
                  : "border-gray-700 focus:ring-indigo-500 focus:border-indigo-500"
              }`}
              placeholder="Tell us about your marketing challenges and what you hope to achieve with Atlas AI..."
              aria-invalid={errors.marketingGoals ? "true" : "false"}
              aria-describedby={errors.marketingGoals ? "goals-error" : undefined}
            />
            {errors.marketingGoals && (
              <p id="goals-error" className="mt-1 text-sm text-red-400" role="alert">
                {errors.marketingGoals}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Your Account...
              </div>
            ) : (
              "Start My Free Trial"
            )}
          </button>

          <p className="text-center text-gray-500 text-sm">
            By signing up, you agree to our{" "}
            <Link href="/terms" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300 transition-colors">
              Privacy Policy
            </Link>
            .
          </p>
        </form>

        {/* Login Link */}
        <div className="text-center mt-8 pt-6 border-t border-gray-800">
          <p className="text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}