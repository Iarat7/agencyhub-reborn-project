
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer } from 'recharts';
import { LucideIcon } from 'lucide-react';

interface ChartContainerProps {
  title: string;
  icon?: LucideIcon;
  children: React.ReactElement;
  className?: string;
  height?: number;
}

export const ChartContainer = ({ 
  title, 
  icon: Icon, 
  children, 
  className = "",
  height = 300 
}: ChartContainerProps) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {Icon && <Icon className="h-5 w-5" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          {children}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
