
import { useQuery } from '@tanstack/react-query';
import { usePeriodUtils } from './usePeriodUtils';
import { useMetricsCalculation } from './useMetricsCalculation';
import { supabase } from '@/integrations/supabase/client';

export const useCompleteDashboardData = (selectedPeriod: string | null) => {
  console.log('📊 useCompleteDashboardData called with period:', selectedPeriod);
  
  const { calculatePeriodDates } = usePeriodUtils();
  
  // Sempre calcular datas, mesmo se período for null
  const { startDate, endDate } = selectedPeriod 
    ? calculatePeriodDates(selectedPeriod)
    : { startDate: new Date(), endDate: new Date() };

  const dashboardQuery = useQuery({
    queryKey: ['complete-dashboard-data', selectedPeriod || 'none'],
    queryFn: async () => {
      if (!selectedPeriod) {
        console.log('📊 No period provided, returning empty data');
        return {
          clients: [],
          opportunities: [],
          tasks: [],
          allOpportunities: []
        };
      }

      console.log('📊 Fetching dashboard data for period:', selectedPeriod);
      
      const startDateISO = startDate.toISOString();
      const endDateISO = endDate.toISOString();

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
    enabled: true, // Sempre habilitado
    staleTime: 5 * 60 * 1000,
    retry: 1
  });

  // Sempre chamar useMetricsCalculation, independente do estado
  const rawData = dashboardQuery.data || { clients: [], opportunities: [], tasks: [], allOpportunities: [] };
  const calculatedMetrics = useMetricsCalculation(rawData, startDate, endDate);

  // Combinar dados apenas se tivermos dados válidos
  const combinedData = selectedPeriod && dashboardQuery.data && calculatedMetrics ? {
    ...dashboardQuery.data,
    metrics: calculatedMetrics
  } : null;

  console.log('📊 Dashboard data state:', {
    isLoading: dashboardQuery.isLoading,
    hasData: Boolean(combinedData),
    error: dashboardQuery.error?.message || null,
    hasMetrics: Boolean(calculatedMetrics),
    selectedPeriod
  });

  return {
    data: combinedData,
    isLoading: dashboardQuery.isLoading,
    error: dashboardQuery.error
  };
};
