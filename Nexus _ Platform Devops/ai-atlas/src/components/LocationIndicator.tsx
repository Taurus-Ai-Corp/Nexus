import React, { useState } from 'react';
import { useGeoTargeting } from '../context/GeoTargetingContext';
import LocationPreferences from './LocationPreferences';

interface LocationIndicatorProps {
  className?: string;
}

const LocationIndicator: React.FC<LocationIndicatorProps> = ({ className }) => {
  const { location, loading, preferences } = useGeoTargeting();
  const [showPreferences, setShowPreferences] = useState(false);

  // Don't show the indicator if geo-targeting is disabled
  if (!preferences.allowGeoTargeting) {
    return null;
  }

  return (
    <div className={`relative ${className || ''}`}>
      <button
        onClick={() => setShowPreferences(true)}
        className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors focus:outline-none"
        aria-label="Location settings"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>
          {loading ? (
            'Detecting...'
          ) : location?.country ? (
            location.country
          ) : (
            'Location'
          )}
        </span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showPreferences && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-md w-full">
            <LocationPreferences onClose={() => setShowPreferences(false)} />
            <button
              onClick={() => setShowPreferences(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationIndicator;