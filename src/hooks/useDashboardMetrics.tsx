
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useMetricsCalculation } from './useMetricsCalculation';

export const useDashboardMetrics = (startDate: Date = new Date(), endDate: Date = new Date()) => {
  return useQuery({
    queryKey: ['dashboard-metrics', startDate.toISOString(), endDate.toISOString()],
    queryFn: async () => {
      console.log('Buscando métricas do dashboard...');
      
      // Garantir que as datas são válidas
      const safeStartDate = startDate instanceof Date ? startDate : new Date();
      const safeEndDate = endDate instanceof Date ? endDate : new Date();
      
      const startDateISO = safeStartDate.toISOString();
      const endDateISO = safeEndDate.toISOString();

      // Buscar dados com filtro de data para métricas específicas do período
      const { data: clients } = await supabase
        .from('clients')
        .select('*')
        .gte('created_at', startDateISO)
        .lte('created_at', endDateISO);

      // Buscar TODOS os clientes para cálculo de clientes ativos
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
        clients: allClients || [], // Usar todos os clientes para o cálculo de ativos
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
export const useCalculatedDashboardMetrics = (startDate: Date = new Date(), endDate: Date = new Date()) => {
  const { data: rawData, isLoading, error } = useDashboardMetrics(startDate, endDate);
  const metrics = useMetricsCalculation(rawData || { clients: [], opportunities: [], tasks: [], allOpportunities: [] }, startDate, endDate);

  return {
    data: metrics ? { ...metrics, rawData } : null,
    isLoading,
    error
  };
};
