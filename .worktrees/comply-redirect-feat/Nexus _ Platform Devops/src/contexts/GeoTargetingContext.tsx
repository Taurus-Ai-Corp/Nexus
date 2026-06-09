import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { addGeoMetaTags } from '../utils/seoUtils';

// Type definitions
type ExchangeRates = Record<string, number>;

interface GeoTargetingContextType {
  userCountry: string;
  userRegion: string;
  userCity: string;
  userCurrency: string;
  userLanguage: string;
  userTimezone: string;
  latitude: number | null;
  longitude: number | null;
  exchangeRates: ExchangeRates | null;
  isLoading: boolean;
  error: string | null;
  setUserCountry: (country: string) => void;
  setUserRegion: (region: string) => void;
  setUserCurrency: (currency: string) => void;
  resetLocationPreference: () => void;
}

// Default context values
const defaultContextValue: GeoTargetingContextType = {
  userCountry: 'US',
  userRegion: '',
  userCity: '',
  userCurrency: 'USD',
  userLanguage: 'en',
  userTimezone: 'America/New_York',
  latitude: null,
  longitude: null,
  exchangeRates: null,
  isLoading: true,
  error: null,
  setUserCountry: () => {},
  setUserRegion: () => {},
  setUserCurrency: () => {},
  resetLocationPreference: () => {},
};

// Currency mapping (country code to currency code)
const countryCurrencyMap: Record<string, string> = {
  US: 'USD', // United States - US Dollar
  CA: 'CAD', // Canada - Canadian Dollar
  GB: 'GBP', // United Kingdom - British Pound
  EU: 'EUR', // European Union - Euro
  DE: 'EUR', // Germany - Euro
  FR: 'EUR', // France - Euro
  IT: 'EUR', // Italy - Euro
  ES: 'EUR', // Spain - Euro
  JP: 'JPY', // Japan - Japanese Yen
  CN: 'CNY', // China - Chinese Yuan
  IN: 'INR', // India - Indian Rupee
  AU: 'AUD', // Australia - Australian Dollar
  BR: 'BRL', // Brazil - Brazilian Real
  RU: 'RUB', // Russia - Russian Ruble
  ZA: 'ZAR', // South Africa - South African Rand
  MX: 'MXN', // Mexico - Mexican Peso
};

// Sample exchange rates (in a real app, these would be fetched from an API)
const sampleExchangeRates: ExchangeRates = {
  USD: 1.0,    // Base currency
  EUR: 0.92,   // US Dollar to Euro
  GBP: 0.79,   // US Dollar to British Pound
  CAD: 1.36,   // US Dollar to Canadian Dollar
  AUD: 1.52,   // US Dollar to Australian Dollar
  JPY: 150.21, // US Dollar to Japanese Yen
  CNY: 7.21,   // US Dollar to Chinese Yuan
  INR: 83.54,  // US Dollar to Indian Rupee
  BRL: 5.43,   // US Dollar to Brazilian Real
  RUB: 89.77,  // US Dollar to Russian Ruble
  ZAR: 18.34,  // US Dollar to South African Rand
  MXN: 16.82,  // US Dollar to Mexican Peso
};

// Create the context
export const GeoTargetingContext = createContext<GeoTargetingContextType>(defaultContextValue);

interface GeoTargetingProviderProps {
  children: ReactNode;
}

/**
 * Provider component for GeoTargeting functionality
 */
export const GeoTargetingProvider: React.FC<GeoTargetingProviderProps> = ({ children }) => {
  // State for user location data
  const [userCountry, setUserCountry] = useState<string>(defaultContextValue.userCountry);
  const [userRegion, setUserRegion] = useState<string>(defaultContextValue.userRegion);
  const [userCity, setUserCity] = useState<string>(defaultContextValue.userCity);
  const [userCurrency, setUserCurrency] = useState<string>(defaultContextValue.userCurrency);
  const [userLanguage, setUserLanguage] = useState<string>(defaultContextValue.userLanguage);
  const [userTimezone, setUserTimezone] = useState<string>(defaultContextValue.userTimezone);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for user preferences
  const [hasCustomLocation, setHasCustomLocation] = useState<boolean>(false);
  
  // Effect to detect user location on component mount
  useEffect(() => {
    const detectUserLocation = async () => {
      try {
        setIsLoading(true);
        
        // In a real application, we would use a geolocation API service
        // For this demo, we're using a mock implementation
        
        // Check if user has a saved preference in localStorage
        const savedCountry = localStorage.getItem('userCountry');
        const savedRegion = localStorage.getItem('userRegion');
        const savedCurrency = localStorage.getItem('userCurrency');
        
        if (savedCountry && savedCurrency) {
          // Use saved preferences
          setUserCountry(savedCountry);
          setUserRegion(savedRegion || '');
          setUserCurrency(savedCurrency);
          setHasCustomLocation(true);
        } else {
          // Simulate API call to a geolocation service
          // In a real app, you would use something like:
          // const response = await fetch('https://api.ipgeolocation.io/ipgeo?apiKey=YOUR_API_KEY');
          
          // Simulate a delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Simulate successful geolocation
          // In a real app, these values would come from the API response
          const detectedCountry = 'US';
          const detectedRegion = 'CA';
          const detectedCity = 'San Francisco';
          const detectedTimezone = 'America/Los_Angeles';
          const detectedLatitude = 37.7749;
          const detectedLongitude = -122.4194;
          
          // Determine currency based on country
          const detectedCurrency = countryCurrencyMap[detectedCountry] || 'USD';
          
          // Update state with detected location
          setUserCountry(detectedCountry);
          setUserRegion(detectedRegion);
          setUserCity(detectedCity);
          setUserCurrency(detectedCurrency);
          setUserTimezone(detectedTimezone);
          setLatitude(detectedLatitude);
          setLongitude(detectedLongitude);
          
          // Add geo meta tags for SEO
          if (detectedLatitude && detectedLongitude) {
            addGeoMetaTags(
              `US-${detectedRegion}`,
              detectedCity,
              `${detectedLatitude},${detectedLongitude}`
            );
          }
        }
        
        // Fetch exchange rates
        // In a real app, you would use something like:
        // const ratesResponse = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        // const ratesData = await ratesResponse.json();
        // setExchangeRates(ratesData.rates);
        
        // Use sample exchange rates for this demo
        setExchangeRates(sampleExchangeRates);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error detecting user location:', err);
        setError('Failed to detect your location. Using default settings.');
        setIsLoading(false);
      }
    };
    
    detectUserLocation();
  }, []);
  
  // Function to set a custom country preference
  const handleSetUserCountry = (country: string) => {
    setUserCountry(country);
    setUserCurrency(countryCurrencyMap[country] || 'USD');
    localStorage.setItem('userCountry', country);
    localStorage.setItem('userCurrency', countryCurrencyMap[country] || 'USD');
    setHasCustomLocation(true);
  };
  
  // Function to set a custom region preference
  const handleSetUserRegion = (region: string) => {
    setUserRegion(region);
    localStorage.setItem('userRegion', region);
    setHasCustomLocation(true);
  };
  
  // Function to set a custom currency preference
  const handleSetUserCurrency = (currency: string) => {
    setUserCurrency(currency);
    localStorage.setItem('userCurrency', currency);
    setHasCustomLocation(true);
  };
  
  // Function to reset location preferences
  const resetLocationPreference = () => {
    localStorage.removeItem('userCountry');
    localStorage.removeItem('userRegion');
    localStorage.removeItem('userCurrency');
    setHasCustomLocation(false);
    
    // Refresh the page to re-detect location
    window.location.reload();
  };
  
  // Context value
  const contextValue: GeoTargetingContextType = {
    userCountry,
    userRegion,
    userCity,
    userCurrency,
    userLanguage,
    userTimezone,
    latitude,
    longitude,
    exchangeRates,
    isLoading,
    error,
    setUserCountry: handleSetUserCountry,
    setUserRegion: handleSetUserRegion,
    setUserCurrency: handleSetUserCurrency,
    resetLocationPreference,
  };
  
  return (
    <GeoTargetingContext.Provider value={contextValue}>
      {children}
    </GeoTargetingContext.Provider>
  );
};
