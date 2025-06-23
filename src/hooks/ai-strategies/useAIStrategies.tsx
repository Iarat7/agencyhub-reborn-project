
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useClients } from '../useClients';
import { useOpportunities } from '../useOpportunities';
import { useFinancialEntries } from '../useFinancialEntries';
import { useTasks } from '../useTasks';
import { useAdvancedMetrics } from './useAdvancedMetrics';
import { AIStrategy } from './types';
import {
  generatePipelineStrategy,
  generateFinancialStrategy,
  generateRetentionStrategy,
  generateProductivityStrategy,
  generateSeasonalStrategy,
  generateCompetitiveStrategy
} from './strategyGenerators';

export const useAIStrategies = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { data: clients = [] } = useClients();
  const { data: opportunities = [] } = useOpportunities();
  const { entries } = useFinancialEntries();
  const { data: tasks = [] } = useTasks();

  const metrics = useAdvancedMetrics({ clients, opportunities });

  const generateAdvancedStrategies = async (): Promise<AIStrategy[]> => {
    setIsGenerating(true);
    
    try {
      const strategies: AIStrategy[] = [];

      console.log('Advanced metrics calculated:', metrics);

      // Generate different types of strategies
      const pipelineStrategy = generatePipelineStrategy(opportunities, metrics);
      if (pipelineStrategy) strategies.push(pipelineStrategy);

      const financialStrategy = generateFinancialStrategy(entries, metrics);
      if (financialStrategy) strategies.push(financialStrategy);

      const retentionStrategy = generateRetentionStrategy(clients, opportunities, metrics);
      if (retentionStrategy) strategies.push(retentionStrategy);

      const productivityStrategy = generateProductivityStrategy(tasks, metrics);
      if (productivityStrategy) strategies.push(productivityStrategy);

      const seasonalStrategy = generateSeasonalStrategy(opportunities, metrics);
      if (seasonalStrategy) strategies.push(seasonalStrategy);

      const competitiveStrategy = generateCompetitiveStrategy(metrics);
      if (competitiveStrategy) strategies.push(competitiveStrategy);

      // Sort by urgency score and impact
      return strategies.sort((a, b) => {
        const scoreA = a.urgencyScore + (a.potentialRevenue || 0) / 10000;
        const scoreB = b.urgencyScore + (b.potentialRevenue || 0) / 10000;
        return scoreB - scoreA;
      }).slice(0, 5); // Top 5 strategies

    } finally {
      setIsGenerating(false);
    }
  };

  const strategiesQuery = useQuery({
    queryKey: ['ai-strategies-advanced', clients.length, opportunities.length, entries.length, tasks.length],
    queryFn: generateAdvancedStrategies,
    staleTime: 3 * 60 * 1000, // 3 minutes
    enabled: clients.length > 0 || opportunities.length > 0 || entries.length > 0 || tasks.length > 0,
  });

  return {
    strategies: strategiesQuery.data || [],
    isLoading: strategiesQuery.isLoading || isGenerating,
    isError: strategiesQuery.isError,
    refetch: strategiesQuery.refetch,
    metrics: strategiesQuery.data ? metrics : null,
  };
};
