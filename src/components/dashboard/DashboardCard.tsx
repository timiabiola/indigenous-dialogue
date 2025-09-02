import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: number | string;
  description?: string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'green' | 'orange' | 'red' | 'blue';
  icon?: React.ReactNode;
  className?: string;
}

const colorClasses = {
  green: 'border-green-200 bg-green-50',
  orange: 'border-orange-200 bg-orange-50',
  red: 'border-red-200 bg-red-50',
  blue: 'border-blue-200 bg-blue-50',
};

const trendIcons = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus,
};

const trendColors = {
  up: 'text-green-600',
  down: 'text-red-600',
  neutral: 'text-gray-600',
};

export function DashboardCard({
  title,
  value,
  description,
  change,
  trend = 'neutral',
  color = 'blue',
  icon,
  className,
}: DashboardCardProps) {
  const TrendIcon = trendIcons[trend];

  return (
    <Card className={cn(colorClasses[color], className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || change !== undefined) && (
          <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
            {change !== undefined && (
              <div className={cn('flex items-center', trendColors[trend])}>
                <TrendIcon className="mr-1 h-3 w-3" />
                <span>{Math.abs(change)}%</span>
              </div>
            )}
            {description && <span>{description}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}