import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || '';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const DEMO_USERS = {
  'employee@taurusai.io': { id: 1, email: 'employee@taurusai.io', role: 'employee', password: 'employee123' },
  'admin@taurusai.io': { id: 0, email: 'admin@taurusai.io', role: 'admin', password: 'admin123' },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('neosync_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { localStorage.removeItem('neosync_user'); }
    }
    setLoading(false);
  }, []);

  const login = async (email, password, mfaCode) => {
    if (API_URL) {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, mfa_code: mfaCode || null })
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.detail || 'Login failed'); }
      const data = await res.json();
      // MFA required — return early so LoginPage can show MFA input
      if (data.mfa_required) return data;
      localStorage.setItem('neosync_access_token', data.access_token);
      localStorage.setItem('neosync_user', JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    }
    // Mock auth for deployed frontend without backend
    await new Promise(r => setTimeout(r, 600));
    const demoUser = DEMO_USERS[email.toLowerCase()];
    if (!demoUser || demoUser.password !== password) throw new Error('Invalid email or password');
    const mockUser = { id: demoUser.id, email: demoUser.email, role: demoUser.role, mfa_enabled: false };
    localStorage.setItem('neosync_user', JSON.stringify(mockUser));
    setUser(mockUser);
    return mockUser;
  };

  const register = async (email, password) => {
    if (API_URL) {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.detail || 'Registration failed'); }
      const data = await res.json();
      localStorage.setItem('neosync_access_token', data.access_token);
      localStorage.setItem('neosync_user', JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    }
    await new Promise(r => setTimeout(r, 600));
    if (DEMO_USERS[email.toLowerCase()]) throw new Error('Email already registered');
    const newUser = { id: Date.now(), email, role: 'employee' };
    localStorage.setItem('neosync_user', JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('neosync_access_token');
    localStorage.removeItem('neosync_user');
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
