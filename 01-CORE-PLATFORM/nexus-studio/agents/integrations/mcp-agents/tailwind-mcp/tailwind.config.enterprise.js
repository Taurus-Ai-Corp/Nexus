/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,ts,jsx,tsx}',
    './public/**/*.{html,js}',
    '../../../BIZFLOW-COMPETITIVE-INTELLIGENCE-PLATFORM/**/*.{html,js,ts,jsx,tsx}',
    './components/**/*.{html,js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Enable dark mode support
  theme: {
    // TAURUS AI Enterprise Breakpoints
    screens: {
      'xs': '475px',      // Extra small devices
      'sm': '640px',      // Small devices (phones)
      'md': '768px',      // Medium devices (tablets)
      'lg': '1024px',     // Large devices (laptops)
      'xl': '1280px',     // Extra large devices (desktops)
      '2xl': '1536px',    // 2X large devices
      '3xl': '1920px',    // Ultra-wide monitors
      '4k': '2560px',     // 4K displays
      // Custom breakpoints for enterprise dashboards
      'tablet-portrait': {'raw': '(min-width: 768px) and (orientation: portrait)'},
      'tablet-landscape': {'raw': '(min-width: 1024px) and (orientation: landscape)'},
      'desktop-sm': '1366px',  // Common laptop resolution
      'desktop-lg': '1680px',  // Large desktop
      'executive': '2880px',   // Executive display systems
    },
    extend: {
      // TAURUS AI Brand Colors - Enhanced Palette
      colors: {
        // Primary Intelligence Colors
        taurus: {
          primary: {
            50: '#eff6ff',
            100: '#dbeafe', 
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',  // Main brand blue
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
            950: '#0f1629'
          },
          // Competitive Intelligence Theme
          intelligence: {
            bg: {
              primary: '#0f172a',     // Deep space blue
              secondary: '#1e293b',   // Lighter space blue  
              tertiary: '#334155',    // Medium slate
              glass: 'rgba(15, 23, 42, 0.95)', // Glass effect
              glassDark: 'rgba(30, 41, 59, 0.9)',
            },
            border: {
              primary: 'rgba(59, 130, 246, 0.3)',  // Blue border
              secondary: 'rgba(100, 116, 139, 0.5)', // Slate border
              accent: 'rgba(34, 197, 94, 0.3)',    // Green accent
              warning: 'rgba(245, 158, 11, 0.3)',  // Amber warning
              danger: 'rgba(239, 68, 68, 0.3)',    // Red danger
            },
            glow: {
              primary: 'rgba(59, 130, 246, 0.4)',
              success: 'rgba(34, 197, 94, 0.4)',
              warning: 'rgba(245, 158, 11, 0.4)', 
              danger: 'rgba(239, 68, 68, 0.4)',
              cyan: 'rgba(6, 182, 212, 0.4)',
            }
          },
          // Status Colors for Intelligence
          status: {
            monitoring: '#22c55e',    // Green - actively monitoring
            threat: '#ef4444',        // Red - threat detected  
            opportunity: '#3b82f6',   // Blue - opportunity
            neutral: '#64748b',       // Gray - neutral/unknown
            warning: '#f59e0b',       // Amber - warning state
          },
          // Threat Levels
          threat: {
            low: '#22c55e',      // Green
            medium: '#f59e0b',   // Amber
            high: '#ef4444',     // Red
            critical: '#dc2626', // Dark red
          }
        },
        // Extended color palette for competitive analysis
        competitor: {
          50: '#fef2f2',
          100: '#fee2e2', 
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        opportunity: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0', 
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        }
      },
      
      // Enterprise Typography Scale
      fontFamily: {
        'taurus-sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'taurus-mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
        'taurus-display': ['Inter', 'system-ui', 'sans-serif'], // For headings
      },
      
      // Responsive Typography
      fontSize: {
        // Mobile-first responsive sizes
        'xs-responsive': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.025em' }],
        'sm-responsive': ['0.875rem', { lineHeight: '1.25rem' }],
        'base-responsive': ['1rem', { lineHeight: '1.5rem' }],
        'lg-responsive': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl-responsive': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl-responsive': ['1.5rem', { lineHeight: '2rem' }],
        '3xl-responsive': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl-responsive': ['2.25rem', { lineHeight: '2.5rem' }],
        // Executive display sizes
        'executive-sm': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
        'executive-md': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
        'executive-lg': ['5rem', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
      },
      
      // Enterprise Spacing Scale
      spacing: {
        // Micro spacing
        '0.5': '0.125rem',
        '1.5': '0.375rem',
        '2.5': '0.625rem',
        '3.5': '0.875rem',
        // Dashboard specific spacing
        'dashboard-xs': '0.5rem',
        'dashboard-sm': '1rem',
        'dashboard-md': '1.5rem', 
        'dashboard-lg': '2rem',
        'dashboard-xl': '3rem',
        'dashboard-2xl': '4rem',
        // Executive spacing for large displays
        'executive-sm': '2rem',
        'executive-md': '3rem',
        'executive-lg': '4rem',
        'executive-xl': '6rem',
        // Component specific
        'metric-card': '1.5rem',
        'chart-margin': '2rem',
        'sidebar-width': '24rem',
        'header-height': '4rem',
      },
      
      // Enhanced Border Radius
      borderRadius: {
        'taurus-xs': '0.25rem',
        'taurus-sm': '0.375rem',
        'taurus-md': '0.5rem',
        'taurus-lg': '0.75rem',
        'taurus-xl': '1rem',
        'taurus-2xl': '1.5rem',
        'taurus-3xl': '2rem',
        // Component specific
        'metric-card': '0.75rem',
        'chart-container': '1rem',
        'dashboard-panel': '1.5rem',
      },
      
      // Enterprise Box Shadows
      boxShadow: {
        // TAURUS glow effects
        'taurus-glow-sm': '0 0 10px rgb(59 130 246 / 0.3)',
        'taurus-glow-md': '0 0 20px rgb(59 130 246 / 0.4)',
        'taurus-glow-lg': '0 0 30px rgb(59 130 246 / 0.5)',
        'taurus-glow-xl': '0 0 40px rgb(59 130 246 / 0.6)',
        // Status glows
        'success-glow': '0 0 20px rgb(34 197 94 / 0.4)',
        'warning-glow': '0 0 20px rgb(245 158 11 / 0.4)',
        'danger-glow': '0 0 20px rgb(239 68 68 / 0.4)',
        'opportunity-glow': '0 0 20px rgb(34 197 94 / 0.4)',
        'threat-glow': '0 0 20px rgb(239 68 68 / 0.4)',
        // Glass morphism shadows
        'glass-sm': '0 4px 6px rgb(0 0 0 / 0.1), 0 1px 3px rgb(0 0 0 / 0.08)',
        'glass-md': '0 10px 15px rgb(0 0 0 / 0.1), 0 4px 6px rgb(0 0 0 / 0.05)',
        'glass-lg': '0 20px 25px rgb(0 0 0 / 0.15), 0 8px 10px rgb(0 0 0 / 0.04)',
        'glass-xl': '0 25px 50px rgb(0 0 0 / 0.25), 0 10px 20px rgb(0 0 0 / 0.1)',
        // Enterprise depth
        'enterprise-card': '0 10px 30px rgb(0 0 0 / 0.2), 0 4px 15px rgb(0 0 0 / 0.1)',
        'enterprise-float': '0 20px 40px rgb(0 0 0 / 0.3), 0 8px 20px rgb(0 0 0 / 0.15)',
      },
      
      // Advanced Animations
      animation: {
        // Data flow animations
        'data-flow': 'dataFlow 2s linear infinite',
        'data-flow-reverse': 'dataFlowReverse 2s linear infinite',
        'data-pulse': 'dataPulse 3s ease-in-out infinite',
        // Intelligence specific
        'intelligence-scan': 'intelligenceScan 4s ease-in-out infinite',
        'threat-pulse': 'threatPulse 2s ease-in-out infinite',
        'opportunity-glow': 'opportunityGlow 3s ease-in-out infinite',
        // Status indicators
        'status-online': 'statusOnline 2s ease-in-out infinite',
        'status-processing': 'statusProcessing 1.5s linear infinite',
        'status-alert': 'statusAlert 1s ease-in-out infinite',
        // Responsive animations
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'fade-in-down': 'fadeInDown 0.6s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        // Enterprise hover effects
        'hover-lift': 'hoverLift 0.3s ease-out',
        'hover-glow': 'hoverGlow 0.3s ease-out',
      },
      
      // Animation Keyframes
      keyframes: {
        // Data visualization animations
        dataFlow: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
        dataFlowReverse: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateX(-100%)', opacity: '0' },
        },
        dataPulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        // Intelligence scanning effect
        intelligenceScan: {
          '0%': { 
            boxShadow: '0 0 20px rgb(59 130 246 / 0.4)',
            borderColor: 'rgb(59 130 246 / 0.3)'
          },
          '50%': { 
            boxShadow: '0 0 40px rgb(59 130 246 / 0.8)',
            borderColor: 'rgb(59 130 246 / 0.6)'
          },
          '100%': { 
            boxShadow: '0 0 20px rgb(59 130 246 / 0.4)',
            borderColor: 'rgb(59 130 246 / 0.3)'
          },
        },
        // Status animations
        threatPulse: {
          '0%, 100%': { 
            backgroundColor: 'rgb(239 68 68)',
            boxShadow: '0 0 10px rgb(239 68 68 / 0.4)'
          },
          '50%': { 
            backgroundColor: 'rgb(220 38 38)',
            boxShadow: '0 0 20px rgb(239 68 68 / 0.8)'
          },
        },
        opportunityGlow: {
          '0%, 100%': { 
            boxShadow: '0 0 15px rgb(34 197 94 / 0.3)',
            borderColor: 'rgb(34 197 94 / 0.3)'
          },
          '50%': { 
            boxShadow: '0 0 30px rgb(34 197 94 / 0.6)',
            borderColor: 'rgb(34 197 94 / 0.5)'
          },
        },
        statusOnline: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.2)' },
        },
        statusProcessing: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        statusAlert: {
          '0%, 100%': { backgroundColor: 'rgb(239 68 68)' },
          '50%': { backgroundColor: 'rgb(245 158 11)' },
        },
        // Entrance animations
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        // Hover effects
        hoverLift: {
          '0%': { transform: 'translateY(0) scale(1)' },
          '100%': { transform: 'translateY(-4px) scale(1.02)' },
        },
        hoverGlow: {
          '0%': { boxShadow: '0 4px 6px rgb(0 0 0 / 0.1)' },
          '100%': { boxShadow: '0 20px 40px rgb(0 0 0 / 0.3), 0 0 20px rgb(59 130 246 / 0.4)' },
        },
      },
      
      // Advanced Grid Templates
      gridTemplateColumns: {
        // Dashboard grids
        'dashboard-mobile': '1fr',
        'dashboard-tablet': 'repeat(2, 1fr)',
        'dashboard-desktop': 'repeat(4, 1fr)',
        'dashboard-executive': 'repeat(6, 1fr)',
        // Intelligence layout
        'intelligence-main': '2fr 1fr',
        'intelligence-full': '1fr 2fr 1fr',
        // Metric grids
        'metrics-xs': '1fr',
        'metrics-sm': 'repeat(2, 1fr)',
        'metrics-md': 'repeat(3, 1fr)',
        'metrics-lg': 'repeat(4, 1fr)',
        'metrics-xl': 'repeat(6, 1fr)',
      },
      
      // Container max widths for different breakpoints
      maxWidth: {
        'dashboard': '1600px',
        'executive': '2400px',
        '8xl': '88rem',
        '9xl': '96rem',
      },
      
      // Z-index scale for layering
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
        'modal': '1000',
        'dropdown': '1010',
        'tooltip': '1020',
        'notification': '1030',
        'overlay': '1040',
      },
      
      // Backdrop blur levels
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
        '3xl': '32px',
      },
      
      // Responsive aspect ratios
      aspectRatio: {
        'dashboard': '16 / 9',
        'metric-card': '4 / 3',
        'chart': '16 / 10',
        'ultra-wide': '21 / 9',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    // Custom plugin for TAURUS components
    function({ addComponents, addUtilities, theme }) {
      // Add custom component classes
      addComponents({
        // TAURUS Glass Cards
        '.taurus-glass': {
          backdropFilter: 'blur(20px)',
          backgroundColor: theme('colors.taurus.intelligence.bg.glass'),
          border: `1px solid ${theme('colors.taurus.intelligence.border.secondary')}`,
          borderRadius: theme('borderRadius.taurus-xl'),
          boxShadow: theme('boxShadow.glass-lg'),
        },
        '.taurus-glass-dark': {
          backdropFilter: 'blur(20px)',
          backgroundColor: theme('colors.taurus.intelligence.bg.glassDark'),
          border: `1px solid ${theme('colors.taurus.intelligence.border.primary')}`,
          borderRadius: theme('borderRadius.taurus-xl'),
          boxShadow: theme('boxShadow.glass-xl'),
        },
        
        // Metric Cards
        '.taurus-metric-card': {
          background: `linear-gradient(135deg, ${theme('colors.taurus.intelligence.bg.secondary')} 0%, ${theme('colors.taurus.intelligence.bg.primary')} 100%)`,
          border: `1px solid ${theme('colors.taurus.intelligence.border.primary')}`,
          borderRadius: theme('borderRadius.taurus-xl'),
          padding: theme('spacing.dashboard-md'),
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px) scale(1.02)',
            boxShadow: theme('boxShadow.enterprise-float'),
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            height: '3px',
            background: `linear-gradient(90deg, ${theme('colors.taurus.primary.500')}, ${theme('colors.taurus.primary.600')})`,
          }
        },
        
        // Competitor Cards
        '.taurus-competitor-card': {
          backgroundColor: theme('colors.taurus.intelligence.bg.glass'),
          border: `1px solid ${theme('colors.taurus.intelligence.border.secondary')}`,
          borderRadius: theme('borderRadius.taurus-lg'),
          padding: theme('spacing.dashboard-sm'),
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
          '&:hover': {
            borderColor: theme('colors.taurus.intelligence.border.primary'),
            transform: 'translateY(-2px)',
            boxShadow: theme('boxShadow.taurus-glow-md'),
          },
          '&.monitoring': {
            borderLeftColor: theme('colors.taurus.status.monitoring'),
            borderLeftWidth: '4px',
          },
          '&.threat': {
            borderLeftColor: theme('colors.taurus.status.threat'),
            borderLeftWidth: '4px',
          },
          '&.opportunity': {
            borderLeftColor: theme('colors.taurus.status.opportunity'),
            borderLeftWidth: '4px',
          },
        },
        
        // Button Components
        '.taurus-btn-primary': {
          background: `linear-gradient(135deg, ${theme('colors.taurus.primary.500')} 0%, ${theme('colors.taurus.primary.600')} 100%)`,
          border: 'none',
          borderRadius: theme('borderRadius.taurus-md'),
          color: 'white',
          fontWeight: '600',
          padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
          transition: 'all 0.3s ease',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: theme('boxShadow.glass-md'),
          '&:hover': {
            background: `linear-gradient(135deg, ${theme('colors.taurus.primary.600')} 0%, ${theme('colors.taurus.primary.700')} 100%)`,
            transform: 'translateY(-2px)',
            boxShadow: theme('boxShadow.taurus-glow-md'),
          },
        },
        
        // Dashboard Grid
        '.taurus-dashboard-grid': {
          display: 'grid',
          gap: theme('spacing.dashboard-sm'),
          '@media (min-width: 640px)': {
            gap: theme('spacing.dashboard-md'),
          },
          '@media (min-width: 1024px)': {
            gap: theme('spacing.dashboard-lg'),
          },
        },
      });
      
      // Add custom utilities
      addUtilities({
        // Responsive text scaling
        '.text-responsive': {
          fontSize: theme('fontSize.sm-responsive[0]'),
          lineHeight: theme('fontSize.sm-responsive[1].lineHeight'),
          '@media (min-width: 640px)': {
            fontSize: theme('fontSize.base-responsive[0]'),
            lineHeight: theme('fontSize.base-responsive[1].lineHeight'),
          },
          '@media (min-width: 1024px)': {
            fontSize: theme('fontSize.lg-responsive[0]'),
            lineHeight: theme('fontSize.lg-responsive[1].lineHeight'),
          },
        },
        
        // Responsive padding utilities
        '.p-responsive': {
          padding: theme('spacing.dashboard-xs'),
          '@media (min-width: 640px)': {
            padding: theme('spacing.dashboard-sm'),
          },
          '@media (min-width: 1024px)': {
            padding: theme('spacing.dashboard-md'),
          },
          '@media (min-width: 1536px)': {
            padding: theme('spacing.dashboard-lg'),
          },
        },
        
        // Glass morphism utilities
        '.glass-light': {
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        },
        '.glass-medium': {
          backdropFilter: 'blur(15px)',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
        },
        '.glass-heavy': {
          backdropFilter: 'blur(25px)',
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
        },
        
        // Animation delays for staggered effects
        '.animate-delay-75': {
          animationDelay: '75ms',
        },
        '.animate-delay-150': {
          animationDelay: '150ms',
        },
        '.animate-delay-300': {
          animationDelay: '300ms',
        },
        '.animate-delay-500': {
          animationDelay: '500ms',
        },
      });
    },
  ],
  // Safelist classes that might be dynamically generated
  safelist: [
    // Status colors
    'text-taurus-status-monitoring',
    'text-taurus-status-threat', 
    'text-taurus-status-opportunity',
    'text-taurus-status-neutral',
    'text-taurus-status-warning',
    // Border colors
    'border-taurus-status-monitoring',
    'border-taurus-status-threat',
    'border-taurus-status-opportunity',
    // Background colors
    'bg-taurus-status-monitoring',
    'bg-taurus-status-threat',
    'bg-taurus-status-opportunity',
    // Glow effects
    'shadow-taurus-glow-sm',
    'shadow-taurus-glow-md',
    'shadow-taurus-glow-lg',
    'shadow-success-glow',
    'shadow-warning-glow',
    'shadow-danger-glow',
    // Animations
    'animate-data-flow',
    'animate-intelligence-scan',
    'animate-threat-pulse',
    'animate-opportunity-glow',
    // Responsive grid classes
    'grid-cols-1',
    'sm:grid-cols-2',
    'md:grid-cols-3',
    'lg:grid-cols-4',
    'xl:grid-cols-6',
    '2xl:grid-cols-8',
    // Component classes
    'taurus-glass',
    'taurus-glass-dark',
    'taurus-metric-card',
    'taurus-competitor-card',
    'taurus-btn-primary',
    'taurus-dashboard-grid',
  ],
};