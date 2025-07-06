import { useQuery } from '@tanstack/react-query';
import { useCalculatedDashboardMetrics } from './useDashboardMetrics';
import { useDashboardActivities } from './useDashboardActivities';
import { usePeriodUtils } from './usePeriodUtils';
import { useMemo } from 'react';
import { useOrganization } from '@/contexts/OrganizationContext';

export const useDashboardData = (selectedPeriod: string = '6m') => {
  const { calculatePeriodDates } = usePeriodUtils();
  const { currentOrganization } = useOrganization();
  
  const periodDates = useMemo(() => {
    return calculatePeriodDates(selectedPeriod);
  }, [selectedPeriod, calculatePeriodDates]);
  
  return useQuery({
    queryKey: ['dashboard-data', selectedPeriod, currentOrganization?.id],
    queryFn: async () => {
      if (!currentOrganization) {
        console.log('Nenhuma organização selecionada');
        return null;
      }

      const { startDate, endDate, periodConfig } = periodDates;
      
      console.log('Carregando dados do dashboard para organização:', currentOrganization.name);
      console.log('Período:', selectedPeriod, 'Data início:', startDate, 'Data fim:', endDate);

      const now = new Date();
      
      // Gerar dados para gráficos baseado no tipo de período
      let chartData = [];
      
      if (periodConfig?.type === 'days' || periodConfig?.type === 'current_month' || periodConfig?.type === 'last_month' || periodConfig?.type === 'yesterday') {
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
        const months = periodConfig?.months || 6;
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
};

// Hook composto que usa os hooks menores
export const useCompleteDashboardData = (selectedPeriod: string = '6m') => {
  const { calculatePeriodDates } = usePeriodUtils();
  const { currentOrganization } = useOrganization();
  
  const periodDates = useMemo(() => {
    return calculatePeriodDates(selectedPeriod);
  }, [selectedPeriod, calculatePeriodDates]);
  
  const { startDate, endDate } = periodDates;
  
  const metricsQuery = useCalculatedDashboardMetrics(startDate, endDate);
  const dashboardQuery = useDashboardData(selectedPeriod);
  
  const activitiesQuery = useDashboardActivities(
    startDate, 
    endDate, 
    metricsQuery.data?.rawData || { clients: [], allOpportunities: [], tasks: [] }
  );

  // Se não há organização, retornar dados vazios sem erro
  if (!currentOrganization) {
    return {
      data: {
        metrics: null,
        charts: null,
        recentActivities: [],
      },
      isLoading: false,
      error: null
    };
  }

  const isLoading = metricsQuery.isLoading || dashboardQuery.isLoading;
  const error = metricsQuery.error || dashboardQuery.error;

  return {
    data: {
      metrics: metricsQuery.data,
      charts: dashboardQuery.data,
      recentActivities: activitiesQuery.data || [],
    },
    isLoading,
    error
  };
};