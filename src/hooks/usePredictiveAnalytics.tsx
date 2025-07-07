
import { useQuery } from '@tanstack/react-query';
import { useOrganization } from '@/contexts/OrganizationContext';

export const usePredictiveAnalytics = (selectedPeriod: string = '6m', metrics?: any) => {
  const { currentOrganization } = useOrganization();

  return useQuery({
    queryKey: ['predictive-analytics', selectedPeriod, currentOrganization?.id],
    queryFn: async () => {
      if (!metrics) return null;
      
      // Simulação de análise preditiva baseada nos dados históricos
      const predictedRevenue = calculatePredictedRevenue(metrics);
      const revenueTarget = 100000; // Meta configurável
      const probabilityToTarget = calculateProbabilityToTarget(metrics, revenueTarget);
      
      const trends = {
        clientGrowth: calculateClientGrowthTrend(metrics),
        conversionTrend: calculateConversionTrend(metrics),
        salesVelocity: calculateSalesVelocityTrend(metrics)
      };

      const alerts = generateSmartAlerts(metrics, trends);

      return {
        predictedRevenue,
        revenueTarget,
        probabilityToTarget,
        trends,
        alerts
      };
    },
    enabled: !!metrics,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });
};

// Funções auxiliares para cálculos preditivos
const calculatePredictedRevenue = (metrics: any) => {
  const currentRevenue = metrics.totalRevenue || 0;
  const conversionRate = metrics.conversionRate || 0;
  const totalOpportunities = metrics.totalOpportunities || 0;
  
  // Análise simples baseada na taxa de conversão atual
  const projectedRevenue = currentRevenue * 1.15; // 15% de crescimento estimado
  
  return Math.round(projectedRevenue);
};

const calculateProbabilityToTarget = (metrics: any, target: number) => {
  const currentRevenue = metrics.totalRevenue || 0;
  const conversionRate = metrics.conversionRate || 0;
  
  // Cálculo simplificado de probabilidade
  const currentProgress = (currentRevenue / target) * 100;
  const conversionFactor = Math.min(conversionRate / 20, 1); // Normaliza taxa de conversão
  
  return Math.min(Math.round(currentProgress * conversionFactor * 1.2), 100);
};

const calculateClientGrowthTrend = (metrics: any) => {
  // Simula tendência de crescimento de clientes
  const totalClients = metrics.totalClients || 0;
  const activeClients = metrics.activeClients || 0;
  
  return totalClients > 0 ? ((activeClients / totalClients) * 100 - 70) : 0;
};

const calculateConversionTrend = (metrics: any) => {
  // Simula tendência de conversão
  const conversionRate = metrics.conversionRate || 0;
  return conversionRate - 15; // Baseline de 15%
};

const calculateSalesVelocityTrend = (metrics: any) => {
  // Simula velocidade de vendas
  const wonOpportunities = metrics.wonOpportunities || 0;
  const totalOpportunities = metrics.totalOpportunities || 0;
  
  return totalOpportunities > 0 ? ((wonOpportunities / totalOpportunities) * 100 - 25) : 0;
};

const generateSmartAlerts = (metrics: any, trends: any) => {
  const alerts = [];
  
  // Alerta de baixa conversão
  if (metrics.conversionRate < 10) {
    alerts.push({
      type: 'warning' as const,
      message: 'Taxa de conversão abaixo da média. Considere revisar o processo de vendas.',
      priority: 'high' as const
    });
  }
  
  // Alerta de crescimento lento
  if (trends.clientGrowth < 0) {
    alerts.push({
      type: 'error' as const,
      message: 'Crescimento de clientes em declínio. Ação necessária na aquisição.',
      priority: 'high' as const
    });
  }
  
  // Alerta de oportunidade
  if (trends.salesVelocity > 10) {
    alerts.push({
      type: 'info' as const,
      message: 'Velocidade de vendas acima da média. Considere aumentar metas.',
      priority: 'medium' as const
    });
  }
  
  return alerts;
};
