
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportsMetrics } from '@/components/reports/ReportsMetrics';
import { ReportsCharts } from '@/components/reports/ReportsCharts';
import { AdvancedCharts } from '@/components/reports/AdvancedCharts';
import { PerformanceIndicators } from '@/components/reports/PerformanceIndicators';
import { ReportsDetails } from '@/components/reports/ReportsDetails';
import { PeriodSummary } from '@/components/reports/PeriodSummary';
import { useReportsData } from '@/hooks/useReports';
import { useAdvancedReports } from '@/hooks/useAdvancedReports';

export const Relatorios = () => {
  const { data: reportsData, isLoading: reportsLoading, error } = useReportsData();
  const { data: advancedData, isLoading: advancedLoading } = useAdvancedReports();

  if (error) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="text-center py-8">
          <p className="text-red-600">Erro ao carregar relatórios. Tente novamente.</p>
          <p className="text-sm text-gray-500 mt-2">Erro: {error.message}</p>
        </div>
      </div>
    );
  }

  if (reportsLoading || advancedLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-slate-600 mt-2">Carregando relatórios avançados...</p>
        </div>
      </div>
    );
  }

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

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Relatórios Avançados</h1>
        <p className="text-slate-600 mt-2 text-sm md:text-base">
          Análise detalhada com gráficos interativos e métricas avançadas
        </p>
      </div>

      {/* Métricas Principais */}
      <ReportsMetrics 
        metrics={metrics} 
        advancedMetrics={advancedData?.metrics}
      />

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
      <PerformanceIndicators 
        metrics={metrics}
        advancedData={advancedData}
      />

      {/* Gráficos Básicos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Visão Geral por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <ReportsCharts data={charts} />
        </CardContent>
      </Card>

      {/* Informações Detalhadas */}
      <ReportsDetails details={details} />

      {/* Resumo do Período */}
      <PeriodSummary metrics={metrics} />
    </div>
  );
};
