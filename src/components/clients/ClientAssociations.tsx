
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckSquare, Calendar, Plus, Eye } from 'lucide-react';
import { Task, Event, Client } from '@/services/api/types';
import { useTasks } from '@/hooks/useTasks';
import { useEvents } from '@/hooks/useEvents';
import { TaskDialog } from '@/components/tasks/TaskDialog';
import { EventDialog } from '@/components/calendar/EventDialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ClientAssociationsProps {
  client: Client;
}

export const ClientAssociations = ({ client }: ClientAssociationsProps) => {
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const { data: allTasks = [] } = useTasks();
  const { data: allEvents = [] } = useEvents();

  // Filtrar tarefas e eventos do cliente
  const clientTasks = allTasks.filter(task => task.client_id === client.id);
  const clientEvents = allEvents.filter(event => event.client_id === client.id);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'in_progress': 'bg-blue-100 text-blue-800',
      'in_approval': 'bg-purple-100 text-purple-800',
      'completed': 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'low': 'bg-gray-100 text-gray-800',
      'medium': 'bg-blue-100 text-blue-800',
      'high': 'bg-orange-100 text-orange-800',
      'urgent': 'bg-red-100 text-red-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'meeting': 'bg-blue-100 text-blue-800',
      'call': 'bg-green-100 text-green-800',
      'deadline': 'bg-red-100 text-red-800',
      'reminder': 'bg-yellow-100 text-yellow-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      'pending': 'Pendente',
      'in_progress': 'Em Andamento',
      'in_approval': 'Em Aprovação',
      'completed': 'Concluída',
    };
    return statusMap[status] || status;
  };

  const formatPriority = (priority: string) => {
    const priorityMap: Record<string, string> = {
      'low': 'Baixa',
      'medium': 'Média',
      'high': 'Alta',
      'urgent': 'Urgente',
    };
    return priorityMap[priority] || priority;
  };

  const formatEventType = (type: string) => {
    const typeMap: Record<string, string> = {
      'meeting': 'Reunião',
      'call': 'Chamada',
      'deadline': 'Prazo',
      'reminder': 'Lembrete',
    };
    return typeMap[type] || type;
  };

  const handleNewTask = () => {
    setSelectedTask(null);
    setTaskDialogOpen(true);
  };

  const handleNewEvent = () => {
    setSelectedEvent(null);
    setEventDialogOpen(true);
  };

  const handleViewTask = (task: Task) => {
    setSelectedTask(task);
    setTaskDialogOpen(true);
  };

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setEventDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Tarefas e Eventos - {client.name}</span>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleNewTask}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Tarefa
            </Button>
            <Button size="sm" onClick={handleNewEvent}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Evento
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              Tarefas ({clientTasks.length})
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Eventos ({clientEvents.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-4 mt-4">
            {clientTasks.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhuma tarefa associada a este cliente</p>
                <Button className="mt-4" onClick={handleNewTask}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar primeira tarefa
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {clientTasks.map((task) => (
                  <div key={task.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-lg">{task.title}</h4>
                      <Button size="sm" variant="outline" onClick={() => handleViewTask(task)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Ver
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={getStatusColor(task.status || '')}>
                        {formatStatus(task.status || '')}
                      </Badge>
                      <Badge variant="outline" className={getPriorityColor(task.priority || '')}>
                        {formatPriority(task.priority || '')}
                      </Badge>
                    </div>

                    {task.description && (
                      <p className="text-gray-600 mb-3 text-sm">{task.description}</p>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div>
                        {task.due_date && (
                          <span>Prazo: {format(new Date(task.due_date), 'dd/MM/yyyy', { locale: ptBR })}</span>
                        )}
                      </div>
                      <div>
                        Criada em: {format(new Date(task.created_at!), 'dd/MM/yyyy', { locale: ptBR })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="events" className="space-y-4 mt-4">
            {clientEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhum evento associado a este cliente</p>
                <Button className="mt-4" onClick={handleNewEvent}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar primeiro evento
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {clientEvents.map((event) => (
                  <div key={event.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-lg">{event.title}</h4>
                      <Button size="sm" variant="outline" onClick={() => handleViewEvent(event)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Ver
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={getEventTypeColor(event.event_type || '')}>
                        {formatEventType(event.event_type || '')}
                      </Badge>
                    </div>

                    {event.description && (
                      <p className="text-gray-600 mb-3 text-sm">{event.description}</p>
                    )}

                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center justify-between">
                        <span>Início: {format(new Date(event.start_date), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</span>
                        <span>Fim: {format(new Date(event.end_date), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</span>
                      </div>
                      {event.attendees && event.attendees.length > 0 && (
                        <div>
                          <span className="font-medium">Participantes: </span>
                          <span>{event.attendees.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Diálogos */}
        <TaskDialog
          open={taskDialogOpen}
          onOpenChange={setTaskDialogOpen}
          task={selectedTask}
          initialClientId={client.id}
        />

        <EventDialog
          open={eventDialogOpen}
          onOpenChange={setEventDialogOpen}
          event={selectedEvent}
        />
      </CardContent>
    </Card>
  );
};
