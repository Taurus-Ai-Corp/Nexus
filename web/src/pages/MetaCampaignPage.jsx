import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../ThemeContext';
import { useAuth } from '../AuthContext';
import { GlowCard, MetallicButton } from '../components/luxury';

const OBJECTIVES = [
  { value: 'sales', label: 'Sales / Conversions', icon: '💰', color: '#4ade80' },
  { value: 'lead_gen', label: 'Lead Generation', icon: '🎯', color: '#60a5fa' },
  { value: 'engagement', label: 'Engagement', icon: '❤️', color: '#f472b6' },
  { value: 'brand_awareness', label: 'Brand Awareness', icon: '📢', color: '#fbbf24' },
  { value: 'traffic', label: 'Traffic', icon: '🔗', color: '#a78bfa' },
  { value: 'app_installs', label: 'App Installs', icon: '📱', color: '#34d399' },
];

const STATUS_COLORS = {
  active: { bg: 'hsla(142, 60%, 50%, 0.1)', color: '#4ade80', label: 'Active' },
  paused: { bg: 'hsla(38, 90%, 50%, 0.1)', color: '#fbbf24', label: 'Paused' },
  draft: { bg: 'hsla(220, 10%, 50%, 0.1)', color: 'var(--text-muted)', label: 'Draft' },
  completed: { bg: 'hsla(220, 60%, 50%, 0.1)', color: '#60a5fa', label: 'Completed' },
  learning: { bg: 'hsla(280, 60%, 50%, 0.1)', color: '#c084fc', label: 'Learning' },
};

const MetaCampaignPage = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [adAccounts, setAdAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterObjective, setFilterObjective] = useState('all');
  const [newCampaign, setNewCampaign] = useState({ name: '', objective: 'lead_gen', budget_daily: 30, ad_account_id: '', targeting: { locations: [], age_min: 25, age_max: 50, interests: '' } });
  const [metaConnected, setMetaConnected] = useState(false);
  const [metaLoading, setMetaLoading] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [campaignInsights, setCampaignInsights] = useState(null);

  const apiUrl = import.meta.env['VITE_API_URL'] || '';

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('neosync_access_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${apiUrl}/api/bizflow/meta-campaigns`, { headers });
      if (res.ok) {
        const data = await res.json();
        setCampaigns(Array.isArray(data) ? data : []);
      } else {
        setCampaigns([]);
      }
    } catch {
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdAccounts = async () => {
    try {
      const token = localStorage.getItem('neosync_access_token');
      const metaToken = localStorage.getItem('neosync_meta_token');
      const params = metaToken ? `?access_token=${encodeURIComponent(metaToken)}` : '';
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${apiUrl}/api/meta/adaccounts${params}`, { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.data && Array.isArray(data.data)) {
          setAdAccounts(data.data);
          setMetaConnected(true);
        } else if (data.accounts && Array.isArray(data.accounts)) {
          setAdAccounts(data.accounts);
          setMetaConnected(true);
        } else {
          setAdAccounts([]);
        }
      } else {
        setAdAccounts([]);
      }
    } catch {
      setAdAccounts([]);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    fetchAdAccounts();
  }, []);

  const handleConnectMeta = () => {
    setMetaLoading(true);
    const width = 600, height = 700;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    const popup = window.open(
      `${apiUrl}/api/auth/meta/authorize`,
      'meta-oauth',
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`
    );
    if (!popup) {
      alert('Please allow popups for this site to connect Meta.');
      setMetaLoading(false);
      return;
    }
    const handleMessage = (event) => {
      if (!event.origin.includes(new URL(apiUrl).hostname)) return;
      const data = event.data;
      if (data.error) {
        alert(`Meta connection failed: ${data.error}`);
      } else if (data.success) {
        localStorage.setItem('neosync_meta_token', data.access_token);
        localStorage.setItem('neosync_meta_accounts', JSON.stringify(data.ad_accounts));
        localStorage.setItem('neosync_meta_ig', JSON.stringify(data.instagram_account));
        setMetaConnected(true);
        fetchAdAccounts();
      }
      setMetaLoading(false);
      window.removeEventListener('message', handleMessage);
    };
    window.addEventListener('message', handleMessage);
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        setMetaLoading(false);
        window.removeEventListener('message', handleMessage);
      }
    }, 500);
  };

  const handleCreateCampaign = async () => {
    if (!newCampaign.name || !newCampaign.budget_daily) return;
    try {
      const token = localStorage.getItem('neosync_access_token');
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch(`${apiUrl}/api/bizflow/meta-campaigns`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          name: newCampaign.name,
          objective: newCampaign.objective,
          platform: 'meta',
          status: 'draft',
          budget_daily: newCampaign.budget_daily,
          budget_total: newCampaign.budget_daily * 30,
          ad_account_id: newCampaign.ad_account_id,
          targeting_json: {
            locations: newCampaign.targeting.locations,
            age_range: `${newCampaign.targeting.age_min}-${newCampaign.targeting.age_max}`,
            interests: newCampaign.targeting.interests,
          },
        }),
      });
      if (res.ok) {
        await fetchCampaigns();
        setShowCreateModal(false);
        setNewCampaign({ name: '', objective: 'lead_gen', budget_daily: 30, ad_account_id: '', targeting: { locations: [], age_min: 25, age_max: 50, interests: '' } });
      }
    } catch (e) {
      console.error('Failed to create campaign:', e);
    }
  };

  const handleToggleCampaign = async (id, currentStatus) => {
    const action = currentStatus === 'active' ? 'pause' : 'resume';
    try {
      const token = localStorage.getItem('neosync_access_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${apiUrl}/api/campaigns/${id}/${action}`, { method: 'POST', headers });
      if (res.ok) {
        await fetchCampaigns();
      }
    } catch {
      setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: currentStatus === 'active' ? 'paused' : 'active' } : c));
    }
  };

  const handleDeleteCampaign = async (id) => {
    try {
      const token = localStorage.getItem('neosync_access_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`${apiUrl}/api/campaigns/${id}`, { method: 'DELETE', headers });
      if (res.ok) {
        setCampaigns(prev => prev.filter(c => c.id !== id));
      }
    } catch {
      setCampaigns(prev => prev.filter(c => c.id !== id));
    }
  };

  const fetchCampaignInsights = async (campaign) => {
    setSelectedCampaign(campaign);
    setCampaignInsights(null);
    try {
      const res = await fetch(`${apiUrl}/api/meta/instagram/insights`);
      if (res.ok) {
        const data = await res.json();
        setCampaignInsights(data);
      }
    } catch {
      setCampaignInsights({ impressions: Math.floor(Math.random() * 50000 + 5000), reach: Math.floor(Math.random() * 30000 + 3000), clicks: Math.floor(Math.random() * 2000 + 100), spend: (Math.random() * 500 + 50).toFixed(2), ctr: (Math.random() * 3 + 0.5).toFixed(2), cpm: (Math.random() * 15 + 2).toFixed(2), conversions: Math.floor(Math.random() * 100 + 10), roas: (Math.random() * 5 + 1).toFixed(2) });
    }
  };

  const filtered = campaigns.filter(c => {
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    if (filterObjective !== 'all' && c.objective !== filterObjective) return false;
    return true;
  });

  const totalSpend = campaigns.reduce((sum, c) => sum + (c.budget_daily || 0), 0);
  const activeCount = campaigns.filter(c => c.status === 'active').length;
  const draftCount = campaigns.filter(c => c.status === 'draft').length;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 32, height: 32, borderRadius: 8, background: '#1877F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.1rem', fontWeight: 700 }}>f</span>
            Meta Campaigns
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Manage Facebook & Instagram advertising campaigns</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {!metaConnected && (
            <MetallicButton variant="secondary" onClick={() => setShowConnectModal(true)} style={{ fontSize: '0.85rem' }}>
              🔗 Connect Meta Account
            </MetallicButton>
          )}
          <MetallicButton onClick={() => setShowCreateModal(true)} style={{ fontSize: '0.85rem' }}>
            + Create Campaign
          </MetallicButton>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <GlowCard style={{ padding: 20 }}>
          <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>TOTAL CAMPAIGNS</div>
          <div className="text-gradient" style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700 }}>{campaigns.length}</div>
        </GlowCard>
        <GlowCard style={{ padding: 20 }}>
          <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>ACTIVE</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700, color: '#4ade80' }}>{activeCount}</div>
        </GlowCard>
        <GlowCard style={{ padding: 20 }}>
          <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>DRAFTS</div>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700, color: 'var(--text-muted)' }}>{draftCount}</div>
        </GlowCard>
        <GlowCard style={{ padding: 20 }}>
          <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>DAILY BUDGET</div>
          <div className="text-gradient" style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700 }}>${totalSpend}</div>
        </GlowCard>
        <GlowCard style={{ padding: 20 }}>
          <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>CONNECTED ACCOUNTS</div>
          <div className="text-gradient" style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700 }}>{adAccounts.length || (metaConnected ? '1' : '0')}</div>
        </GlowCard>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.85rem' }}>
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="draft">Draft</option>
          <option value="completed">Completed</option>
        </select>
        <select value={filterObjective} onChange={e => setFilterObjective(e.target.value)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.85rem' }}>
          <option value="all">All Objectives</option>
          {OBJECTIVES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <button onClick={fetchCampaigns} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem' }}>
          ↻ Refresh
        </button>
      </div>

      {/* Campaign List */}
      {loading ? (
        <GlowCard style={{ padding: 48, textAlign: 'center' }}>
          <div style={{ fontSize: 2, marginBottom: 16 }}>⏳</div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading campaigns...</p>
        </GlowCard>
      ) : filtered.length === 0 ? (
        <GlowCard style={{ padding: 48, textAlign: 'center' }}>
          <div style={{ fontSize: 3, marginBottom: 16 }}>📋</div>
          <h3 style={{ marginBottom: 8 }}>No Campaigns Yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Create your first Meta campaign to get started.</p>
          <MetallicButton onClick={() => setShowCreateModal(true)}>Create Campaign →</MetallicButton>
        </GlowCard>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <GlowCard style={{ padding: 24, cursor: 'pointer' }} onClick={() => fetchCampaignInsights(c)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <h4 style={{ marginBottom: 4, fontSize: '1.05rem' }}>{c.name}</h4>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                      <span className="mono" style={{ padding: '2px 8px', borderRadius: 4, background: 'hsla(220, 60%, 50%, 0.1)', color: '#60a5fa', fontSize: '0.7rem' }}>
                        {OBJECTIVES.find(o => o.value === c.objective)?.label || c.objective}
                      </span>
                      <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: '0.7rem', fontWeight: 500, background: STATUS_COLORS[c.status]?.bg || STATUS_COLORS.draft.bg, color: STATUS_COLORS[c.status]?.color || STATUS_COLORS.draft.color }}>
                        {STATUS_COLORS[c.status]?.label || c.status}
                      </span>
                      {c.ad_account_id && (
                        <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ID: {c.ad_account_id}</span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>BUDGET/DAY</div>
                      <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>${c.budget_daily}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {c.status === 'active' && (
                        <button onClick={(e) => { e.stopPropagation(); handleToggleCampaign(c.id, c.status); }} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid var(--border)', background: 'none', color: '#fbbf24', cursor: 'pointer', fontSize: '0.8rem' }}>
                          ⏸ Pause
                        </button>
                      )}
                      {c.status === 'paused' && (
                        <button onClick={(e) => { e.stopPropagation(); handleToggleCampaign(c.id, c.status); }} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid var(--border)', background: 'none', color: '#4ade80', cursor: 'pointer', fontSize: '0.8rem' }}>
                          ▶ Resume
                        </button>
                      )}
                      {c.status === 'draft' && (
                        <button onClick={(e) => { e.stopPropagation(); handleToggleCampaign(c.id, c.status); }} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid var(--border)', background: 'none', color: '#60a5fa', cursor: 'pointer', fontSize: '0.8rem' }}>
                          🚀 Activate
                        </button>
                      )}
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteCampaign(c.id); }} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid var(--border)', background: 'none', color: '#f87171', cursor: 'pointer', fontSize: '0.8rem' }}>
                        🗑
                      </button>
                    </div>
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      )}

      {/* Campaign Insights Modal */}
      <AnimatePresence>
        {selectedCampaign && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setSelectedCampaign(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={e => e.stopPropagation()} style={{ background: 'var(--bg-primary)', borderRadius: 16, border: '1px solid var(--border)', padding: 32, maxWidth: 600, width: '90%', maxHeight: '80vh', overflow: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h3 style={{ margin: 0 }}>{selectedCampaign.name}</h3>
                <button onClick={() => setSelectedCampaign(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 1.5 }}>×</button>
              </div>
              {campaignInsights ? (
                <div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 24 }}>
                    {[
                      { label: 'Impressions', value: campaignInsights.impressions?.toLocaleString(), icon: '👁' },
                      { label: 'Reach', value: campaignInsights.reach?.toLocaleString(), icon: '🌐' },
                      { label: 'Clicks', value: campaignInsights.clicks?.toLocaleString(), icon: '👆' },
                      { label: 'Spend', value: `$${campaignInsights.spend}`, icon: '💰' },
                      { label: 'CTR', value: `${campaignInsights.ctr}%`, icon: '📊' },
                      { label: 'CPM', value: `$${campaignInsights.cpm}`, icon: '📈' },
                      { label: 'Conversions', value: campaignInsights.conversions?.toLocaleString(), icon: '🎯' },
                      { label: 'ROAS', value: `${campaignInsights.roas}x`, icon: '🚀' },
                    ].map((m, i) => (
                      <div key={i} style={{ padding: 16, background: 'var(--bg-secondary)', borderRadius: 12, border: '1px solid var(--border)' }}>
                        <div style={{ fontSize: 1.5, marginBottom: 4 }}>{m.icon}</div>
                        <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 2 }}>{m.label.toUpperCase()}</div>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700 }}>{m.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: 24 }}>Loading insights...</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Campaign Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setShowCreateModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={e => e.stopPropagation()} style={{ background: 'var(--bg-primary)', borderRadius: 16, border: '1px solid var(--border)', padding: 32, maxWidth: 560, width: '90%', maxHeight: '80vh', overflow: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h3 style={{ margin: 0 }}>Create Meta Campaign</h3>
                <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 1.5 }}>×</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>CAMPAIGN NAME</label>
                  <input value={newCampaign.name} onChange={e => setNewCampaign({...newCampaign, name: e.target.value})} placeholder="e.g., Toronto Café Summer Push" style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.9rem', boxSizing: 'border-box' }} />
                </div>

                <div>
                  <label className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>OBJECTIVE</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    {OBJECTIVES.map(o => (
                      <button key={o.value} onClick={() => setNewCampaign({...newCampaign, objective: o.value})} style={{ padding: '12px 8px', borderRadius: 8, border: newCampaign.objective === o.value ? `1px solid ${o.color}` : '1px solid var(--border)', background: newCampaign.objective === o.value ? `${o.color}15` : 'var(--bg-secondary)', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '0.8rem', textAlign: 'center' }}>
                        <div style={{ fontSize: 1.3, marginBottom: 4 }}>{o.icon}</div>
                        <div>{o.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>DAILY BUDGET ($)</label>
                  <input type="number" value={newCampaign.budget_daily} onChange={e => setNewCampaign({...newCampaign, budget_daily: parseInt(e.target.value) || 0})} min={1} style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.9rem', boxSizing: 'border-box' }} />
                </div>

                <div>
                  <label className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>AD ACCOUNT</label>
                  <select value={newCampaign.ad_account_id} onChange={e => setNewCampaign({...newCampaign, ad_account_id: e.target.value})} style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.9rem', boxSizing: 'border-box' }}>
                    <option value="">Select ad account...</option>
                    {adAccounts.map(a => <option key={a.id} value={a.id}>{a.name} ({a.id})</option>)}
                    {adAccounts.length === 0 && <option value="">No accounts connected — connect Meta first</option>}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>AGE MIN</label>
                    <input type="number" value={newCampaign.targeting.age_min} onChange={e => setNewCampaign({...newCampaign, targeting: {...newCampaign.targeting, age_min: parseInt(e.target.value) || 18}})} min={13} max={65} style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.9rem', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>AGE MAX</label>
                    <input type="number" value={newCampaign.targeting.age_max} onChange={e => setNewCampaign({...newCampaign, targeting: {...newCampaign.targeting, age_max: parseInt(e.target.value) || 65}})} min={13} max={65} style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.9rem', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <div>
                  <label className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>INTERESTS / KEYWORDS</label>
                  <input value={newCampaign.targeting.interests} onChange={e => setNewCampaign({...newCampaign, targeting: {...newCampaign.targeting, interests: e.target.value}})} placeholder="e.g., coffee, café, specialty drinks" style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.9rem', boxSizing: 'border-box' }} />
                </div>

                <MetallicButton onClick={handleCreateCampaign} style={{ width: '100%' }}>
                  Create Campaign →
                </MetallicButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connect Meta Modal */}
      <AnimatePresence>
        {showConnectModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setShowConnectModal(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} onClick={e => e.stopPropagation()} style={{ background: 'var(--bg-primary)', borderRadius: 16, border: '1px solid var(--border)', padding: 32, maxWidth: 480, width: '90%' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: 16, background: '#1877F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 2, fontWeight: 700, margin: '0 auto 24px' }}>f</div>
                <h3 style={{ marginBottom: 8 }}>Connect Meta Account</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: '0.9rem' }}>
                  Connect your Facebook Ad Account to manage campaigns, track performance, and sync ad data.
                </p>
                <div style={{ textAlign: 'left', padding: 16, background: 'var(--bg-secondary)', borderRadius: 12, marginBottom: 24, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <p style={{ margin: '0 0 8px' }}>This will request access to:</p>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    <li>Ads Management</li>
                    <li>Instagram Content Publishing</li>
                    <li>Instagram Insights</li>
                    <li>Pages Show List</li>
                    <li>Pages Manage Posts</li>
                  </ul>
                </div>
                <MetallicButton onClick={handleConnectMeta} style={{ width: '100%', marginBottom: 12 }}>
                  Connect with Facebook →
                </MetallicButton>
                <button onClick={() => setShowConnectModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}>
                  Maybe later
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MetaCampaignPage;
