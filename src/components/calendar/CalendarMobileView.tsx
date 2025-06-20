
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, MapPin } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Event, Task } from '@/services/api/types';

interface CalendarMobileViewProps {
  currentDate: Date;
  events: Event[];
  tasks: Task[];
  onEventClick: (event: Event) => void;
  onTaskClick: (task: Task) => void;
  dragAndDrop?: any;
}

export const CalendarMobileView = ({
  currentDate,
  events,
  tasks,
  onEventClick,
  onTaskClick,
}: CalendarMobileViewProps) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDay = (date: Date) => {
    return events.filter(event => 
      isSameDay(new Date(event.start_date), date)
    );
  };

  const getTasksForDay = (date: Date) => {
    return tasks.filter(task => 
      task.due_date && isSameDay(new Date(task.due_date), date)
    );
  };

  const getEventTypeColor = (type: string) => {
    const colors = {
      meeting: 'bg-blue-100 text-blue-800 border-blue-200',
      call: 'bg-green-100 text-green-800 border-green-200',
      task: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      deadline: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTaskPriorityColor = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200',
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="w-5 h-5" />
            {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {days.map((day) => {
            const dayEvents = getEventsForDay(day);
            const dayTasks = getTasksForDay(day);
            const hasItems = dayEvents.length > 0 || dayTasks.length > 0;
            
            if (!hasItems) return null;

            return (
              <div
                key={day.toISOString()}
                className={`border rounded-lg p-3 space-y-2 ${
                  isToday(day) ? 'bg-blue-50 border-blue-200' : 'bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">
                    {format(day, 'dd/MM - EEEE', { locale: ptBR })}
                  </h4>
                  {isToday(day) && (
                    <Badge variant="outline" className="text-xs">
                      Hoje
                    </Badge>
                  )}
                </div>

                {dayEvents.length > 0 && (
                  <div className="space-y-2">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className={`p-2 rounded border cursor-pointer hover:shadow-sm transition-shadow ${getEventTypeColor(event.event_type || 'meeting')}`}
                        onClick={() => onEventClick(event)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-xs truncate">{event.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="w-3 h-3" />
                              <span className="text-xs">
                                {format(new Date(event.start_date), 'HH:mm')} - {format(new Date(event.end_date), 'HH:mm')}
                              </span>
                            </div>
                            {event.description && (
                              <p className="text-xs opacity-75 mt-1 truncate">
                                {event.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {dayTasks.length > 0 && (
                  <div className="space-y-2">
                    {dayTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`p-2 rounded border cursor-pointer hover:shadow-sm transition-shadow ${getTaskPriorityColor(task.priority || 'medium')}`}
                        onClick={() => onTaskClick(task)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-xs truncate">{task.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Users className="w-3 h-3" />
                              <span className="text-xs">Tarefa</span>
                              <Badge variant="outline" className="text-xs">
                                {task.priority}
                              </Badge>
                            </div>
                            {task.description && (
                              <p className="text-xs opacity-75 mt-1 truncate">
                                {task.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          
          {days.every(day => getEventsForDay(day).length === 0 && getTasksForDay(day).length === 0) && (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum evento ou tarefa este mês</p>
              <Button variant="outline" size="sm" className="mt-2">
                Criar evento
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
