
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { ChartContainer } from './ChartContainer';
import { TrendingUp } from 'lucide-react';

interface SalesChartProps {
  data: Array<{ name: string; vendas: number; oportunidades: number }>;
}

export const SalesChart = ({ data }: SalesChartProps) => {
  return (
    <ChartContainer 
      title="Vendas vs Oportunidades (Últimos 6 Meses)"
      icon={TrendingUp}
      className="col-span-2"
      height={350}
    >
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip 
          formatter={(value, name) => [
            name === 'vendas' ? `R$ ${Number(value).toLocaleString('pt-BR')}` : value,
            name === 'vendas' ? 'Vendas' : 'Oportunidades'
          ]}
        />
        <Legend />
        <Bar dataKey="vendas" fill="#0088FE" name="Vendas (R$)" />
        <Bar dataKey="oportunidades" fill="#00C49F" name="Oportunidades" />
      </BarChart>
    </ChartContainer>
  );
};
