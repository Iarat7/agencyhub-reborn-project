
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const DashboardCard = ({ 
  title, 
  value, 
  subtitle,
  icon: Icon, 
  trend,
  className = ""
}: DashboardCardProps) => {
  return (
    <Card className={`hover:shadow-lg transition-shadow ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-slate-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        {subtitle && (
          <p className="text-xs text-slate-600 mt-1">
            {subtitle}
          </p>
        )}
        {trend && (
          <p className="text-xs text-slate-600 mt-1">
            <span className={trend.isPositive ? 'text-green-600' : 'text-red-600'}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </span>{' '}
            desde o mês passado
          </p>
        )}
      </CardContent>
    </Card>
  );
};
