
import React from 'react';
import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar as CalendarIcon } from 'lucide-react';
import type { Event } from '@/services/api/types';
import type { Task } from '@/services/api/types';

interface DayViewProps {
  currentDate: Date;
  events: Event[];
  tasks: Task[];
  onEventClick: (event: Event) => void;
  onTaskClick: (task: Task) => void;
}

export const DayView = ({ 
  currentDate, 
  events, 
  tasks, 
  onEventClick, 
  onTaskClick 
}: DayViewProps) => {
  const dayEvents = events.filter(event => 
    isSameDay(new Date(event.start_date), currentDate)
  ).sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

  const dayTasks = tasks.filter(task => 
    task.due_date && isSameDay(new Date(task.due_date), currentDate)
  ).sort((a, b) => {
    const priorities = { urgent: 4, high: 3, medium: 2, low: 1 };
    return priorities[b.priority as keyof typeof priorities] - priorities[a.priority as keyof typeof priorities];
  });

  const timeSlots = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          {format(currentDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
        </h2>
        <p className="text-muted-foreground">
          {dayEvents.length} eventos • {dayTasks.length} tarefas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Timeline */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="w-4 h-4" />
                Cronograma do Dia
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {timeSlots.map((hour) => {
                  const hourEvents = dayEvents.filter(event => {
                    const eventHour = new Date(event.start_date).getHours();
                    return eventHour === hour;
                  });

                  return (
                    <div key={hour} className="flex gap-3 min-h-12 border-b border-border/50 pb-2">
                      <div className="text-sm text-muted-foreground font-mono w-12">
                        {hour.toString().padStart(2, '0')}:00
                      </div>
                      <div className="flex-1 space-y-1">
                        {hourEvents.map((event) => (
                          <div
                            key={event.id}
                            className="p-2 bg-blue-50 rounded cursor-pointer hover:bg-blue-100 transition-colors"
                            onClick={() => onEventClick(event)}
                          >
                            <div className="font-medium">{event.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {format(new Date(event.start_date), 'HH:mm')} - {format(new Date(event.end_date), 'HH:mm')}
                            </div>
                            {event.description && (
                              <div className="text-sm text-muted-foreground mt-1">
                                {event.description}
                              </div>
                            )}
                            <Badge variant="secondary" className="mt-1">
                              {event.event_type}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarIcon className="w-4 h-4" />
                Tarefas do Dia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-96 overflow-y-auto">
              {dayTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhuma tarefa para hoje</p>
              ) : (
                dayTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-2 bg-orange-50 rounded cursor-pointer hover:bg-orange-100 transition-colors"
                    onClick={() => onTaskClick(task)}
                  >
                    <div className="font-medium">{task.title}</div>
                    {task.description && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {task.description}
                      </div>
                    )}
                    <div className="flex gap-2 mt-2">
                      <Badge 
                        variant={task.priority === 'high' || task.priority === 'urgent' ? 'destructive' : 'secondary'}
                      >
                        {task.priority}
                      </Badge>
                      <Badge variant="outline">
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
