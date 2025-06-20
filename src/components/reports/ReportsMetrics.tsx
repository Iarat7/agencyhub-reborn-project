
import React from 'react';
import { Users, Target, DollarSign, Activity } from 'lucide-react';
import { MetricsCard } from '@/components/reports/MetricsCard';

interface ReportsMetricsProps {
  metrics: {
    totalClients: number;
    activeClients: number;
    totalOpportunities: number;
    wonOpportunities: number;
    totalRevenue: number;
    pendingTasks: number;
    completedTasks: number;
  };
  advancedMetrics?: {
    avgDealSize: number;
  };
}

export const ReportsMetrics = ({ metrics, advancedMetrics }: ReportsMetricsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
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
        value={formatCurrency(advancedMetrics?.avgDealSize || 0)}
        icon={Activity}
        description="Por oportunidade fechada"
      />
    </div>
  );
};
