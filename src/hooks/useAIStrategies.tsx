
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useClients } from './useClients';
import { useOpportunities } from './useOpportunities';
import { useFinancialEntries } from './useFinancialEntries';
import { useTasks } from './useTasks';

interface AIStrategy {
  id: string;
  type: 'marketing' | 'sales' | 'financial' | 'operational';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  impact: string;
  actionItems: string[];
  dataSource: string;
  confidence: number;
  estimatedROI?: string;
}

export const useAIStrategies = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { data: clients = [] } = useClients();
  const { data: opportunities = [] } = useOpportunities();
  const { entries } = useFinancialEntries();
  const { data: tasks = [] } = useTasks();

  const generateStrategies = async (): Promise<AIStrategy[]> => {
    setIsGenerating(true);
    
    try {
      // Análise dos dados existentes
      const strategies: AIStrategy[] = [];

      // Estratégia 1: Análise de Oportunidades Paradas
      const stalledOpportunities = opportunities.filter(opp => {
        const lastUpdate = new Date(opp.updated_at || opp.created_at!);
        const daysSinceUpdate = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceUpdate > 7 && opp.status !== 'won' && opp.status !== 'lost';
      });

      if (stalledOpportunities.length > 0) {
        strategies.push({
          id: 'stalled-opportunities',
          type: 'sales',
          title: 'Reativar Oportunidades Paradas',
          description: `${stalledOpportunities.length} oportunidades estão paradas há mais de 7 dias. Ação imediata pode aumentar a taxa de conversão.`,
          priority: stalledOpportunities.length > 5 ? 'high' : 'medium',
          impact: `Potencial de recuperar R$ ${stalledOpportunities.reduce((sum, opp) => sum + (opp.value || 0), 0).toLocaleString('pt-BR')}`,
          actionItems: [
            'Entrar em contato com leads parados',
            'Revisar propostas enviadas',
            'Oferecer desconto estratégico',
            'Agendar reunião de follow-up'
          ],
          dataSource: 'Análise do pipeline comercial',
          confidence: 0.85,
          estimatedROI: '15-30%'
        });
      }

      // Estratégia 2: Análise Financeira
      const overdueEntries = entries.filter(entry => entry.status === 'overdue');
      const pendingEntries = entries.filter(entry => entry.status === 'pending');
      
      if (overdueEntries.length > 0 || pendingEntries.length > 10) {
        strategies.push({
          id: 'financial-management',
          type: 'financial',
          title: 'Otimizar Fluxo de Caixa',
          description: `${overdueEntries.length} movimentações vencidas e ${pendingEntries.length} pendentes requerem atenção imediata.`,
          priority: overdueEntries.length > 5 ? 'urgent' : 'high',
          impact: `Melhorar cashflow em R$ ${[...overdueEntries, ...pendingEntries].reduce((sum, entry) => sum + (entry.amount || 0), 0).toLocaleString('pt-BR')}`,
          actionItems: [
            'Cobrar movimentações vencidas',
            'Renegociar prazos de pagamento',
            'Implementar desconto por pagamento antecipado',
            'Automatizar lembretes de cobrança'
          ],
          dataSource: 'Análise do módulo financeiro',
          confidence: 0.92,
          estimatedROI: '20-40%'
        });
      }

      // Estratégia 3: Análise de Clientes
      const inactiveClients = clients.filter(client => {
        const hasRecentOpportunity = opportunities.some(opp => 
          opp.client_id === client.id && 
          new Date(opp.created_at!).getTime() > Date.now() - (90 * 24 * 60 * 60 * 1000)
        );
        return !hasRecentOpportunity;
      });

      if (inactiveClients.length > 0) {
        strategies.push({
          id: 'client-reactivation',
          type: 'marketing',
          title: 'Reativar Clientes Inativos',
          description: `${inactiveClients.length} clientes não têm oportunidades nos últimos 90 dias. Campanha de reativação pode gerar novos negócios.`,
          priority: 'medium',
          impact: `Potencial de gerar 20-30% de novos negócios`,
          actionItems: [
            'Criar campanha de e-mail marketing',
            'Oferecer promoções especiais',
            'Agendar calls de relacionamento',
            'Pesquisa de satisfação'
          ],
          dataSource: 'Análise de comportamento dos clientes',
          confidence: 0.75,
          estimatedROI: '10-25%'
        });
      }

      // Estratégia 4: Análise de Produtividade
      const overdueTasks = tasks.filter(task => 
        task.due_date && 
        new Date(task.due_date) < new Date() && 
        task.status !== 'completed'
      );

      if (overdueTasks.length > 0) {
        strategies.push({
          id: 'productivity-optimization',
          type: 'operational',
          title: 'Otimizar Produtividade da Equipe',
          description: `${overdueTasks.length} tarefas em atraso indicam gargalos operacionais que podem impactar resultados.`,
          priority: overdueTasks.length > 10 ? 'high' : 'medium',
          impact: `Aumentar eficiência operacional em 15-25%`,
          actionItems: [
            'Revisar cargas de trabalho',
            'Redistribuir tarefas prioritárias',
            'Implementar automações',
            'Treinamento da equipe'
          ],
          dataSource: 'Análise de tarefas e produtividade',
          confidence: 0.80,
          estimatedROI: '15-30%'
        });
      }

      // Estratégia 5: Análise Sazonal (baseada na data atual)
      const currentMonth = new Date().getMonth();
      const isEndOfYear = currentMonth >= 10; // Nov-Dez
      const isBeginningOfYear = currentMonth <= 1; // Jan-Fev

      if (isEndOfYear) {
        strategies.push({
          id: 'year-end-strategy',
          type: 'sales',
          title: 'Estratégia de Fim de Ano',
          description: 'Aproveitar o período de fim de ano para acelerar fechamentos e preparar o próximo ano.',
          priority: 'high',
          impact: 'Potencial de acelerar 30-40% dos fechamentos',
          actionItems: [
            'Oferecer descontos de fim de ano',
            'Acelerar propostas em andamento',
            'Planejar metas para o próximo ano',
            'Campanha de Black Friday/Natal'
          ],
          dataSource: 'Análise sazonal de mercado',
          confidence: 0.88,
          estimatedROI: '25-45%'
        });
      }

      if (isBeginningOfYear) {
        strategies.push({
          id: 'new-year-strategy',
          type: 'marketing',
          title: 'Estratégia de Início de Ano',
          description: 'Aproveitar o momento de renovação para atrair novos clientes e expandir negócios.',
          priority: 'high',
          impact: 'Potencial de aumentar base de clientes em 20-30%',
          actionItems: [
            'Campanhas de "Novo Ano, Novos Negócios"',
            'Prospecção ativa de novos mercados',
            'Lançar novos produtos/serviços',
            'Networking e eventos'
          ],
          dataSource: 'Análise sazonal de mercado',
          confidence: 0.82,
          estimatedROI: '20-35%'
        });
      }

      return strategies.sort((a, b) => {
        const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const strategiesQuery = useQuery({
    queryKey: ['ai-strategies', clients.length, opportunities.length, entries.length, tasks.length],
    queryFn: generateStrategies,
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled: clients.length > 0 || opportunities.length > 0 || entries.length > 0 || tasks.length > 0,
  });

  return {
    strategies: strategiesQuery.data || [],
    isLoading: strategiesQuery.isLoading || isGenerating,
    isError: strategiesQuery.isError,
    refetch: strategiesQuery.refetch,
  };
};
