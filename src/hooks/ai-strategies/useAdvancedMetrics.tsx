
import { useMemo } from 'react';
import { AdvancedMetrics } from './types';

interface UseAdvancedMetricsProps {
  clients: any[];
  opportunities: any[];
}

export const useAdvancedMetrics = ({ clients, opportunities }: UseAdvancedMetricsProps) => {
  return useMemo((): AdvancedMetrics => {
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
  }, [clients, opportunities]);
};
