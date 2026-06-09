import React, { useContext } from 'react';
import { GeoTargetingContext } from '../../contexts/GeoTargetingContext';

interface LocationBasedContentProps {
  children: React.ReactNode;
  countries: string[];
}

/**
 * A component that conditionally renders content based on the user's location
 * If the user's country matches one in the list, the content is shown
 * If the countries array is empty, the content is shown regardless of location
 */
const LocationBasedContent: React.FC<LocationBasedContentProps> = ({
  children,
  countries = [],
}) => {
  const { userCountry } = useContext(GeoTargetingContext);
  
  // If no countries specified, show content to everyone
  if (countries.length === 0) {
    return <>{children}</>;
  }
  
  // Show content only if user's country is in the list
  if (userCountry && countries.includes(userCountry)) {
    return <>{children}</>;
  }
  
  // Otherwise don't render anything
  return null;
};

export default LocationBasedContent;