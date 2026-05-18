import { GeoLocation } from './seo/geoTargeting';

/**
 * Utility to create HTML meta tags for GEO targeting
 */
export const createGeoMetaTags = (location: GeoLocation) => {
  const tags = [];
  
  // Add country metadata
  if (location.country) {
    tags.push({
      property: 'geo:country',
      content: location.country
    });
  }
  
  // Add region metadata
  if (location.region) {
    tags.push({
      property: 'geo:region',
      content: location.region
    });
  }
  
  // Add city metadata
  if (location.city) {
    tags.push({
      property: 'geo:city',
      content: location.city
    });
  }
  
  // Add coordinates if available
  if (location.latitude && location.longitude) {
    tags.push({
      property: 'geo:position',
      content: `${location.latitude};${location.longitude}`
    });
    
    // Also add ICBM coordinates (a common format for geo metadata)
    tags.push({
      name: 'ICBM',
      content: `${location.latitude}, ${location.longitude}`
    });
  }
  
  return tags;
};

/**
 * Utility to generate hreflang links for language/region targeting
 */
export const createHrefLangLinks = (baseUrl: string, pathname: string, supportedLocales: string[]) => {
  const links = [];
  
  // Add x-default for global users
  links.push({
    rel: 'alternate',
    hreflang: 'x-default',
    href: `${baseUrl}${pathname}`
  });
  
  // Generate hreflang links for all supported locales
  supportedLocales.forEach(locale => {
    const [language, region] = locale.split('-');
    
    // If it's a language-region combination
    if (region) {
      // Handle localized paths based on language
      const localizedPath = `/${language}${pathname === '/' ? '' : pathname}`;
      
      links.push({
        rel: 'alternate',
        hreflang: locale,
        href: `${baseUrl}${localizedPath}`
      });
    } 
    // If it's just a language
    else {
      // Handle localized paths based on language
      const localizedPath = `/${language}${pathname === '/' ? '' : pathname}`;
      
      links.push({
        rel: 'alternate',
        hreflang: language,
        href: `${baseUrl}${localizedPath}`
      });
    }
  });
  
  return links;
};

/**
 * Utility to convert country code to region code
 */
export const getRegionFromCountry = (countryCode: string): string | null => {
  const regionMap: {[key: string]: string} = {
    // EU countries
    AT: 'eu', BE: 'eu', BG: 'eu', HR: 'eu', CY: 'eu', CZ: 'eu', DK: 'eu',
    EE: 'eu', FI: 'eu', FR: 'eu', DE: 'eu', GR: 'eu', HU: 'eu', IE: 'eu',
    IT: 'eu', LV: 'eu', LT: 'eu', LU: 'eu', MT: 'eu', NL: 'eu', PL: 'eu',
    PT: 'eu', RO: 'eu', SK: 'eu', SI: 'eu', ES: 'eu', SE: 'eu',
    
    // North America
    US: 'na', CA: 'na', MX: 'na',
    
    // Asia Pacific
    AU: 'apac', CN: 'apac', HK: 'apac', IN: 'apac', ID: 'apac', JP: 'apac',
    MY: 'apac', NZ: 'apac', PH: 'apac', SG: 'apac', KR: 'apac', TW: 'apac', TH: 'apac', VN: 'apac',
    
    // South America
    AR: 'sa', BO: 'sa', BR: 'sa', CL: 'sa', CO: 'sa', EC: 'sa', GY: 'sa',
    PY: 'sa', PE: 'sa', SR: 'sa', UY: 'sa', VE: 'sa',
    
    // Middle East & Africa
    BH: 'mea', EG: 'mea', IL: 'mea', JO: 'mea', KW: 'mea', LB: 'mea',
    OM: 'mea', QA: 'mea', SA: 'mea', ZA: 'mea', AE: 'mea'
  };
  
  return regionMap[countryCode] || null;
};

/**
 * Utility to get the preferred language for a country
 */
export const getPreferredLanguageForCountry = (countryCode: string): string => {
  const languageMap: {[key: string]: string} = {
    US: 'en',
    GB: 'en',
    AU: 'en',
    CA: 'en',
    NZ: 'en',
    FR: 'fr',
    BE: 'fr',
    CH: 'fr',
    ES: 'es',
    MX: 'es',
    AR: 'es',
    CL: 'es',
    CO: 'es',
    DE: 'de',
    AT: 'de',
    JP: 'ja',
    KR: 'ko',
    CN: 'zh',
    TW: 'zh',
    IT: 'it',
    RU: 'ru',
    PT: 'pt',
    BR: 'pt',
    NL: 'nl'
  };
  
  return languageMap[countryCode] || 'en';
};

/**
 * Get content in the user's preferred language
 */
export const getLocalizedContent = (content: {[key: string]: any}, language: string): {[key: string]: any} => {
  // Check if we have content for this language
  const languageContent = content[`lang_${language}`];
  
  if (languageContent) {
    // Merge with default content, with language-specific taking precedence
    return { ...content, ...languageContent };
  }
  
  // No specific content, return global
  return content;
};

/**
 * Detect if user is likely in the European Union (for GDPR)
 */
export const isEuropeanUnion = (countryCode: string): boolean => {
  const euCountries = [
    'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE',
    'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'
  ];
  
  return euCountries.includes(countryCode);
};

/**
 * Utility to get language name from code
 */
export const getLanguageName = (languageCode: string): string => {
  const languageNames: {[key: string]: string} = {
    en: 'English',
    fr: 'Français',
    es: 'Español',
    de: 'Deutsch',
    it: 'Italiano',
    pt: 'Português',
    nl: 'Nederlands',
    ru: 'Русский',
    ja: '日本語',
    zh: '中文',
    ko: '한국어',
    ar: 'العربية',
    hi: 'हिन्दी',
    tr: 'Türkçe',
    pl: 'Polski',
    th: 'ไทย'
  };
  
  return languageNames[languageCode] || languageCode;
};

/**
 * Utility to calculate distance between two points on Earth
 */
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
};
