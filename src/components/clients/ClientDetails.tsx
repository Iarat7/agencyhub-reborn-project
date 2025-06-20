
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useClientTasks, useClientOpportunities } from '@/hooks/useReports';
import { Target, CheckSquare, Plus, Calendar, DollarSign } from 'lucide-react';
import type { Client } from '@/services/api/types';

interface ClientDetailsProps {
  client: Client;
  onCreateTask?: () => void;
  onCreateOpportunity?: () => void;
}

export const ClientDetails = ({ client, onCreateTask, onCreateOpportunity }: ClientDetailsProps) => {
  const { data: tasks, isLoading: tasksLoading } = useClientTasks(client.id);
  const { data: opportunities, isLoading: opportunitiesLoading } = useClientOpportunities(client.id);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'in_progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'prospection': 'bg-gray-100 text-gray-800',
      'qualification': 'bg-blue-100 text-blue-800',
      'proposal': 'bg-orange-100 text-orange-800',
      'negotiation': 'bg-purple-100 text-purple-800',
      'closed_won': 'bg-green-100 text-green-800',
      'closed_lost': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Informações do Cliente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Informações do Cliente
            <Badge className={getStatusColor(client.status || 'active')}>
              {client.status === 'active' ? 'Ativo' : 
               client.status === 'inactive' ? 'Inativo' : 'Prospect'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Nome</label>
              <p className="text-sm">{client.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Empresa</label>
              <p className="text-sm">{client.company || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-sm">{client.email || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Telefone</label>
              <p className="text-sm">{client.phone || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Segmento</label>
              <p className="text-sm">{client.segment || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Valor Mensal</label>
              <p className="text-sm">{client.monthly_value ? formatCurrency(client.monthly_value) : 'N/A'}</p>
            </div>
          </div>
          {client.observations && (
            <div>
              <label className="text-sm font-medium text-gray-600">Observações</label>
              <p className="text-sm mt-1">{client.observations}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Oportunidades */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Oportunidades
            </div>
            <Button size="sm" onClick={onCreateOpportunity}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Oportunidade
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {opportunitiesLoading ? (
            <p className="text-sm text-gray-500">Carregando oportunidades...</p>
          ) : opportunities?.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhuma oportunidade encontrada</p>
          ) : (
            <div className="space-y-3">
              {opportunities?.map((opportunity) => (
                <div key={opportunity.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{opportunity.title}</h4>
                    <Badge className={getStatusColor(opportunity.stage || '')}>
                      {opportunity.stage === 'prospection' ? 'Prospecção' :
                       opportunity.stage === 'qualification' ? 'Qualificação' :
                       opportunity.stage === 'proposal' ? 'Proposta' :
                       opportunity.stage === 'negotiation' ? 'Negociação' :
                       opportunity.stage === 'closed_won' ? 'Ganhou' :
                       opportunity.stage === 'closed_lost' ? 'Perdeu' : opportunity.stage}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    {opportunity.value && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {formatCurrency(opportunity.value)}
                      </div>
                    )}
                    {opportunity.expected_close_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(opportunity.expected_close_date).toLocaleDateString('pt-BR')}
                      </div>
                    )}
                    {opportunity.probability && (
                      <span>{opportunity.probability}% probabilidade</span>
                    )}
                  </div>
                  {opportunity.description && (
                    <p className="text-sm text-gray-600 mt-2">{opportunity.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tarefas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Tarefas
            </div>
            <Button size="sm" onClick={onCreateTask}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Tarefa
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tasksLoading ? (
            <p className="text-sm text-gray-500">Carregando tarefas...</p>
          ) : tasks?.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhuma tarefa encontrada</p>
          ) : (
            <div className="space-y-3">
              {tasks?.map((task) => (
                <div key={task.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{task.title}</h4>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(task.status || '')}>
                        {task.status === 'pending' ? 'Pendente' :
                         task.status === 'in_progress' ? 'Em Progresso' :
                         task.status === 'in_approval' ? 'Em Aprovação' :
                         task.status === 'completed' ? 'Concluída' : task.status}
                      </Badge>
                      <Badge variant="outline">
                        {task.priority === 'low' ? 'Baixa' :
                         task.priority === 'medium' ? 'Média' :
                         task.priority === 'high' ? 'Alta' :
                         task.priority === 'urgent' ? 'Urgente' : task.priority}
                      </Badge>
                    </div>
                  </div>
                  {task.due_date && (
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                      <Calendar className="h-3 w-3" />
                      Prazo: {new Date(task.due_date).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                  {task.description && (
                    <p className="text-sm text-gray-600">{task.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
