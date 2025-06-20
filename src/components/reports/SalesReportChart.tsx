
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { Opportunity } from '@/services/api/types';
import { format, subMonths, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface SalesReportChartProps {
  opportunities: Opportunity[];
}

export const SalesReportChart = ({ opportunities }: SalesReportChartProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Gerar dados dos últimos 6 meses
  const today = new Date();
  const sixMonthsAgo = subMonths(today, 5);
  const months = eachMonthOfInterval({ start: sixMonthsAgo, end: today });

  const monthlyData = months.map(month => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    
    // Oportunidades criadas no mês
    const createdInMonth = opportunities.filter(opp => {
      const createdDate = new Date(opp.created_at!);
      return createdDate >= monthStart && createdDate <= monthEnd;
    });

    // Oportunidades fechadas (ganhas) no mês
    const wonInMonth = opportunities.filter(opp => {
      if (opp.stage !== 'closed_won' || !opp.updated_at) return false;
      const updatedDate = new Date(opp.updated_at);
      return updatedDate >= monthStart && updatedDate <= monthEnd;
    });

    const createdValue = createdInMonth.reduce((sum, opp) => sum + (opp.value || 0), 0);
    const wonValue = wonInMonth.reduce((sum, opp) => sum + (opp.value || 0), 0);

    return {
      month: format(month, 'MMM', { locale: ptBR }),
      fullMonth: format(month, 'MMMM yyyy', { locale: ptBR }),
      oportunidadesCriadas: createdInMonth.length,
      oportunidadesGanhas: wonInMonth.length,
      valorCriado: createdValue,
      valorGanho: wonValue,
      conversao: createdInMonth.length > 0 ? (wonInMonth.length / createdInMonth.length) * 100 : 0
    };
  });

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Performance de Vendas (Últimos 6 Meses)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'valorCriado' || name === 'valorGanho') {
                      return [formatCurrency(Number(value)), name === 'valorCriado' ? 'Valor Criado' : 'Valor Ganho'];
                    }
                    return [value, name === 'oportunidadesCriadas' ? 'Oportunidades Criadas' : 'Oportunidades Ganhas'];
                  }}
                  labelFormatter={(label) => {
                    const monthData = monthlyData.find(m => m.month === label);
                    return monthData?.fullMonth || label;
                  }}
                />
                <Bar dataKey="valorCriado" fill="#0088FE" name="Valor Criado" />
                <Bar dataKey="valorGanho" fill="#00C49F" name="Valor Ganho" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quantidade de Oportunidades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    value, 
                    name === 'oportunidadesCriadas' ? 'Criadas' : 'Ganhas'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="oportunidadesCriadas" 
                  stroke="#0088FE" 
                  strokeWidth={2}
                  name="Criadas"
                />
                <Line 
                  type="monotone" 
                  dataKey="oportunidadesGanhas" 
                  stroke="#00C49F" 
                  strokeWidth={2}
                  name="Ganhas"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Taxa de Conversão Mensal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Taxa de Conversão']}
                />
                <Line 
                  type="monotone" 
                  dataKey="conversao" 
                  stroke="#FF8042" 
                  strokeWidth={2}
                  name="Conversão"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
