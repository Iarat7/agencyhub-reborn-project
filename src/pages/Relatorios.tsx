
import React from 'react';
import { Users, Target, CheckSquare, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricsCard } from '@/components/reports/MetricsCard';
import { ReportsCharts } from '@/components/reports/ReportsCharts';
import { useReportsData } from '@/hooks/useReports';

export const Relatorios = () => {
  const { data: reportsData, isLoading, error } = useReportsData();

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-red-600">Erro ao carregar relatórios. Tente novamente.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-slate-600">Carregando relatórios...</p>
        </div>
      </div>
    );
  }

  const { metrics, charts } = reportsData || {
    metrics: {
      totalClients: 0,
      activeClients: 0,
      totalOpportunities: 0,
      wonOpportunities: 0,
      totalRevenue: 0,
      pendingTasks: 0,
      completedTasks: 0,
    },
    charts: {
      opportunitiesByStage: [],
      tasksByStatus: [],
      clientsByStatus: [],
    },
  };

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Relatórios</h1>
        <p className="text-slate-600 mt-2">Visualize métricas e indicadores importantes</p>
      </div>

      {/* Métricas Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          title="Total de Clientes"
          value={metrics.totalClients}
          icon={Users}
          description={`${metrics.activeClients} ativos`}
        />
        <MetricsCard
          title="Oportunidades"
          value={metrics.totalOpportunities}
          icon={Target}
          description={`${metrics.wonOpportunities} fechadas`}
        />
        <MetricsCard
          title="Receita Total"
          value={formatCurrency(metrics.totalRevenue)}
          icon={DollarSign}
          description="Oportunidades fechadas"
        />
        <MetricsCard
          title="Tarefas Pendentes"
          value={metrics.pendingTasks}
          icon={AlertCircle}
          description={`${metrics.completedTasks} concluídas`}
        />
      </div>

      {/* Indicadores de Performance */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Taxa de Conversão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{conversionRate}%</div>
            <p className="text-sm text-slate-600 mt-1">
              {metrics.wonOpportunities} de {metrics.totalOpportunities} oportunidades fechadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Taxa de Conclusão de Tarefas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{taskCompletionRate}%</div>
            <p className="text-sm text-slate-600 mt-1">
              {metrics.completedTasks} de {metrics.pendingTasks + metrics.completedTasks} tarefas concluídas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <ReportsCharts data={charts} />

      {/* Resumo Mensal */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo do Período</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{metrics.totalClients}</div>
              <div className="text-sm text-blue-600">Clientes Cadastrados</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{formatCurrency(metrics.totalRevenue)}</div>
              <div className="text-sm text-green-600">Receita Gerada</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{metrics.completedTasks}</div>
              <div className="text-sm text-orange-600">Tarefas Concluídas</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
