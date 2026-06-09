// GeoTargeting Utilities

export interface GeoLocation {
  country?: string;
  countryCode?: string;
  region?: string;
  regionCode?: string;
  city?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  currency?: string;
  currencySymbol?: string;
  languages?: string[];
  ip?: string;
  proxy?: boolean;
  accuracy?: number;
}

export interface GeoPreferences {
  locationOverride?: GeoLocation;
  preferredLanguage?: string;
  preferredCurrency?: string;
  useAutoDetect: boolean;
  allowGeoTargeting: boolean;
}

// Cache geo data to avoid repeated API calls
let cachedGeoData: GeoLocation | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Get the user's location from IP geolocation API
 */
export const fetchUserLocation = async (): Promise<GeoLocation> => {
  try {
    // Check if we have valid cached data
    const now = Date.now();
    if (cachedGeoData && (now - cacheTimestamp < CACHE_DURATION)) {
      return cachedGeoData;
    }

    // Try with ipapi.co first
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) {
      throw new Error('Failed to fetch from ipapi.co');
    }

    const data = await response.json();
    const geoData: GeoLocation = {
      country: data.country_name,
      countryCode: data.country_code,
      region: data.region,
      regionCode: data.region_code,
      city: data.city,
      postalCode: data.postal,
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone,
      currency: data.currency,
      currencySymbol: data.currency_name ? data.currency_name.split(' ')[0] : '',
      languages: data.languages ? data.languages.split(',').map((l: string) => l.trim()) : [],
      ip: data.ip,
      proxy: false,
      accuracy: 0.9
    };

    // Cache the data
    cachedGeoData = geoData;
    cacheTimestamp = now;

    return geoData;
  } catch (error) {
    console.error('Error fetching location from ipapi.co', error);
    
    // Fallback to ipinfo.io
    try {
      const response = await fetch('https://ipinfo.io/json');
      if (!response.ok) {
        throw new Error('Failed to fetch from ipinfo.io');
      }

      const data = await response.json();
      const [lat, lng] = data.loc ? data.loc.split(',').map(Number) : [null, null];

      const geoData: GeoLocation = {
        country: data.country ? data.country : undefined,
        countryCode: data.country,
        region: data.region,
        city: data.city,
        postalCode: data.postal,
        latitude: lat,
        longitude: lng,
        timezone: data.timezone,
        ip: data.ip,
        proxy: false,
        accuracy: 0.8
      };

      // Cache the data
      cachedGeoData = geoData;
      cacheTimestamp = Date.now();

      return geoData;
    } catch (fallbackError) {
      console.error('Error fetching location from ipinfo.io', fallbackError);
      
      // Return a minimal location object based on browser's language
      const browserLang = navigator.language.split('-')[0];
      const fallbackData: GeoLocation = {
        languages: [browserLang],
        accuracy: 0.3
      };
      
      return fallbackData;
    }
  }
};

/**
 * Get location from browser's geolocation API if available and permitted
 */
export const getBrowserGeolocation = (): Promise<{latitude: number, longitude: number} | null> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      () => {
        resolve(null);
      },
      { timeout: 5000, maximumAge: 3600000 } // 1 hour cache
    );
  });
};

/**
 * Convert browser geolocation coordinates to full location data using reverse geocoding
 */
export const reverseGeocode = async (latitude: number, longitude: number): Promise<Partial<GeoLocation>> => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
    const data = await response.json();

    if (!data.address) {
      throw new Error('No address data found');
    }

    return {
      country: data.address.country,
      countryCode: data.address.country_code?.toUpperCase(),
      region: data.address.state || data.address.county,
      city: data.address.city || data.address.town || data.address.village,
      postalCode: data.address.postcode,
      latitude,
      longitude,
      accuracy: 0.95
    };
  } catch (error) {
    console.error('Error during reverse geocoding', error);
    return { latitude, longitude, accuracy: 0.5 };
  }
};

/**
 * Combined function to get the most accurate location data possible
 */
export const getBrowserLocation = async (): Promise<GeoLocation | null> => {
  // First try to get precise location from browser geolocation API
  const preciseLocation = await getBrowserGeolocation();
  
  if (preciseLocation) {
    // If we have precise coordinates, get more details with reverse geocoding
    const geoDetails = await reverseGeocode(preciseLocation.latitude, preciseLocation.longitude);
    
    // Get the IP-based location as a fallback and for additional data
    const ipLocation = await fetchUserLocation();
    
    // Merge the precise location with additional data from IP geolocation
    return {
      ...ipLocation,
      ...geoDetails,
      accuracy: 0.95 // Higher accuracy due to precise browser geolocation
    };
  }
  
  // Fallback to IP-based geolocation
  return fetchUserLocation();
};

/**
 * Determine the closest server to the user's location
 */
export const getClosestServer = (userLocation: GeoLocation, servers: Array<{id: string, latitude: number, longitude: number, name: string}>) => {
  if (!userLocation.latitude || !userLocation.longitude) {
    // Default to first server if no location data
    return servers[0];
  }
  
  const userLat = userLocation.latitude;
  const userLng = userLocation.longitude;
  
  // Calculate distances using Haversine formula
  const distances = servers.map(server => {
    const distance = calculateDistance(
      userLat,
      userLng,
      server.latitude,
      server.longitude
    );
    
    return {
      ...server,
      distance
    };
  });
  
  // Sort by distance and return the closest
  distances.sort((a, b) => a.distance - b.distance);
  return distances[0];
};

/**
 * Calculate distance between coordinates using Haversine formula
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

/**
 * Get language preference from browser
 */
export const getBrowserLanguage = (): string => {
  return navigator.language || 'en';
};

/**
 * Get currency and formatting for a country
 */
export const getCountryCurrency = (countryCode: string): {currency: string, symbol: string, format: string} => {
  const currencyMap: {[key: string]: {currency: string, symbol: string, format: string}} = {
    US: { currency: 'USD', symbol: '$', format: '$#,###.##' },
    GB: { currency: 'GBP', symbol: '£', format: '£#,###.##' },
    EU: { currency: 'EUR', symbol: '€', format: '#,###.## €' },
    DE: { currency: 'EUR', symbol: '€', format: '#,###,## €' },
    FR: { currency: 'EUR', symbol: '€', format: '# ###,## €' },
    JP: { currency: 'JPY', symbol: '¥', format: '¥#,###' },
    CN: { currency: 'CNY', symbol: '¥', format: '¥#,###.##' },
    IN: { currency: 'INR', symbol: '₹', format: '₹ #,##,###.##' },
    BR: { currency: 'BRL', symbol: 'R$', format: 'R$ #.###,##' },
    RU: { currency: 'RUB', symbol: '₽', format: '# ###,## ₽' },
    AU: { currency: 'AUD', symbol: 'A$', format: 'A$#,###.##' },
    CA: { currency: 'CAD', symbol: 'C$', format: 'C$#,###.##' },
    KR: { currency: 'KRW', symbol: '₩', format: '₩#,###' },
    MX: { currency: 'MXN', symbol: 'Mex$', format: 'Mex$#,###.##' },
    SG: { currency: 'SGD', symbol: 'S$', format: 'S$#,###.##' },
    ZA: { currency: 'ZAR', symbol: 'R', format: 'R #,###.##' },
    SE: { currency: 'SEK', symbol: 'kr', format: '# ###,## kr' },
    CH: { currency: 'CHF', symbol: 'CHF', format: 'CHF #,###.##' },
    NO: { currency: 'NOK', symbol: 'kr', format: 'kr #,###.##' },
    DK: { currency: 'DKK', symbol: 'kr', format: '# ###,## kr' }
  };
  
  return currencyMap[countryCode] || { currency: 'USD', symbol: '$', format: '$#,###.##' };
};

/**
 * Format price according to locale
 */
export const formatLocalPrice = (price: number, countryCode: string, options?: { showCurrency?: boolean, decimalPlaces?: number }): string => {
  const { currency, symbol, format } = getCountryCurrency(countryCode);
  const showCurrency = options?.showCurrency !== undefined ? options.showCurrency : true;
  const decimalPlaces = options?.decimalPlaces !== undefined ? options.decimalPlaces : 2;
  
  try {
    // Use Intl API for formatting
    const formatter = new Intl.NumberFormat(countryCode, {
      style: showCurrency ? 'currency' : 'decimal',
      currency: showCurrency ? currency : undefined,
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces
    });
    
    return formatter.format(price);
  } catch (error) {
    // Fallback to basic formatting if Intl API fails
    let formattedPrice = price.toFixed(decimalPlaces);
    
    if (showCurrency) {
      // Apply the format from our map
      if (format.startsWith(symbol)) {
        formattedPrice = `${symbol}${formattedPrice}`;
      } else {
        formattedPrice = `${formattedPrice} ${symbol}`;
      }
    }
    
    return formattedPrice;
  }
};

/**
 * Get localized content based on user's location
 */
export const getLocalizedContent = (content: {[key: string]: any}, userLocation: GeoLocation): {[key: string]: any} => {
  // Default to global content
  if (!userLocation.countryCode) {
    return content;
  }
  
  // Check if we have specific content for this country
  const countryContent = content[`country_${userLocation.countryCode.toLowerCase()}`];
  if (countryContent) {
    // Merge with default content, with country-specific taking precedence
    return { ...content, ...countryContent };
  }
  
  // Check for regional content (e.g., EU, NA, APAC)
  // Map countries to regions
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
  
  const userRegion = regionMap[userLocation.countryCode];
  if (userRegion) {
    const regionContent = content[`region_${userRegion}`];
    if (regionContent) {
      return { ...content, ...regionContent };
    }
  }
  
  // No specific content, return global
  return content;
};

/**
 * Save user location preferences to local storage
 */
export const saveGeoPreferences = (preferences: GeoPreferences): void => {
  localStorage.setItem('atlas_geo_preferences', JSON.stringify(preferences));
};

/**
 * Load user location preferences from local storage
 */
export const loadGeoPreferences = (): GeoPreferences => {
  const stored = localStorage.getItem('atlas_geo_preferences');
  if (!stored) {
    return {
      useAutoDetect: true,
      allowGeoTargeting: true
    };
  }
  
  try {
    return JSON.parse(stored) as GeoPreferences;
  } catch (error) {
    console.error('Error parsing geo preferences', error);
    return {
      useAutoDetect: true,
      allowGeoTargeting: true
    };
  }
};

/**
 * Check if a feature is available in the user's region
 */
export const isFeatureAvailableInRegion = (featureId: string, userLocation: GeoLocation): boolean => {
  // Define region restrictions for features
  const featureRestrictions: {[key: string]: {allowedRegions?: string[], disallowedRegions?: string[]}} = {
    'ai-content-generation': {
      // Some countries might have restrictions on AI usage
      disallowedRegions: []
    },
    'payment-processing': {
      // Supported payment regions
      allowedRegions: ['US', 'CA', 'GB', 'EU', 'AU', 'JP', 'SG', 'HK', 'NZ', 'AE']
    },
    'marketing-automation': {
      // Regions with restrictions on automated communications
      disallowedRegions: []
    },
    'data-processing': {
      // Regions with strict data processing regulations
      disallowedRegions: []
    }
  };
  
  const restrictions = featureRestrictions[featureId];
  if (!restrictions) {
    // If no restrictions defined, feature is available everywhere
    return true;
  }
  
  const countryCode = userLocation.countryCode;
  if (!countryCode) {
    // If we don't know the country, default to allowing the feature
    return true;
  }
  
  // Check if country is explicitly disallowed
  if (restrictions.disallowedRegions && restrictions.disallowedRegions.includes(countryCode)) {
    return false;
  }
  
  // Check if country is in allowed regions list (if specified)
  if (restrictions.allowedRegions) {
    // Check exact country match
    if (restrictions.allowedRegions.includes(countryCode)) {
      return true;
    }
    
    // Check for region groups (EU, etc.)
    // For EU countries
    const euCountries = [
      'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE',
      'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'
    ];
    
    if (restrictions.allowedRegions.includes('EU') && euCountries.includes(countryCode)) {
      return true;
    }
    
    // Feature is not allowed in this region
    return false;
  }
  
  // Default to allowing if no specific allow list
  return true;
};
