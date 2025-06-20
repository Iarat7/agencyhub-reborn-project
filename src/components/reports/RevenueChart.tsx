
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChartContainer } from './ChartContainer';
import { DollarSign } from 'lucide-react';

interface RevenueChartProps {
  data: Array<{ month: string; receita: number; meta: number }>;
}

export const RevenueChart = ({ data }: RevenueChartProps) => {
  return (
    <ChartContainer 
      title="Receita vs Meta"
      icon={DollarSign}
    >
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip 
          formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, '']}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="receita" 
          stroke="#0088FE" 
          strokeWidth={3}
          name="Receita Real"
        />
        <Line 
          type="monotone" 
          dataKey="meta" 
          stroke="#FF8042" 
          strokeDasharray="5 5"
          name="Meta"
        />
      </LineChart>
    </ChartContainer>
  );
};
