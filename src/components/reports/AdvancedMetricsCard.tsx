
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface AdvancedMetricsCardProps {
  title: string;
  value: string | number;
  previousValue?: string | number;
  target?: number;
  format?: 'currency' | 'percentage' | 'number';
  description?: string;
}

export const AdvancedMetricsCard = ({
  title,
  value,
  previousValue,
  target,
  format = 'number',
  description
}: AdvancedMetricsCardProps) => {
  const formatValue = (val: string | number) => {
    const numVal = typeof val === 'string' ? parseFloat(val) : val;
    
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(numVal);
      case 'percentage':
        return `${numVal.toFixed(1)}%`;
      default:
        return numVal.toLocaleString('pt-BR');
    }
  };

  const calculateTrend = () => {
    if (previousValue === undefined) return null;
    
    const current = typeof value === 'string' ? parseFloat(value) : value;
    const previous = typeof previousValue === 'string' ? parseFloat(previousValue) : previousValue;
    
    if (previous === 0) return null;
    
    const trend = ((current - previous) / previous) * 100;
    return trend;
  };

  const calculateProgress = () => {
    if (!target) return null;
    
    const current = typeof value === 'string' ? parseFloat(value) : value;
    return Math.min((current / target) * 100, 100);
  };

  const trend = calculateTrend();
  const progress = calculateProgress();

  const getTrendIcon = () => {
    if (trend === null) return null;
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-600" />;
  };

  const getTrendColor = () => {
    if (trend === null) return 'text-gray-600';
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {getTrendIcon()}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatValue(value)}</div>
        
        {trend !== null && (
          <p className={`text-xs ${getTrendColor()}`}>
            {trend > 0 ? '+' : ''}{trend.toFixed(1)}% em relação ao período anterior
          </p>
        )}
        
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        
        {progress !== null && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progresso da Meta</span>
              <span>{progress.toFixed(1)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
