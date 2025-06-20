
import React, { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface PerformanceIndicatorProps {
  title: string;
  current: number;
  target: number;
  format?: 'number' | 'currency' | 'percentage';
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
}

export const PerformanceIndicator = memo(({
  title,
  current,
  target,
  format = 'number',
  trend,
}: PerformanceIndicatorProps) => {
  const formatValue = (value: number) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      default:
        return value.toLocaleString('pt-BR');
    }
  };

  const progressPercentage = Math.min((current / target) * 100, 100);
  const isOnTarget = current >= target;

  const getTrendIcon = () => {
    if (!trend) return null;
    switch (trend.direction) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          {title}
          {getTrendIcon()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-bold">{formatValue(current)}</span>
          <span className="text-sm text-muted-foreground">
            de {formatValue(target)}
          </span>
        </div>
        
        <Progress 
          value={progressPercentage} 
          className={`h-2 ${isOnTarget ? 'bg-green-100' : 'bg-gray-100'}`}
        />
        
        <div className="flex items-center justify-between text-xs">
          <span className={isOnTarget ? 'text-green-600' : 'text-orange-600'}>
            {progressPercentage.toFixed(1)}% da meta
          </span>
          {trend && (
            <span className={
              trend.direction === 'up' ? 'text-green-600' : 
              trend.direction === 'down' ? 'text-red-600' : 'text-gray-600'
            }>
              {trend.direction === 'up' ? '+' : trend.direction === 'down' ? '-' : ''}
              {Math.abs(trend.value).toFixed(1)}%
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

PerformanceIndicator.displayName = 'PerformanceIndicator';
