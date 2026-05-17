import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../ThemeContext';
import { GlowCard, MetallicButton, ScrollProgress, ThemeToggle } from '../components/luxury';
import { loadStripe } from '@stripe/stripe-js';

const stripeKey = import.meta.env['VITE_STRIPE_PUBLISHABLE_KEY'] || '';
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

const handleCheckout = async (priceId) => {
  const apiUrl = import.meta.env['VITE_API_URL'] || '';
  if (!apiUrl) {
    alert('Payments are not configured yet. Contact admin@taurusai.io for Pro access.');
    return;
  }
  const token = localStorage.getItem('neosync_access_token');
  if (!token) {
    window.location.href = '/login?redirect=/#pricing';
    return;
  }
  if (!stripeKey) {
    alert('Stripe is not configured yet. Contact admin@taurusai.io to enable payments.');
    return;
  }
  try {
    const res = await fetch(`${apiUrl}/api/stripe/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ price_id: priceId }),
    });
    if (!res.ok) {
      const err = await res.json();
      alert(`Checkout error: ${err.detail || 'Please try again or contact admin@taurusai.io'}`);
      return;
    }
    const { url } = await res.json();
    if (url) window.location.href = url;
  } catch {
    alert('Failed to start checkout. Please try again or contact admin@taurusai.io');
  }
};

const features = [
  { icon: '⚡', title: 'Three-Tier AI Routing', desc: 'Local Ollama → OpenRouter Cloud → HuggingFace. 70-95% cost reduction vs cloud-only AI.' },
  { icon: '🎯', title: 'NLP Command Center', desc: 'Type natural language commands. "Create Instagram story ad for café in Toronto $30/day" — done.' },
  { icon: '📊', title: 'Multi-Platform Management', desc: 'Meta, Instagram, BizFlow, NeoVibe campaigns in one unified dashboard.' },
  { icon: '🤖', title: 'Agent Orchestration', desc: '5 AI frameworks orchestrated: CrewAI, LangChain, Hedera, Swarm, Claude Code.' },
  { icon: '🔍', title: 'Vector Search + Analytics', desc: 'PostgreSQL + pgvector + TimescaleDB. Semantic search across all campaign content.' },
  { icon: '🔒', title: 'Self-Hosted & Private', desc: 'Zero Docker overhead. Native Homebrew services. Your data stays on your infrastructure.' },
];

const stats = [
  { value: '364+', label: 'AI Models Available' },
  { value: '95%', label: 'Cost Reduction' },
  { value: '<50ms', label: 'Local Inference' },
  { value: '27+', label: 'Integrated Services' },
];

const pricingTiers = [
  { name: 'Free', price: 'Free', desc: 'Forever free, self-hosted', features: ['3 social channels', '10 scheduled posts total', '30-day analytics history', 'Basic AI routing (local only)', 'Community support'], action: 'dashboard' },
  { name: 'Pro', price: '$49', desc: 'Per month, billed annually', features: ['Unlimited channels', 'Unlimited scheduled posts', 'Full analytics + reports', 'Three-tier AI routing', 'Priority support', 'API access', 'WhatsApp + Telegram bots'], priceId: 'price_pro_monthly', action: 'checkout', annualPrice: '$39', monthlyPrice: '$49' },
  { name: 'Reseller', price: '$699', desc: 'One-time, white-label license', features: ['Everything in Pro', 'White-label branding (your logo/domain)', 'Unlimited client accounts', 'Reseller dashboard', 'Revenue share program', 'Lifetime updates', 'Dedicated onboarding'], priceId: 'price_reseller_lifetime', action: 'checkout' },
  { name: 'Enterprise', price: 'Custom', desc: 'Dedicated deployment', features: ['Everything in Reseller', 'On-premise deployment', 'SLA guarantee', 'Custom integrations', 'Dedicated support', 'Audit & compliance'], action: 'contact' },
];

const LandingPage = () => {
  const { theme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [annualBilling, setAnnualBilling] = useState(true);

  const navItems = [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Dashboard', href: '/dashboard' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', position: 'relative' }}>
      <ScrollProgress />
      <div className="gradient-mesh" />

      {/* ── Navigation ── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, padding: '16px 0', transition: 'all 0.3s ease' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', textDecoration: 'none' }}>
            Neo<span className="text-gradient">Sync</span>™
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {navItems.map(item => (
              <a key={item.label} href={item.href} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s' }} onMouseEnter={e => e.target.style.color = 'var(--accent-start)'} onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}>
                {item.label}
              </a>
            ))}
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '120px 24px 80px' }}>
        <div style={{ textAlign: 'center', maxWidth: 900, position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="badge" style={{ marginBottom: 24, display: 'inline-block' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-start)', display: 'inline-block' }} />
              Open Source • Self-Hosted • AI-Powered
            </span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} style={{ marginBottom: 24 }}>
            The Social Suite<br />
            <span className="text-gradient">Dashboard Reimagined</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} style={{ fontSize: 'clamp(1.1rem, 1rem + 0.5vw, 1.3rem)', color: 'var(--text-secondary)', maxWidth: 640, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Manage Meta, Instagram, and AI campaigns with natural language commands. Three-tier AI routing that cuts cloud costs by 95%. Built for teams who demand more.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/dashboard"><MetallicButton>Launch Dashboard →</MetallicButton></a>
            <MetallicButton variant="secondary" onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}>Explore Features</MetallicButton>
            <a href="/best-time-to-post"><MetallicButton variant="secondary" style={{ fontSize: '0.85rem' }}>🕐 Free: Best Time to Post</MetallicButton></a>
          </motion.div>
        </div>

        {/* Floating decorative elements */}
        <div className="float" style={{ position: 'absolute', top: '15%', left: '10%', width: 60, height: 60, borderRadius: '50%', background: 'var(--accent-glow)', filter: 'blur(40px)' }} />
        <div className="float-slow" style={{ position: 'absolute', bottom: '20%', right: '15%', width: 80, height: 80, borderRadius: '50%', background: 'hsla(260, 60%, 50%, 0.1)', filter: 'blur(50px)' }} />
      </section>

      {/* ── Marquee Strip ── */}
      <div style={{ padding: '20px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
        <div className="marquee">
          <div className="marquee-content">
            {['PostgreSQL + pgvector', 'Ollama Local AI', 'OpenRouter Cloud', 'HuggingFace Models', 'FastAPI Gateway', 'Valkey Cache', 'Meilisearch', 'TimescaleDB', 'Meta Business Suite', 'Instagram Graph API', 'Agent Orchestration', 'Vector Search'].map((item, i) => (
              <span key={i} className="mono" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{item}</span>
            ))}
          </div>
          <div className="marquee-content">
            {['PostgreSQL + pgvector', 'Ollama Local AI', 'OpenRouter Cloud', 'HuggingFace Models', 'FastAPI Gateway', 'Valkey Cache', 'Meilisearch', 'TimescaleDB', 'Meta Business Suite', 'Instagram Graph API', 'Agent Orchestration', 'Vector Search'].map((item, i) => (
              <span key={i} className="mono" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{item}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats Bar ── */}
      <section style={{ padding: '48px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <p className="mono" style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 8 }}>TRUSTED BY INNOVATIVE TEAMS</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32, textAlign: 'center' }}>
            {[
              { value: '27+', label: 'Integrated Services' },
              { value: '364+', label: 'AI Models Available' },
              { value: '95%', label: 'Cost Reduction vs Cloud' },
              { value: '<50ms', label: 'Local Inference Latency' },
              { value: '100%', label: 'Self-Hosted & Private' },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-gradient" style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700, marginBottom: 4 }}>{stat.value}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Case Studies ── */}
      <section style={{ padding: '80px 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span className="badge" style={{ marginBottom: 16, display: 'inline-block' }}>Case Studies</span>
            <h2 style={{ marginBottom: 16 }}>Real Results.<br /><span className="text-gradient">Real Teams.</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {[
              { org: 'TAURUS AI Corp', metric: '95%', detail: 'AI cost reduction with three-tier routing', quote: 'NeoSync cut our cloud AI spend from $2,400/mo to $120/mo while maintaining response quality.' },
              { org: 'NeoVibe Marketing', metric: '4.2hrs', detail: 'Saved per week on campaign management', quote: 'Natural language commands replaced hours of manual scheduling. "Create Instagram story for Dubai café" — done.' },
              { org: 'Q-Grid Platform', metric: '27+', label: 'services orchestrated', detail: 'Unified dashboard for all social operations', quote: 'One dashboard replaced 6 different tools. Our team finally has a single source of truth.' },
            ].map((cs, i) => (
              <GlowCard key={i} delay={i * 0.1} style={{ padding: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{cs.org}</h4>
                  <span className="text-gradient" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700 }}>{cs.metric}</span>
                </div>
                <p style={{ color: 'var(--accent-start)', fontSize: '0.85rem', marginBottom: 16 }}>{cs.detail}</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontStyle: 'italic', lineHeight: 1.7 }}>"{cs.quote}"</p>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Section ── */}
      <section style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
            {stats.map((stat, i) => (
              <GlowCard key={i} delay={i * 0.1} style={{ textAlign: 'center', padding: 32 }}>
                <div className="text-gradient" style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 1.5rem + 2vw, 3rem)', fontWeight: 700, marginBottom: 8 }}>{stat.value}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{stat.label}</div>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="features" style={{ padding: '96px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="badge" style={{ marginBottom: 16, display: 'inline-block' }}>Features</span>
            <h2 style={{ marginBottom: 16 }}>Everything You Need.<br /><span className="text-gradient">Nothing You Don't.</span></h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto' }}>A complete social media management suite with AI-native architecture, built for performance and privacy.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
            {features.map((f, i) => (
              <GlowCard key={i} delay={i * 0.1}>
                <div style={{ fontSize: 2.5, marginBottom: 16 }}>{f.icon}</div>
                <h4 style={{ marginBottom: 12, fontSize: '1.2rem' }}>{f.title}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>{f.desc}</p>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing Section ── */}
      <section id="pricing" style={{ padding: '96px 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="badge" style={{ marginBottom: 16, display: 'inline-block' }}>Pricing</span>
            <h2 style={{ marginBottom: 16 }}>Simple, Transparent<br /><span className="text-gradient">Pricing</span></h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto' }}>Start free. Scale when you're ready. No hidden fees.</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 32 }}>
              <span style={{ color: !annualBilling ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: '0.9rem', fontWeight: !annualBilling ? 600 : 400 }}>Monthly</span>
              <button onClick={() => setAnnualBilling(!annualBilling)} style={{ width: 48, height: 26, borderRadius: 13, border: 'none', background: annualBilling ? 'var(--accent-start)' : 'var(--border)', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: annualBilling ? 25 : 3, transition: 'left 0.2s' }} />
              </button>
              <span style={{ color: annualBilling ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: '0.9rem', fontWeight: annualBilling ? 600 : 400 }}>Annual <span style={{ color: 'var(--accent-start)', fontSize: '0.8rem' }}>(Save 20%)</span></span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, maxWidth: 1100, margin: '0 auto' }}>
            {pricingTiers.map((tier, i) => (
              <GlowCard key={i} delay={i * 0.15} style={{ display: 'flex', flexDirection: 'column', padding: 40, ...(i === 1 ? { border: '1px solid var(--accent-start)', boxShadow: 'var(--shadow-glow)' } : {}) }}>
                {i === 1 && <span className="badge" style={{ marginBottom: 16, alignSelf: 'flex-start' }}>Most Popular</span>}
                <h4 style={{ marginBottom: 8 }}>{tier.name}</h4>
                <div className="text-gradient" style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 700, marginBottom: 8 }}>
                  {tier.annualPrice && annualBilling ? tier.annualPrice : tier.price}
                </div>
                {tier.annualPrice && annualBilling && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: -4, marginBottom: 4 }}>
                    <s style={{ color: 'var(--text-muted)' }}>{tier.monthlyPrice}/mo</s> billed annually
                  </p>
                )}
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 24 }}>{tier.desc}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', flex: 1 }}>
                  {tier.features.map((f, j) => (
                    <li key={j} style={{ padding: '8px 0', color: 'var(--text-secondary)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ color: 'var(--accent-start)' }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                {tier.action === 'dashboard' && (
                  <a href="/dashboard"><MetallicButton variant={i === 1 ? 'primary' : 'secondary'} style={{ width: '100%' }}>Get Started</MetallicButton></a>
                )}
                {tier.action === 'checkout' && (
                  <MetallicButton variant="primary" style={{ width: '100%' }} onClick={() => handleCheckout(tier.priceId)}>
                    Start Free Trial →
                  </MetallicButton>
                )}
                {tier.action === 'contact' && (
                  <a href="mailto:admin@taurusai.io?subject=NeoSync%20Enterprise%20Inquiry"><MetallicButton variant="secondary" style={{ width: '100%' }}>Contact Sales</MetallicButton></a>
                )}
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── Competitive Comparison ── */}
      <section style={{ padding: '96px 0', background: 'var(--bg-primary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span className="badge" style={{ marginBottom: 16, display: 'inline-block' }}>Why NeoSync™</span>
            <h2 style={{ marginBottom: 16 }}>Built Different.<br /><span className="text-gradient">By Design.</span></h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto' }}>How we compare to typical chatbot platforms.</p>
          </div>
          <div style={{ maxWidth: 800, margin: '0 auto', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ textAlign: 'left', padding: '16px', color: 'var(--text-muted)', fontWeight: 600 }}>Feature</th>
                  <th style={{ textAlign: 'center', padding: '16px', color: 'var(--accent-start)', fontWeight: 700 }}>NeoSync™</th>
                  <th style={{ textAlign: 'center', padding: '16px', color: 'var(--text-muted)', fontWeight: 500 }}>Typical SaaS</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Multi-Factor Auth (MFA)', '✅ TOTP', '❌ None'],
                  ['Data Privacy', '✅ Self-hosted, zero-knowledge', '❌ Cloud-only, vendor access'],
                  ['AI Cost', '✅ 95% reduction (3-tier routing)', '❌ Full cloud pricing'],
                  ['Uptime SLA', '✅ Your infrastructure, your control', '⚠️ 20-30 min daily downtime reported'],
                  ['API Access', '✅ Official WhatsApp/Telegram APIs', '⚠️ Unofficial APIs (ToS risk)'],
                  ['NLP Commands', '✅ Natural language', '❌ Visual flow builder only'],
                  ['Agent Orchestration', '✅ 5 AI frameworks', '❌ Single bot'],
                  ['Vector Search', '✅ Semantic campaign search', '❌ Keyword only'],
                  ['White-Label', '✅ $699 one-time', '✅ $699 one-time'],
                  ['Entry Price', '✅ Free tier', '❌ $14/mo minimum'],
                ].map(([feature, neosync, other], i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 500 }}>{feature}</td>
                    <td style={{ padding: '14px 16px', textAlign: 'center', color: 'var(--accent-start)', fontWeight: 600 }}>{neosync}</td>
                    <td style={{ padding: '14px 16px', textAlign: 'center', color: 'var(--text-secondary)' }}>{other}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section style={{ padding: '120px 0', textAlign: 'center', position: 'relative' }}>
        <div className="gradient-mesh" />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ marginBottom: 24 }}>Ready to Transform Your<br /><span className="text-gradient">Social Workflow?</span></h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto 40px', fontSize: '1.1rem' }}>Join teams using NeoSync™ to manage campaigns, generate content, and orchestrate AI agents — all from one dashboard.</p>
          <a href="/dashboard"><MetallicButton>Launch NeoSync™ Dashboard →</MetallicButton></a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding: '48px 0', borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700 }}>Neo<span className="text-gradient">Sync</span>™</span>
            <p className="mono" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 4 }}>TAURUS AI CORP - FZCO | License #68122, IFZA Dubai</p>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            <a href="https://github.com/taurus-ai/neosync" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>GitHub</a>
            <a href="/terms" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Terms</a>
            <a href="/privacy" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Privacy</a>
            <a href="mailto:admin@taurusai.io" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
