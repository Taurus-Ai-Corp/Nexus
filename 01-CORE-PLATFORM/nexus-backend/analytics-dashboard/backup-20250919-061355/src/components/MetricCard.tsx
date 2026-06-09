import React from 'react';
import { formatCurrency, formatNumber, formatPercentage, formatTrend } from '../utils/formatters';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: number | string;
  type?: 'currency' | 'number' | 'percentage';
  trend?: number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  type = 'number',
  trend,
  subtitle,
  icon,
  color = 'primary',
  size = 'md',
  loading = false,
  className = ''
}) => {
  const colorClasses = {
    primary: 'bg-taurus-50 border-taurus-200 text-taurus-900',
    success: 'bg-success-50 border-success-200 text-success-900',
    warning: 'bg-warning-50 border-warning-200 text-warning-900',
    danger: 'bg-danger-50 border-danger-200 text-danger-900',
    gray: 'bg-gray-50 border-gray-200 text-gray-900'
  };

  const sizeClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const formatValue = () => {
    if (typeof value === 'string') return value;
    
    switch (type) {
      case 'currency':
        return formatCurrency(value);
      case 'percentage':
        return formatPercentage(value);
      default:
        return formatNumber(value);
    }
  };

  const renderTrend = () => {
    if (trend === undefined) return null;
    
    const trendData = formatTrend(trend);
    
    return (
      <div className={`flex items-center text-sm ${trendData.color}`}>
        {trend > 0 && <TrendingUp className="w-4 h-4 mr-1" />}
        {trend < 0 && <TrendingDown className="w-4 h-4 mr-1" />}
        {trend === 0 && <Minus className="w-4 h-4 mr-1" />}
        <span>{trendData.text}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`rounded-lg border-2 border-dashed ${colorClasses[color]} ${sizeClasses[size]} ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-2">
            <div className="h-4 bg-gray-300 rounded w-1/3"></div>
            {icon && <div className="w-6 h-6 bg-gray-300 rounded"></div>}
          </div>
          <div className="h-8 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-1/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border-2 ${colorClasses[color]} ${sizeClasses[size]} ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium opacity-75">{title}</h3>
        {icon && <div className="text-2xl opacity-75">{icon}</div>}
      </div>
      
      <div className="mb-2">
        <div className="text-2xl font-bold">
          {formatValue()}
        </div>
        {subtitle && (
          <div className="text-sm opacity-75 mt-1">
            {subtitle}
          </div>
        )}
      </div>
      
      {renderTrend()}
    </div>
  );
};

export default MetricCard;
