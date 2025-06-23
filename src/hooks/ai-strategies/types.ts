
export interface AIStrategy {
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

export interface AdvancedMetrics {
  clientHealthScore: number;
  pipelineVelocity: number;
  churnRisk: number;
  growthTrend: number;
  seasonalImpact: number;
  competitivePosition: number;
}
