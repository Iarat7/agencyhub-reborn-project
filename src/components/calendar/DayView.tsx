
import React from 'react';
import { format, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar } from 'lucide-react';
import type { Event } from '@/services/api/types';
import type { Task } from '@/services/api/types';

interface DayViewProps {
  currentDate: Date;
  events: Event[];
  tasks: Task[];
  onEventClick: (event: Event) => void;
  onTaskClick: (task: Task) => void;
  dragAndDrop?: any;
}

export const DayView = ({ 
  currentDate, 
  events, 
  tasks, 
  onEventClick, 
  onTaskClick,
  dragAndDrop
}: DayViewProps) => {
  const dayEvents = events.filter(event => 
    isSameDay(parseISO(event.start_date), currentDate)
  );

  const dayTasks = tasks.filter(task => 
    task.due_date && isSameDay(parseISO(task.due_date), currentDate)
  );

  const timeSlots = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForHour = (hour: number) => {
    return dayEvents.filter(event => {
      const eventHour = parseISO(event.start_date).getHours();
      return eventHour === hour;
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {format(currentDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Timeline */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Cronograma do Dia
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {timeSlots.map((hour) => {
                  const hourEvents = getEventsForHour(hour);
                  
                  return (
                    <div 
                      key={hour} 
                      className={`flex gap-3 ${
                        dragAndDrop?.dragOverDate && isSameDay(currentDate, dragAndDrop.dragOverDate) 
                          ? 'bg-blue-50 rounded p-2' 
                          : ''
                      }`}
                      onDragOver={(e) => dragAndDrop?.handleDragOver(e, currentDate)}
                      onDragLeave={dragAndDrop?.handleDragLeave}
                      onDrop={(e) => dragAndDrop?.handleDrop(e, currentDate)}
                    >
                      <div className="text-sm text-muted-foreground font-mono min-w-16">
                        {hour.toString().padStart(2, '0')}:00
                      </div>
                      <div className="flex-1 min-h-8 border-l border-border pl-3">
                        {hourEvents.map((event) => (
                          <div
                            key={event.id}
                            className="mb-2 p-2 bg-blue-50 rounded cursor-pointer hover:bg-blue-100 transition-colors"
                            draggable={!!dragAndDrop}
                            onDragStart={() => dragAndDrop?.handleDragStart('event', event.id, event)}
                            onDragEnd={dragAndDrop?.handleDragEnd}
                            onClick={() => onEventClick(event)}
                          >
                            <div className="font-medium text-sm">{event.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {format(parseISO(event.start_date), 'HH:mm')} - {format(parseISO(event.end_date), 'HH:mm')}
                            </div>
                            <Badge variant="secondary" className="mt-1 text-xs">
                              {event.event_type}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tasks */}
            <div>
              <h3 className="font-semibold mb-4">
                Tarefas ({dayTasks.length})
              </h3>
              <div 
                className={`space-y-2 max-h-96 overflow-y-auto ${
                  dragAndDrop?.dragOverDate && isSameDay(currentDate, dragAndDrop.dragOverDate) 
                    ? 'bg-orange-50 rounded p-2' 
                    : ''
                }`}
                onDragOver={(e) => dragAndDrop?.handleDragOver(e, currentDate)}
                onDragLeave={dragAndDrop?.handleDragLeave}
                onDrop={(e) => dragAndDrop?.handleDrop(e, currentDate)}
              >
                {dayTasks.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhuma tarefa para hoje</p>
                ) : (
                  dayTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 bg-orange-50 rounded cursor-pointer hover:bg-orange-100 transition-colors"
                      draggable={!!dragAndDrop}
                      onDragStart={() => dragAndDrop?.handleDragStart('task', task.id, task)}
                      onDragEnd={dragAndDrop?.handleDragEnd}
                      onClick={() => onTaskClick(task)}
                    >
                      <div className="font-medium text-sm mb-1">{task.title}</div>
                      {task.description && (
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2">
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
                  ))
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
