import { Users, CreditCard, Zap, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  trend: string;
  icon?: string;
  color?: 'blue' | 'green' | 'purple' | 'emerald';
}

export function StatsCard({ 
  title, 
  value, 
  trend, 
  icon = 'Users',
  color = 'blue'
}: StatsCardProps) {
  const bgColors: Record<string, string> = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    purple: 'bg-purple-50',
    emerald: 'bg-emerald-50'
  };

  const textColors: Record<string, string> = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    emerald: 'text-emerald-600'
  };

  const isPositive = trend.startsWith('+');
  const trendColor = isPositive ? 'text-green-600' : 'text-red-600';

  const getIcon = () => {
    switch (icon) {
      case 'Users': return <Users className={`h-5 w-5 ${textColors[color]}`} />;
      case 'CreditCard': return <CreditCard className={`h-5 w-5 ${textColors[color]}`} />;
      case 'Zap': return <Zap className={`h-5 w-5 ${textColors[color]}`} />;
      case 'DollarSign': return <DollarSign className={`h-5 w-5 ${textColors[color]}`} />;
      default: return <Users className={`h-5 w-5 ${textColors[color]}`} />;
    }
  };

  return (
    <div className={`rounded-xl shadow ${bgColors[color]} p-6`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-sm font-medium ${textColors[color]}`}>
          {title}
        </h3>
        {getIcon()}
      </div>
      
      <p className="text-3xl font-bold text-gray-900">
        {value}
      </p>
      
      <div className="flex items-center text-sm mt-2">
        {isPositive ? <TrendingUp className="mr-1 h-4 w-4" /> : <TrendingDown className="mr-1 h-4 w-4" />}
        <span className={trendColor}>{trend}</span>
      </div>
    </div>
  );
}