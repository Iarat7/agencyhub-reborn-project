
import React from 'react';
import { ReportsCharts } from "@/components/reports/ReportsCharts";

interface DashboardChartsProps {
  metrics?: {
    opportunitiesByStage: Array<{ stage: string; count: number }>;
    tasksByStatus: Array<{ status: string; count: number }>;
    clientsByStatus: Array<{ status: string; count: number }>;
  };
}

export const DashboardCharts = ({ metrics }: DashboardChartsProps) => {
  // Usar os dados calculados do hook de métricas
  const chartData = {
    opportunitiesByStage: metrics?.opportunitiesByStage || [
      { stage: 'Prospecção', count: 0 },
      { stage: 'Qualificação', count: 0 },
      { stage: 'Proposta', count: 0 },
      { stage: 'Negociação', count: 0 },
      { stage: 'Fechada - Ganho', count: 0 },
      { stage: 'Fechada - Perdido', count: 0 }
    ],
    tasksByStatus: metrics?.tasksByStatus || [
      { status: 'Pendente', count: 0 },
      { status: 'Em Progresso', count: 0 },
      { status: 'Em Aprovação', count: 0 },
      { status: 'Concluída', count: 0 }
    ],
    clientsByStatus: metrics?.clientsByStatus || [
      { status: 'Ativo', count: 0 },
      { status: 'Inativo', count: 0 },
      { status: 'Prospect', count: 0 }
    ]
  };

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <ReportsCharts data={chartData} />
    </div>
  );
};
