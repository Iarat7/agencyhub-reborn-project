
import { useQuery } from '@tanstack/react-query';
import { usePeriodUtils } from './usePeriodUtils';
import { useMetricsCalculation } from './useMetricsCalculation';
import { supabase } from '@/integrations/supabase/client';

export const useCompleteDashboardData = (selectedPeriod: string | null) => {
  console.log('📊 useCompleteDashboardData called with period:', selectedPeriod);
  
  const { calculatePeriodDates } = usePeriodUtils();
  
  // Se não tiver período, retornar estado inicial
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
    queryKey: ['complete-dashboard-data', selectedPeriod],
    queryFn: async () => {
      console.log('📊 Fetching dashboard data for period:', selectedPeriod);
      
      const startDateISO = startDate.toISOString();
      const endDateISO = endDate.toISOString();

      // Buscar dados com filtro de data
      const [clientsResult, allClientsResult, opportunitiesResult, allOpportunitiesResult, tasksResult] = await Promise.all([
        supabase
          .from('clients')
          .select('*')
          .gte('created_at', startDateISO)
          .lte('created_at', endDateISO),
        
        supabase
          .from('clients')
          .select('*'),
        
        supabase
          .from('opportunities')
          .select('*')
          .gte('created_at', startDateISO)
          .lte('created_at', endDateISO),
        
        supabase
          .from('opportunities')
          .select('*'),
        
        supabase
          .from('tasks')
          .select('*')
          .gte('created_at', startDateISO)
          .lte('created_at', endDateISO)
      ]);

      const rawData = {
        clients: allClientsResult.data || [],
        opportunities: opportunitiesResult.data || [],
        tasks: tasksResult.data || [],
        allOpportunities: allOpportunitiesResult.data || []
      };

      console.log('📊 Raw data fetched:', rawData);
      return rawData;
    },
    enabled: Boolean(selectedPeriod),
    staleTime: 5 * 60 * 1000,
    retry: 1
  });

  // Calcular métricas usando hook separado
  const calculatedMetrics = useMetricsCalculation(
    dashboardQuery.data || { clients: [], opportunities: [], tasks: [], allOpportunities: [] },
    startDate,
    endDate
  );

  // Combinar dados apenas se ambos existirem
  const combinedData = dashboardQuery.data && calculatedMetrics ? {
    ...dashboardQuery.data,
    metrics: calculatedMetrics
  } : null;

  console.log('📊 Dashboard data state:', {
    isLoading: dashboardQuery.isLoading,
    hasData: Boolean(combinedData),
    error: dashboardQuery.error?.message || null,
    hasMetrics: Boolean(calculatedMetrics)
  });

  return {
    data: combinedData,
    isLoading: dashboardQuery.isLoading,
    error: dashboardQuery.error
  };
};
