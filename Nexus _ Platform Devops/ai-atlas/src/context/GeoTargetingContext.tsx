import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  GeoLocation,
  GeoPreferences,
  getBrowserLocation,
  loadGeoPreferences,
  saveGeoPreferences,
  getLocalizedContent,
  formatLocalPrice,
  isFeatureAvailableInRegion
} from '../utils/seo/geoTargeting';

interface GeoTargetingContextType {
  location: GeoLocation | null;
  preferences: GeoPreferences;
  loading: boolean;
  error: string | null;
  updatePreferences: (newPreferences: Partial<GeoPreferences>) => void;
  refreshLocation: () => Promise<void>;
  getLocalizedContent: <T extends {[key: string]: any}>(content: T) => T;
  formatPrice: (price: number, options?: { showCurrency?: boolean, decimalPlaces?: number }) => string;
  isFeatureAvailable: (featureId: string) => boolean;
  hasGeolocationPermission: boolean;
  requestGeolocationPermission: () => Promise<boolean>;
}

const GeoTargetingContext = createContext<GeoTargetingContextType>({} as GeoTargetingContextType);

export const useGeoTargeting = () => useContext(GeoTargetingContext);

interface GeoTargetingProviderProps {
  children: ReactNode;
}

export const GeoTargetingProvider: React.FC<GeoTargetingProviderProps> = ({ children }) => {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [preferences, setPreferences] = useState<GeoPreferences>({
    useAutoDetect: true,
    allowGeoTargeting: true
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasGeolocationPermission, setHasGeolocationPermission] = useState<boolean>(false);

  // Load user preferences from local storage
  useEffect(() => {
    const storedPreferences = loadGeoPreferences();
    setPreferences(storedPreferences);
  }, []);

  // Fetch user location on mount if auto-detect is enabled
  useEffect(() => {
    if (preferences.useAutoDetect && preferences.allowGeoTargeting) {
      fetchLocation();
    } else if (preferences.locationOverride) {
      // Use the user's preferred location
      setLocation(preferences.locationOverride);
      setLoading(false);
    } else {
      // No location available
      setLoading(false);
    }
  }, [preferences.useAutoDetect, preferences.allowGeoTargeting, preferences.locationOverride]);

  // Check if geolocation permission is granted
  useEffect(() => {
    checkGeolocationPermission();
  }, []);

  const checkGeolocationPermission = async () => {
    if (!navigator.permissions) {
      // Browser doesn't support permissions API
      setHasGeolocationPermission(false);
      return;
    }

    try {
      const { state } = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
      setHasGeolocationPermission(state === 'granted');
    } catch (error) {
      console.error('Error checking geolocation permission:', error);
      setHasGeolocationPermission(false);
    }
  };

  const requestGeolocationPermission = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        () => {
          setHasGeolocationPermission(true);
          resolve(true);
        },
        () => {
          setHasGeolocationPermission(false);
          resolve(false);
        }
      );
    });
  };

  const fetchLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      const geoLocation = await getBrowserLocation();
      setLocation(geoLocation);
    } catch (err) {
      console.error('Error fetching location:', err);
      setError('Failed to detect your location');
    } finally {
      setLoading(false);
    }
  };

  const refreshLocation = async () => {
    if (preferences.allowGeoTargeting) {
      await fetchLocation();
    }
  };

  const updatePreferences = (newPreferences: Partial<GeoPreferences>) => {
    const updatedPreferences = { ...preferences, ...newPreferences };
    setPreferences(updatedPreferences);
    saveGeoPreferences(updatedPreferences);

    // If auto-detect was enabled, refresh the location
    if (newPreferences.useAutoDetect && newPreferences.allowGeoTargeting) {
      fetchLocation();
    }
  };

  // Helper function to get localized content
  const getLocalizedContentWrapper = <T extends {[key: string]: any}>(content: T): T => {
    if (!location || !preferences.allowGeoTargeting) {
      return content;
    }
    return getLocalizedContent(content, location) as T;
  };

  // Helper function to format prices according to user's location
  const formatPrice = (price: number, options?: { showCurrency?: boolean, decimalPlaces?: number }): string => {
    if (!location?.countryCode || !preferences.allowGeoTargeting) {
      // Default formatting if no location or geo-targeting disabled
      return new Intl.NumberFormat('en-US', {
        style: options?.showCurrency !== false ? 'currency' : 'decimal',
        currency: 'USD',
        minimumFractionDigits: options?.decimalPlaces ?? 2,
        maximumFractionDigits: options?.decimalPlaces ?? 2
      }).format(price);
    }

    return formatLocalPrice(price, location.countryCode, options);
  };

  // Helper function to check if a feature is available in the user's region
  const isFeatureAvailable = (featureId: string): boolean => {
    if (!location || !preferences.allowGeoTargeting) {
      // Default to available if no location or geo-targeting disabled
      return true;
    }

    return isFeatureAvailableInRegion(featureId, location);
  };

  const value = {
    location,
    preferences,
    loading,
    error,
    updatePreferences,
    refreshLocation,
    getLocalizedContent: getLocalizedContentWrapper,
    formatPrice,
    isFeatureAvailable,
    hasGeolocationPermission,
    requestGeolocationPermission
  };

  return (
    <GeoTargetingContext.Provider value={value}>
      {children}
    </GeoTargetingContext.Provider>
  );
};
