
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface ChartData {
  opportunitiesByStage: Array<{ stage: string; count: number }>;
  tasksByStatus: Array<{ status: string; count: number }>;
  clientsByStatus: Array<{ status: string; count: number }>;
}

interface ReportsChartsProps {
  data: ChartData;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export const ReportsCharts = ({ data }: ReportsChartsProps) => {
  return (
    <>
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Oportunidades por Estágio</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data.opportunitiesByStage}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ stage, count }) => `${stage}: ${count}`}
                outerRadius={60}
                fill="#8884d8"
                dataKey="count"
                className="md:block"
              >
                {data.opportunitiesByStage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                wrapperStyle={{ fontSize: '12px' }}
                className="block md:hidden"
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Legenda customizada para mobile */}
          <div className="block md:hidden mt-2 grid grid-cols-2 gap-1 text-xs">
            {data.opportunitiesByStage.map((entry, index) => (
              <div key={entry.stage} className="flex items-center gap-1">
                <div 
                  className="w-3 h-3 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="truncate">{entry.stage}: {entry.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Tarefas por Status</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.tasksByStatus}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="status" 
                fontSize={12}
                tickMargin={5}
              />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Clientes por Status</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data.clientsByStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ status, count }) => `${status}: ${count}`}
                outerRadius={60}
                fill="#8884d8"
                dataKey="count"
              >
                {data.clientsByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          {/* Legenda customizada para mobile */}
          <div className="block md:hidden mt-2 grid grid-cols-2 gap-1 text-xs">
            {data.clientsByStatus.map((entry, index) => (
              <div key={entry.status} className="flex items-center gap-1">
                <div 
                  className="w-3 h-3 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="truncate">{entry.status}: {entry.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};
