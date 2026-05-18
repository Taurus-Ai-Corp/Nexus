"use client";

import Link from "next/link";
import AnimatedCounter from "./AnimatedCounter";
import StickyCTA from "./StickyCTA";
import Fuse from "fuse.js";
import { useState } from "react";

function TemplateSearch({ data }: { data: { title: string; description: string; category: string }[] }) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const fuse = new Fuse(data, { 
    keys: ["title", "description", "category"], 
    threshold: 0.3 
  });
  
  const categories = ["all", "email", "social", "analytics", "ecommerce"];
  
  let results = query ? fuse.search(query).map(result => result.item) : data;
  
  if (selectedCategory !== "all") {
    results = results.filter(item => item.category === selectedCategory);
  }

  return (
    <div className="mt-8">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search templates..."
          className="flex-1 rounded-xl border border-gray-700 bg-gray-900 p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search AI automation templates"
        />
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-xl border border-gray-700 bg-gray-900 p-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
          aria-label="Filter by category"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((item, idx) => (
          <div
            key={idx}
            className="group p-6 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-indigo-500 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/10"
          >
            <div className="flex items-start justify-between mb-3">
              <h4 className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
                {item.title}
              </h4>
              <span className="text-xs px-2 py-1 bg-indigo-600/20 text-indigo-400 rounded-full">
                {item.category}
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-4">{item.description}</p>
            <Link 
              href="/signup"
              className="text-indigo-400 text-sm font-medium hover:text-indigo-300 transition-colors"
            >
              Use Template →
            </Link>
          </div>
        ))}
      </div>
      
      {results.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No templates found</div>
          <p className="text-gray-500">Try adjusting your search terms or category filter.</p>
        </div>
      )}
    </div>
  );
}

export default function LandingPage() {
  const templates = [
    { 
      title: "Smart Lead Follow-up System", 
      description: "Automatically nurture leads with personalized email sequences",
      category: "email"
    },
    { 
      title: "AI Viral News Scraper", 
      description: "Find trending topics and create viral content automatically",
      category: "social"
    },
    { 
      title: "Ecommerce Chatbot", 
      description: "24/7 customer support with purchase recommendations",
      category: "ecommerce"
    },
    { 
      title: "Cross-Platform Publishing Bot", 
      description: "Publish content across all social platforms simultaneously",
      category: "social"
    },
    { 
      title: "Email Campaign Optimizer", 
      description: "A/B test and optimize email campaigns automatically",
      category: "email"
    },
    { 
      title: "Customer Analytics Dashboard", 
      description: "Real-time insights into customer behavior and preferences",
      category: "analytics"
    },
  ];

  return (
    <div className="pt-20"> {/* Add top padding for fixed navbar */}
      {/* HERO */}
      <section className="px-6 py-20 text-center max-w-5xl mx-auto">
        <div className="space-y-8">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight">
            Create AI-Powered Marketing Campaigns{" "}
            <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
              10x Faster
            </span>
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            Transform your business with advanced AI automation, 60+ proven templates, 
            and 25+ specialized AI agents working around the clock for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/signup"
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl text-lg font-semibold shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Start Free Trial
            </Link>
            <Link 
              href="/features"
              className="px-8 py-4 border-2 border-gray-700 hover:border-indigo-500 rounded-xl text-lg font-semibold transition-all duration-200 hover:bg-indigo-500/10"
            >
              Watch Demo
            </Link>
          </div>
          <p className="text-gray-500 text-sm">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="px-6 py-12 bg-gradient-to-r from-gray-900/50 to-gray-800/50">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400 mb-8">Trusted by thousands of growing businesses</p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-8 items-center">
            {["TechCorp", "StartupXYZ", "GrowthCo", "ScaleUp", "InnovateInc"].map((company) => (
              <div key={company} className="text-gray-600 font-semibold text-lg">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powering Marketing Success Worldwide</h2>
            <p className="text-gray-400 text-lg">Real results from real businesses using Atlas AI</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-8 text-center">
            <div className="p-6 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700">
              <div className="text-3xl font-bold text-indigo-400 mb-2">
                <AnimatedCounter value={2847} />
              </div>
              <p className="text-gray-400">Active Projects</p>
            </div>
            <div className="p-6 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700">
              <div className="text-3xl font-bold text-indigo-400 mb-2">
                <AnimatedCounter value={15439} />
              </div>
              <p className="text-gray-400">Campaigns</p>
            </div>
            <div className="p-6 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700">
              <div className="text-3xl font-bold text-indigo-400 mb-2">
                <AnimatedCounter value={8924} />
              </div>
              <p className="text-gray-400">Active Users</p>
            </div>
            <div className="p-6 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700">
              <div className="text-3xl font-bold text-indigo-400 mb-2">
                $<AnimatedCounter value={2400000} />
              </div>
              <p className="text-gray-400">Revenue Generated</p>
            </div>
            <div className="p-6 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700">
              <div className="text-3xl font-bold text-green-400 mb-2">
                <AnimatedCounter value={0} />
              </div>
              <p className="text-gray-400">Projects Pending</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES PREVIEW */}
      <section className="px-6 py-20 bg-gradient-to-br from-indigo-900/20 to-purple-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Everything You Need to Dominate Digital Marketing
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              From AI-powered content creation to automated campaign optimization, 
              Atlas AI provides all the tools you need to scale your marketing efforts.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">AI Automation</h3>
              <p className="text-gray-400">
                Deploy 25+ specialized AI agents to handle everything from content creation to customer support.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Smart Analytics</h3>
              <p className="text-gray-400">
                Get real-time insights and actionable recommendations to optimize your campaigns.
              </p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Lightning Fast</h3>
              <p className="text-gray-400">
                Launch campaigns in minutes, not hours. Our AI does the heavy lifting for you.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link 
              href="/features"
              className="inline-block px-8 py-4 border-2 border-indigo-600 hover:bg-indigo-600 rounded-xl text-lg font-semibold transition-all duration-200"
            >
              Explore All Features
            </Link>
          </div>
        </div>
      </section>

      {/* TEMPLATE SEARCH */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">60+ Ready-to-Use AI Templates</h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Jump-start your marketing with proven templates designed by experts and powered by AI. 
              Find the perfect automation for your business needs.
            </p>
          </div>
          <TemplateSearch data={templates} />
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="px-6 py-20 bg-gradient-to-r from-indigo-900/30 to-purple-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-5xl font-bold mb-6">
            Ready to Transform Your Marketing?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of businesses already using Atlas AI to automate their marketing 
            and grow faster than ever before.
          </p>
          <Link 
            href="/signup"
            className="inline-block px-10 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-xl text-xl font-semibold shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Start Your Free Trial Today
          </Link>
          <p className="text-gray-500 text-sm mt-4">
            14-day free trial • No setup fees • Cancel anytime
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Atlas AI</h3>
              <p className="text-gray-400 mb-4">
                AI-powered marketing automation that helps businesses grow 10x faster.
              </p>
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} Atlas AI. All rights reserved.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/features" className="hover:text-indigo-400 transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-indigo-400 transition-colors">Pricing</Link></li>
                <li><Link href="/signup" className="hover:text-indigo-400 transition-colors">Free Trial</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/contact" className="hover:text-indigo-400 transition-colors">Contact</Link></li>
                <li><Link href="/about" className="hover:text-indigo-400 transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-indigo-400 transition-colors">Blog</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-indigo-400 transition-colors">Help Center</Link></li>
                <li><Link href="/docs" className="hover:text-indigo-400 transition-colors">Documentation</Link></li>
                <li><Link href="/contact" className="hover:text-indigo-400 transition-colors">Contact Support</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky CTA */}
      <StickyCTA />
    </div>
  );
}