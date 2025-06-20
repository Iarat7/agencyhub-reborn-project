
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Target, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PredictiveAnalyticsProps {
  metrics?: {
    predictedRevenue: number;
    revenueTarget: number;
    probabilityToTarget: number;
    trends: {
      clientGrowth: number;
      conversionTrend: number;
      salesVelocity: number;
    };
    alerts: Array<{
      type: 'warning' | 'error' | 'info';
      message: string;
      priority: 'high' | 'medium' | 'low';
    }>;
  };
}

export const PredictiveAnalytics = ({ metrics }: PredictiveAnalyticsProps) => {
  if (!metrics) return null;

  const { predictedRevenue, revenueTarget, probabilityToTarget, trends, alerts } = metrics;
  const targetProgress = (predictedRevenue / revenueTarget) * 100;

  const getTrendIcon = (value: number) => {
    return value > 0 ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  const getTrendColor = (value: number) => {
    if (value > 5) return 'text-green-600';
    if (value < -5) return 'text-red-600';
    return 'text-yellow-600';
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Previsão de Receita */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Previsão de Receita</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {predictedRevenue.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">
              Meta: R$ {revenueTarget.toLocaleString('pt-BR')}
            </p>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Progresso da Meta</span>
                <span>{targetProgress.toFixed(1)}%</span>
              </div>
              <Progress value={Math.min(targetProgress, 100)} className="h-2" />
            </div>
            <div className="mt-2">
              <Badge variant={probabilityToTarget > 70 ? 'default' : 'secondary'}>
                {probabilityToTarget}% de probabilidade
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Tendências */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Análise de Tendências</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Crescimento de Clientes</span>
              <div className="flex items-center gap-1">
                {getTrendIcon(trends.clientGrowth)}
                <span className={`text-sm ${getTrendColor(trends.clientGrowth)}`}>
                  {trends.clientGrowth > 0 ? '+' : ''}{trends.clientGrowth.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Taxa de Conversão</span>
              <div className="flex items-center gap-1">
                {getTrendIcon(trends.conversionTrend)}
                <span className={`text-sm ${getTrendColor(trends.conversionTrend)}`}>
                  {trends.conversionTrend > 0 ? '+' : ''}{trends.conversionTrend.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Velocidade de Vendas</span>
              <div className="flex items-center gap-1">
                {getTrendIcon(trends.salesVelocity)}
                <span className={`text-sm ${getTrendColor(trends.salesVelocity)}`}>
                  {trends.salesVelocity > 0 ? '+' : ''}{trends.salesVelocity.toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alertas Inteligentes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Alertas Inteligentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {alerts.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum alerta no momento</p>
            ) : (
              alerts.slice(0, 3).map((alert, index) => (
                <div key={index} className="flex items-start gap-2 p-2 rounded-md bg-muted/30">
                  <Badge 
                    variant={alert.type === 'error' ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {alert.priority}
                  </Badge>
                  <p className="text-xs flex-1">{alert.message}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
