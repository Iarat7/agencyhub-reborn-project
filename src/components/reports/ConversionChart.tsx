
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ChartContainer } from './ChartContainer';
import { Target } from 'lucide-react';

interface ConversionChartProps {
  data: Array<{ stage: string; conversion: number }>;
}

export const ConversionChart = ({ data }: ConversionChartProps) => {
  return (
    <ChartContainer 
      title="Funil de Conversão"
      icon={Target}
    >
      <BarChart data={data} layout="horizontal">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="stage" type="category" width={100} />
        <Tooltip formatter={(value) => [`${value}%`, 'Taxa de Conversão']} />
        <Bar dataKey="conversion" fill="#00C49F" />
      </BarChart>
    </ChartContainer>
  );
};
