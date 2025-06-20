
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, CheckCircle, Target, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { useClientTasks, useClientOpportunities } from '@/hooks/useReports';
import type { Client } from '@/services/api/types';

interface ClientDetailsMetricsProps {
  client: Client;
}

export const ClientDetailsMetrics = ({ client }: ClientDetailsMetricsProps) => {
  const { data: tasks = [] } = useClientTasks(client.id);
  const { data: opportunities = [] } = useClientOpportunities(client.id);

  const formatCurrency = (value: number | null | undefined) => {
    if (!value) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Cálculos de métricas
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const overdueTasks = tasks.filter(task => 
    task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed'
  ).length;

  const totalOpportunityValue = opportunities.reduce((sum, opp) => sum + (opp.value || 0), 0);
  const wonOpportunities = opportunities.filter(opp => opp.stage === 'closed_won');
  const wonValue = wonOpportunities.reduce((sum, opp) => sum + (opp.value || 0), 0);

  const activeOpportunities = opportunities.filter(opp => 
    !['closed_won', 'closed_lost'].includes(opp.stage || '')
  );

  const conversionRate = opportunities.length > 0 ? (wonOpportunities.length / opportunities.length) * 100 : 0;

  const metrics = [
    {
      title: 'Tarefas Concluídas',
      value: completedTasks,
      subtitle: `${pendingTasks} pendentes`,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Tarefas Atrasadas',
      value: overdueTasks,
      subtitle: 'Requer atenção',
      icon: Clock,
      color: overdueTasks > 0 ? 'text-red-600' : 'text-gray-600',
      bgColor: overdueTasks > 0 ? 'bg-red-50' : 'bg-gray-50'
    },
    {
      title: 'Oportunidades Ativas',
      value: activeOpportunities.length,
      subtitle: `${opportunities.length} total`,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Valor Potencial',
      value: formatCurrency(totalOpportunityValue),
      subtitle: `${formatCurrency(wonValue)} ganho`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Taxa de Conversão',
      value: `${conversionRate.toFixed(1)}%`,
      subtitle: `${wonOpportunities.length} fechadas`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Valor Mensal',
      value: formatCurrency(client.monthly_value),
      subtitle: client.status === 'active' ? 'Ativo' : 'Inativo',
      icon: CalendarDays,
      color: client.status === 'active' ? 'text-green-600' : 'text-gray-600',
      bgColor: client.status === 'active' ? 'bg-green-50' : 'bg-gray-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {metric.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {metric.value}
                  </p>
                  <p className="text-xs text-gray-500">
                    {metric.subtitle}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${metric.bgColor}`}>
                  <Icon className={`h-5 w-5 ${metric.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
