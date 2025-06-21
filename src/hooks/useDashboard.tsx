
import { useQuery } from '@tanstack/react-query';
import { useDashboardMetrics } from './useDashboardMetrics';
import { useDashboardActivities } from './useDashboardActivities';

export const useCompleteDashboardData = (selectedPeriod: string | null) => {
  console.log('📊 useCompleteDashboardData called with period:', selectedPeriod);
  
  // Se não tiver período, não fazer a query
  if (!selectedPeriod) {
    console.log('📊 No period provided, skipping dashboard data fetch');
    return {
      data: null,
      isLoading: false,
      error: null
    };
  }

  const { data: metrics, isLoading: metricsLoading, error: metricsError } = useDashboardMetrics(selectedPeriod);
  const { data: activities, isLoading: activitiesLoading, error: activitiesError } = useDashboardActivities();

  const combinedQuery = useQuery({
    queryKey: ['complete-dashboard-data', selectedPeriod],
    queryFn: async () => {
      console.log('📊 Combining dashboard data...');
      
      try {
        // Verificar se temos dados de métricas
        if (!metrics && !metricsLoading && !metricsError) {
          console.log('📊 No metrics data available');
        }

        const combinedData = {
          metrics: metrics || {
            totalClients: 0,
            activeClients: 0,
            totalOpportunities: 0,
            wonOpportunities: 0,
            totalRevenue: 0,
            completedTasks: 0,
            pendingTasks: 0,
            inProgressTasks: 0,
            inApprovalTasks: 0,
            conversionRate: 0,
            opportunitiesByStage: [],
            tasksByStatus: [],
            clientsByStatus: []
          },
          activities: activities || []
        };

        console.log('📊 Combined dashboard data:', combinedData);
        return combinedData;
      } catch (error) {
        console.error('📊 Error combining dashboard data:', error);
        throw error;
      }
    },
    enabled: !!selectedPeriod && !metricsLoading && !activitiesLoading,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: (failureCount, error) => {
      console.log('📊 Dashboard query retry attempt:', failureCount, error);
      // Menos tentativas em dispositivos móveis
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const maxRetries = isMobile ? 1 : 2;
      return failureCount < maxRetries;
    }
  });

  const isLoading = metricsLoading || activitiesLoading || combinedQuery.isLoading;
  const error = metricsError || activitiesError || combinedQuery.error;

  console.log('📊 Dashboard data state:', {
    isLoading,
    hasData: !!combinedQuery.data,
    error: error?.message || null,
    metricsLoading,
    activitiesLoading
  });

  return {
    data: combinedQuery.data,
    isLoading,
    error
  };
};
