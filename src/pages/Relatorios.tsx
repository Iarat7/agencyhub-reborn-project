
import React, { useState } from 'react';
import { useAdvancedReports } from '@/hooks/useAdvancedReports';
import { ReportsFilters } from '@/components/reports/ReportsFilters';
import { ReportsMetrics } from '@/components/reports/ReportsMetrics';
import { ReportsCharts } from '@/components/reports/ReportsCharts';
import { ReportsTable } from '@/components/reports/ReportsTable';
import { ReportsDetails } from '@/components/reports/ReportsDetails';
import { AdvancedMetricsCard } from '@/components/reports/AdvancedMetricsCard';
import { DateRange } from 'react-day-picker';

export function Relatorios() {
  const [selectedPeriod, setSelectedPeriod] = useState('6m');
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined
  });

  const { data, isLoading } = useAdvancedReports();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
  };

  const handleApplyFilters = () => {
    // Logic to apply filters
    console.log('Applying filters:', { selectedPeriod, dateRange });
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Relatórios</h2>
          <p className="text-muted-foreground">
            Análise completa do desempenho do seu negócio
          </p>
        </div>
      </div>

      <ReportsFilters
        period={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        onApplyFilters={handleApplyFilters}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AdvancedMetricsCard
          title="Receita Total"
          value={data?.metrics?.totalRevenue || 0}
          format="currency"
          description="Receita do período selecionado"
        />
        <AdvancedMetricsCard
          title="Taxa de Conversão"
          value={data?.metrics?.conversionRate || 0}
          format="percentage"
          description="% de oportunidades fechadas"
        />
        <AdvancedMetricsCard
          title="Ticket Médio"
          value={data?.metrics?.avgDealSize || 0}
          format="currency"
          description="Valor médio por negócio"
        />
        <AdvancedMetricsCard
          title="Oportunidades Ativas"
          value={data?.metrics?.activeTasks || 0}
          description="Oportunidades em andamento"
        />
      </div>

      <ReportsMetrics 
        metrics={{
          totalClients: data?.metrics?.totalClients || 0,
          activeClients: data?.metrics?.totalClients || 0,
          totalOpportunities: data?.metrics?.totalOpportunities || 0,
          wonOpportunities: Math.round((data?.metrics?.totalOpportunities || 0) * (data?.metrics?.conversionRate || 0) / 100),
          totalRevenue: data?.metrics?.totalRevenue || 0,
          pendingTasks: data?.metrics?.activeTasks || 0,
          completedTasks: 0
        }}
        advancedMetrics={{
          avgDealSize: data?.metrics?.avgDealSize || 0
        }}
      />

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <ReportsCharts data={{
          opportunitiesByStage: [
            { stage: 'Prospecção', count: Math.round((data?.metrics?.totalOpportunities || 0) * 0.3) },
            { stage: 'Qualificação', count: Math.round((data?.metrics?.totalOpportunities || 0) * 0.25) },
            { stage: 'Proposta', count: Math.round((data?.metrics?.totalOpportunities || 0) * 0.2) },
            { stage: 'Negociação', count: Math.round((data?.metrics?.totalOpportunities || 0) * 0.15) },
            { stage: 'Fechada', count: Math.round((data?.metrics?.totalOpportunities || 0) * (data?.metrics?.conversionRate || 0) / 100) }
          ],
          tasksByStatus: [
            { status: 'Pendente', count: data?.metrics?.activeTasks || 0 },
            { status: 'Em Progresso', count: Math.round((data?.metrics?.activeTasks || 0) * 0.3) },
            { status: 'Concluída', count: Math.round((data?.metrics?.activeTasks || 0) * 0.7) }
          ],
          clientsByStatus: [
            { status: 'Ativo', count: Math.round((data?.metrics?.totalClients || 0) * 0.8) },
            { status: 'Inativo', count: Math.round((data?.metrics?.totalClients || 0) * 0.2) }
          ]
        }} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ReportsTable
          title="Análise de Vendas"
          data={data?.charts?.salesData || []}
          columns={[
            { key: 'name', label: 'Período' },
            { key: 'vendas', label: 'Vendas (R$)' },
            { key: 'oportunidades', label: 'Oportunidades' }
          ]}
          filename="analise-vendas"
        />

        <ReportsTable
          title="Funil de Conversão"
          data={data?.charts?.conversionData || []}
          columns={[
            { key: 'stage', label: 'Estágio' },
            { key: 'conversion', label: 'Taxa de Conversão (%)' }
          ]}
          filename="funil-conversao"
        />
      </div>

      <ReportsDetails details={{
        recentOpportunities: [],
        urgentTasks: []
      }} />
    </div>
  );
}
