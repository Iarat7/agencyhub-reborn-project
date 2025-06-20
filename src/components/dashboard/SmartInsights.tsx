
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Users, Target, Calendar, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SmartInsightsProps {
  insights?: Array<{
    id: string;
    type: 'opportunity' | 'risk' | 'recommendation' | 'trend';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    confidence: number;
    actionable: boolean;
  }>;
}

export const SmartInsights = ({ insights = [] }: SmartInsightsProps) => {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'risk': return <Target className="h-4 w-4 text-red-500" />;
      case 'recommendation': return <Lightbulb className="h-4 w-4 text-blue-500" />;
      case 'trend': return <Calendar className="h-4 w-4 text-purple-500" />;
      default: return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'opportunity': return 'Oportunidade';
      case 'risk': return 'Risco';
      case 'recommendation': return 'Recomendação';
      case 'trend': return 'Tendência';
      default: return 'Insight';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Insights Inteligentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {insights.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Analisando dados para gerar insights...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {insights.map((insight) => (
              <div key={insight.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getInsightIcon(insight.type)}
                    <span className="font-medium">{insight.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getImpactColor(insight.impact)}>
                      {insight.impact === 'high' ? 'Alto' : insight.impact === 'medium' ? 'Médio' : 'Baixo'} Impacto
                    </Badge>
                    <Badge variant="outline">
                      {getTypeLabel(insight.type)}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {insight.description}
                </p>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Confiança: {insight.confidence}%
                  </span>
                  {insight.actionable && (
                    <Badge variant="outline" className="text-xs">
                      Ação recomendada
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
