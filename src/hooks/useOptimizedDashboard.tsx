import { useQuery } from '@tanstack/react-query';
import { useCalculatedDashboardMetrics } from './useDashboardMetrics';
import { useDashboardActivities } from './useDashboardActivities';
import { usePeriodUtils } from './usePeriodUtils';
import { useMemo } from 'react';
import { useOrganization } from '@/contexts/OrganizationContext';

export const useOptimizedDashboard = (selectedPeriod: string = '6m') => {
  const { calculatePeriodDates } = usePeriodUtils();
  const { currentOrganization } = useOrganization();
  
  const periodDates = useMemo(() => {
    return calculatePeriodDates(selectedPeriod);
  }, [selectedPeriod, calculatePeriodDates]);

  const { startDate, endDate } = periodDates;
  
  // Query única para buscar todos os dados necessários
  const mainQuery = useQuery({
    queryKey: ['optimized-dashboard', selectedPeriod, currentOrganization?.id],
    queryFn: async () => {
      if (!currentOrganization) {
        return {
          metrics: null,
          charts: null,
          recentActivities: []
        };
      }

      const now = new Date();
      
      // Gerar dados para gráficos baseado no tipo de período
      let chartData = [];
      
      if (periodDates.periodConfig?.type === 'days' || periodDates.periodConfig?.type === 'current_month' || periodDates.periodConfig?.type === 'last_month' || periodDates.periodConfig?.type === 'yesterday') {
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const daysToShow = Math.min(diffDays + 1, 30);
        
        chartData = Array.from({ length: daysToShow }, (_, i) => {
          const date = new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000));
          return {
            name: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
            value: 0
          };
        });
      } else {
        const months = periodDates.periodConfig?.months || 6;
        chartData = Array.from({ length: months }, (_, i) => {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          return {
            month: date.toLocaleDateString('pt-BR', { month: 'short' }),
            name: date.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase(),
            value: 0
          };
        }).reverse();
      }

      return {
        period: periodDates,
        chartData
      };
    },
    enabled: !!currentOrganization,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
  });

  // Queries separadas para métricas e atividades
  const metricsQuery = useCalculatedDashboardMetrics(startDate, endDate);
  
  const activitiesQuery = useDashboardActivities(
    startDate, 
    endDate, 
    metricsQuery.data?.rawData || { clients: [], allOpportunities: [], tasks: [] }
  );

  const isLoading = mainQuery.isLoading || metricsQuery.isLoading;
  const error = mainQuery.error || metricsQuery.error;

  return {
    data: {
      metrics: metricsQuery.data,
      charts: mainQuery.data,
      recentActivities: activitiesQuery.data || [],
    },
    isLoading,
    error
  };
};