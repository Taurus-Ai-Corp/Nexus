"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { ChevronDown, Menu, X, Zap, ArrowRight, CheckCircle, Terminal, Bot, Lock, Cloud, GitBranch, Server, TrendingUp, Globe, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const SITE = {
  name: "TAURUS AI",
  tagline: "Partner for Growth",
  description: "Join our partner network and unlock exponential agency growth through AI-powered execution.",
}

const PARTNER_BENEFITS = [
  { icon: TrendingUp, title: "Scale Capacity", desc: "Handle 10x more work without adding headcount." },
  { icon: Zap, title: "Zero Upfront", desc: "Start free. Pay as you grow." },
  { icon: Users, title: "Partner Support", desc: "Dedicated success manager for Gold+ partners." },
  { icon: Globe, title: "Shared Knowledge", desc: "Access playbook, templates, and training." },
]

const PARTNERSHIP_TIERS = [
  {
    name: "Silver",
    price: "$0",
    period: "/month",
    badge: "Start",
    features: ["5 AI Agents", "Basic Analytics", "Email Support", "Community Access"],
    cta: "Apply Now",
    popular: false,
  },
  {
    name: "Gold",
    price: "$0",
    period: "/month",
    badge: "Recommended",
    features: ["Unlimited AI Agents", "Advanced Analytics", "Priority Support", "Partner Network Access", "Custom Training", "Dedicated Account Manager"],
    cta: "Apply Now",
    popular: true,
  },
  {
    name: "Platinum",
    price: "$2,500",
    period: "/month",
    badge: "Enterprise",
    features: ["Everything in Gold", "White-Label Rights", "API Access", "Custom Integrations", "99.9% SLA", "Monthly Business Reviews"],
    cta: "Contact Sales",
    popular: false,
  },
]

const PROOF_POINTS = [
  { value: "10x", label: "Avg. Capacity Increase" },
  { value: "24hrs", label: "Average Onboarding" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "24/7", label: "Support Available" },
]

const PARTNER_TESTIMONIALS = [
  { name: "Alex Rivera", role: "Director, ScaleOps", company: "ScaleOps Agency", quote: "Went from 3 to 12 clients in 6 months. The AI handles the repetitive work.", linkedin: "https://linkedin.com/in/alexrivera" },
  { name: "Jamie Lee", role: "Founder, DigitalFlow", company: "DigitalFlow", quote: "Finally freed up 30hrs/week to focus on strategy instead of execution.", linkedin: "https://linkedin.com/in/jamielee" },
  { name: "Sam Taylor", role: "CEO, GrowthLab", company: "GrowthLab", quote: "Best decision we made. Team actually enjoys work again.", linkedin: "https://linkedin.com/in/samtaylor" },
]

const FAQ = [
  { q: "What's the commitment?", a: "Silver is free forever. No credit card, no strings. Upgrade when ready." },
  { q: "How fast is onboarding?", a: "Most partners are live within 24 hours. We handle setup end-to-end." },
  { q: "White-label details?", a: "Platinum partners get full white-label. Rebrand and resell under your own brand." },
  { q: "What's included in support?", a: "Silver: email. Gold: priority email + dedicated manager. Platinum: named CSM + SLA." },
]

const TOOLS = [
  { icon: Bot, name: "AI Agents", desc: "Autonomous execution", color: "from-amber-500 to-orange-600" },
  { icon: Terminal, name: "DevOps CLI", desc: "Infrastructure as code", color: "from-blue-500 to-cyan-600" },
  { icon: Server, name: "Heiro Chain", desc: "Distributed ledger", color: "from-purple-500 to-pink-600" },
  { icon: Cloud, name: "Cloud Sync", desc: "Real-time backup", color: "from-green-500 to-emerald-600" },
  { icon: GitBranch, name: "Version Ctrl", desc: "Git with AI twist", color: "from-orange-500 to-red-600" },
  { icon: Lock, name: "Security", desc: "Zero-trust auth", color: "from-indigo-500 to-violet-600" },
]

const INTEGRATIONS = [
  { name: "OpenRouter", desc: "Cloud AI models" },
  { name: "Ollama", desc: "Local AI inference" },
  { name: "Claude Code", desc: "Agent orchestration" },
  { name: "Heiro Chain", desc: "Transaction layer" },
]

export default function PitchPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <>
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-500 z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-foreground">{SITE.name}</span>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <Link href="#benefits" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Benefits</Link>
              <Link href="#tiers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Partnership Tiers</Link>
              <Link href="#proof" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Social Proof</Link>
              <Link href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
            </nav>

            <div className="flex items-center gap-4">
              <Button className="hidden sm:flex bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white">
                Apply Now
              </Button>
              <button
                className="md:hidden p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-b px-4 py-4">
            <div className="flex flex-col gap-4">
              <Link href="#benefits" className="text-sm text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>Benefits</Link>
              <Link href="#tiers" className="text-sm text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>Partnership Tiers</Link>
              <Link href="#proof" className="text-sm text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>Social Proof</Link>
              <Link href="#faq" className="text-sm text-muted-foreground" onClick={() => setMobileMenuOpen(false)}>FAQ</Link>
              <Button className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white">Apply Now</Button>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-background to-yellow-50 dark:from-amber-950/20 dark:to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-200/30 via-transparent to-transparent dark:from-amber-900/20" />
        
        <div className="relative z-10 text-center max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse mr-2" />
              Partnership Opportunity
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            Scale Together.
            <span className="block bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent">
              Win Together.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            {SITE.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white text-lg px-8">
              Apply for Partnership
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Download Prospectus
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 flex flex-wrap justify-center gap-8"
          >
            {PROOF_POINTS.slice(0, 3).map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold text-amber-500">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-6 h-6 text-muted-foreground" />
        </motion.div>
      </section>

      {/* Partner Benefits */}
      <section id="benefits" className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Partner With Us</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Everything you need to dominate your market.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PARTNER_BENEFITS.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow text-center h-full">
                  <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Testimonials */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">What Partners Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Real agencies, real results.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PARTNER_TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="p-6 border-amber-500/20">
                  <div className="text-3xl text-amber-500 mb-4">&quot;</div>
                  <p className="text-muted-foreground mb-6 italic">{t.quote}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-white font-medium text-sm">
                        {t.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-semibold">{t.name}</div>
                        <div className="text-xs text-muted-foreground">{t.role}, {t.company}</div>
                      </div>
                    </div>
                    <a href={t.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    </a>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Platform Capabilities</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Production-ready tools included with every partnership tier.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOOLS.map((tool, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <tool.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{tool.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{tool.desc}</p>
                    <div className="mt-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">available</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Stack */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">AI-Powered Stack</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Advanced cloud and local models working in harmony.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {INTEGRATIONS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              >
                <Card className="text-center p-6 hover:border-amber-500/50 transition-colors cursor-pointer hover:-translate-y-1">
                  <div className="text-4xl mb-3">🧠</div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Tiers */}
      <section id="tiers" className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Choose Your Tier</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Start free. Scale when you are ready.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PARTNERSHIP_TIERS.map((tier, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.15 }}
              >
                <Card className={`p-6 h-full flex flex-col ${tier.popular ? 'border-2 border-amber-500 shadow-xl relative' : ''}`}>
                  {tier.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white">
                      {tier.badge}
                    </Badge>
                  )}
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
                    <div className="text-4xl font-bold">
                      {tier.price}
                      <span className="text-lg font-normal text-muted-foreground">{tier.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-8 flex-grow">
                    {tier.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full ${tier.popular ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white' : ''}`}>
                    {tier.cta}
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section id="proof" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Proven Results</h2>
            <p className="text-muted-foreground">Our partners are winning.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {PROOF_POINTS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-bold text-amber-500">{item.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>

          <Accordion className="w-full">
            {FAQ.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-5xl font-bold mb-6">Ready to Partner?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join 500+ agencies who have transformed their business with TAURUS AI.
          </p>
          <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white text-xl px-12 py-6">
            Apply for Partnership
            <ArrowRight className="ml-2 w-6 h-6" />
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">No commitment. Application takes 2 minutes.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">{SITE.name}</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 Taurus AI Corp. All rights reserved.</p>
            <div className="flex gap-6">
              {["Privacy", "Terms", "Contact"].map((link) => (
                <a key={link} href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}