
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, CheckSquare, Calendar, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { Client, Opportunity, Task, Event } from '@/services/api/types';

interface ClientMetricsCardsProps {
  client: Client;
  opportunities: Opportunity[];
  tasks: Task[];
  events: Event[];
}

export const ClientMetricsCards = ({ client, opportunities, tasks, events }: ClientMetricsCardsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Métricas de oportunidades
  const totalOpportunityValue = opportunities.reduce((sum, opp) => sum + (opp.value || 0), 0);
  const activeOpportunities = opportunities.filter(opp => !['closed_won', 'closed_lost'].includes(opp.stage));
  const wonOpportunities = opportunities.filter(opp => opp.stage === 'closed_won');
  const conversionRate = opportunities.length > 0 ? (wonOpportunities.length / opportunities.length) * 100 : 0;

  // Métricas de tarefas
  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const overdueTasks = tasks.filter(task => 
    task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed'
  );
  const completedTasks = tasks.filter(task => task.status === 'completed');
  const taskCompletionRate = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;

  // Próximos eventos
  const upcomingEvents = events.filter(event => 
    new Date(event.start_date) > new Date()
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pipeline Ativo</CardTitle>
          <Target className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-900">{formatCurrency(totalOpportunityValue)}</div>
          <p className="text-xs text-blue-700 mt-1">
            {activeOpportunities.length} oportunidade{activeOpportunities.length !== 1 ? 's' : ''} ativa{activeOpportunities.length !== 1 ? 's' : ''}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-900">{conversionRate.toFixed(1)}%</div>
          <p className="text-xs text-green-700 mt-1">
            {wonOpportunities.length} de {opportunities.length} oportunidades
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tarefas</CardTitle>
          <CheckSquare className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-900">{pendingTasks.length}</div>
          <p className="text-xs text-orange-700 mt-1">
            {overdueTasks.length > 0 && (
              <span className="text-red-600 font-medium">
                {overdueTasks.length} vencida{overdueTasks.length !== 1 ? 's' : ''}
              </span>
            )}
            {overdueTasks.length === 0 && 'Todas em dia'}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Próximos Eventos</CardTitle>
          <Calendar className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-900">{upcomingEvents}</div>
          <p className="text-xs text-purple-700 mt-1">
            Agendados
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
