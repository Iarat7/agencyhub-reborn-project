
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportsMetrics } from '@/components/reports/ReportsMetrics';
import { ReportsCharts } from '@/components/reports/ReportsCharts';
import { AdvancedCharts } from '@/components/reports/AdvancedCharts';
import { PerformanceIndicators } from '@/components/reports/PerformanceIndicators';
import { ReportsDetails } from '@/components/reports/ReportsDetails';
import { PeriodSummary } from '@/components/reports/PeriodSummary';
import { ReportsFilters } from '@/components/reports/ReportsFilters';
import { AdvancedMetricsCard } from '@/components/reports/AdvancedMetricsCard';
import { ExportDialog } from '@/components/reports/ExportDialog';
import { useReportsData } from '@/hooks/useReports';
import { useAdvancedReports } from '@/hooks/useAdvancedReports';
import { useAdvancedReportsData } from '@/hooks/useAdvancedReportsData';

export const Relatorios = () => {
  const [reportFilters, setReportFilters] = useState({
    period: '6m',
    dateRange: { from: undefined as Date | undefined, to: undefined as Date | undefined }
  });

  const { data: reportsData, isLoading: reportsLoading, error } = useReportsData();
  const { data: advancedData, isLoading: advancedLoading } = useAdvancedReports();
  const { data: filteredReportsData, isLoading: filteredLoading } = useAdvancedReportsData(reportFilters);

  const handleApplyFilters = () => {
    // A query será automaticamente re-executada quando reportFilters mudar
    console.log('Applying filters:', reportFilters);
  };

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

  if (reportsLoading || advancedLoading || filteredLoading) {
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Relatórios Avançados</h1>
          <p className="text-slate-600 mt-2 text-sm md:text-base">
            Análise detalhada com gráficos interativos e métricas avançadas
          </p>
        </div>
        <div className="flex gap-2">
          <ExportDialog 
            data={details.opportunities} 
            filename="oportunidades" 
            title="Oportunidades"
          />
          <ExportDialog 
            data={details.clients} 
            filename="clientes" 
            title="Clientes"
          />
          <ExportDialog 
            data={details.tasks} 
            filename="tarefas" 
            title="Tarefas"
          />
        </div>
      </div>

      {/* Filtros Avançados */}
      <ReportsFilters
        period={reportFilters.period}
        onPeriodChange={(period) => setReportFilters({ ...reportFilters, period })}
        dateRange={reportFilters.dateRange}
        onDateRangeChange={(dateRange) => setReportFilters({ ...reportFilters, dateRange })}
        onApplyFilters={handleApplyFilters}
      />

      {/* Métricas Avançadas com Comparação */}
      {filteredReportsData && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <AdvancedMetricsCard
            title="Novos Clientes"
            value={filteredReportsData.metrics.newClients}
            previousValue={filteredReportsData.prevMetrics.newClients}
            target={50}
            description="Meta mensal: 50 clientes"
          />
          <AdvancedMetricsCard
            title="Receita Gerada"
            value={filteredReportsData.metrics.totalRevenue}
            previousValue={filteredReportsData.prevMetrics.totalRevenue}
            format="currency"
            target={100000}
            description="Meta mensal: R$ 100.000"
          />
          <AdvancedMetricsCard
            title="Taxa de Conversão"
            value={filteredReportsData.metrics.conversionRate}
            format="percentage"
            target={25}
            description="Meta: 25%"
          />
          <AdvancedMetricsCard
            title="Ticket Médio"
            value={filteredReportsData.metrics.averageDealSize}
            format="currency"
            description="Por oportunidade fechada"
          />
        </div>
      )}

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
