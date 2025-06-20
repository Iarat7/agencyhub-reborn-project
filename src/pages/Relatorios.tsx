import React from 'react';
import { Users, Target, CheckSquare, DollarSign, TrendingUp, AlertCircle, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MetricsCard } from '@/components/reports/MetricsCard';
import { ReportsCharts } from '@/components/reports/ReportsCharts';
import { AdvancedCharts } from '@/components/reports/AdvancedCharts';
import { useReportsData } from '@/hooks/useReports';
import { useAdvancedReports } from '@/hooks/useAdvancedReports';

export const Relatorios = () => {
  const { data: reportsData, isLoading: reportsLoading, error } = useReportsData();
  const { data: advancedData, isLoading: advancedLoading } = useAdvancedReports();

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-red-600">Erro ao carregar relatórios. Tente novamente.</p>
          <p className="text-sm text-gray-500 mt-2">Erro: {error.message}</p>
        </div>
      </div>
    );
  }

  if (reportsLoading || advancedLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-slate-600 mt-2">Carregando relatórios avançados...</p>
        </div>
      </div>
    );
  }

  // Verificar se reportsData existe e tem a estrutura esperada
  const metrics = reportsData?.metrics || {
    totalClients: 0,
    activeClients: 0,
    totalOpportunities: 0,
    wonOpportunities: 0,
    totalRevenue: 0,
    pendingTasks: 0,
    completedTasks: 0,
  };

  const charts = reportsData?.charts || {
    opportunitiesByStage: [],
    tasksByStatus: [],
    clientsByStatus: [],
  };

  const details = reportsData?.details || {
    recentOpportunities: [],
    urgentTasks: [],
    clients: [],
    opportunities: [],
    tasks: [],
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
        <h1 className="text-3xl font-bold text-slate-900">Relatórios Avançados</h1>
        <p className="text-slate-600 mt-2">Análise detalhada com gráficos interativos e métricas avançadas</p>
      </div>

      {/* Métricas Principais Expandidas */}
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
          title="Ticket Médio"
          value={formatCurrency(advancedData?.metrics.avgDealSize || 0)}
          icon={Activity}
          description="Por oportunidade fechada"
        />
      </div>

      {/* Gráficos Avançados */}
      {advancedData && (
        <AdvancedCharts 
          salesData={advancedData.charts.salesData}
          revenueData={advancedData.charts.revenueData}
          conversionData={advancedData.charts.conversionData}
          activityData={advancedData.charts.activityData}
        />
      )}

      {/* Indicadores de Performance */}
      <div className="grid gap-4 md:grid-cols-3">
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Projeção Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {formatCurrency((advancedData?.metrics.totalRevenue || 0) / 6)}
            </div>
            <p className="text-sm text-slate-600 mt-1">
              Baseado nos últimos 6 meses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos Básicos (mantidos para comparação) */}
      <Card>
        <CardHeader>
          <CardTitle>Visão Geral por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <ReportsCharts data={charts} />
        </CardContent>
      </Card>

      {/* Informações Detalhadas */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Oportunidades Recentes */}
        <Card>
          <CardHeader>
            <CardTitle>Oportunidades Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            {details.recentOpportunities.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhuma oportunidade encontrada</p>
            ) : (
              <div className="space-y-3">
                {details.recentOpportunities.map((opportunity) => (
                  <div key={opportunity.id} className="border-l-4 border-blue-500 pl-3">
                    <h4 className="font-medium text-sm">{opportunity.title}</h4>
                    <div className="text-xs text-gray-600 flex items-center gap-2">
                      <span>{opportunity.stage}</span>
                      {opportunity.value && (
                        <span>• {formatCurrency(opportunity.value)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tarefas Urgentes */}
        <Card>
          <CardHeader>
            <CardTitle>Tarefas Urgentes</CardTitle>
          </CardHeader>
          <CardContent>
            {details.urgentTasks.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhuma tarefa urgente</p>
            ) : (
              <div className="space-y-3">
                {details.urgentTasks.map((task) => (
                  <div key={task.id} className="border-l-4 border-red-500 pl-3">
                    <h4 className="font-medium text-sm">{task.title}</h4>
                    <div className="text-xs text-gray-600">
                      Status: {task.status}
                      {task.due_date && (
                        <span> • Prazo: {new Date(task.due_date).toLocaleDateString('pt-BR')}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resumo do Período */}
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
