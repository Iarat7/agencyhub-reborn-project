
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
    const activeClients = allOpportunities?.filter(c => c.status === 'active').length || 0;
    const totalOpportunities = opportunities?.length || 0;
    
    const wonOpportunities = allOpportunities?.filter(o => {
      if (o.stage !== 'closed_won' || !o.updated_at) return false;
      const opDate = new Date(o.updated_at);
      return opDate >= startDate && opDate <= endDate;
    }).length || 0;

    const totalRevenue = allOpportunities?.filter(o => {
      if (o.stage !== 'closed_won' || !o.updated_at) return false;
      const opDate = new Date(o.updated_at);
      return opDate >= startDate && opDate <= endDate;
    }).reduce((sum, o) => sum + (o.value || 0), 0) || 0;

    const pendingTasks = tasks?.filter(t => t.status === 'pending').length || 0;
    const completedTasks = tasks?.filter(t => t.status === 'completed').length || 0;
    const conversionRate = totalOpportunities > 0 ? (wonOpportunities / totalOpportunities) * 100 : 0;

    return {
      totalClients,
      activeClients,
      totalOpportunities,
      wonOpportunities,
      totalRevenue,
      pendingTasks,
      completedTasks,
      conversionRate
    };
  }, [rawData, startDate, endDate]);
};
