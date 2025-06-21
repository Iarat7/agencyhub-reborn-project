
import { useQuery } from '@tanstack/react-query';

export const useSmartInsights = (dashboardMetrics: any = null) => {
  return useQuery({
    queryKey: ['smart-insights', Boolean(dashboardMetrics)],
    queryFn: async () => {
      if (!dashboardMetrics) return [];

      const insights = [];

      // Insight sobre oportunidades
      if (dashboardMetrics.totalOpportunities > 0) {
        const conversionRate = dashboardMetrics.conversionRate;
        if (conversionRate < 15) {
          insights.push({
            id: 'low-conversion',
            type: 'risk' as const,
            title: 'Taxa de Conversão Baixa',
            description: `Sua taxa de conversão de ${conversionRate.toFixed(1)}% está abaixo da média do mercado (20-25%). Considere revisar seu processo de vendas e qualificação de leads.`,
            impact: 'high' as const,
            confidence: 85,
            actionable: true
          });
        } else if (conversionRate > 25) {
          insights.push({
            id: 'high-conversion',
            type: 'opportunity' as const,
            title: 'Excelente Taxa de Conversão',
            description: `Sua taxa de conversão de ${conversionRate.toFixed(1)}% está acima da média! Considere aumentar seus esforços de prospecção para maximizar resultados.`,
            impact: 'medium' as const,
            confidence: 90,
            actionable: true
          });
        }
      }

      // Insight sobre clientes
      if (dashboardMetrics.totalClients > 0) {
        const clientActivityRate = (dashboardMetrics.activeClients / dashboardMetrics.totalClients) * 100;
        if (clientActivityRate < 60) {
          insights.push({
            id: 'client-reactivation',
            type: 'recommendation' as const,
            title: 'Oportunidade de Reativação',
            description: `${(100 - clientActivityRate).toFixed(1)}% dos seus clientes estão inativos. Implemente uma campanha de reativação para recuperar relacionamentos.`,
            impact: 'medium' as const,
            confidence: 75,
            actionable: true
          });
        }
      }

      return insights;
    },
    enabled: Boolean(dashboardMetrics),
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
