import React, { ReactNode } from 'react';
import { useGeoTargeting } from '../context/GeoTargetingContext';

interface GeoTargetedContentProps {
  children: ReactNode;
  countries?: string[];
  regions?: ('eu' | 'na' | 'apac' | 'sa' | 'mea')[];
  excludeCountries?: string[];
  excludeRegions?: ('eu' | 'na' | 'apac' | 'sa' | 'mea')[];
  fallback?: ReactNode;
}

/**
 * Component that conditionally renders content based on user's geographic location
 */
const GeoTargetedContent: React.FC<GeoTargetedContentProps> = ({
  children,
  countries,
  regions,
  excludeCountries,
  excludeRegions,
  fallback
}) => {
  const { location, preferences } = useGeoTargeting();

  if (!location || !preferences.allowGeoTargeting) {
    // If location is unknown or geo-targeting is disabled, show children by default
    return <>{children}</>;
  }

  const countryCode = location.countryCode;
  if (!countryCode) {
    // If country code is unknown, show children by default
    return <>{children}</>;
  }

  // Check if country is explicitly excluded
  if (excludeCountries && excludeCountries.includes(countryCode)) {
    return <>{fallback || null}</>;
  }

  // Define region mappings
  const regionMap: { [key: string]: ('eu' | 'na' | 'apac' | 'sa' | 'mea') } = {
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

  // Get user's region
  const userRegion = regionMap[countryCode];

  // Check if region is explicitly excluded
  if (excludeRegions && userRegion && excludeRegions.includes(userRegion)) {
    return <>{fallback || null}</>;
  }

  // If specific countries are provided, check if user's country is included
  if (countries && countries.length > 0) {
    if (countries.includes(countryCode)) {
      return <>{children}</>;
    }
  }
  // If specific regions are provided, check if user's region is included
  else if (regions && regions.length > 0 && userRegion) {
    if (regions.includes(userRegion)) {
      return <>{children}</>;
    }
  }
  // If no targeting criteria provided, show content by default
  else if (!countries && !regions) {
    return <>{children}</>;
  }

  // If we get here, the user's location doesn't match the criteria
  return <>{fallback || null}</>;
};

export default GeoTargetedContent;