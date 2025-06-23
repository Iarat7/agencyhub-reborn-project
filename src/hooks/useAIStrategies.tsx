
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useClients } from './useClients';
import { useOpportunities } from './useOpportunities';
import { useFinancialEntries } from './useFinancialEntries';
import { useTasks } from './useTasks';

interface AIStrategy {
  id: string;
  type: 'marketing' | 'sales' | 'financial' | 'operational' | 'growth' | 'retention';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  impact: string;
  actionItems: string[];
  dataSource: string;
  confidence: number;
  estimatedROI?: string;
  urgencyScore: number;
  potentialRevenue?: number;
  implementationDifficulty: 'easy' | 'medium' | 'hard';
  timeToResult: number; // dias
}

interface AdvancedMetrics {
  clientHealthScore: number;
  pipelineVelocity: number;
  churnRisk: number;
  growthTrend: number;
  seasonalImpact: number;
  competitivePosition: number;
}

export const useAIStrategies = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { data: clients = [] } = useClients();
  const { data: opportunities = [] } = useOpportunities();
  const { entries } = useFinancialEntries();
  const { data: tasks = [] } = useTasks();

  // Função para calcular métricas avançadas
  const calculateAdvancedMetrics = (): AdvancedMetrics => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    // Client Health Score (0-100)
    const activeClients = clients.filter(c => c.status === 'active').length;
    const totalClients = clients.length;
    const clientHealthScore = totalClients > 0 ? (activeClients / totalClients) * 100 : 0;

    // Pipeline Velocity (oportunidades/dia)
    const recentOpportunities = opportunities.filter(opp => 
      new Date(opp.created_at!) > thirtyDaysAgo
    );
    const pipelineVelocity = recentOpportunities.length / 30;

    // Churn Risk (%)
    const inactiveClients = clients.filter(c => c.status === 'inactive').length;
    const churnRisk = totalClients > 0 ? (inactiveClients / totalClients) * 100 : 0;

    // Growth Trend (comparação 30 vs 60 dias)
    const last30DaysOpps = opportunities.filter(opp => 
      new Date(opp.created_at!) > thirtyDaysAgo
    ).length;
    const previous30DaysOpps = opportunities.filter(opp => {
      const date = new Date(opp.created_at!);
      return date > sixtyDaysAgo && date <= thirtyDaysAgo;
    }).length;
    const growthTrend = previous30DaysOpps > 0 ? 
      ((last30DaysOpps - previous30DaysOpps) / previous30DaysOpps) * 100 : 0;

    // Seasonal Impact (baseado no mês atual)
    const currentMonth = now.getMonth();
    const seasonalMultipliers = [0.8, 0.9, 1.1, 1.0, 1.0, 1.1, 0.9, 0.8, 1.0, 1.1, 1.3, 1.4];
    const seasonalImpact = seasonalMultipliers[currentMonth] * 100;

    // Competitive Position (baseado na performance)
    const wonOpps = opportunities.filter(opp => opp.stage === 'closed_won').length;
    const totalClosedOpps = opportunities.filter(opp => 
      opp.stage === 'closed_won' || opp.stage === 'closed_lost'
    ).length;
    const competitivePosition = totalClosedOpps > 0 ? (wonOpps / totalClosedOpps) * 100 : 50;

    return {
      clientHealthScore,
      pipelineVelocity,
      churnRisk,
      growthTrend,
      seasonalImpact,
      competitivePosition
    };
  };

  // Função para calcular score de urgência
  const calculateUrgencyScore = (metrics: AdvancedMetrics, strategyType: string): number => {
    let score = 50; // base

    if (strategyType === 'financial' && metrics.churnRisk > 20) score += 30;
    if (strategyType === 'sales' && metrics.pipelineVelocity < 1) score += 25;
    if (strategyType === 'retention' && metrics.clientHealthScore < 70) score += 35;
    if (strategyType === 'growth' && metrics.growthTrend < 0) score += 20;

    return Math.min(score, 100);
  };

  const generateAdvancedStrategies = async (): Promise<AIStrategy[]> => {
    setIsGenerating(true);
    
    try {
      const metrics = calculateAdvancedMetrics();
      const strategies: AIStrategy[] = [];
      const now = new Date();

      console.log('Advanced metrics calculated:', metrics);

      // ESTRATÉGIA 1: Análise Avançada de Pipeline
      const stalledOpportunities = opportunities.filter(opp => {
        const lastUpdate = new Date(opp.updated_at || opp.created_at!);
        const daysSinceUpdate = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceUpdate > 7 && !['closed_won', 'closed_lost'].includes(opp.stage);
      });

      if (stalledOpportunities.length > 0) {
        const totalStalledValue = stalledOpportunities.reduce((sum, opp) => sum + (opp.value || 0), 0);
        const urgencyScore = calculateUrgencyScore(metrics, 'sales');
        
        strategies.push({
          id: 'advanced-pipeline-optimization',
          type: 'sales',
          title: 'Reativação Inteligente do Pipeline',
          description: `${stalledOpportunities.length} oportunidades (R$ ${totalStalledValue.toLocaleString('pt-BR')}) estão paradas. Estratégia de reativação com score de urgência ${urgencyScore}/100.`,
          priority: urgencyScore > 80 ? 'urgent' : urgencyScore > 60 ? 'high' : 'medium',
          impact: `Potencial de recuperar R$ ${(totalStalledValue * 0.3).toLocaleString('pt-BR')} em 30 dias`,
          actionItems: [
            'Análise de causa raiz das oportunidades paradas',
            'Sequência automatizada de follow-up personalizado',
            'Ofertas limitadas com desconto estratégico',
            'Reunião de urgência com prospects de alto valor',
            'Implementar CRM scoring para priorização'
          ],
          dataSource: 'Análise avançada do pipeline comercial',
          confidence: 0.85 + (urgencyScore / 1000),
          estimatedROI: `${Math.round(15 + urgencyScore * 0.3)}-${Math.round(30 + urgencyScore * 0.5)}%`,
          urgencyScore,
          potentialRevenue: totalStalledValue * 0.3,
          implementationDifficulty: 'medium',
          timeToResult: 15
        });
      }

      // ESTRATÉGIA 2: Gestão Financeira Inteligente
      const overdueEntries = entries.filter(entry => 
        entry.status === 'overdue' || 
        (entry.status === 'pending' && entry.due_date && new Date(entry.due_date) < now)
      );
      const pendingEntries = entries.filter(entry => entry.status === 'pending');
      
      if (overdueEntries.length > 0 || pendingEntries.length > 10) {
        const overdueAmount = overdueEntries.reduce((sum, entry) => sum + (entry.amount || 0), 0);
        const pendingAmount = pendingEntries.reduce((sum, entry) => sum + (entry.amount || 0), 0);
        const totalAmount = overdueAmount + pendingAmount;
        const urgencyScore = calculateUrgencyScore(metrics, 'financial');
        
        strategies.push({
          id: 'intelligent-cashflow-management',
          type: 'financial',
          title: 'Otimização Inteligente de Fluxo de Caixa',
          description: `${overdueEntries.length} vencidas (R$ ${overdueAmount.toLocaleString('pt-BR')}) + ${pendingEntries.length} pendentes (R$ ${pendingAmount.toLocaleString('pt-BR')}). Score de risco: ${urgencyScore}/100.`,
          priority: urgencyScore > 75 ? 'urgent' : 'high',
          impact: `Acelerar entrada de R$ ${totalAmount.toLocaleString('pt-BR')} em 45 dias`,
          actionItems: [
            'Implementar cobrança automatizada por WhatsApp/email',
            'Negociar parcelamento com desconto para pagamento à vista',
            'Programa de fidelidade para pagamentos antecipados',
            'Dashboard de aging de recebíveis em tempo real',
            'Score de crédito para novos clientes'
          ],
          dataSource: 'Análise de aging e comportamento de pagamento',
          confidence: 0.92,
          estimatedROI: `${Math.round(20 + urgencyScore * 0.4)}-${Math.round(50 + urgencyScore * 0.6)}%`,
          urgencyScore,
          potentialRevenue: totalAmount * 0.85,
          implementationDifficulty: 'easy',
          timeToResult: 7
        });
      }

      // ESTRATÉGIA 3: Reativação Inteligente de Clientes
      if (metrics.churnRisk > 15) {
        const inactiveClients = clients.filter(client => {
          const hasRecentOpportunity = opportunities.some(opp => 
            opp.client_id === client.id && 
            new Date(opp.created_at!).getTime() > Date.now() - (90 * 24 * 60 * 60 * 1000)
          );
          return !hasRecentOpportunity && client.status !== 'inactive';
        });

        if (inactiveClients.length > 0) {
          const potentialRevenue = inactiveClients.reduce((sum, client) => sum + (client.monthly_value || 1000), 0);
          const urgencyScore = calculateUrgencyScore(metrics, 'retention');
          
          strategies.push({
            id: 'intelligent-client-reactivation',
            type: 'retention',
            title: 'Programa de Reativação com IA',
            description: `${inactiveClients.length} clientes em risco de churn (${metrics.churnRisk.toFixed(1)}% taxa atual). Potencial de receita: R$ ${potentialRevenue.toLocaleString('pt-BR')}/mês.`,
            priority: urgencyScore > 70 ? 'high' : 'medium',
            impact: `Recuperar 30-40% dos clientes inativos em 60 dias`,
            actionItems: [
              'Segmentação por comportamento e valor do cliente',
              'Campanha omnichannel personalizada (email + WhatsApp + ligação)',
              'Oferta exclusiva "volta por tempo limitado"',
              'Pesquisa de satisfação com incentivo',
              'Programa de referência para clientes reativados'
            ],
            dataSource: 'Análise de comportamento e churn prediction',
            confidence: 0.75 + (urgencyScore / 1000),
            estimatedROI: `${Math.round(15 + urgencyScore * 0.2)}-${Math.round(35 + urgencyScore * 0.4)}%`,
            urgencyScore,
            potentialRevenue: potentialRevenue * 0.35,
            implementationDifficulty: 'medium',
            timeToResult: 30
          });
        }
      }

      // ESTRATÉGIA 4: Otimização de Produtividade com IA
      const overdueTasks = tasks.filter(task => 
        task.due_date && 
        new Date(task.due_date) < now && 
        task.status !== 'completed'
      );
      const completedTasks = tasks.filter(task => task.status === 'completed');
      const totalTasks = tasks.length;

      if (overdueTasks.length > 0 && totalTasks > 0) {
        const productivityScore = (completedTasks.length / totalTasks) * 100;
        const urgencyScore = calculateUrgencyScore(metrics, 'operational');
        
        strategies.push({
          id: 'ai-productivity-optimization',
          type: 'operational',
          title: 'Sistema de Produtividade Inteligente',
          description: `${overdueTasks.length} tarefas em atraso (${(100 - productivityScore).toFixed(1)}% de ineficiência). Score de produtividade: ${productivityScore.toFixed(1)}/100.`,
          priority: urgencyScore > 65 ? 'high' : 'medium',
          impact: `Aumentar produtividade em ${Math.round(20 + urgencyScore * 0.3)}% em 45 dias`,
          actionItems: [
            'Implementar automação de tarefas repetitivas',
            'Sistema de priorização inteligente (matriz Eisenhower + IA)',
            'Métricas de produtividade em tempo real por pessoa',
            'Gamificação para engajamento da equipe',
            'Treinamento em metodologias ágeis (Scrum/Kanban)'
          ],
          dataSource: 'Análise de performance e gargalos operacionais',
          confidence: 0.80 + (urgencyScore / 1250),
          estimatedROI: `${Math.round(15 + urgencyScore * 0.25)}-${Math.round(40 + urgencyScore * 0.45)}%`,
          urgencyScore,
          implementationDifficulty: 'medium',
          timeToResult: 21
        });
      }

      // ESTRATÉGIA 5: Crescimento Sazonal Inteligente
      if (metrics.seasonalImpact > 110) { // Período favorável
        const currentMonth = now.getMonth();
        const seasonName = currentMonth >= 10 ? 'fim de ano' : 
                          currentMonth <= 2 ? 'início de ano' : 'meio do ano';
        
        strategies.push({
          id: 'seasonal-growth-strategy',
          type: 'growth',
          title: `Estratégia de Crescimento ${seasonName.charAt(0).toUpperCase() + seasonName.slice(1)}`,
          description: `Período de alta demanda detectado (${metrics.seasonalImpact.toFixed(0)}% do normal). Oportunidade para acelerar crescimento com menor CAC.`,
          priority: 'high',
          impact: `Potencial de crescimento ${Math.round(metrics.seasonalImpact - 100)}% acima da média`,
          actionItems: [
            `Campanha agressiva para período de ${seasonName}`,
            'Aumento temporário do budget de marketing (2x)',
            'Ofertas limitadas e exclusivas da temporada',
            'Parcerias estratégicas para ampliar alcance',
            'Análise de concorrentes para aproveitamento de gaps'
          ],
          dataSource: `Análise sazonal e tendências de mercado`,
          confidence: 0.82 + (metrics.seasonalImpact / 1000),
          estimatedROI: `${Math.round(25 + metrics.seasonalImpact * 0.2)}-${Math.round(50 + metrics.seasonalImpact * 0.4)}%`,
          urgencyScore: Math.round(metrics.seasonalImpact),
          potentialRevenue: (opportunities.reduce((sum, opp) => sum + (opp.value || 0), 0) * (metrics.seasonalImpact / 100)),
          implementationDifficulty: 'easy',
          timeToResult: 14
        });
      }

      // ESTRATÉGIA 6: Inteligência Competitiva
      if (metrics.competitivePosition < 70) {
        strategies.push({
          id: 'competitive-intelligence-boost',
          type: 'growth',
          title: 'Programa de Inteligência Competitiva',
          description: `Taxa de conversão de ${metrics.competitivePosition.toFixed(1)}% indica necessidade de diferenciação. Estratégia para melhorar posicionamento competitivo.`,
          priority: 'medium',
          impact: `Aumentar win rate para 75%+ em 90 dias`,
          actionItems: [
            'Análise detalhada dos 3 principais concorrentes',
            'Pesquisa de NPS e satisfação com clientes',
            'Desenvolvimento de diferencial competitivo único',
            'Treinamento de vendas em objeções e concorrência',
            'Criação de battle cards para equipe comercial'
          ],
          dataSource: 'Análise de win/loss ratio e benchmarking',
          confidence: 0.75,
          estimatedROI: '20-35%',
          urgencyScore: Math.round(100 - metrics.competitivePosition),
          implementationDifficulty: 'hard',
          timeToResult: 60
        });
      }

      // Ordenar por score de urgência e impacto
      return strategies.sort((a, b) => {
        const scoreA = a.urgencyScore + (a.potentialRevenue || 0) / 10000;
        const scoreB = b.urgencyScore + (b.potentialRevenue || 0) / 10000;
        return scoreB - scoreA;
      }).slice(0, 5); // Top 5 estratégias

    } finally {
      setIsGenerating(false);
    }
  };

  const strategiesQuery = useQuery({
    queryKey: ['ai-strategies-advanced', clients.length, opportunities.length, entries.length, tasks.length],
    queryFn: generateAdvancedStrategies,
    staleTime: 3 * 60 * 1000, // 3 minutos (mais agressivo)
    enabled: clients.length > 0 || opportunities.length > 0 || entries.length > 0 || tasks.length > 0,
  });

  return {
    strategies: strategiesQuery.data || [],
    isLoading: strategiesQuery.isLoading || isGenerating,
    isError: strategiesQuery.isError,
    refetch: strategiesQuery.refetch,
    metrics: strategiesQuery.data ? calculateAdvancedMetrics() : null,
  };
};
