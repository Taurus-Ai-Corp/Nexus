import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../AuthContext';
import { MetallicButton } from '../components/luxury';

const LoginPage = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('employee@taurusai.io');
  const [password, setPassword] = useState('employee123');
  const [mfaCode, setMfaCode] = useState('');
  const [mfaRequired, setMfaRequired] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mfaRequired) {
        await login(email, password, mfaCode);
        navigate('/dashboard');
      } else {
        const result = await (isRegister ? register : login)(email, password);
        if (result && result.mfa_required) {
          setMfaRequired(true);
          setError('');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', position: 'relative', padding: 24 }}>
      <div className="gradient-mesh" style={{ opacity: 0.4 }} />

      {/* Floating accents */}
      <div className="float" style={{ position: 'absolute', top: '20%', left: '15%', width: 80, height: 80, borderRadius: '50%', background: 'var(--accent-glow)', filter: 'blur(60px)' }} />
      <div className="float-slow" style={{ position: 'absolute', bottom: '25%', right: '20%', width: 100, height: 100, borderRadius: '50%', background: 'hsla(260, 60%, 50%, 0.08)', filter: 'blur(80px)' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420 }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link to="/" style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', textDecoration: 'none' }}>
            Neo<span className="text-gradient">Sync</span>™
          </Link>
          <p style={{ color: 'var(--text-secondary)', marginTop: 8, fontSize: '0.9rem' }}>
            {mfaRequired ? 'Enter your authentication code' : isRegister ? 'Create your account' : 'Sign in to your account'}
          </p>
        </div>

        {/* Card */}
        <div className="glow-card" style={{ padding: 40 }}>
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {!mfaRequired ? (
                <motion.div key="credentials" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Email</label>
                    <input
                      type="email" value={email} onChange={e => setEmail(e.target.value)} required
                      placeholder="you@company.com"
                      style={{
                        width: '100%', padding: '14px 16px', borderRadius: 12, border: '1px solid var(--border)',
                        background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '0.95rem',
                        outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box'
                      }}
                      onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-start)'}
                      onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
                    />
                  </div>

                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Password</label>
                    <input
                      type="password" value={password} onChange={e => setPassword(e.target.value)} required
                      placeholder="••••••••"
                      style={{
                        width: '100%', padding: '14px 16px', borderRadius: 12, border: '1px solid var(--border)',
                        background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '0.95rem',
                        outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box'
                      }}
                      onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-start)'}
                      onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div key="mfa" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <div style={{ fontSize: 3, marginBottom: 12 }}>🔐</div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      Enter the 6-digit code from your authenticator app
                    </p>
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Authentication Code</label>
                    <input
                      type="text" value={mfaCode} onChange={e => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))} required
                      placeholder="000000" maxLength={6}
                      style={{
                        width: '100%', padding: '14px 16px', borderRadius: 12, border: '1px solid var(--border)',
                        background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '1.5rem',
                        outline: 'none', fontFamily: 'monospace', boxSizing: 'border-box', textAlign: 'center', letterSpacing: '0.5em'
                      }}
                      onFocus={e => e.currentTarget.style.borderColor = 'var(--accent-start)'}
                      onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
                      autoFocus
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <div style={{ padding: '12px 16px', borderRadius: 8, background: 'hsla(0, 70%, 50%, 0.1)', border: '1px solid hsla(0, 70%, 50%, 0.3)', color: '#f87171', fontSize: '0.85rem', marginBottom: 20 }}>
                {error}
              </div>
            )}

            <MetallicButton type="submit" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Please wait...' : mfaRequired ? 'Verify Code' : isRegister ? 'Create Account' : 'Sign In'} →
            </MetallicButton>

            {mfaRequired && (
              <button
                type="button"
                onClick={() => { setMfaRequired(false); setMfaCode(''); setError(''); }}
                style={{ width: '100%', marginTop: 12, padding: '12px 0', background: 'none', border: '1px solid var(--border)', borderRadius: 12, color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'Inter, sans-serif' }}
              >
                ← Back to login
              </button>
            )}
          </form>
        </div>

        {/* Toggle */}
        {!mfaRequired && (
          <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              style={{ background: 'none', border: 'none', color: 'var(--accent-start)', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', fontFamily: 'Inter, sans-serif' }}
            >
              {isRegister ? 'Sign in' : 'Create one'}
            </button>
          </p>
        )}

        {/* Demo credentials */}
        {!isRegister && !mfaRequired && (
          <div style={{ marginTop: 32, padding: 16, borderRadius: 8, background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
            <p className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>Demo Credentials</p>
            <p className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>employee@taurusai.io / employee123</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default LoginPage;
