import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: 'violet' | 'green' | 'blue' | 'amber' | 'red' | 'purple';
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  onClick?: () => void;
}

const colorStyles = {
  violet: {
    bg: 'bg-violet-50 dark:bg-violet-900/20',
    icon: 'text-violet-600 dark:text-violet-400',
    border: 'border-violet-200 dark:border-violet-800',
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-900/20',
    icon: 'text-green-600 dark:text-green-400',
    border: 'border-green-200 dark:border-green-800',
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    icon: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    icon: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800',
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    icon: 'text-red-600 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    icon: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-200 dark:border-purple-800',
  },
};

export const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color,
  trend,
  onClick 
}: StatsCardProps) => {
  const styles = colorStyles[color];

  return (
    <Card
      onClick={onClick}
      className={cn(
        'p-4 sm:p-6 transition-all duration-200',
        'hover:shadow-md hover:-translate-y-0.5',
        onClick && 'cursor-pointer',
        'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="mb-1 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {value}
          </h3>
          
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span className={cn(
                'text-xs font-medium',
                trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              )}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {trend.label}
              </span>
            </div>
          )}
        </div>
        
        <div className={cn(
          'w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center',
          styles.bg
        )}>
          <Icon className={cn('w-5 h-5 sm:w-6 sm:h-6', styles.icon)} />
        </div>
      </div>
    </Card>
  );
};
