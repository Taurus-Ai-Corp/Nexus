/**
 * SEO Utilities
 * 
 * This module provides functions to manage and set SEO-related metadata
 * for the application, including page titles, descriptions, and keywords.
 */

// Interface for page metadata
export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile' | 'book' | 'product';
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
}

// Default values
const defaultMetadata: PageMetadata = {
  title: 'Atlas AI - Advanced AI Solutions',
  description: 'Atlas AI provides cutting-edge artificial intelligence solutions for businesses of all sizes.',
  keywords: 'AI, artificial intelligence, machine learning, business solutions',
  ogType: 'website',
  twitterCard: 'summary_large_image'
};

/**
 * Set the page metadata for SEO
 * @param metadata - The metadata to set
 */
export const setPageMetadata = (metadata: Partial<PageMetadata>): void => {
  // Merge with defaults
  const finalMetadata = { ...defaultMetadata, ...metadata };
  
  // Update document title
  document.title = finalMetadata.title;
  
  // Update meta tags
  updateMetaTag('description', finalMetadata.description);
  
  if (finalMetadata.keywords) {
    updateMetaTag('keywords', finalMetadata.keywords);
  }
  
  // Update Open Graph tags
  updateMetaTag('og:title', finalMetadata.title);
  updateMetaTag('og:description', finalMetadata.description);
  updateMetaTag('og:type', finalMetadata.ogType || 'website');
  
  if (finalMetadata.ogImage) {
    updateMetaTag('og:image', finalMetadata.ogImage);
  }
  
  // Update Twitter Card tags
  updateMetaTag('twitter:card', finalMetadata.twitterCard || 'summary_large_image');
  updateMetaTag('twitter:title', finalMetadata.title);
  updateMetaTag('twitter:description', finalMetadata.description);
  
  if (finalMetadata.ogImage) {
    updateMetaTag('twitter:image', finalMetadata.ogImage);
  }
  
  // Update canonical URL if provided
  if (finalMetadata.canonicalUrl) {
    updateCanonicalLink(finalMetadata.canonicalUrl);
  }
};

/**
 * Get the current page metadata
 * @returns The current page metadata
 */
export const getPageMetadata = (): PageMetadata => {
  return {
    title: document.title,
    description: getMetaTagContent('description'),
    keywords: getMetaTagContent('keywords'),
    canonicalUrl: getCanonicalUrl(),
    ogImage: getMetaTagContent('og:image'),
    ogType: getMetaTagContent('og:type') as PageMetadata['ogType'],
    twitterCard: getMetaTagContent('twitter:card') as PageMetadata['twitterCard']
  };
};

/**
 * Helper function to update a meta tag
 * @param name - The name or property of the meta tag
 * @param content - The content value
 */
const updateMetaTag = (name: string, content: string): void => {
  // Check if it's a standard meta name or Open Graph / Twitter property
  const isProperty = name.startsWith('og:') || name.startsWith('twitter:');
  const selector = isProperty 
    ? `meta[property="${name}"]` 
    : `meta[name="${name}"]`;
  
  let metaTag = document.querySelector(selector) as HTMLMetaElement;
  
  if (!metaTag) {
    // Create the meta tag if it doesn't exist
    metaTag = document.createElement('meta');
    if (isProperty) {
      metaTag.setAttribute('property', name);
    } else {
      metaTag.setAttribute('name', name);
    }
    document.head.appendChild(metaTag);
  }
  
  // Set the content
  metaTag.setAttribute('content', content);
};

/**
 * Helper function to get the content of a meta tag
 * @param name - The name or property of the meta tag
 * @returns The content value or an empty string if not found
 */
const getMetaTagContent = (name: string): string => {
  const isProperty = name.startsWith('og:') || name.startsWith('twitter:');
  const selector = isProperty 
    ? `meta[property="${name}"]` 
    : `meta[name="${name}"]`;
  
  const metaTag = document.querySelector(selector) as HTMLMetaElement;
  return metaTag ? metaTag.getAttribute('content') || '' : '';
};

/**
 * Helper function to update the canonical link
 * @param url - The canonical URL
 */
const updateCanonicalLink = (url: string): void => {
  let linkTag = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  
  if (!linkTag) {
    // Create the link tag if it doesn't exist
    linkTag = document.createElement('link');
    linkTag.setAttribute('rel', 'canonical');
    document.head.appendChild(linkTag);
  }
  
  // Set the href
  linkTag.setAttribute('href', url);
};

/**
 * Helper function to get the canonical URL
 * @returns The canonical URL or an empty string if not found
 */
const getCanonicalUrl = (): string => {
  const linkTag = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  return linkTag ? linkTag.getAttribute('href') || '' : '';
};

/**
 * Generate a page title with an optional prefix or suffix
 * @param title - The main page title
 * @param options - Configuration options
 * @returns The formatted page title
 */
export const formatPageTitle = (
  title: string,
  options: { prefix?: string; suffix?: string; separator?: string } = {}
): string => {
  const { prefix, suffix, separator = ' | ' } = options;
  
  if (prefix) {
    return `${prefix}${separator}${title}`;
  }
  
  if (suffix) {
    return `${title}${separator}${suffix}`;
  }
  
  return title;
};

/**
 * Generate structured data for the current page
 * @param type - The type of structured data to generate
 * @param data - The data to use for the structured data
 * @returns The structured data as a string
 */
export const generateStructuredData = (
  type: 'WebPage' | 'Article' | 'Product' | 'Organization' | 'LocalBusiness',
  data: Record<string, any>
): string => {
  // Base structured data
  const baseStructuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    ...data
  };
  
  return JSON.stringify(baseStructuredData);
};

/**
 * Add hreflang links for language/regional variations
 * @param links - The hreflang links to add
 */
export const addHreflangLinks = (links: Array<{ hreflang: string; href: string }>): void => {
  // Remove existing hreflang links
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(link => {
    link.parentNode?.removeChild(link);
  });
  
  // Add new hreflang links
  links.forEach(({ hreflang, href }) => {
    const link = document.createElement('link');
    link.setAttribute('rel', 'alternate');
    link.setAttribute('hreflang', hreflang);
    link.setAttribute('href', href);
    document.head.appendChild(link);
  });
};

/**
 * Add geo-specific meta tags
 * @param region - The region code
 * @param placename - The place name
 * @param position - The geo position (latitude,longitude)
 */
export const addGeoMetaTags = (region: string, placename: string, position: string): void => {
  updateMetaTag('geo.region', region);
  updateMetaTag('geo.placename', placename);
  updateMetaTag('geo.position', position);
  updateMetaTag('ICBM', position);
};
