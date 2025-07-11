
import React from 'react';
import { DashboardCard } from "@/components/DashboardCard";
import { Users, Target, DollarSign, CheckCircle } from "lucide-react";

interface DashboardMetricsProps {
  metrics?: {
    totalClients: number;
    activeClients: number;
    totalOpportunities: number;
    wonOpportunities: number;
    totalRevenue: number;
    completedTasks: number;
    pendingTasks: number;
    inProgressTasks: number;
    inApprovalTasks: number;
    conversionRate: number;
  };
}

export const DashboardMetrics = ({ metrics }: DashboardMetricsProps) => {
  const totalTasks = (metrics?.completedTasks || 0) + (metrics?.pendingTasks || 0) + 
                    (metrics?.inProgressTasks || 0) + (metrics?.inApprovalTasks || 0);
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <DashboardCard
        title="Total de Clientes"
        value={metrics?.totalClients?.toString() || "0"}
        subtitle={`${metrics?.activeClients || 0} ativos`}
        icon={Users}
      />
      <DashboardCard
        title="Oportunidades"
        value={metrics?.totalOpportunities?.toString() || "0"}
        subtitle={`${metrics?.wonOpportunities || 0} fechadas`}
        icon={Target}
      />
      <DashboardCard
        title="Receita Mensal"
        value={`R$ ${(metrics?.totalRevenue || 0).toLocaleString('pt-BR')}`}
        subtitle={`Taxa de conversão: ${metrics?.conversionRate?.toFixed(1) || 0}%`}
        icon={DollarSign}
      />
      <DashboardCard
        title="Tarefas"
        value={`${metrics?.completedTasks || 0}/${totalTasks}`}
        subtitle={`${metrics?.pendingTasks || 0} pendentes, ${metrics?.inProgressTasks || 0} em progresso`}
        icon={CheckCircle}
      />
    </div>
  );
};
