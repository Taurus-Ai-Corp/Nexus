import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../ThemeContext';
import { useAuth } from '../AuthContext';
import { GlowCard, MetallicButton, ScrollProgress, ThemeToggle } from '../components/luxury';
import MetaCampaignPage from './MetaCampaignPage';

const navItems = [
  { key: 'dashboard', icon: '◉', label: 'Dashboard' },
  { key: 'meta', icon: 'f', label: 'Meta Campaigns' },
  { key: 'instagram', icon: '◎', label: 'Instagram' },
  { key: 'bizflow', icon: '◆', label: 'BizFlow' },
  { key: 'neovibe', icon: '✦', label: 'NeoVibe' },
  { key: 'agents', icon: '⚙', label: 'Agents' },
  { key: 'status', icon: '◈', label: 'System Status' },
];

const mockCampaigns = [
  { id: 1, name: "Toronto Café Summer Push", objective: "lead_gen", platform: "meta", status: "active", budget_daily: 30 },
  { id: 2, name: "Dubai Luxury Real Estate Q2", objective: "sales", platform: "instagram", status: "active", budget_daily: 75 },
  { id: 3, name: "Kerala Ayurveda Wellness", objective: "engagement", platform: "meta", status: "paused", budget_daily: 20 },
  { id: 4, name: "NRI Investment Advisory", objective: "lead_gen", platform: "instagram", status: "active", budget_daily: 50 },
  { id: 5, name: "PQC Migration Services", objective: "brand_awareness", platform: "meta", status: "draft", budget_daily: 100 },
];

const DashboardPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [activeNav, setActiveNav] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [campaigns, setCampaigns] = useState(mockCampaigns);

  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget_daily, 0);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-primary)', position: 'relative' }}>
      <div className="gradient-mesh" style={{ opacity: 0.5 }} />
      <ScrollProgress />

      {/* ── Sidebar ── */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarCollapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{
          position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 100,
          background: 'var(--glass-bg)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          borderRight: '1px solid var(--glass-border)', padding: '24px 0', display: 'flex', flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <div style={{ padding: '0 20px', marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <motion.span animate={{ opacity: sidebarCollapsed ? 0 : 1 }} style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
            Neo<span className="text-gradient">Sync</span>™
          </motion.span>
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 18, padding: 4 }}>
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        <nav style={{ flex: 1, padding: '0 12px' }}>
          {navItems.map(item => (
            <button
              key={item.key}
              onClick={() => setActiveNav(item.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, width: '100%', padding: sidebarCollapsed ? '12px 0' : '12px 16px',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                background: activeNav === item.key ? 'var(--accent-glow)' : 'transparent',
                border: 'none', borderRadius: 12, cursor: 'pointer', marginBottom: 4,
                color: activeNav === item.key ? 'var(--accent-start)' : 'var(--text-secondary)',
                fontSize: '0.9rem', fontWeight: 500, transition: 'all 0.2s ease',
                fontFamily: 'Inter, sans-serif'
              }}
              onMouseEnter={e => { if (activeNav !== item.key) e.currentTarget.style.background = 'var(--surface-hover)'; }}
              onMouseLeave={e => { if (activeNav !== item.key) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ fontSize: 1.2, width: 24, textAlign: 'center' }}>{item.icon}</span>
              <motion.span animate={{ opacity: sidebarCollapsed ? 0 : 1, width: sidebarCollapsed ? 0 : 'auto' }} style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
                {item.label}
              </motion.span>
            </button>
          ))}
        </nav>

        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-start), var(--accent-end))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'hsl(220, 25%, 8%)', fontWeight: 600, fontSize: '0.85rem' }}>
              {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <motion.div animate={{ opacity: sidebarCollapsed ? 0 : 1 }} style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)' }}>{user?.email?.split('@')[0] || 'User'}</div>
              <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user?.role || 'employee'}</div>
            </motion.div>
          </div>
          <button onClick={logout} style={{ marginTop: 12, width: '100%', padding: '8px 0', background: 'none', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'Inter, sans-serif', display: sidebarCollapsed ? 'none' : 'block' }}>
            Sign Out
          </button>
        </div>
      </motion.aside>

      {/* ── Main Content ── */}
      <main style={{ flex: 1, marginLeft: sidebarCollapsed ? 72 : 260, transition: 'margin-left 0.3s ease', padding: '24px 32px', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: 4 }}>
              {navItems.find(n => n.key === activeNav)?.label || 'Dashboard'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Signed in as {user?.email}</p>
          </div>
          <ThemeToggle />
        </header>

        {/* ── Dashboard Overview ── */}
        {activeNav === 'dashboard' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
              <GlowCard delay={0} style={{ padding: 24 }}>
                <div className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8 }}>TOTAL CAMPAIGNS</div>
                <div className="text-gradient" style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 700 }}>{campaigns.length}</div>
              </GlowCard>
              <GlowCard delay={0.1} style={{ padding: 24 }}>
                <div className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8 }}>ACTIVE</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 700, color: '#4ade80' }}>{activeCampaigns}</div>
              </GlowCard>
              <GlowCard delay={0.2} style={{ padding: 24 }}>
                <div className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8 }}>DAILY BUDGET</div>
                <div className="text-gradient" style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 700 }}>${totalBudget}</div>
              </GlowCard>
              <GlowCard delay={0.3} style={{ padding: 24 }}>
                <div className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 8 }}>AI MODELS</div>
                <div className="text-gradient" style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 700 }}>364+</div>
              </GlowCard>
            </div>

            {/* NLP Command Panel */}
            <GlowCard style={{ padding: 32, marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <span style={{ fontSize: 1.5 }}>⚡</span>
                <h4 style={{ fontSize: '1.2rem' }}>NLP Command Interpreter</h4>
                <span className="badge" style={{ marginLeft: 'auto' }}>Rule-based (Instant)</span>
              </div>
              <NLPCommandPanel />
            </GlowCard>

            {/* Campaigns Table */}
            <GlowCard style={{ padding: 32 }}>
              <h4 style={{ fontSize: '1.2rem', marginBottom: 20 }}>Recent Campaigns</h4>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      {['Campaign', 'Platform', 'Objective', 'Budget/Day', 'Status'].map(h => (
                        <th key={h} className="mono" style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--text-muted)', fontWeight: 500, fontSize: '0.75rem', letterSpacing: '0.05em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map(c => (
                      <tr key={c.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '14px 16px', fontWeight: 500 }}>{c.name}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span className="mono" style={{ padding: '4px 10px', borderRadius: 6, background: c.platform === 'meta' ? 'hsla(220, 60%, 50%, 0.1)' : 'hsla(320, 60%, 50%, 0.1)', color: c.platform === 'meta' ? '#60a5fa' : '#f472b6', fontSize: '0.75rem' }}>
                            {c.platform}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{c.objective}</td>
                        <td style={{ padding: '14px 16px', fontWeight: 500 }}>${c.budget_daily}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 500, background: c.status === 'active' ? 'hsla(142, 60%, 50%, 0.1)' : c.status === 'paused' ? 'hsla(38, 90%, 50%, 0.1)' : 'hsla(220, 10%, 50%, 0.1)', color: c.status === 'active' ? '#4ade80' : c.status === 'paused' ? '#fbbf24' : 'var(--text-muted)' }}>
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlowCard>
          </motion.div>
        )}

        {/* ── Meta Campaigns ── */}
        {activeNav === 'meta' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <MetaCampaignPage />
          </motion.div>
        )}

        {/* ── Other Nav Items (placeholder) ── */}
        {activeNav !== 'dashboard' && activeNav !== 'meta' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <GlowCard style={{ padding: 48, textAlign: 'center' }}>
              <div style={{ fontSize: 3, marginBottom: 16 }}>🚧</div>
              <h3 style={{ marginBottom: 12 }}>{navItems.find(n => n.key === activeNav)?.label}</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>This section is being built with the luxury design system. Check back soon.</p>
              <a href="https://nexus-social.vercel.app" target="_blank" rel="noopener noreferrer">
                <MetallicButton>View Live Dashboard →</MetallicButton>
              </a>
            </GlowCard>
          </motion.div>
        )}
      </main>
    </div>
  );
};

const NLPCommandPanel = () => {
  const [command, setCommand] = useState('');
  const [result, setResult] = useState(null);

  const interpretCommand = (text) => {
    const lower = text.toLowerCase();
    let intent = 'general_query', entities = {}, action = {};
    if (lower.includes('instagram') || lower.includes('ig')) {
      intent = 'create_instagram_campaign';
      const budgetMatch = text.match(/\$(\d+)/);
      entities = { platform: 'instagram', budget_daily: budgetMatch ? parseInt(budgetMatch[1]) : 25, ad_format: lower.includes('story') ? 'story' : 'feed' };
      action = { endpoint: '/api/neovibe/instagram-campaigns', method: 'POST', payload: { name: `IG Campaign ${Date.now()}`, objective: 'engagement', platform: 'instagram', status: 'draft', budget_daily: entities.budget_daily } };
    } else if (lower.includes('meta') || lower.includes('facebook')) {
      intent = 'create_meta_campaign';
      const budgetMatch = text.match(/\$(\d+)/);
      entities = { platform: 'meta', budget_daily: budgetMatch ? parseInt(budgetMatch[1]) : 30 };
      action = { endpoint: '/api/bizflow/meta-campaigns', method: 'POST', payload: { name: `Meta Campaign ${Date.now()}`, objective: 'lead_gen', platform: 'meta', status: 'draft', budget_daily: entities.budget_daily } };
    } else {
      intent = 'general_query';
      entities = { query: text };
    }
    return { intent, entities, suggested_action: action, tier: 'rule-based', cost_estimate: 0, latency_ms: Math.floor(Math.random() * 50 + 10) };
  };

  const handleInterpret = () => {
    if (!command.trim()) return;
    setResult(interpretCommand(command));
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <input
          value={command}
          onChange={e => setCommand(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleInterpret()}
          placeholder="e.g., Create an Instagram story ad for a café in Toronto with $30/day budget"
          style={{
            flex: 1, padding: '14px 20px', borderRadius: 12, border: '1px solid var(--border)',
            background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '0.95rem',
            outline: 'none', fontFamily: 'Inter, sans-serif'
          }}
          onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-start)'}
          onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
        />
        <MetallicButton onClick={handleInterpret}>Send →</MetallicButton>
      </div>
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ padding: 20, background: 'var(--bg-primary)', borderRadius: 12, border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
              <span className="badge">Intent: {result.intent}</span>
              <span className="badge" style={{ background: 'hsla(142, 60%, 50%, 0.1)', color: '#4ade80', borderColor: '#4ade80' }}>Tier: {result.tier}</span>
              <span className="mono" style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{result.latency_ms}ms</span>
            </div>
            <pre style={{ background: 'var(--bg-secondary)', padding: 16, borderRadius: 8, fontSize: '0.8rem', color: 'var(--text-secondary)', overflow: 'auto', maxHeight: 150, border: '1px solid var(--border)' }}>
              {JSON.stringify(result.entities, null, 2)}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardPage;
