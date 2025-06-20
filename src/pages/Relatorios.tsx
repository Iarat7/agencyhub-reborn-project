
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

  const { data, isLoading } = useAdvancedReports(selectedPeriod);

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
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AdvancedMetricsCard
          title="Receita Total"
          value={data?.metrics?.totalRevenue || 0}
          previousValue={data?.prevMetrics?.totalRevenue || 0}
          format="currency"
          description="Receita do período selecionado"
        />
        <AdvancedMetricsCard
          title="Taxa de Conversão"
          value={data?.metrics?.conversionRate || 0}
          previousValue={data?.prevMetrics?.conversionRate || 0}
          format="percentage"
          description="% de oportunidades fechadas"
        />
        <AdvancedMetricsCard
          title="Novos Clientes"
          value={data?.metrics?.totalClients || 0}
          previousValue={data?.prevMetrics?.totalClients || 0}
          description="Clientes adquiridos"
        />
        <AdvancedMetricsCard
          title="Tarefas Concluídas"
          value={data?.metrics?.completedTasks || 0}
          previousValue={data?.prevMetrics?.completedTasks || 0}
          description="Produtividade da equipe"
        />
      </div>

      <ReportsMetrics metrics={data?.metrics} />

      <ReportsCharts data={data?.chartData} />

      <div className="grid gap-6 md:grid-cols-2">
        <ReportsTable
          title="Relatório de Clientes"
          data={data?.rawData?.clients || []}
          columns={[
            { key: 'name', label: 'Nome' },
            { key: 'email', label: 'Email' },
            { key: 'status', label: 'Status' },
            { key: 'created_at', label: 'Data de Cadastro' }
          ]}
          filename="relatorio-clientes"
        />

        <ReportsTable
          title="Relatório de Oportunidades"
          data={data?.rawData?.opportunities || []}
          columns={[
            { key: 'title', label: 'Título' },
            { key: 'value', label: 'Valor' },
            { key: 'stage', label: 'Estágio' },
            { key: 'client_id', label: 'Cliente' }
          ]}
          filename="relatorio-oportunidades"
        />
      </div>

      <ReportsDetails rawData={data?.rawData} period={data?.period} />
    </div>
  );
}
