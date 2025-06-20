
import React from 'react';
import { ReportsCharts } from "@/components/reports/ReportsCharts";

interface DashboardChartsProps {
  metrics?: {
    activeClients: number;
    totalClients: number;
  };
}

export const DashboardCharts = ({ metrics }: DashboardChartsProps) => {
  // Preparar dados para os gráficos no formato esperado pelo ReportsCharts
  const chartData = {
    opportunitiesByStage: [
      { stage: 'Prospecção', count: 0 },
      { stage: 'Qualificação', count: 0 },
      { stage: 'Proposta', count: 0 },
      { stage: 'Negociação', count: 0 },
      { stage: 'Fechada', count: 0 }
    ],
    tasksByStatus: [
      { status: 'Pendente', count: 0 },
      { status: 'Em Progresso', count: 0 },
      { status: 'Concluída', count: 0 }
    ],
    clientsByStatus: [
      { status: 'Ativo', count: metrics?.activeClients || 0 },
      { status: 'Inativo', count: (metrics?.totalClients || 0) - (metrics?.activeClients || 0) }
    ]
  };

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <ReportsCharts data={chartData} />
    </div>
  );
};
