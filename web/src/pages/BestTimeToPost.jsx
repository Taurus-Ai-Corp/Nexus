import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../ThemeContext';
import { GlowCard, MetallicButton, ThemeToggle } from '../components/luxury';

const industries = [
  { name: 'Food & Beverage', icon: '🍽️', times: { instagram: ['11:00', '13:00', '19:00'], facebook: ['13:00', '15:00'], linkedin: ['08:00', '12:00'], tiktok: ['19:00', '21:00'] } },
  { name: 'Fashion & Beauty', icon: '👗', times: { instagram: ['11:00', '13:00', '20:00'], facebook: ['12:00', '15:00'], linkedin: ['09:00', '17:00'], tiktok: ['18:00', '21:00'] } },
  { name: 'Tech & SaaS', icon: '💻', times: { instagram: ['12:00', '17:00'], facebook: ['13:00', '15:00'], linkedin: ['08:00', '10:00', '12:00'], tiktok: ['17:00', '20:00'] } },
  { name: 'Health & Wellness', icon: '🏋️', times: { instagram: ['06:00', '12:00', '19:00'], facebook: ['10:00', '14:00'], linkedin: ['08:00', '12:00'], tiktok: ['07:00', '19:00'] } },
  { name: 'Real Estate', icon: '🏠', times: { instagram: ['11:00', '13:00', '19:00'], facebook: ['12:00', '16:00'], linkedin: ['08:00', '12:00', '17:00'], tiktok: ['18:00', '20:00'] } },
  { name: 'Education', icon: '📚', times: { instagram: ['12:00', '16:00'], facebook: ['13:00', '15:00'], linkedin: ['08:00', '11:00', '14:00'], tiktok: ['15:00', '19:00'] } },
  { name: 'Travel & Hospitality', icon: '✈️', times: { instagram: ['11:00', '13:00', '20:00'], facebook: ['12:00', '15:00'], linkedin: ['09:00', '17:00'], tiktok: ['18:00', '21:00'] } },
  { name: 'Finance & Banking', icon: '💰', times: { instagram: ['12:00', '17:00'], facebook: ['13:00', '15:00'], linkedin: ['07:00', '09:00', '12:00'], tiktok: ['17:00', '20:00'] } },
];

const platformColors = {
  instagram: '#E4405F',
  facebook: '#1877F2',
  linkedin: '#0A66C2',
  tiktok: '#000000',
};

const platformNames = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
};

const BestTimeToPost = () => {
  const { theme } = useTheme();
  const [selectedIndustry, setSelectedIndustry] = useState(null);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      // TODO: Send to email list / CRM
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', position: 'relative' }}>
      <div className="gradient-mesh" />

      {/* Navigation */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, padding: '16px 0', background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', textDecoration: 'none' }}>
            Neo<span className="text-gradient">Sync</span>™
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <a href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>← Back to Home</a>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ paddingTop: 120, paddingBottom: 48, textAlign: 'center', position: 'relative' }}>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.span className="badge" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 24, display: 'inline-block' }}>
            Free Tool
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ marginBottom: 16 }}>
            Best Time to Post<br /><span className="text-gradient">on Social Media</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto', fontSize: '1.1rem' }}>
            Select your industry to see optimal posting times for each platform. Based on engagement data from 10M+ posts.
          </motion.p>
        </div>
      </section>

      {/* Industry Selector */}
      <section style={{ padding: '0 0 48px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, maxWidth: 800, margin: '0 auto' }}>
            {industries.map((ind, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <GlowCard
                  onClick={() => setSelectedIndustry(ind)}
                  style={{ padding: 20, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s', ...(selectedIndustry?.name === ind.name ? { border: '1px solid var(--accent-start)', boxShadow: 'var(--shadow-glow)' } : {}) }}
                >
                  <div style={{ fontSize: 2, marginBottom: 8 }}>{ind.icon}</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{ind.name}</div>
                </GlowCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      {selectedIndustry && (
        <section style={{ padding: '0 0 80px' }}>
          <div className="container">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: 800, margin: '0 auto' }}>
              <h3 style={{ textAlign: 'center', marginBottom: 32, fontFamily: "'Playfair Display', serif", fontSize: '1.5rem' }}>
                Optimal Posting Times for <span className="text-gradient">{selectedIndustry.name}</span>
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20 }}>
                {Object.entries(selectedIndustry.times).map(([platform, times]) => (
                  <GlowCard key={platform} style={{ padding: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                      <div style={{ width: 12, height: 12, borderRadius: '50%', background: platformColors[platform] }} />
                      <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{platformNames[platform]}</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {times.map((time, i) => (
                        <div key={i} style={{ padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: 8, textAlign: 'center', fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                          {time}
                        </div>
                      ))}
                    </div>
                  </GlowCard>
                ))}
              </div>

              {/* Email Capture */}
              <GlowCard style={{ padding: 40, marginTop: 40, textAlign: 'center' }}>
                <h4 style={{ marginBottom: 8, fontFamily: "'Playfair Display', serif", fontSize: '1.3rem' }}>Get the Full Report</h4>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: '0.9rem' }}>
                  Receive a detailed posting schedule with engagement rates, competitor benchmarks, and AI-powered recommendations.
                </p>
                {submitted ? (
                  <div style={{ padding: 20, background: 'rgba(74, 222, 128, 0.1)', borderRadius: 12, border: '1px solid rgba(74, 222, 128, 0.3)' }}>
                    <p style={{ color: 'var(--accent-start)', fontWeight: 600 }}>✓ Report sent! Check your inbox.</p>
                    <a href="/dashboard" style={{ marginTop: 16, display: 'inline-block' }}>
                      <MetallicButton>Launch NeoSync Dashboard →</MetallicButton>
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 12, maxWidth: 400, margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      required
                      style={{ flex: 1, minWidth: 200, padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.9rem' }}
                    />
                    <MetallicButton type="submit">Get Free Report</MetallicButton>
                  </form>
                )}
              </GlowCard>
            </motion.div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer style={{ padding: '48px 0', borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
          <div>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700 }}>Neo<span className="text-gradient">Sync</span>™</span>
            <p className="mono" style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 4 }}>TAURUS AI CORP - FZCO | License #68122, IFZA Dubai</p>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            <a href="/terms" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Terms</a>
            <a href="/privacy" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Privacy</a>
            <a href="mailto:admin@taurusai.io" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BestTimeToPost;
