
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useMetricsCalculation } from './useMetricsCalculation';
import { useOrganization } from '@/contexts/OrganizationContext';

export const useDashboardMetrics = (startDate: Date, endDate: Date) => {
  const { currentOrganization } = useOrganization();

  return useQuery({
    queryKey: ['dashboard-metrics', startDate.toISOString(), endDate.toISOString(), currentOrganization?.id],
    queryFn: async () => {
      if (!currentOrganization) {
        console.log('Nenhuma organização para buscar métricas');
        return { clients: [], opportunities: [], tasks: [], allOpportunities: [] };
      }

      console.log('Buscando métricas do dashboard para organização:', currentOrganization.name);
      
      // Garantir que as datas são válidas
      const safeStartDate = startDate instanceof Date ? startDate : new Date();
      const safeEndDate = endDate instanceof Date ? endDate : new Date();
      
      const startDateISO = safeStartDate.toISOString();
      const endDateISO = safeEndDate.toISOString();

      // Buscar dados com filtro de organização e data
      const { data: clients } = await supabase
        .from('clients')
        .select('*')
        .eq('organization_id', currentOrganization.id)
        .gte('created_at', startDateISO)
        .lte('created_at', endDateISO);

      // Buscar TODOS os clientes da organização para cálculo de clientes ativos
      const { data: allClients } = await supabase
        .from('clients')
        .select('*')
        .eq('organization_id', currentOrganization.id);

      const { data: opportunities } = await supabase
        .from('opportunities')
        .select('*')
        .eq('organization_id', currentOrganization.id)
        .gte('created_at', startDateISO)
        .lte('created_at', endDateISO);

      const { data: allOpportunities } = await supabase
        .from('opportunities')
        .select('*')
        .eq('organization_id', currentOrganization.id);

      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('organization_id', currentOrganization.id)
        .gte('created_at', startDateISO)
        .lte('created_at', endDateISO);

      const rawData = {
        clients: allClients || [], // Usar todos os clientes para o cálculo de ativos
        opportunities: opportunities || [],
        tasks: tasks || [],
        allOpportunities: allOpportunities || []
      };

      return rawData;
    },
    enabled: !!currentOrganization,
    staleTime: 30 * 60 * 1000, // 30 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
  });
};

// Hook que combina os dados com os cálculos
export const useCalculatedDashboardMetrics = (startDate: Date, endDate: Date) => {
  const { data: rawData, isLoading, error } = useDashboardMetrics(startDate, endDate);
  const metrics = useMetricsCalculation(rawData || { clients: [], opportunities: [], tasks: [], allOpportunities: [] }, startDate, endDate);

  return {
    data: metrics ? { ...metrics, rawData } : null,
    isLoading,
    error
  };
};
