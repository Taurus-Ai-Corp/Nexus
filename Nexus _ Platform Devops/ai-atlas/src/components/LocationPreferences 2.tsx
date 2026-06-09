import React, { useState, useEffect } from 'react';
import { useGeoTargeting } from '../context/GeoTargetingContext';

interface LocationPreferencesProps {
  onClose?: () => void;
  className?: string;
}

const LocationPreferences: React.FC<LocationPreferencesProps> = ({ onClose, className }) => {
  const { location, preferences, updatePreferences, refreshLocation, loading, error, hasGeolocationPermission, requestGeolocationPermission } = useGeoTargeting();

  const [allowGeoTargeting, setAllowGeoTargeting] = useState<boolean>(preferences.allowGeoTargeting);
  const [useAutoDetect, setUseAutoDetect] = useState<boolean>(preferences.useAutoDetect);
  const [selectedCountry, setSelectedCountry] = useState<string>(location?.countryCode || '');
  const [selectedLanguage, setSelectedLanguage] = useState<string>(preferences.preferredLanguage || navigator.language || 'en');
  const [selectedCurrency, setSelectedCurrency] = useState<string>(preferences.preferredCurrency || 'USD');
  const [permissionStatus, setPermissionStatus] = useState<string>(hasGeolocationPermission ? 'granted' : 'unknown');

  // Update form state when preferences change
  useEffect(() => {
    setAllowGeoTargeting(preferences.allowGeoTargeting);
    setUseAutoDetect(preferences.useAutoDetect);
    setSelectedLanguage(preferences.preferredLanguage || navigator.language || 'en');
    setSelectedCurrency(preferences.preferredCurrency || 'USD');
  }, [preferences]);

  // Update selected country when location changes
  useEffect(() => {
    if (location?.countryCode) {
      setSelectedCountry(location.countryCode);
    }
  }, [location]);

  // Update permission status when hasGeolocationPermission changes
  useEffect(() => {
    setPermissionStatus(hasGeolocationPermission ? 'granted' : 'unknown');
  }, [hasGeolocationPermission]);

  // List of common countries
  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'ES', name: 'Spain' },
    { code: 'IT', name: 'Italy' },
    { code: 'JP', name: 'Japan' },
    { code: 'IN', name: 'India' },
    { code: 'BR', name: 'Brazil' },
    { code: 'MX', name: 'Mexico' },
    { code: 'ZA', name: 'South Africa' },
    { code: 'CN', name: 'China' },
    { code: 'RU', name: 'Russia' },
    { code: 'SG', name: 'Singapore' },
    { code: 'AE', name: 'United Arab Emirates' },
    // Add more countries as needed
  ];

  // List of common languages
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
    // Add more languages as needed
  ];

  // List of common currencies
  const currencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'CNY', name: 'Chinese Yuan' },
    { code: 'BRL', name: 'Brazilian Real' },
    { code: 'RUB', name: 'Russian Ruble' },
    { code: 'ZAR', name: 'South African Rand' },
    { code: 'SGD', name: 'Singapore Dollar' },
    { code: 'AED', name: 'UAE Dirham' },
    // Add more currencies as needed
  ];

  const handleSave = () => {
    const newPreferences = {
      allowGeoTargeting,
      useAutoDetect,
      preferredLanguage: selectedLanguage,
      preferredCurrency: selectedCurrency,
      locationOverride: !useAutoDetect ? {
        countryCode: selectedCountry,
      } : undefined
    };

    updatePreferences(newPreferences);
    onClose && onClose();
  };

  const handleRequestPermission = async () => {
    const granted = await requestGeolocationPermission();
    setPermissionStatus(granted ? 'granted' : 'denied');
    if (granted) {
      // Refresh location after permission is granted
      refreshLocation();
    }
  };

  const handleRefreshLocation = () => {
    refreshLocation();
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md mx-auto ${className || ''}`}>
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Location Preferences</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-md">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={allowGeoTargeting}
              onChange={() => setAllowGeoTargeting(!allowGeoTargeting)}
              className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-700 dark:text-gray-300">Enable location-based features</span>
          </label>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-7">
            Allow Atlas AI to customize content and features based on your location
          </p>
        </div>
        
        {allowGeoTargeting && (
          <>
            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useAutoDetect}
                  onChange={() => setUseAutoDetect(!useAutoDetect)}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-700 dark:text-gray-300">Auto-detect my location</span>
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-7">
                Atlas AI will automatically detect your location
              </p>
            </div>
            
            {useAutoDetect && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Current Location</span>
                  <button
                    onClick={handleRefreshLocation}
                    disabled={loading}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
                  >
                    {loading ? 'Refreshing...' : 'Refresh'}
                    {!loading && (
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    )}
                  </button>
                </div>
                
                <div className="bg-gray-100 dark:bg-gray-700 rounded-md p-3">
                  {loading ? (
                    <p className="text-gray-500 dark:text-gray-400">Detecting your location...</p>
                  ) : location ? (
                    <div className="space-y-1">
                      <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-medium">Country:</span> {location.country || 'Unknown'}
                      </p>
                      {location.city && (
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-medium">City:</span> {location.city}
                        </p>
                      )}
                      {location.region && (
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-medium">Region:</span> {location.region}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">Location not available</p>
                  )}
                </div>
                
                {permissionStatus !== 'granted' && (
                  <div className="mt-2">
                    <button
                      onClick={handleRequestPermission}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                    >
                      Allow precise location detection
                    </button>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      This improves location accuracy for better targeting
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {!useAutoDetect && (
              <div>
                <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">
                  Select your country
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a country</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            <div>
              <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">
                Preferred Language
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {languages.map((language) => (
                  <option key={language.code} value={language.code}>
                    {language.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block mb-2 text-gray-700 dark:text-gray-300 font-medium">
                Preferred Currency
              </label>
              <select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.name} ({currency.code})
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
      </div>
      
      <div className="flex justify-end mt-6 space-x-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default LocationPreferences;