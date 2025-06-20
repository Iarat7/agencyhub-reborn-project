
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  CheckSquare, 
  Target,
  Phone,
  Mail,
  Building,
  Plus,
  Activity,
  BarChart3
} from 'lucide-react';
import { Client } from '@/services/api/types';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useTasks } from '@/hooks/useTasks';
import { useEvents } from '@/hooks/useEvents';
import { ClientMetricsCards } from './ClientMetricsCards';
import { ClientActivityTimeline } from './ClientActivityTimeline';
import { ClientOpportunityChart } from './ClientOpportunityChart';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ClientDetailsProps {
  client: Client;
  onCreateTask: () => void;
  onCreateOpportunity: () => void;
}

export const ClientDetails = ({ client, onCreateTask, onCreateOpportunity }: ClientDetailsProps) => {
  const { data: allOpportunities = [] } = useOpportunities();
  const { data: allTasks = [] } = useTasks();
  const { data: allEvents = [] } = useEvents();

  // Filtrar dados do cliente
  const clientOpportunities = allOpportunities.filter(opp => opp.client_id === client.id);
  const clientTasks = allTasks.filter(task => task.client_id === client.id);
  const clientEvents = allEvents.filter(event => event.client_id === client.id);

  // Calcular métricas
  const totalOpportunityValue = clientOpportunities.reduce((sum, opp) => sum + (opp.value || 0), 0);
  const wonOpportunities = clientOpportunities.filter(opp => opp.stage === 'closed_won');
  const totalWonValue = wonOpportunities.reduce((sum, opp) => sum + (opp.value || 0), 0);
  const pendingTasks = clientTasks.filter(task => task.status === 'pending').length;
  const completedTasks = clientTasks.filter(task => task.status === 'completed').length;
  const taskCompletionRate = clientTasks.length > 0 ? (completedTasks / clientTasks.length) * 100 : 0;

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      prospect: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status as keyof typeof colors] || colors.active;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header do Cliente */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <CardTitle className="text-2xl">{client.name}</CardTitle>
                <Badge className={getStatusColor(client.status || 'active')}>
                  {client.status === 'active' ? 'Ativo' : 
                   client.status === 'inactive' ? 'Inativo' : 'Prospect'}
                </Badge>
              </div>
              {client.company && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Building className="h-4 w-4" />
                  <span>{client.company}</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button onClick={onCreateTask} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nova Tarefa
              </Button>
              <Button onClick={onCreateOpportunity} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nova Oportunidade
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {client.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-500" />
                <span className="text-sm">{client.email}</span>
              </div>
            )}
            {client.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-500" />
                <span className="text-sm">{client.phone}</span>
              </div>
            )}
            {client.segment && (
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-slate-500" />
                <span className="text-sm">{client.segment}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Métricas do Cliente */}
      <ClientMetricsCards 
        client={client}
        opportunities={clientOpportunities}
        tasks={clientTasks}
        events={clientEvents}
      />

      {/* Abas de Detalhes */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="opportunities" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Oportunidades ({clientOpportunities.length})
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4" />
            Tarefas ({clientTasks.length})
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Atividades
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ClientOpportunityChart opportunities={clientOpportunities} />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resumo Financeiro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Pipeline Total</span>
                    <span className="font-medium">{formatCurrency(totalOpportunityValue)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Receita Fechada</span>
                    <span className="font-medium text-green-600">{formatCurrency(totalWonValue)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Valor Mensal</span>
                    <span className="font-medium">{formatCurrency(client.monthly_value || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Taxa de Conclusão</span>
                    <span className="font-medium">{taskCompletionRate.toFixed(1)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-4">
          {clientOpportunities.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Target className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <p className="text-slate-600 mb-4">Nenhuma oportunidade encontrada</p>
                <Button onClick={onCreateOpportunity}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar primeira oportunidade
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {clientOpportunities.map((opportunity) => (
                <Card key={opportunity.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{opportunity.title}</h4>
                        <p className="text-sm text-slate-600">{opportunity.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">
                          {formatCurrency(opportunity.value || 0)}
                        </p>
                        <p className="text-sm text-slate-600">{opportunity.probability}%</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">
                        {opportunity.stage === 'prospection' ? 'Prospecção' :
                         opportunity.stage === 'qualification' ? 'Qualificação' :
                         opportunity.stage === 'proposal' ? 'Proposta' :
                         opportunity.stage === 'negotiation' ? 'Negociação' :
                         opportunity.stage === 'closed_won' ? 'Fechada (Ganha)' :
                         'Fechada (Perdida)'}
                      </Badge>
                      {opportunity.expected_close_date && (
                        <span className="text-sm text-slate-600">
                          {format(new Date(opportunity.expected_close_date), 'dd/MM/yyyy', { locale: ptBR })}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          {clientTasks.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <CheckSquare className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <p className="text-slate-600 mb-4">Nenhuma tarefa encontrada</p>
                <Button onClick={onCreateTask}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar primeira tarefa
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {clientTasks.map((task) => (
                <Card key={task.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{task.title}</h4>
                        <p className="text-sm text-slate-600">{task.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={task.status === 'completed' ? 'default' : 'outline'}>
                          {task.status === 'pending' ? 'Pendente' :
                           task.status === 'in_progress' ? 'Em Andamento' :
                           task.status === 'completed' ? 'Concluída' : 'Em Aprovação'}
                        </Badge>
                        <Badge variant="outline">
                          {task.priority === 'low' ? 'Baixa' :
                           task.priority === 'medium' ? 'Média' :
                           task.priority === 'high' ? 'Alta' : 'Urgente'}
                        </Badge>
                      </div>
                    </div>
                    {task.due_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        <span className="text-sm text-slate-600">
                          {format(new Date(task.due_date), 'dd/MM/yyyy', { locale: ptBR })}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <ClientActivityTimeline 
            client={client}
            opportunities={clientOpportunities}
            tasks={clientTasks}
            events={clientEvents}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
