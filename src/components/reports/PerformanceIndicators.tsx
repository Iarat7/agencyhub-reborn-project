
import React from 'react';
import { TrendingUp, CheckSquare, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PerformanceIndicatorsProps {
  metrics: {
    totalOpportunities: number;
    wonOpportunities: number;
    pendingTasks: number;
    completedTasks: number;
  };
  advancedData?: {
    metrics: {
      totalRevenue: number;
    };
  };
}

export const PerformanceIndicators = ({ metrics, advancedData }: PerformanceIndicatorsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const conversionRate = metrics.totalOpportunities > 0 
    ? ((metrics.wonOpportunities / metrics.totalOpportunities) * 100).toFixed(1)
    : '0';

  const taskCompletionRate = (metrics.pendingTasks + metrics.completedTasks) > 0
    ? ((metrics.completedTasks / (metrics.pendingTasks + metrics.completedTasks)) * 100).toFixed(1)
    : '0';

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm md:text-base">
            <TrendingUp className="h-4 w-4 md:h-5 md:w-5" />
            Taxa de Conversão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl md:text-3xl font-bold text-green-600">{conversionRate}%</div>
          <p className="text-xs md:text-sm text-slate-600 mt-1">
            {metrics.wonOpportunities} de {metrics.totalOpportunities} oportunidades fechadas
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm md:text-base">
            <CheckSquare className="h-4 w-4 md:h-5 md:w-5" />
            Taxa de Conclusão de Tarefas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl md:text-3xl font-bold text-blue-600">{taskCompletionRate}%</div>
          <p className="text-xs md:text-sm text-slate-600 mt-1">
            {metrics.completedTasks} de {metrics.pendingTasks + metrics.completedTasks} tarefas concluídas
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm md:text-base">
            <DollarSign className="h-4 w-4 md:h-5 md:w-5" />
            Projeção Mensal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl md:text-3xl font-bold text-purple-600">
            {formatCurrency((advancedData?.metrics.totalRevenue || 0) / 6)}
          </div>
          <p className="text-xs md:text-sm text-slate-600 mt-1">
            Baseado nos últimos 6 meses
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
