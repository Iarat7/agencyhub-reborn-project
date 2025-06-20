
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target, DollarSign, Calendar, Users, Percent } from 'lucide-react';
import { Opportunity } from '@/services/api/types';

interface OpportunityMetricsProps {
  opportunities: Opportunity[];
}

export const OpportunityMetrics = ({ opportunities }: OpportunityMetricsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Métricas gerais
  const totalValue = opportunities.reduce((sum, opp) => sum + (opp.value || 0), 0);
  const activeOpportunities = opportunities.filter(opp => !['closed_won', 'closed_lost'].includes(opp.stage));
  const wonOpportunities = opportunities.filter(opp => opp.stage === 'closed_won');
  const lostOpportunities = opportunities.filter(opp => opp.stage === 'closed_lost');
  
  const conversionRate = opportunities.length > 0 ? (wonOpportunities.length / opportunities.length) * 100 : 0;
  const avgDealSize = wonOpportunities.length > 0 ? 
    wonOpportunities.reduce((sum, opp) => sum + (opp.value || 0), 0) / wonOpportunities.length : 0;

  // Métricas por estágio
  const stageMetrics = {
    prospection: opportunities.filter(o => o.stage === 'prospection').length,
    qualification: opportunities.filter(o => o.stage === 'qualification').length,
    proposal: opportunities.filter(o => o.stage === 'proposal').length,
    negotiation: opportunities.filter(o => o.stage === 'negotiation').length,
  };

  const totalActiveValue = activeOpportunities.reduce((sum, opp) => sum + (opp.value || 0), 0);
  const wonValue = wonOpportunities.reduce((sum, opp) => sum + (opp.value || 0), 0);

  // Oportunidades próximas do vencimento (próximos 30 dias)
  const upcomingDeadlines = opportunities.filter(opp => {
    if (!opp.expected_close_date || ['closed_won', 'closed_lost'].includes(opp.stage)) return false;
    const closeDate = new Date(opp.expected_close_date);
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
    return closeDate <= thirtyDaysFromNow && closeDate >= today;
  }).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pipeline Total</CardTitle>
          <DollarSign className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900">{formatCurrency(totalValue)}</div>
          <p className="text-xs text-blue-700 mt-1">
            {opportunities.length} oportunidade{opportunities.length !== 1 ? 's' : ''}
          </p>
          <div className="mt-2">
            <div className="flex justify-between text-xs text-blue-700 mb-1">
              <span>Ativo: {formatCurrency(totalActiveValue)}</span>
              <span>Ganho: {formatCurrency(wonValue)}</span>
            </div>
            <Progress 
              value={totalValue > 0 ? (wonValue / totalValue) * 100 : 0} 
              className="h-2 bg-blue-200" 
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
          <Percent className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900">{conversionRate.toFixed(1)}%</div>
          <p className="text-xs text-green-700 mt-1">
            {wonOpportunities.length} ganhas, {lostOpportunities.length} perdidas
          </p>
          <div className="mt-2">
            <Progress value={conversionRate} className="h-2 bg-green-200" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
          <TrendingUp className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-900">{formatCurrency(avgDealSize)}</div>
          <p className="text-xs text-orange-700 mt-1">
            Por oportunidade fechada
          </p>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span>Negociação: {stageMetrics.negotiation}</span>
              <span>Proposta: {stageMetrics.proposal}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Prazos Próximos</CardTitle>
          <Calendar className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900">{upcomingDeadlines}</div>
          <p className="text-xs text-purple-700 mt-1">
            Próximos 30 dias
          </p>
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span>Qualif.: {stageMetrics.qualification}</span>
              <span>Prosp.: {stageMetrics.prospection}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
