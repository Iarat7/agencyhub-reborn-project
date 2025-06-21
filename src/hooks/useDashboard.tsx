
import { useQuery } from '@tanstack/react-query';
import { usePeriodUtils } from './usePeriodUtils';
import { useMetricsCalculation } from './useMetricsCalculation';
import { supabase } from '@/integrations/supabase/client';

export const useCompleteDashboardData = (selectedPeriod: string | null) => {
  console.log('📊 useCompleteDashboardData called with period:', selectedPeriod);
  
  const { calculatePeriodDates } = usePeriodUtils();
  
  // Se não tiver período, não fazer a query
  if (!selectedPeriod) {
    console.log('📊 No period provided, skipping dashboard data fetch');
    return {
      data: null,
      isLoading: false,
      error: null
    };
  }

  const { startDate, endDate } = calculatePeriodDates(selectedPeriod);

  const dashboardQuery = useQuery({
    queryKey: ['complete-dashboard-data', selectedPeriod || 'none'],
    queryFn: async () => {
      console.log('📊 Fetching dashboard data for period:', selectedPeriod);
      
      try {
        const startDateISO = startDate.toISOString();
        const endDateISO = endDate.toISOString();

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
          clients: allClients || [],
          opportunities: opportunities || [],
          tasks: tasks || [],
          allOpportunities: allOpportunities || []
        };

        console.log('📊 Raw data fetched:', rawData);
        return rawData;
      } catch (error) {
        console.error('📊 Error fetching dashboard data:', error);
        throw error;
      }
    },
    enabled: !!selectedPeriod,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: (failureCount, error) => {
      console.log('📊 Dashboard query retry attempt:', failureCount, error);
      // Menos tentativas em dispositivos móveis
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const maxRetries = isMobile ? 1 : 2;
      return failureCount < maxRetries;
    }
  });

  // Calcular métricas a partir dos dados brutos
  const calculatedMetrics = useMetricsCalculation(
    dashboardQuery.data || { clients: [], opportunities: [], tasks: [], allOpportunities: [] },
    startDate,
    endDate
  );

  // Combinar dados brutos com métricas calculadas
  const combinedData = dashboardQuery.data && calculatedMetrics ? {
    ...dashboardQuery.data,
    metrics: calculatedMetrics
  } : null;

  console.log('📊 Dashboard data state:', {
    isLoading: dashboardQuery.isLoading,
    hasData: !!combinedData,
    error: dashboardQuery.error?.message || null,
    hasMetrics: !!calculatedMetrics
  });

  return {
    data: combinedData,
    isLoading: dashboardQuery.isLoading,
    error: dashboardQuery.error
  };
};
