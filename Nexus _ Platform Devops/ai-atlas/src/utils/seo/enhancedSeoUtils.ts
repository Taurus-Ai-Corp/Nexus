// Enhanced SEO and Meta Tag Utilities
import { getBrowserLocation } from './geoTargeting';

export interface EnhancedSEOData {
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
  canonicalUrl?: string;
  robots?: string;
  viewport?: string;
  author?: string;
  localeAlternates?: { [key: string]: string };
  siteName?: string;
  articleTags?: string[];
  publishedTime?: string;
  modifiedTime?: string;
  locationRelevance?: {
    country?: string;
    region?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
    relevanceScore?: number;
  };
}

export const updateEnhancedSEO = async (seoData: EnhancedSEOData) => {
  // Update document title
  document.title = seoData.title;

  // Update or create meta tags
  updateMetaTag('description', seoData.description);
  
  if (seoData.keywords) {
    updateMetaTag('keywords', seoData.keywords);
  }

  // Author metadata
  if (seoData.author) {
    updateMetaTag('author', seoData.author);
  }

  // Robots directive
  if (seoData.robots) {
    updateMetaTag('robots', seoData.robots);
  }

  // Viewport settings
  if (seoData.viewport) {
    updateMetaTag('viewport', seoData.viewport);
  }

  // Canonical URL
  updateOrCreateCanonical(seoData.canonicalUrl || window.location.href);

  // Open Graph tags
  updateMetaProperty('og:title', seoData.ogTitle || seoData.title);
  updateMetaProperty('og:description', seoData.ogDescription || seoData.description);
  updateMetaProperty('og:type', seoData.ogType || 'website');
  updateMetaProperty('og:url', seoData.ogUrl || window.location.href);
  
  // Site name for Open Graph
  if (seoData.siteName) {
    updateMetaProperty('og:site_name', seoData.siteName);
  }
  
  // Article tags
  if (seoData.articleTags && seoData.articleTags.length > 0) {
    // Remove existing article tags first
    document.querySelectorAll('meta[property="article:tag"]').forEach(tag => {
      tag.remove();
    });
    
    seoData.articleTags.forEach(tag => {
      const meta = document.createElement('meta');
      meta.setAttribute('property', 'article:tag');
      meta.setAttribute('content', tag);
      document.head.appendChild(meta);
    });
  }
  
  // Article published and modified time
  if (seoData.publishedTime) {
    updateMetaProperty('article:published_time', seoData.publishedTime);
  }
  
  if (seoData.modifiedTime) {
    updateMetaProperty('article:modified_time', seoData.modifiedTime);
  }
  
  // Location relevance for geo-targeting
  if (seoData.locationRelevance) {
    const { country, region, city, latitude, longitude, relevanceScore } = seoData.locationRelevance;
    
    if (country) {
      updateMetaProperty('geo:country', country);
    }
    
    if (region) {
      updateMetaProperty('geo:region', region);
    }
    
    if (city) {
      updateMetaProperty('geo:city', city);
    }
    
    if (latitude !== undefined && longitude !== undefined) {
      updateMetaProperty('geo:position', `${latitude};${longitude}`);
      updateMetaProperty('ICBM', `${latitude}, ${longitude}`);
    }
    
    if (relevanceScore !== undefined) {
      updateMetaProperty('geo:relevance', relevanceScore.toString());
    }
  } else {
    // If no location relevance is provided, try to get it from the browser
    try {
      const location = await getBrowserLocation();
      if (location) {
        if (location.country) {
          updateMetaProperty('geo:country', location.country);
        }
        if (location.region) {
          updateMetaProperty('geo:region', location.region);
        }
        if (location.city) {
          updateMetaProperty('geo:city', location.city);
        }
        if (location.latitude && location.longitude) {
          updateMetaProperty('geo:position', `${location.latitude};${location.longitude}`);
          updateMetaProperty('ICBM', `${location.latitude}, ${location.longitude}`);
        }
      }
    } catch (error) {
      console.error('Failed to get browser location for SEO', error);
    }
  }
  
  // Language alternates for localization
  if (seoData.localeAlternates) {
    // Remove existing alternates first
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(alt => {
      alt.remove();
    });
    
    Object.entries(seoData.localeAlternates).forEach(([locale, url]) => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = locale;
      link.href = url;
      document.head.appendChild(link);
    });
  }
  
  if (seoData.ogImage) {
    updateMetaProperty('og:image', seoData.ogImage);
  }

  // Twitter card tags
  updateMetaTag('twitter:card', seoData.twitterCard || 'summary_large_image');
  updateMetaTag('twitter:title', seoData.twitterTitle || seoData.title);
  updateMetaTag('twitter:description', seoData.twitterDescription || seoData.description);
  
  if (seoData.ogImage) {
    updateMetaTag('twitter:image', seoData.ogImage);
  }
};

// Helper functions to update meta tags
const updateMetaTag = (name: string, content: string) => {
  let meta = document.querySelector(`meta[name="${name}"]`);
  
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', name);
    document.head.appendChild(meta);
  }
  
  meta.setAttribute('content', content);
};

const updateMetaProperty = (property: string, content: string) => {
  let meta = document.querySelector(`meta[property="${property}"]`);
  
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  
  meta.setAttribute('content', content);
};

const updateOrCreateCanonical = (url: string) => {
  let link = document.querySelector('link[rel="canonical"]');
  
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  
  link.setAttribute('href', url);
};

// Generate dynamic SEO data based on content
export const generateDynamicSEO = (content: {
  title: string;
  description?: string;
  keywords?: string[];
  imageUrl?: string;
  type?: 'website' | 'article' | 'product' | 'service';
  publishDate?: Date;
  modifyDate?: Date;
  tags?: string[];
  author?: string;
  location?: {
    country?: string;
    region?: string;
    city?: string;
    coordinates?: [number, number];
    relevance?: number;
  };
  locales?: { [key: string]: string };
}) => {
  const baseUrl = window.location.origin;
  const currentUrl = window.location.href;
  
  const seoData: EnhancedSEOData = {
    title: content.title,
    description: content.description || `Learn more about ${content.title} at Atlas AI`,
    keywords: content.keywords?.join(', '),
    ogTitle: content.title,
    ogDescription: content.description,
    ogType: content.type || 'website',
    ogUrl: currentUrl,
    ogImage: content.imageUrl,
    twitterCard: 'summary_large_image',
    twitterTitle: content.title,
    twitterDescription: content.description,
    canonicalUrl: currentUrl,
    robots: 'index, follow',
    viewport: 'width=device-width, initial-scale=1',
    author: content.author || 'Atlas AI',
    siteName: 'Atlas AI',
    articleTags: content.tags,
    publishedTime: content.publishDate?.toISOString(),
    modifiedTime: content.modifyDate?.toISOString(),
    localeAlternates: content.locales
  };
  
  // Add location relevance if available
  if (content.location) {
    seoData.locationRelevance = {
      country: content.location.country,
      region: content.location.region,
      city: content.location.city,
      latitude: content.location.coordinates?.[0],
      longitude: content.location.coordinates?.[1],
      relevanceScore: content.location.relevance,
    };
  }
  
  return seoData;
};

// Enhanced page SEO configurations
export const enhancedPageSEOConfigs: { [key: string]: EnhancedSEOData } = {
  home: {
    title: 'Atlas AI - Advanced AI-Powered Marketing Automation Platform',
    description: 'Transform your marketing with Atlas AI\'s advanced automation platform. AI-powered campaigns, templates, analytics dashboard. Start your free trial today.',
    keywords: 'AI marketing automation, campaign management, marketing analytics, AI templates, marketing platform',
    ogTitle: 'Atlas AI - AI-Powered Marketing Automation',
    ogDescription: 'Advanced AI marketing automation platform with unlimited campaigns, premium templates, and analytics.',
    ogType: 'website',
    ogImage: `${window.location.origin}/images/atlas-ai-platform.jpg`,
    twitterCard: 'summary_large_image',
    siteName: 'Atlas AI',
    robots: 'index, follow',
    localeAlternates: {
      'en': `${window.location.origin}/`,
      'fr': `${window.location.origin}/fr/`,
      'es': `${window.location.origin}/es/`,
      'de': `${window.location.origin}/de/`
    },
    author: 'Atlas AI Team'
  },
  features: {
    title: 'Features - Atlas AI Marketing Automation Platform',
    description: 'Explore the powerful features of Atlas AI: AI-driven campaign management, content generation, analytics, and more.',
    keywords: 'AI features, marketing automation features, campaign management, content generation, marketing analytics',
    ogTitle: 'Atlas AI Features - Advanced Marketing Automation Tools',
    ogDescription: 'Discover the powerful AI-driven features that make Atlas AI the leading marketing automation platform.',
    ogType: 'website',
    ogImage: `${window.location.origin}/images/atlas-ai-features.jpg`,
    twitterCard: 'summary_large_image',
    siteName: 'Atlas AI',
    robots: 'index, follow',
    localeAlternates: {
      'en': `${window.location.origin}/features`,
      'fr': `${window.location.origin}/fr/features`,
      'es': `${window.location.origin}/es/features`,
      'de': `${window.location.origin}/de/features`
    },
    author: 'Atlas AI Team'
  },
  pricing: {
    title: 'Pricing - Atlas AI Marketing Automation Platform',
    description: 'Choose the right Atlas AI plan for your business. Free, Pro, and Enterprise options available with flexible pricing.',
    keywords: 'AI marketing pricing, automation plans, marketing platform cost, free marketing tools',
    ogTitle: 'Atlas AI Pricing - Choose Your Marketing Automation Plan',
    ogDescription: 'Flexible pricing options for businesses of all sizes. Start with our free plan or scale up with Pro and Enterprise features.',
    ogType: 'website',
    ogImage: `${window.location.origin}/images/atlas-ai-pricing.jpg`,
    twitterCard: 'summary_large_image',
    siteName: 'Atlas AI',
    robots: 'index, follow',
    localeAlternates: {
      'en': `${window.location.origin}/pricing`,
      'fr': `${window.location.origin}/fr/pricing`,
      'es': `${window.location.origin}/es/pricing`,
      'de': `${window.location.origin}/de/pricing`
    },
    author: 'Atlas AI Team'
  },
  insights: {
    title: 'Insights - Atlas AI Marketing Automation Platform',
    description: 'Marketing insights, tips, and best practices from Atlas AI. Stay updated with the latest marketing trends.',
    keywords: 'marketing insights, AI marketing tips, automation best practices, marketing trends',
    ogTitle: 'Atlas AI Insights - Marketing Automation Expertise',
    ogDescription: 'Expert marketing insights and AI automation tips to help you optimize your campaigns and grow your business.',
    ogType: 'website',
    ogImage: `${window.location.origin}/images/atlas-ai-insights.jpg`,
    twitterCard: 'summary_large_image',
    siteName: 'Atlas AI',
    robots: 'index, follow',
    localeAlternates: {
      'en': `${window.location.origin}/insights`,
      'fr': `${window.location.origin}/fr/insights`,
      'es': `${window.location.origin}/es/insights`,
      'de': `${window.location.origin}/de/insights`
    },
    author: 'Atlas AI Team',
    articleTags: ['marketing automation', 'AI marketing', 'marketing tips', 'digital marketing']
  },
  contact: {
    title: 'Contact Us - Atlas AI Marketing Automation Platform',
    description: 'Get in touch with Atlas AI support team. We\'re here to help you with any questions or issues.',
    keywords: 'contact Atlas AI, marketing automation support, AI platform help',
    ogTitle: 'Contact Atlas AI - Get Support for Your Marketing Automation',
    ogDescription: 'Our expert support team is ready to help you with any questions about Atlas AI marketing automation platform.',
    ogType: 'website',
    ogImage: `${window.location.origin}/images/atlas-ai-contact.jpg`,
    twitterCard: 'summary_large_image',
    siteName: 'Atlas AI',
    robots: 'index, follow',
    localeAlternates: {
      'en': `${window.location.origin}/contact`,
      'fr': `${window.location.origin}/fr/contact`,
      'es': `${window.location.origin}/es/contact`,
      'de': `${window.location.origin}/de/contact`
    },
    author: 'Atlas AI Team'
  },
  signup: {
    title: 'Sign Up - Atlas AI Marketing Automation Platform',
    description: 'Create your Atlas AI account and start optimizing your marketing with AI-powered automation.',
    keywords: 'sign up Atlas AI, create marketing account, start with AI automation',
    ogTitle: 'Sign Up for Atlas AI - Start Your AI Marketing Journey',
    ogDescription: 'Create your Atlas AI account in minutes and start transforming your marketing with AI-powered automation.',
    ogType: 'website',
    ogImage: `${window.location.origin}/images/atlas-ai-signup.jpg`,
    twitterCard: 'summary_large_image',
    siteName: 'Atlas AI',
    robots: 'index, follow',
    localeAlternates: {
      'en': `${window.location.origin}/signup`,
      'fr': `${window.location.origin}/fr/signup`,
      'es': `${window.location.origin}/es/signup`,
      'de': `${window.location.origin}/de/signup`
    },
    author: 'Atlas AI Team'
  }
};
