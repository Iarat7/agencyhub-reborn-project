import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { useAIStrategies } from '@/hooks/ai-strategies/useAIStrategies';

export const AIStrategiesCard = () => {
  const { strategies, isLoading, refetch } = useAIStrategies();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <AlertTriangle className="w-4 h-4" />;
      case 'high': return <TrendingUp className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'marketing': return '📢';
      case 'sales': return '💰';
      case 'financial': return '📊';
      case 'operational': return '⚙️';
      default: return '💡';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Estratégias Inteligentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="w-6 h-6 animate-spin mr-2" />
            <span>Analisando dados e gerando estratégias...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Estratégias Inteligentes
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {strategies.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma estratégia identificada no momento.</p>
            <p className="text-sm">Continue operando para gerar insights.</p>
          </div>
        ) : (
          strategies.slice(0, 3).map((strategy) => (
            <div key={strategy.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getTypeIcon(strategy.type)}</span>
                  <h4 className="font-semibold text-sm">{strategy.title}</h4>
                </div>
                <Badge variant={getPriorityColor(strategy.priority)} className="text-xs">
                  {getPriorityIcon(strategy.priority)}
                  {strategy.priority.toUpperCase()}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground">{strategy.description}</p>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-green-600 font-medium">{strategy.impact}</span>
                <span className="text-muted-foreground">
                  Confiança: {Math.round(strategy.confidence * 100)}%
                </span>
              </div>
              
              {strategy.estimatedROI && (
                <div className="text-xs text-blue-600 font-medium">
                  ROI Estimado: {strategy.estimatedROI}
                </div>
              )}
              
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Ações Sugeridas:</p>
                <ul className="text-xs space-y-1">
                  {strategy.actionItems.slice(0, 2).map((action, index) => (
                    <li key={index} className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      {action}
                    </li>
                  ))}
                  {strategy.actionItems.length > 2 && (
                    <li className="text-muted-foreground">
                      +{strategy.actionItems.length - 2} ações adicionais
                    </li>
                  )}
                </ul>
              </div>
            </div>
          ))
        )}
        
        {strategies.length > 3 && (
          <div className="text-center pt-2">
            <Button variant="ghost" size="sm">
              Ver todas as {strategies.length} estratégias
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
