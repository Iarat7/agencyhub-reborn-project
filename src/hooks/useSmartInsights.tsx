
import { useQuery } from '@tanstack/react-query';
import { useCompleteDashboardData } from './useDashboard';

export const useSmartInsights = (selectedPeriod: string | null = '6m') => {
  const { data: dashboardData } = useCompleteDashboardData(selectedPeriod);

  return useQuery({
    queryKey: ['smart-insights', selectedPeriod, dashboardData],
    queryFn: async () => {
      if (!dashboardData?.metrics) return [];

      const metrics = dashboardData.metrics;
      const insights = [];

      // Insight sobre oportunidades
      if (metrics.totalOpportunities > 0) {
        const conversionRate = metrics.conversionRate;
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
      if (metrics.totalClients > 0) {
        const clientActivityRate = (metrics.activeClients / metrics.totalClients) * 100;
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

      // Insight sobre produtividade
      if (metrics.completedTasks > 0 && metrics.pendingTasks > 0) {
        const taskCompletionRate = (metrics.completedTasks / (metrics.completedTasks + metrics.pendingTasks)) * 100;
        if (taskCompletionRate < 70) {
          insights.push({
            id: 'task-management',
            type: 'recommendation' as const,
            title: 'Melhoria na Gestão de Tarefas',
            description: `Taxa de conclusão de tarefas em ${taskCompletionRate.toFixed(1)}%. Considere implementar metodologias ágeis ou ferramentas de produtividade.`,
            impact: 'medium' as const,
            confidence: 70,
            actionable: true
          });
        }
      }

      // Insight sobre receita
      if (metrics.totalRevenue > 50000) {
        insights.push({
          id: 'revenue-growth',
          type: 'trend' as const,
          title: 'Crescimento de Receita Sólido',
          description: `Com R$ ${metrics.totalRevenue.toLocaleString('pt-BR')} em receita, você está em uma trajetória positiva. Considere diversificar produtos/serviços.`,
          impact: 'low' as const,
          confidence: 80,
          actionable: false
        });
      }

      // Insight sazonal (exemplo)
      const currentMonth = new Date().getMonth();
      if (currentMonth >= 10 || currentMonth <= 1) { // Nov, Dez, Jan
        insights.push({
          id: 'seasonal-opportunity',
          type: 'opportunity' as const,
          title: 'Período Sazonal de Oportunidades',
          description: 'Estamos no período de maior movimentação comercial. Intensifique ações de marketing e vendas para maximizar resultados.',
          impact: 'high' as const,
          confidence: 65,
          actionable: true
        });
      }

      return insights;
    },
    enabled: !!dashboardData?.metrics,
    staleTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false,
  });
};
