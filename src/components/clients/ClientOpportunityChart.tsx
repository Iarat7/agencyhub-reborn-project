
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Opportunity } from '@/services/api/types';

interface ClientOpportunityChartProps {
  opportunities: Opportunity[];
}

export const ClientOpportunityChart = ({ opportunities }: ClientOpportunityChartProps) => {
  // Dados para gráfico de barras por estágio
  const stageData = [
    { stage: 'Prospecção', count: opportunities.filter(o => o.stage === 'prospection').length, value: opportunities.filter(o => o.stage === 'prospection').reduce((sum, o) => sum + (o.value || 0), 0) },
    { stage: 'Qualificação', count: opportunities.filter(o => o.stage === 'qualification').length, value: opportunities.filter(o => o.stage === 'qualification').reduce((sum, o) => sum + (o.value || 0), 0) },
    { stage: 'Proposta', count: opportunities.filter(o => o.stage === 'proposal').length, value: opportunities.filter(o => o.stage === 'proposal').reduce((sum, o) => sum + (o.value || 0), 0) },
    { stage: 'Negociação', count: opportunities.filter(o => o.stage === 'negotiation').length, value: opportunities.filter(o => o.stage === 'negotiation').reduce((sum, o) => sum + (o.value || 0), 0) },
    { stage: 'Ganhas', count: opportunities.filter(o => o.stage === 'closed_won').length, value: opportunities.filter(o => o.stage === 'closed_won').reduce((sum, o) => sum + (o.value || 0), 0) },
    { stage: 'Perdidas', count: opportunities.filter(o => o.stage === 'closed_lost').length, value: opportunities.filter(o => o.stage === 'closed_lost').reduce((sum, o) => sum + (o.value || 0), 0) },
  ];

  // Dados para gráfico de pizza
  const pieData = stageData.filter(d => d.count > 0).map(d => ({
    name: d.stage,
    value: d.count,
    valueAmount: d.value
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (opportunities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Distribuição de Oportunidades</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-slate-600">Nenhuma oportunidade para mostrar</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Distribuição de Oportunidades</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Gráfico de Barras */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="stage" 
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis fontSize={12} />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'count' ? `${value} oportunidades` : formatCurrency(Number(value)),
                    name === 'count' ? 'Quantidade' : 'Valor Total'
                  ]}
                />
                <Bar dataKey="count" fill="#0088FE" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Resumo numérico */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-600">Total de Oportunidades</p>
              <p className="font-medium text-lg">{opportunities.length}</p>
            </div>
            <div>
              <p className="text-slate-600">Valor Total</p>
              <p className="font-medium text-lg text-green-600">
                {formatCurrency(opportunities.reduce((sum, o) => sum + (o.value || 0), 0))}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
