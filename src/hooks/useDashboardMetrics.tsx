
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDashboardMetrics = (startDate: Date, endDate: Date) => {
  return useQuery({
    queryKey: ['dashboard-metrics', startDate.toISOString(), endDate.toISOString()],
    queryFn: async () => {
      console.log('Buscando métricas do dashboard...');
      
      const startDateISO = startDate.toISOString();
      const endDateISO = endDate.toISOString();

      // Buscar dados com filtro de data
      const { data: clients } = await supabase
        .from('clients')
        .select('*')
        .gte('created_at', startDateISO)
        .lte('created_at', endDateISO);

      const { data: allClients } = await supabase
        .from('clients')
        .select('*');

      const { data: opportunities } = await supabase
        .from('opportunities')
        .select('*')
        .gte('created_at', startDateISO)
        .lte('created_at', endDateISO);

      const { data: allOpportunities } = await supabase
        .from('opportunities')
        .select('*');

      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .gte('created_at', startDateISO)
        .lte('created_at', endDateISO);

      // Calcular métricas
      const totalClients = clients?.length || 0;
      const activeClients = allClients?.filter(c => c.status === 'active').length || 0;
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
        conversionRate,
        rawData: {
          clients: clients || [],
          opportunities: opportunities || [],
          tasks: tasks || [],
          allOpportunities: allOpportunities || []
        }
      };
    },
    staleTime: 30 * 60 * 1000, // 30 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
  });
};
