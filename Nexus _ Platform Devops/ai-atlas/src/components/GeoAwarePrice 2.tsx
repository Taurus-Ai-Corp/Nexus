import React from 'react';
import { useGeoTargeting } from '../context/GeoTargetingContext';

interface GeoAwarePriceProps {
  value: number;
  showCurrency?: boolean;
  decimalPlaces?: number;
  className?: string;
  discount?: number; // Optional discount percentage
  showDiscount?: boolean; // Whether to show the discount badge
  discountLabel?: string; // Optional custom discount label
  original?: number; // Optional original price to show strikethrough
}

/**
 * Component that displays prices formatted according to the user's geographic location
 */
const GeoAwarePrice: React.FC<GeoAwarePriceProps> = ({
  value,
  showCurrency = true,
  decimalPlaces = 2,
  className = '',
  discount,
  showDiscount = false,
  discountLabel,
  original
}) => {
  const { formatPrice } = useGeoTargeting();

  // Calculate the final price after discount if provided
  const finalPrice = discount ? value * (1 - discount / 100) : value;
  
  // Format the price according to the user's location
  const formattedPrice = formatPrice(finalPrice, { showCurrency, decimalPlaces });
  const formattedOriginal = original ? formatPrice(original, { showCurrency, decimalPlaces }) : undefined;

  return (
    <div className={`inline-flex items-center ${className}`}>
      {showDiscount && discount && (
        <span className="bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded-md mr-2">
          {discountLabel || `${discount}% OFF`}
        </span>
      )}
      
      <div>
        {formattedOriginal && (
          <span className="text-gray-500 line-through mr-2 text-sm">
            {formattedOriginal}
          </span>
        )}
        <span className="font-semibold">{formattedPrice}</span>
      </div>
    </div>
  );
};

export default GeoAwarePrice;