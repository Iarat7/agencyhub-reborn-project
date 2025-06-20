
import React, { memo } from 'react';
import { DashboardCard } from "@/components/DashboardCard";
import { PerformanceIndicator } from './PerformanceIndicator';
import { Users, Target, DollarSign, CheckCircle } from "lucide-react";
import { useMemoizedCalculation } from '@/hooks/useOptimizedQueries';

interface OptimizedDashboardMetricsProps {
  metrics?: {
    totalClients: number;
    activeClients: number;
    totalOpportunities: number;
    wonOpportunities: number;
    totalRevenue: number;
    completedTasks: number;
    pendingTasks: number;
    conversionRate: number;
  };
  targets?: {
    clientsTarget: number;
    revenueTarget: number;
    conversionTarget: number;
    tasksTarget: number;
  };
}

export const OptimizedDashboardMetrics = memo(({ 
  metrics, 
  targets 
}: OptimizedDashboardMetricsProps) => {
  const calculatedMetrics = useMemoizedCalculation(
    metrics,
    (data) => ({
      clientGrowth: data ? ((data.totalClients / (targets?.clientsTarget || 100)) * 100) : 0,
      revenueProgress: data ? ((data.totalRevenue / (targets?.revenueTarget || 100000)) * 100) : 0,
      taskEfficiency: data ? ((data.completedTasks / (data.completedTasks + data.pendingTasks)) * 100) : 0,
    }),
    [targets]
  );

  if (!metrics) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cards tradicionais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total de Clientes"
          value={metrics.totalClients.toString()}
          subtitle={`${metrics.activeClients} ativos`}
          icon={Users}
        />
        <DashboardCard
          title="Oportunidades"
          value={metrics.totalOpportunities.toString()}
          subtitle={`${metrics.wonOpportunities} fechadas`}
          icon={Target}
        />
        <DashboardCard
          title="Receita Total"
          value={`R$ ${metrics.totalRevenue.toLocaleString('pt-BR')}`}
          subtitle={`Taxa de conversão: ${metrics.conversionRate.toFixed(1)}%`}
          icon={DollarSign}
        />
        <DashboardCard
          title="Tarefas"
          value={`${metrics.completedTasks}/${metrics.completedTasks + metrics.pendingTasks}`}
          subtitle={`${metrics.pendingTasks} pendentes`}
          icon={CheckCircle}
        />
      </div>

      {/* Indicadores de performance */}
      {targets && (
        <div className="grid gap-4 md:grid-cols-3">
          <PerformanceIndicator
            title="Meta de Clientes"
            current={metrics.totalClients}
            target={targets.clientsTarget}
            trend={{
              value: calculatedMetrics.clientGrowth - 100,
              direction: calculatedMetrics.clientGrowth >= 100 ? 'up' : 'down'
            }}
          />
          <PerformanceIndicator
            title="Meta de Receita"
            current={metrics.totalRevenue}
            target={targets.revenueTarget}
            format="currency"
            trend={{
              value: calculatedMetrics.revenueProgress - 100,
              direction: calculatedMetrics.revenueProgress >= 100 ? 'up' : 'down'
            }}
          />
          <PerformanceIndicator
            title="Taxa de Conversão"
            current={metrics.conversionRate}
            target={targets.conversionTarget}
            format="percentage"
            trend={{
              value: metrics.conversionRate - targets.conversionTarget,
              direction: metrics.conversionRate >= targets.conversionTarget ? 'up' : 'down'
            }}
          />
        </div>
      )}
    </div>
  );
});

OptimizedDashboardMetrics.displayName = 'OptimizedDashboardMetrics';
