
import { useMemo } from 'react';

interface RawData {
  clients: any[];
  opportunities: any[];
  tasks: any[];
  allOpportunities: any[];
}

export const useMetricsCalculation = (rawData: RawData, startDate: Date, endDate: Date) => {
  return useMemo(() => {
    // Sempre retornar um objeto, mesmo com dados vazios
    const { clients = [], opportunities = [], tasks = [], allOpportunities = [] } = rawData || {};

    const totalClients = clients.length;
    const activeClients = clients.filter(c => c.status === 'active').length;
    const totalOpportunities = opportunities.length;
    
    const wonOpportunities = allOpportunities.filter(o => {
      if (o.stage !== 'closed_won' || !o.updated_at) return false;
      const opDate = new Date(o.updated_at);
      return opDate >= startDate && opDate <= endDate;
    }).length;

    const totalRevenue = clients.filter(c => c.status === 'active')
      .reduce((sum, c) => sum + (c.monthly_value || 0), 0);

    const pendingTasks = tasks.filter(t => t.status === 'pending').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
    const inApprovalTasks = tasks.filter(t => t.status === 'in_approval').length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    
    const conversionRate = totalOpportunities > 0 ? (wonOpportunities / totalOpportunities) * 100 : 0;

    const opportunitiesByStage = [
      { stage: 'Prospecção', count: allOpportunities.filter(o => o.stage === 'prospection').length },
      { stage: 'Qualificação', count: allOpportunities.filter(o => o.stage === 'qualification').length },
      { stage: 'Proposta', count: allOpportunities.filter(o => o.stage === 'proposal').length },
      { stage: 'Negociação', count: allOpportunities.filter(o => o.stage === 'negotiation').length },
      { stage: 'Fechada - Ganho', count: allOpportunities.filter(o => o.stage === 'closed_won').length },
      { stage: 'Fechada - Perdido', count: allOpportunities.filter(o => o.stage === 'closed_lost').length }
    ];

    const tasksByStatus = [
      { status: 'Pendente', count: pendingTasks },
      { status: 'Em Progresso', count: inProgressTasks },
      { status: 'Em Aprovação', count: inApprovalTasks },
      { status: 'Concluída', count: completedTasks }
    ];

    const clientsByStatus = [
      { status: 'Ativo', count: activeClients },
      { status: 'Inativo', count: clients.filter(c => c.status === 'inactive').length },
      { status: 'Prospect', count: clients.filter(c => c.status === 'prospect').length }
    ];

    return {
      totalClients,
      activeClients,
      totalOpportunities,
      wonOpportunities,
      totalRevenue,
      pendingTasks,
      inProgressTasks,
      inApprovalTasks,
      completedTasks,
      conversionRate,
      opportunitiesByStage,
      tasksByStatus,
      clientsByStatus
    };
  }, [rawData, startDate, endDate]);
};
