
import { useMemo } from 'react';

interface RawData {
  clients: any[];
  opportunities: any[];
  tasks: any[];
  allOpportunities: any[];
}

export const useMetricsCalculation = (rawData: RawData, startDate: Date, endDate: Date) => {
  return useMemo(() => {
    if (!rawData) return null;

    const { clients, opportunities, tasks, allOpportunities } = rawData;

    const totalClients = clients?.length || 0;
    const activeClients = clients?.filter(c => c.status === 'active').length || 0;
    const totalOpportunities = opportunities?.length || 0;
    
    const wonOpportunities = allOpportunities?.filter(o => {
      if (o.stage !== 'closed_won' || !o.updated_at) return false;
      const opDate = new Date(o.updated_at);
      return opDate >= startDate && opDate <= endDate;
    }).length || 0;

    // Calcular receita total: oportunidades fechadas + valor mensal dos clientes ativos
    const opportunitiesRevenue = allOpportunities?.filter(o => {
      if (o.stage !== 'closed_won' || !o.updated_at) return false;
      const opDate = new Date(o.updated_at);
      return opDate >= startDate && opDate <= endDate;
    }).reduce((sum, o) => sum + (o.value || 0), 0) || 0;

    const activeClientsRevenue = clients?.filter(c => c.status === 'active')
      .reduce((sum, c) => sum + (c.monthly_value || 0), 0) || 0;

    const totalRevenue = opportunitiesRevenue + activeClientsRevenue;

    const pendingTasks = tasks?.filter(t => t.status === 'pending').length || 0;
    const completedTasks = tasks?.filter(t => t.status === 'completed').length || 0;
    const conversionRate = totalOpportunities > 0 ? (wonOpportunities / totalOpportunities) * 100 : 0;

    // Dados detalhados para gráficos
    const opportunitiesByStage = [
      { stage: 'Prospecção', count: allOpportunities?.filter(o => o.stage === 'prospection').length || 0 },
      { stage: 'Qualificação', count: allOpportunities?.filter(o => o.stage === 'qualification').length || 0 },
      { stage: 'Proposta', count: allOpportunities?.filter(o => o.stage === 'proposal').length || 0 },
      { stage: 'Negociação', count: allOpportunities?.filter(o => o.stage === 'negotiation').length || 0 },
      { stage: 'Fechada - Ganho', count: allOpportunities?.filter(o => o.stage === 'closed_won').length || 0 },
      { stage: 'Fechada - Perdido', count: allOpportunities?.filter(o => o.stage === 'closed_lost').length || 0 }
    ];

    const tasksByStatus = [
      { status: 'Pendente', count: tasks?.filter(t => t.status === 'pending').length || 0 },
      { status: 'Em Progresso', count: tasks?.filter(t => t.status === 'in_progress').length || 0 },
      { status: 'Em Aprovação', count: tasks?.filter(t => t.status === 'in_approval').length || 0 },
      { status: 'Concluída', count: tasks?.filter(t => t.status === 'completed').length || 0 }
    ];

    const clientsByStatus = [
      { status: 'Ativo', count: activeClients },
      { status: 'Inativo', count: clients?.filter(c => c.status === 'inactive').length || 0 },
      { status: 'Prospect', count: clients?.filter(c => c.status === 'prospect').length || 0 }
    ];

    return {
      totalClients,
      activeClients,
      totalOpportunities,
      wonOpportunities,
      totalRevenue,
      pendingTasks,
      completedTasks,
      conversionRate,
      opportunitiesByStage,
      tasksByStatus,
      clientsByStatus
    };
  }, [rawData, startDate, endDate]);
};
