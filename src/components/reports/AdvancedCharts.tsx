
import React from 'react';
import { SalesChart } from './SalesChart';
import { RevenueChart } from './RevenueChart';
import { ConversionChart } from './ConversionChart';
import { ActivityChart } from './ActivityChart';

interface AdvancedChartsProps {
  salesData: Array<{ name: string; vendas: number; oportunidades: number }>;
  revenueData: Array<{ month: string; receita: number; meta: number }>;
  conversionData: Array<{ stage: string; conversion: number }>;
  activityData: Array<{ day: string; atividades: number }>;
}

export const AdvancedCharts = ({ 
  salesData, 
  revenueData, 
  conversionData, 
  activityData 
}: AdvancedChartsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <SalesChart data={salesData} />
      <RevenueChart data={revenueData} />
      <ConversionChart data={conversionData} />
      <ActivityChart data={activityData} />
    </div>
  );
};
