
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ChartContainer } from './ChartContainer';
import { Calendar } from 'lucide-react';

interface ActivityChartProps {
  data: Array<{ day: string; atividades: number }>;
}

export const ActivityChart = ({ data }: ActivityChartProps) => {
  return (
    <ChartContainer 
      title="Atividades dos Últimos 30 Dias"
      icon={Calendar}
      className="col-span-2"
      height={250}
    >
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Area 
          type="monotone" 
          dataKey="atividades" 
          stroke="#8884D8" 
          fill="#8884D8" 
          fillOpacity={0.6}
          name="Atividades"
        />
      </AreaChart>
    </ChartContainer>
  );
};
