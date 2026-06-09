import { format, parseISO, isValid } from 'date-fns';

// Number formatting utilities
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatNumber = (
  value: number,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    notation?: 'standard' | 'scientific' | 'engineering' | 'compact';
    compactDisplay?: 'short' | 'long';
  } = {}
): string => {
  const {
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    notation = 'standard',
    compactDisplay = 'short'
  } = options;

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits,
    maximumFractionDigits,
    notation,
    compactDisplay
  }).format(value);
};

export const formatPercentage = (
  value: number,
  decimals: number = 1
): string => {
  return `${value.toFixed(decimals)}%`;
};

// Date formatting utilities
export const formatDate = (
  date: string | Date,
  formatString: string = 'MMM dd, yyyy'
): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(dateObj)) {
    return 'Invalid Date';
  }
  
  return format(dateObj, formatString);
};

export const formatDateTime = (
  date: string | Date,
  formatString: string = 'MMM dd, yyyy HH:mm'
): string => {
  return formatDate(date, formatString);
};

export const formatRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(dateObj)) {
    return 'Invalid Date';
  }
  
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
};

// Duration formatting
export const formatDuration = (milliseconds: number): string => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}d ${hours % 24}h ${minutes % 60}m`;
  } else if (hours > 0) {
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

// File size formatting
export const formatFileSize = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

// Data rate formatting
export const formatDataRate = (bytesPerSecond: number): string => {
  return `${formatFileSize(bytesPerSecond)}/s`;
};

// Trend formatting
export const formatTrend = (value: number): {
  text: string;
  color: string;
  icon: string;
} => {
  if (value > 0) {
    return {
      text: `+${formatPercentage(value)}`,
      color: 'text-success-600',
      icon: '↗'
    };
  } else if (value < 0) {
    return {
      text: formatPercentage(value),
      color: 'text-danger-600',
      icon: '↘'
    };
  } else {
    return {
      text: '0%',
      color: 'text-gray-600',
      icon: '→'
    };
  }
};

// Status formatting
export const formatStatus = (status: string): {
  text: string;
  color: string;
  bgColor: string;
} => {
  const statusMap: Record<string, { text: string; color: string; bgColor: string }> = {
    active: {
      text: 'Active',
      color: 'text-success-600',
      bgColor: 'bg-success-100'
    },
    inactive: {
      text: 'Inactive',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    },
    maintenance: {
      text: 'Maintenance',
      color: 'text-warning-600',
      bgColor: 'bg-warning-100'
    },
    error: {
      text: 'Error',
      color: 'text-danger-600',
      bgColor: 'bg-danger-100'
    },
    healthy: {
      text: 'Healthy',
      color: 'text-success-600',
      bgColor: 'bg-success-100'
    },
    warning: {
      text: 'Warning',
      color: 'text-warning-600',
      bgColor: 'bg-warning-100'
    },
    critical: {
      text: 'Critical',
      color: 'text-danger-600',
      bgColor: 'bg-danger-100'
    }
  };
  
  return statusMap[status.toLowerCase()] || {
    text: status,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100'
  };
};

// Chart data formatting
export const formatChartData = (data: any[], xKey: string, yKey: string) => {
  return data.map(item => ({
    x: item[xKey],
    y: item[yKey],
    timestamp: item.timestamp || new Date().toISOString()
  }));
};

// Time series data formatting
export const formatTimeSeriesData = (data: any[], timeKey: string = 'timestamp', valueKey: string = 'value') => {
  return data.map(item => ({
    time: formatDateTime(item[timeKey], 'HH:mm'),
    value: item[valueKey],
    timestamp: item[timeKey]
  }));
};

// Table data formatting
export const formatTableData = (data: any[], columns: string[]) => {
  return data.map(item => {
    const formattedItem: any = {};
    columns.forEach(column => {
      if (item[column] !== undefined) {
        formattedItem[column] = item[column];
      }
    });
    return formattedItem;
  });
};

// Utility for truncating text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Utility for generating color from string
export const generateColorFromString = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 50%)`;
};

// Utility for calculating percentage change
export const calculatePercentageChange = (oldValue: number, newValue: number): number => {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return ((newValue - oldValue) / oldValue) * 100;
};

// Utility for calculating growth rate
export const calculateGrowthRate = (values: number[]): number => {
  if (values.length < 2) return 0;
  
  const firstValue = values[0];
  const lastValue = values[values.length - 1];
  
  return calculatePercentageChange(firstValue, lastValue);
};

