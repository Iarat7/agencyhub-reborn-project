
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PeriodSummaryProps {
  metrics: {
    totalClients: number;
    totalRevenue: number;
    completedTasks: number;
  };
}

export const PeriodSummary = ({ metrics }: PeriodSummaryProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Resumo do Período</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-xl md:text-2xl font-bold text-blue-600">{metrics.totalClients}</div>
            <div className="text-xs md:text-sm text-blue-600">Clientes Cadastrados</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-xl md:text-2xl font-bold text-green-600">{formatCurrency(metrics.totalRevenue)}</div>
            <div className="text-xs md:text-sm text-green-600">Receita Gerada</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-xl md:text-2xl font-bold text-orange-600">{metrics.completedTasks}</div>
            <div className="text-xs md:text-sm text-orange-600">Tarefas Concluídas</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
