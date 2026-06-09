"use client";

import Link from "next/link";
import { useState } from "react";

const plans = [
  {
    name: "Starter",
    price: 49,
    description: "Perfect for small businesses and startups getting started with AI marketing automation",
    features: [
      "3 AI Agents",
      "10 Automation Templates",
      "Up to 1,000 contacts",
      "5 Active Campaigns",
      "Email & Chat Support",
      "Basic Analytics Dashboard",
      "Core Integrations (10+)",
      "Mobile App Access"
    ],
    limitations: [
      "Limited to 1 team member",
      "No custom branding",
      "Standard support response time"
    ],
    popular: false,
    buttonText: "Start Free Trial",
    highlight: false
  },
  {
    name: "Professional",
    price: 149,
    description: "Ideal for growing businesses ready to scale their marketing with advanced AI features",
    features: [
      "15 AI Agents",
      "40 Automation Templates",
      "Up to 10,000 contacts",
      "25 Active Campaigns",
      "Priority Support",
      "Advanced Analytics & Reports",
      "All Integrations (500+)",
      "Team Collaboration (5 users)",
      "A/B Testing",
      "Custom Workflows",
      "Lead Scoring",
      "Multi-channel Campaigns"
    ],
    limitations: [],
    popular: true,
    buttonText: "Start Free Trial",
    highlight: true
  },
  {
    name: "Enterprise",
    price: 449,
    description: "For large organizations needing unlimited scale and premium features",
    features: [
      "25+ AI Agents",
      "60+ Automation Templates",
      "Unlimited Contacts",
      "Unlimited Campaigns",
      "24/7 Dedicated Support",
      "Custom Analytics & BI",
      "White-label Solution",
      "Unlimited Team Members",
      "Advanced Security & Compliance",
      "Custom Integrations",
      "Dedicated Account Manager",
      "Custom AI Agent Development",
      "Priority Feature Requests",
      "SLA Guarantees"
    ],
    limitations: [],
    popular: false,
    buttonText: "Contact Sales",
    highlight: false
  }
];

const faqs = [
  {
    question: "What's included in the 14-day free trial?",
    answer: "You get full access to all Professional plan features with no limitations. No credit card required, and you can cancel anytime during the trial period."
  },
  {
    question: "Can I change plans anytime?",
    answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences."
  },
  {
    question: "What happens if I exceed my contact limits?",
    answer: "We'll notify you before you reach your limit. You can either upgrade your plan or we'll help you optimize your contact list to stay within your current tier."
  },
  {
    question: "Do you offer custom enterprise solutions?",
    answer: "Absolutely! Our Enterprise plan includes custom solutions, dedicated support, and can be tailored to your specific needs. Contact our sales team for details."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and can arrange wire transfers for Enterprise customers. All plans can be billed monthly or annually."
  },
  {
    question: "Is there a setup fee?",
    answer: "No setup fees for any plan. We also provide free onboarding and migration assistance to help you get started quickly."
  }
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const getPrice = (monthlyPrice: number) => {
    if (isAnnual) {
      return Math.round(monthlyPrice * 0.8); // 20% discount for annual
    }
    return monthlyPrice;
  };

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="px-6 py-20 text-center max-w-5xl mx-auto">
        <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight mb-6">
          Simple, Transparent{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
            Pricing
          </span>
        </h1>
        <p className="text-gray-300 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed mb-12">
          Choose the perfect plan for your business. Start with a 14-day free trial, 
          then scale as you grow. No hidden fees, no surprises.
        </p>
        
        {/* Billing Toggle */}
        <div className="inline-flex items-center bg-gray-800 rounded-xl p-1 mb-16">
          <button
            onClick={() => setIsAnnual(false)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              !isAnnual 
                ? "bg-indigo-600 text-white shadow-lg" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              isAnnual 
                ? "bg-indigo-600 text-white shadow-lg" 
                : "text-gray-400 hover:text-white"
            }`}
          >
            Annual
            <span className="ml-2 text-xs bg-green-600 text-white px-2 py-1 rounded-full">
              Save 20%
            </span>
          </button>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div 
                key={index}
                className={`relative p-8 rounded-2xl border transition-all duration-200 hover:shadow-lg ${
                  plan.highlight 
                    ? "border-indigo-500 bg-gradient-to-br from-gray-800/80 to-gray-900/80 shadow-lg shadow-indigo-500/10 scale-105" 
                    : "border-gray-700 bg-gradient-to-br from-gray-800/50 to-gray-900/50 hover:border-gray-600"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <div className="flex items-baseline justify-center">
                      <span className="text-5xl font-bold">${getPrice(plan.price)}</span>
                      <span className="text-gray-400 ml-2">/{isAnnual ? 'year' : 'month'}</span>
                    </div>
                    {isAnnual && (
                      <p className="text-sm text-green-400 mt-2">
                        ${plan.price * 12 - getPrice(plan.price) * 12} saved annually
                      </p>
                    )}
                  </div>
                  
                  <Link
                    href={plan.buttonText === "Contact Sales" ? "/contact" : "/signup"}
                    className={`block w-full py-4 px-6 rounded-xl font-semibold text-center transition-all duration-200 ${
                      plan.highlight
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-indigo-500/25"
                        : "border-2 border-gray-700 hover:border-indigo-500 text-gray-300 hover:text-white hover:bg-indigo-500/10"
                    }`}
                  >
                    {plan.buttonText}
                  </Link>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-white">What's Included:</h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-300">
                        <svg className="w-5 h-5 text-indigo-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {plan.limitations.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-700">
                      <h5 className="font-semibold text-gray-400 text-sm mb-3">Limitations:</h5>
                      <ul className="space-y-2">
                        {plan.limitations.map((limitation, idx) => (
                          <li key={idx} className="flex items-center text-gray-500 text-sm">
                            <svg className="w-4 h-4 text-gray-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            {limitation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="px-6 py-20 bg-gradient-to-r from-gray-900/50 to-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Atlas AI?</h2>
            <p className="text-gray-400 text-lg">
              Compare our features with traditional marketing tools and see the difference.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">❌</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-red-400">Traditional Tools</h3>
              <ul className="text-gray-400 space-y-3 text-left">
                <li>• Multiple expensive subscriptions</li>
                <li>• Manual campaign creation</li>
                <li>• Limited automation capabilities</li>
                <li>• Fragmented data across platforms</li>
                <li>• Steep learning curves</li>
                <li>• Time-consuming setup</li>
              </ul>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-600/10 border-2 border-indigo-500">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-indigo-400">Atlas AI</h3>
              <ul className="text-gray-300 space-y-3 text-left">
                <li>• All-in-one platform</li>
                <li>• AI-powered automation</li>
                <li>• 60+ ready-made templates</li>
                <li>• Unified analytics dashboard</li>
                <li>• Intuitive, user-friendly interface</li>
                <li>• 5-minute setup</li>
              </ul>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-green-400">Cost Savings</h3>
              <ul className="text-gray-400 space-y-3 text-left">
                <li>• Replace 5+ tools with one</li>
                <li>• Save $500+ per month</li>
                <li>• Reduce team training costs</li>
                <li>• No integration fees</li>
                <li>• Faster time-to-market</li>
                <li>• Higher conversion rates</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-400 text-lg">
              Got questions? We've got answers. Can't find what you're looking for? 
              <Link href="/contact" className="text-indigo-400 hover:text-indigo-300 transition-colors ml-1">
                Contact our team
              </Link>.
            </p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="border border-gray-700 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-800/50 transition-colors rounded-xl"
                >
                  <span className="font-semibold text-white">{faq.question}</span>
                  <svg 
                    className={`w-5 h-5 text-gray-400 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 bg-gradient-to-r from-indigo-900/30 to-purple-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-bold mb-6">
            Ready to Transform Your Marketing?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Start your 14-day free trial today. No credit card required, no setup fees. 
            Cancel anytime if we don't exceed your expectations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/signup"
              className="px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl text-xl font-semibold shadow-lg hover:shadow-indigo-500/25 transition-all duration-200"
            >
              Start Free Trial
            </Link>
            <Link 
              href="/contact"
              className="px-10 py-5 border-2 border-gray-700 hover:border-indigo-500 rounded-xl text-xl font-semibold transition-all duration-200 hover:bg-indigo-500/10"
            >
              Schedule Demo
            </Link>
          </div>
          <p className="text-gray-500 text-sm mt-6">
            Join 8,924+ businesses already using Atlas AI to grow their revenue
          </p>
        </div>
      </section>
    </div>
  );
}