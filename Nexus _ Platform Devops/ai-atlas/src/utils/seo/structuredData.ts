/**
 * JSON-LD Structured Data Utility
 * 
 * This utility provides functions to generate schema.org compliant JSON-LD structured data
 * for various content types to enhance SEO and improve search engine understanding of content.
 */

export type OrganizationSchema = {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  socialProfiles?: string[];
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  contactPoint?: {
    telephone?: string;
    email?: string;
    contactType: string;
  }[];
};

export type WebsiteSchema = {
  name: string;
  url: string;
  description?: string;
  keywords?: string[];
  inLanguage?: string[];
  copyrightYear?: number;
  copyrightHolder?: string;
};

export type WebPageSchema = {
  title: string;
  description: string;
  url: string;
  lastUpdated?: string;
  breadcrumb?: {
    name: string;
    url: string;
  }[];
};

export type ProductSchema = {
  name: string;
  description: string;
  image?: string;
  url?: string;
  brand?: string;
  offers?: {
    price: number;
    priceCurrency: string;
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
    validFrom?: string;
  };
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
};

export type ArticleSchema = {
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author: {
    name: string;
    url?: string;
  };
  publisher: {
    name: string;
    logo?: string;
  };
  keywords?: string[];
  articleSection?: string;
};

export type FaqSchema = {
  questions: {
    question: string;
    answer: string;
  }[];
};

export type LocalBusinessSchema = {
  name: string;
  image?: string;
  url: string;
  description?: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  telephone?: string;
  openingHours?: string[];
  priceRange?: string;
};

export type ServiceSchema = {
  name: string;
  description: string;
  url?: string;
  provider?: {
    name: string;
    url?: string;
  };
  serviceType?: string;
  areaServed?: string | string[];
  offers?: {
    price: number;
    priceCurrency: string;
    description?: string;
  }[];
};

export type SoftwareApplicationSchema = {
  name: string;
  description: string;
  url?: string;
  applicationCategory?: string;
  operatingSystem?: string | string[];
  offers?: {
    price: number;
    priceCurrency: string;
  };
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
};

/**
 * Creates Organization Schema JSON-LD structure
 */
export const createOrganizationSchema = (data: OrganizationSchema): string => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': data.name,
    'url': data.url,
    ...(data.logo && { 'logo': data.logo }),
    ...(data.description && { 'description': data.description }),
    ...(data.socialProfiles && { 'sameAs': data.socialProfiles }),
    ...(data.address && {
      'address': {
        '@type': 'PostalAddress',
        ...(data.address.streetAddress && { 'streetAddress': data.address.streetAddress }),
        ...(data.address.addressLocality && { 'addressLocality': data.address.addressLocality }),
        ...(data.address.addressRegion && { 'addressRegion': data.address.addressRegion }),
        ...(data.address.postalCode && { 'postalCode': data.address.postalCode }),
        ...(data.address.addressCountry && { 'addressCountry': data.address.addressCountry }),
      }
    }),
    ...(data.contactPoint && {
      'contactPoint': data.contactPoint.map(contact => ({
        '@type': 'ContactPoint',
        ...(contact.telephone && { 'telephone': contact.telephone }),
        ...(contact.email && { 'email': contact.email }),
        'contactType': contact.contactType
      }))
    })
  };

  return JSON.stringify(schema);
};

/**
 * Creates Website Schema JSON-LD structure
 */
export const createWebsiteSchema = (data: WebsiteSchema): string => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': data.name,
    'url': data.url,
    ...(data.description && { 'description': data.description }),
    ...(data.keywords && { 'keywords': data.keywords.join(', ') }),
    ...(data.inLanguage && { 'inLanguage': data.inLanguage }),
    ...(data.copyrightYear && { 'copyrightYear': data.copyrightYear }),
    ...(data.copyrightHolder && {
      'copyrightHolder': {
        '@type': 'Organization',
        'name': data.copyrightHolder
      }
    }),
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': `${data.url}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };

  return JSON.stringify(schema);
};

/**
 * Creates WebPage Schema JSON-LD structure
 */
export const createWebPageSchema = (data: WebPageSchema): string => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': data.title,
    'description': data.description,
    'url': data.url,
    ...(data.lastUpdated && { 'dateModified': data.lastUpdated }),
    ...(data.breadcrumb && data.breadcrumb.length > 0 && {
      'breadcrumb': {
        '@type': 'BreadcrumbList',
        'itemListElement': data.breadcrumb.map((item, index) => ({
          '@type': 'ListItem',
          'position': index + 1,
          'name': item.name,
          'item': item.url
        }))
      }
    })
  };

  return JSON.stringify(schema);
};

/**
 * Creates Product Schema JSON-LD structure
 */
export const createProductSchema = (data: ProductSchema): string => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': data.name,
    'description': data.description,
    ...(data.image && { 'image': data.image }),
    ...(data.url && { 'url': data.url }),
    ...(data.brand && {
      'brand': {
        '@type': 'Brand',
        'name': data.brand
      }
    }),
    ...(data.offers && {
      'offers': {
        '@type': 'Offer',
        'price': data.offers.price,
        'priceCurrency': data.offers.priceCurrency,
        ...(data.offers.availability && { 'availability': `https://schema.org/${data.offers.availability}` }),
        ...(data.offers.validFrom && { 'validFrom': data.offers.validFrom })
      }
    }),
    ...(data.aggregateRating && {
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': data.aggregateRating.ratingValue,
        'reviewCount': data.aggregateRating.reviewCount
      }
    })
  };

  return JSON.stringify(schema);
};

/**
 * Creates Article Schema JSON-LD structure
 */
export const createArticleSchema = (data: ArticleSchema): string => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': data.headline,
    'description': data.description,
    'datePublished': data.datePublished,
    ...(data.dateModified && { 'dateModified': data.dateModified }),
    ...(data.image && { 'image': data.image }),
    'author': {
      '@type': 'Person',
      'name': data.author.name,
      ...(data.author.url && { 'url': data.author.url })
    },
    'publisher': {
      '@type': 'Organization',
      'name': data.publisher.name,
      ...(data.publisher.logo && {
        'logo': {
          '@type': 'ImageObject',
          'url': data.publisher.logo
        }
      })
    },
    ...(data.keywords && { 'keywords': data.keywords }),
    ...(data.articleSection && { 'articleSection': data.articleSection })
  };

  return JSON.stringify(schema);
};

/**
 * Creates FAQ Schema JSON-LD structure
 */
export const createFaqSchema = (data: FaqSchema): string => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': data.questions.map(q => ({
      '@type': 'Question',
      'name': q.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': q.answer
      }
    }))
  };

  return JSON.stringify(schema);
};

/**
 * Creates LocalBusiness Schema JSON-LD structure
 */
export const createLocalBusinessSchema = (data: LocalBusinessSchema): string => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': data.name,
    ...(data.image && { 'image': data.image }),
    'url': data.url,
    ...(data.description && { 'description': data.description }),
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': data.address.streetAddress,
      'addressLocality': data.address.addressLocality,
      'addressRegion': data.address.addressRegion,
      'postalCode': data.address.postalCode,
      'addressCountry': data.address.addressCountry
    },
    ...(data.geo && {
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': data.geo.latitude,
        'longitude': data.geo.longitude
      }
    }),
    ...(data.telephone && { 'telephone': data.telephone }),
    ...(data.openingHours && { 'openingHours': data.openingHours }),
    ...(data.priceRange && { 'priceRange': data.priceRange })
  };

  return JSON.stringify(schema);
};

/**
 * Creates Service Schema JSON-LD structure
 */
export const createServiceSchema = (data: ServiceSchema): string => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'name': data.name,
    'description': data.description,
    ...(data.url && { 'url': data.url }),
    ...(data.provider && {
      'provider': {
        '@type': 'Organization',
        'name': data.provider.name,
        ...(data.provider.url && { 'url': data.provider.url })
      }
    }),
    ...(data.serviceType && { 'serviceType': data.serviceType }),
    ...(data.areaServed && {
      'areaServed': Array.isArray(data.areaServed)
        ? data.areaServed.map(area => ({
            '@type': 'GeoCircle',
            'name': area
          }))
        : {
            '@type': 'GeoCircle',
            'name': data.areaServed
          }
    }),
    ...(data.offers && {
      'offers': data.offers.map(offer => ({
        '@type': 'Offer',
        'price': offer.price,
        'priceCurrency': offer.priceCurrency,
        ...(offer.description && { 'description': offer.description })
      }))
    })
  };

  return JSON.stringify(schema);
};

/**
 * Creates SoftwareApplication Schema JSON-LD structure
 */
export const createSoftwareApplicationSchema = (data: SoftwareApplicationSchema): string => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': data.name,
    'description': data.description,
    ...(data.url && { 'url': data.url }),
    ...(data.applicationCategory && { 'applicationCategory': data.applicationCategory }),
    ...(data.operatingSystem && { 'operatingSystem': data.operatingSystem }),
    ...(data.offers && {
      'offers': {
        '@type': 'Offer',
        'price': data.offers.price,
        'priceCurrency': data.offers.priceCurrency
      }
    }),
    ...(data.aggregateRating && {
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': data.aggregateRating.ratingValue,
        'reviewCount': data.aggregateRating.reviewCount
      }
    })
  };

  return JSON.stringify(schema);
};

/**
 * Creates a script element with JSON-LD content
 */
export const createJsonLdScript = (jsonLd: string): HTMLScriptElement => {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = jsonLd;
  return script;
};

/**
 * Injects JSON-LD structured data into the document head
 */
export const injectStructuredData = (jsonLd: string, id?: string): void => {
  // Remove existing structured data with the same ID if it exists
  if (id) {
    const existingScript = document.getElementById(id);
    if (existingScript) {
      existingScript.remove();
    }
  }

  const script = createJsonLdScript(jsonLd);
  if (id) {
    script.id = id;
  }
  document.head.appendChild(script);
};

/**
 * Atlas AI organization data
 */
export const atlasAiOrganization: OrganizationSchema = {
  name: 'Atlas AI',
  url: window.location.origin,
  logo: `${window.location.origin}/logo.png`,
  description: 'Advanced AI-Powered Marketing Automation Platform',
  socialProfiles: [
    'https://twitter.com/atlasaimarketing',
    'https://facebook.com/atlasaimarketing',
    'https://linkedin.com/company/atlasai',
    'https://instagram.com/atlasaimarketing'
  ],
  contactPoint: [
    {
      telephone: '+1-800-ATLAS-AI',
      email: 'support@atlasai.example.com',
      contactType: 'customer service'
    }
  ]
};

/**
 * Atlas AI website data
 */
export const atlasAiWebsite: WebsiteSchema = {
  name: 'Atlas AI - AI-Powered Marketing Automation',
  url: window.location.origin,
  description: 'Transform your marketing with Atlas AI\'s advanced automation platform. AI-powered campaigns, templates, analytics dashboard. Start your free trial today.',
  keywords: [
    'AI marketing automation',
    'campaign management',
    'marketing analytics',
    'AI templates',
    'marketing platform'
  ],
  inLanguage: ['en', 'fr', 'es', 'de'],
  copyrightYear: 2025,
  copyrightHolder: 'Atlas AI'
};

/**
 * Generate structured data for all pages
 */
export const generateAllStructuredData = (): void => {
  // Add organization data
  injectStructuredData(
    createOrganizationSchema(atlasAiOrganization),
    'atlas-ai-organization-schema'
  );

  // Add website data
  injectStructuredData(
    createWebsiteSchema(atlasAiWebsite),
    'atlas-ai-website-schema'
  );
};

/**
 * Generates webpage structured data for the current page
 */
export const generateWebPageStructuredData = (title: string, description: string, url: string, breadcrumbs?: {name: string, url: string}[]): void => {
  const webPageData: WebPageSchema = {
    title,
    description,
    url,
    lastUpdated: new Date().toISOString(),
    breadcrumb: breadcrumbs
  };

  injectStructuredData(
    createWebPageSchema(webPageData),
    'atlas-ai-webpage-schema'
  );
};
