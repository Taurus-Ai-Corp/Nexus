// SEO and Meta Tag Utilities
export interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
  ogUrl?: string;
  ogImage?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
}

export const updatePageSEO = (seoData: SEOData) => {
  // Update document title
  document.title = seoData.title;

  // Update or create meta tags
  updateMetaTag('description', seoData.description);
  
  if (seoData.keywords) {
    updateMetaTag('keywords', seoData.keywords);
  }

  // Open Graph tags
  updateMetaProperty('og:title', seoData.ogTitle || seoData.title);
  updateMetaProperty('og:description', seoData.ogDescription || seoData.description);
  updateMetaProperty('og:type', seoData.ogType || 'website');
  updateMetaProperty('og:url', seoData.ogUrl || window.location.href);
  
  if (seoData.ogImage) {
    updateMetaProperty('og:image', seoData.ogImage);
  }

  // Twitter Card tags
  updateMetaName('twitter:card', seoData.twitterCard || 'summary_large_image');
  updateMetaName('twitter:title', seoData.twitterTitle || seoData.title);
  updateMetaName('twitter:description', seoData.twitterDescription || seoData.description);
};

const updateMetaTag = (name: string, content: string) => {
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = name;
    document.head.appendChild(meta);
  }
  meta.content = content;
};

const updateMetaProperty = (property: string, content: string) => {
  let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  meta.content = content;
};

const updateMetaName = (name: string, content: string) => {
  let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = name;
    document.head.appendChild(meta);
  }
  meta.content = content;
};

// Page-specific SEO configurations
export const pageSEOConfigs = {
  home: {
    title: 'Atlas AI - Advanced AI-Powered Marketing Automation Platform',
    description: 'Transform your marketing with Atlas AI\'s advanced automation platform. AI-powered campaigns, 60+ templates, analytics dashboard. Start your free trial today.',
    keywords: 'AI marketing automation, campaign management, marketing analytics, AI templates, marketing platform, automation tools',
    ogTitle: 'Atlas AI - AI-Powered Marketing Automation',
    ogDescription: 'Advanced AI marketing automation platform with unlimited campaigns, premium templates, and analytics.',
    ogType: 'website',
    ogUrl: 'https://e4hilu5riu.space.minimax.io',
  },
  features: {
    title: 'Features - Atlas AI Marketing Automation Platform',
    description: 'Discover Atlas AI\'s powerful features: AI-powered campaigns, advanced analytics, automation workflows, and 60+ premium templates.',
    keywords: 'AI features, marketing automation features, campaign management, analytics, automation workflows',
    ogTitle: 'Atlas AI Features - Advanced Marketing Automation',
    ogDescription: 'Explore advanced AI marketing features including campaign management, analytics, and automation workflows.',
  },
  pricing: {
    title: 'Pricing - Atlas AI Marketing Automation Plans',
    description: 'Choose the perfect Atlas AI plan for your business. Starter, Professional, and Enterprise plans with AI-powered features.',
    keywords: 'AI marketing pricing, automation plans, marketing platform pricing, subscription plans',
    ogTitle: 'Atlas AI Pricing - Marketing Automation Plans',
    ogDescription: 'Flexible pricing plans for AI-powered marketing automation. Start your free trial today.',
  },
  signup: {
    title: 'Sign Up - Start Your Atlas AI Free Trial',
    description: 'Create your Atlas AI account and start your free trial. Access AI-powered marketing automation tools and premium templates.',
    keywords: 'sign up, free trial, AI marketing account, marketing automation trial',
    ogTitle: 'Sign Up for Atlas AI - Free Trial Available',
    ogDescription: 'Start your free trial with Atlas AI and transform your marketing with AI-powered automation.',
  },
  contact: {
    title: 'Contact Us - Atlas AI Support',
    description: 'Get in touch with Atlas AI support team. We\'re here to help with your marketing automation needs.',
    keywords: 'contact support, Atlas AI support, marketing automation help, customer service',
    ogTitle: 'Contact Atlas AI - Expert Support',
    ogDescription: 'Contact our expert team for support with Atlas AI marketing automation platform.',
  },
  insights: {
    title: 'Marketing Insights - Atlas AI Analytics Dashboard',
    description: 'Access powerful marketing insights and analytics with Atlas AI\'s advanced dashboard and reporting tools.',
    keywords: 'marketing insights, analytics dashboard, marketing reports, campaign analytics',
    ogTitle: 'Marketing Insights - Atlas AI Analytics',
    ogDescription: 'Advanced marketing insights and analytics to optimize your campaigns and drive growth.',
  }
};

// Security headers utility
export const applySecurityHeaders = () => {
  // These would typically be set by the server, but for client-side apps,
  // we can set some via JavaScript for additional security

  // Prevent clickjacking
  if (window.self !== window.top) {
    window.top?.location.replace(window.self.location.href);
  }

  // Add security-related meta tags if they don't exist
  const securityMetas = [
    { httpEquiv: 'X-Content-Type-Options', content: 'nosniff' },
    { httpEquiv: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' },
  ];

  securityMetas.forEach(({ httpEquiv, content }) => {
    if (!document.querySelector(`meta[http-equiv="${httpEquiv}"]`)) {
      const meta = document.createElement('meta');
      meta.setAttribute('http-equiv', httpEquiv);
      meta.content = content;
      document.head.appendChild(meta);
    }
  });
};

// Initialize Google Analytics tracking
export const initGoogleAnalytics = () => {
  // Check if user has consented to analytics cookies
  const cookieConsent = localStorage.getItem('cookie-consent');
  let analyticsEnabled = false;

  if (cookieConsent) {
    try {
      const consent = JSON.parse(cookieConsent);
      analyticsEnabled = consent.preferences?.analytics || false;
    } catch (e) {
      console.warn('Failed to parse cookie consent');
    }
  }

  // Configure Google Analytics consent
  if (window.gtag) {
    window.gtag('consent', 'default', {
      analytics_storage: analyticsEnabled ? 'granted' : 'denied',
      ad_storage: 'denied', // We're not using ads
      wait_for_update: 500,
    });

    // Track page view if analytics is enabled
    if (analyticsEnabled) {
      window.gtag('config', 'G-ATLAS-AI-2025', {
        page_title: document.title,
        page_location: window.location.href,
        anonymize_ip: true,
      });
    }
  }
};

// Input validation and sanitization utilities
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
    .slice(0, 1000); // Limit length
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

// Rate limiting utility for form submissions
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  canAttempt(identifier: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(identifier) || [];
    
    // Remove old attempts outside the window
    const validAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (validAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    // Record this attempt
    validAttempts.push(now);
    this.attempts.set(identifier, validAttempts);
    
    return true;
  }

  getRemainingTime(identifier: string): number {
    const attempts = this.attempts.get(identifier) || [];
    if (attempts.length === 0) return 0;
    
    const oldestAttempt = Math.min(...attempts);
    const timeLeft = this.windowMs - (Date.now() - oldestAttempt);
    
    return Math.max(0, timeLeft);
  }
}
