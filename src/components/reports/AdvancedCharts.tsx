
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { TrendingUp, DollarSign, Target, Calendar } from 'lucide-react';

interface AdvancedChartsProps {
  salesData: Array<{ name: string; vendas: number; oportunidades: number }>;
  revenueData: Array<{ month: string; receita: number; meta: number }>;
  conversionData: Array<{ stage: string; conversion: number }>;
  activityData: Array<{ day: string; atividades: number }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export const AdvancedCharts = ({ salesData, revenueData, conversionData, activityData }: AdvancedChartsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Gráfico de Vendas e Oportunidades */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Vendas vs Oportunidades (Últimos 6 Meses)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={salesData}>
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
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico de Receita vs Meta */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Receita vs Meta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
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
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Funil de Conversão */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Funil de Conversão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={conversionData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="stage" type="category" width={100} />
              <Tooltip formatter={(value) => [`${value}%`, 'Taxa de Conversão']} />
              <Bar dataKey="conversion" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Atividades por Dia */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Atividades dos Últimos 30 Dias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={activityData}>
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
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
