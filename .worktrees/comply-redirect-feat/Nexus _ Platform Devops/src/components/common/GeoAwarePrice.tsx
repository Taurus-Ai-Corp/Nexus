import React, { useContext } from 'react';
import { GeoTargetingContext } from '../../contexts/GeoTargetingContext';

interface GeoAwarePriceProps {
  amount: number;
  showCurrencyCode?: boolean;
  className?: string;
}

/**
 * A component that displays a price formatted according to the user's location
 * Converts the price to local currency and formats it according to local conventions
 */
const GeoAwarePrice: React.FC<GeoAwarePriceProps> = ({
  amount,
  showCurrencyCode = false,
  className = '',
}) => {
  const { userCurrency, exchangeRates } = useContext(GeoTargetingContext);
  
  // Convert amount to local currency
  const convertedAmount = exchangeRates && userCurrency !== 'USD'
    ? amount * (exchangeRates[userCurrency] || 1)
    : amount;
  
  // Format according to local conventions
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: userCurrency,
    currencyDisplay: showCurrencyCode ? 'code' : 'symbol',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(convertedAmount);
  
  return <span className={className}>{formattedPrice}</span>;
};

export default GeoAwarePrice;