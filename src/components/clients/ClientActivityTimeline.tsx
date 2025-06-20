
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, CheckSquare, Calendar, Plus } from 'lucide-react';
import { Client, Opportunity, Task, Event } from '@/services/api/types';
import { format, compareDesc } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ClientActivityTimelineProps {
  client: Client;
  opportunities: Opportunity[];
  tasks: Task[];
  events: Event[];
}

interface TimelineItem {
  id: string;
  type: 'opportunity' | 'task' | 'event';
  title: string;
  description?: string;
  date: Date;
  status?: string;
  icon: React.ReactNode;
  color: string;
}

export const ClientActivityTimeline = ({ client, opportunities, tasks, events }: ClientActivityTimelineProps) => {
  // Criar itens da timeline
  const timelineItems: TimelineItem[] = [
    ...opportunities.map(opp => ({
      id: opp.id,
      type: 'opportunity' as const,
      title: opp.title,
      description: opp.description,
      date: new Date(opp.created_at!),
      status: opp.stage,
      icon: <Target className="h-4 w-4" />,
      color: 'blue'
    })),
    ...tasks.map(task => ({
      id: task.id,
      type: 'task' as const,
      title: task.title,
      description: task.description,
      date: new Date(task.created_at!),
      status: task.status,
      icon: <CheckSquare className="h-4 w-4" />,
      color: task.status === 'completed' ? 'green' : task.status === 'pending' ? 'yellow' : 'blue'
    })),
    ...events.map(event => ({
      id: event.id,
      type: 'event' as const,
      title: event.title,
      description: event.description,
      date: new Date(event.start_date),
      icon: <Calendar className="h-4 w-4" />,
      color: 'purple'
    }))
  ];

  // Ordenar por data (mais recente primeiro)
  const sortedItems = timelineItems.sort((a, b) => compareDesc(a.date, b.date));

  const getStatusLabel = (item: TimelineItem) => {
    if (item.type === 'opportunity') {
      const stageMap: Record<string, string> = {
        prospection: 'Prospecção',
        qualification: 'Qualificação', 
        proposal: 'Proposta',
        negotiation: 'Negociação',
        closed_won: 'Fechada (Ganha)',
        closed_lost: 'Fechada (Perdida)'
      };
      return stageMap[item.status || ''] || item.status;
    }
    
    if (item.type === 'task') {
      const statusMap: Record<string, string> = {
        pending: 'Pendente',
        in_progress: 'Em Andamento',
        completed: 'Concluída',
        in_approval: 'Em Aprovação'
      };
      return statusMap[item.status || ''] || item.status;
    }
    
    return null;
  };

  const getStatusColor = (item: TimelineItem) => {
    if (item.type === 'opportunity') {
      if (item.status === 'closed_won') return 'bg-green-100 text-green-800';
      if (item.status === 'closed_lost') return 'bg-red-100 text-red-800';
      return 'bg-blue-100 text-blue-800';
    }
    
    if (item.type === 'task') {
      if (item.status === 'completed') return 'bg-green-100 text-green-800';
      if (item.status === 'pending') return 'bg-yellow-100 text-yellow-800';
      return 'bg-blue-100 text-blue-800';
    }
    
    return 'bg-purple-100 text-purple-800';
  };

  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      opportunity: 'Oportunidade',
      task: 'Tarefa',
      event: 'Evento'
    };
    return typeMap[type] || type;
  };

  if (sortedItems.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Linha do Tempo de Atividades</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Plus className="h-12 w-12 mx-auto mb-4 text-slate-300" />
          <p className="text-slate-600">Nenhuma atividade registrada ainda</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Linha do Tempo de Atividades</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedItems.map((item, index) => (
            <div key={item.id} className="flex gap-4">
              {/* Linha e ícone */}
              <div className="flex flex-col items-center">
                <div className={`p-2 rounded-full bg-${item.color}-100 text-${item.color}-600`}>
                  {item.icon}
                </div>
                {index < sortedItems.length - 1 && (
                  <div className="w-px h-12 bg-slate-200 mt-2" />
                )}
              </div>
              
              {/* Conteúdo */}
              <div className="flex-1 min-w-0 pb-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-slate-900 truncate">{item.title}</h4>
                    {item.description && (
                      <p className="text-sm text-slate-600 mt-1 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 ml-4">
                    <span className="text-xs text-slate-500 whitespace-nowrap">
                      {format(item.date, 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {getTypeLabel(item.type)}
                    </Badge>
                  </div>
                </div>
                
                {item.status && (
                  <Badge className={`text-xs ${getStatusColor(item)}`}>
                    {getStatusLabel(item)}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
