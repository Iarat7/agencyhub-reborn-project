
import React from 'react';
import { format, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, User } from 'lucide-react';
import type { Event } from '@/services/api/types';
import type { Task } from '@/services/api/types';

interface CalendarMobileViewProps {
  currentDate: Date;
  events: Event[];
  tasks: Task[];
  onEventClick: (event: Event) => void;
  onTaskClick: (task: Task) => void;
}

export const CalendarMobileView = ({ 
  currentDate, 
  events, 
  tasks, 
  onEventClick, 
  onTaskClick 
}: CalendarMobileViewProps) => {
  const dayEvents = events.filter(event => 
    isSameDay(parseISO(event.start_date), currentDate)
  );

  const dayTasks = tasks.filter(task => 
    task.due_date && isSameDay(parseISO(task.due_date), currentDate)
  );

  const upcomingEvents = events
    .filter(event => {
      const eventDate = parseISO(event.start_date);
      return eventDate >= currentDate;
    })
    .sort((a, b) => parseISO(a.start_date).getTime() - parseISO(b.start_date).getTime())
    .slice(0, 5);

  const upcomingTasks = tasks
    .filter(task => {
      if (!task.due_date) return false;
      const taskDate = parseISO(task.due_date);
      return taskDate >= currentDate && task.status !== 'completed';
    })
    .sort((a, b) => parseISO(a.due_date!).getTime() - parseISO(b.due_date!).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-4">
      {/* Hoje */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="w-5 h-5" />
            Hoje - {format(currentDate, "d 'de' MMMM", { locale: ptBR })}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Eventos de Hoje */}
          <div>
            <h4 className="font-medium mb-2 text-sm flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              Eventos ({dayEvents.length})
            </h4>
            {dayEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum evento hoje</p>
            ) : (
              <div className="space-y-2">
                {dayEvents.map((event) => (
                  <div 
                    key={event.id}
                    className="p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={() => onEventClick(event)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">{event.title}</h5>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {format(parseISO(event.start_date), 'HH:mm')} - {format(parseISO(event.end_date), 'HH:mm')}
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {event.event_type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tarefas de Hoje */}
          <div>
            <h4 className="font-medium mb-2 text-sm flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              Tarefas ({dayTasks.length})
            </h4>
            {dayTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma tarefa para hoje</p>
            ) : (
              <div className="space-y-2">
                {dayTasks.map((task) => (
                  <div 
                    key={task.id}
                    className="p-3 bg-orange-50 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors"
                    onClick={() => onTaskClick(task)}
                  >
                    <h5 className="font-medium text-sm">{task.title}</h5>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant={task.priority === 'high' || task.priority === 'urgent' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {task.priority}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Próximos Eventos */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Próximos Eventos</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum evento próximo</p>
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div 
                  key={event.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer"
                  onClick={() => onEventClick(event)}
                >
                  <div className="text-center min-w-12">
                    <div className="text-xs text-muted-foreground">
                      {format(parseISO(event.start_date), 'MMM', { locale: ptBR })}
                    </div>
                    <div className="font-semibold text-sm">
                      {format(parseISO(event.start_date), 'd')}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">{event.title}</h5>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {format(parseISO(event.start_date), 'HH:mm')}
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {event.event_type}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Próximas Tarefas */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Próximas Tarefas</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma tarefa próxima</p>
          ) : (
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div 
                  key={task.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent cursor-pointer"
                  onClick={() => onTaskClick(task)}
                >
                  <div className="text-center min-w-12">
                    <div className="text-xs text-muted-foreground">
                      {format(parseISO(task.due_date!), 'MMM', { locale: ptBR })}
                    </div>
                    <div className="font-semibold text-sm">
                      {format(parseISO(task.due_date!), 'd')}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">{task.title}</h5>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant={task.priority === 'high' || task.priority === 'urgent' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
