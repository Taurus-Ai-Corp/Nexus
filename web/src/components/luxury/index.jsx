import { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../ThemeContext';

export const GlowCard = ({ children, className = '', delay = 0 }) => {
  const cardRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    cardRef.current.style.setProperty('--mouse-x', `${x}%`);
    cardRef.current.style.setProperty('--mouse-y', `${y}%`);
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className={`glow-card ${className}`}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

export const GlassPanel = ({ children, className = '' }) => (
  <div className={`glass ${className}`}>{children}</div>
);

export const MetallicButton = ({ children, variant = 'primary', className = '', onClick, type = 'button' }) => (
  <button type={type} className={`metallic-btn ${variant === 'secondary' ? 'secondary' : ''} ${className}`} onClick={onClick}>
    {children}
  </button>
);

export const ScrollProgress = () => {
  const progressRef = useRef(null);

  const updateProgress = useCallback(() => {
    if (!progressRef.current) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;
    progressRef.current.style.transform = `scaleX(${progress})`;
  }, []);

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', updateProgress, { passive: true });
  }

  return <div ref={progressRef} className="scroll-progress" style={{ transform: 'scaleX(0)' }} />;
};

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme} style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'var(--text-primary)', fontSize: 18, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
      {theme === 'dark' ? '☀' : '☾'}
    </button>
  );
};
