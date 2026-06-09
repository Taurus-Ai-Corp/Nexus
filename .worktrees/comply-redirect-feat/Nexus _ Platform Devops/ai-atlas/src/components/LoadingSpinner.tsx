import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'accent';
  text?: string;
  overlay?: boolean;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  text,
  overlay = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'border-dgsm-accent-blue',
    secondary: 'border-dgsm-accent-purple',
    accent: 'border-dgsm-accent-green'
  };

  const spinner = (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Outer ring */}
      <div 
        className={`absolute inset-0 border-2 ${colorClasses[color]} border-t-transparent rounded-full animate-spin`}
      />
      {/* Inner ring */}
      <div 
        className={`absolute inset-1 border-2 ${colorClasses[color]}/40 border-b-transparent rounded-full animate-spin`}
        style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}
      />
      {/* Center dot */}
      <div 
        className={`absolute top-1/2 left-1/2 w-1 h-1 bg-${color === 'primary' ? 'dgsm-accent-blue' : color === 'secondary' ? 'dgsm-accent-purple' : 'dgsm-accent-green'} rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-pulse`}
      />
    </div>
  );

  const content = (
    <div className="flex flex-col items-center justify-center space-y-3">
      {spinner}
      {text && (
        <div className="text-dgsm-text-secondary text-sm font-medium animate-pulse">
          {text}
        </div>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-dgsm-primary/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-dgsm-secondary/90 backdrop-blur-md rounded-2xl p-8 border border-dgsm-border shadow-2xl">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

// Inline loading component for buttons and small spaces
export const InlineLoader: React.FC<{ size?: 'xs' | 'sm'; color?: 'primary' | 'secondary' | 'accent' }> = ({ 
  size = 'xs', 
  color = 'primary' 
}) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4'
  };

  const colorClasses = {
    primary: 'border-white',
    secondary: 'border-dgsm-accent-purple',
    accent: 'border-dgsm-accent-green'
  };

  return (
    <div 
      className={`${sizeClasses[size]} border-2 ${colorClasses[color]} border-t-transparent rounded-full animate-spin`}
    />
  );
};

// Skeleton loader for content
export const SkeletonLoader: React.FC<{ 
  lines?: number; 
  className?: string;
  showAvatar?: boolean;
}> = ({ 
  lines = 3, 
  className = '',
  showAvatar = false 
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="flex space-x-4">
        {showAvatar && (
          <div className="w-10 h-10 bg-dgsm-border rounded-full"></div>
        )}
        <div className="flex-1 space-y-2">
          {Array.from({ length: lines }).map((_, i) => (
            <div 
              key={i}
              className={`h-4 bg-dgsm-border rounded ${
                i === lines - 1 ? 'w-3/4' : 'w-full'
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
