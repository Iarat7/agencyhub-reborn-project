
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useMetricsCalculation } from './useMetricsCalculation';

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

      const rawData = {
        clients: clients || [],
        opportunities: opportunities || [],
        tasks: tasks || [],
        allOpportunities: allOpportunities || []
      };

      return rawData;
    },
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
