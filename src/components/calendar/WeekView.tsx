
import React from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Event } from '@/services/api/types';
import type { Task } from '@/services/api/types';

interface WeekViewProps {
  currentDate: Date;
  events: Event[];
  tasks: Task[];
  onEventClick: (event: Event) => void;
  onTaskClick: (task: Task) => void;
  onDateClick: (date: Date) => void;
}

export const WeekView = ({ 
  currentDate, 
  events, 
  tasks, 
  onEventClick, 
  onTaskClick, 
  onDateClick 
}: WeekViewProps) => {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      isSameDay(new Date(event.start_date), date)
    );
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => 
      task.due_date && isSameDay(new Date(task.due_date), date)
    );
  };

  const timeSlots = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-8 gap-2">
        {/* Time column header */}
        <div className="text-xs font-medium text-muted-foreground p-2">
          Hora
        </div>
        
        {/* Day headers */}
        {weekDays.map((day) => (
          <div key={day.toISOString()} className="text-center">
            <div className="text-xs font-medium text-muted-foreground">
              {format(day, 'EEE', { locale: ptBR })}
            </div>
            <div 
              className={`text-lg font-semibold cursor-pointer hover:bg-accent rounded p-1 ${
                isSameDay(day, new Date()) ? 'bg-primary text-primary-foreground' : ''
              }`}
              onClick={() => onDateClick(day)}
            >
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>

      <div className="max-h-96 overflow-y-auto">
        <div className="grid grid-cols-8 gap-2">
          {timeSlots.map((hour) => (
            <React.Fragment key={hour}>
              {/* Time label */}
              <div className="text-xs text-muted-foreground p-1 border-r">
                {hour.toString().padStart(2, '0')}:00
              </div>
              
              {/* Day columns */}
              {weekDays.map((day) => {
                const dayEvents = getEventsForDate(day).filter(event => {
                  const eventHour = new Date(event.start_date).getHours();
                  return eventHour === hour;
                });
                
                const dayTasks = getTasksForDate(day);
                
                return (
                  <div 
                    key={`${day.toISOString()}-${hour}`} 
                    className="min-h-12 border border-border/50 p-1 cursor-pointer hover:bg-accent/50"
                    onClick={() => onDateClick(day)}
                  >
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className="mb-1 p-1 bg-blue-100 rounded text-xs cursor-pointer hover:bg-blue-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                      >
                        <div className="font-medium truncate">{event.title}</div>
                        <div className="text-muted-foreground">
                          {format(new Date(event.start_date), 'HH:mm')}
                        </div>
                      </div>
                    ))}
                    
                    {hour === 0 && dayTasks.map((task) => (
                      <div
                        key={task.id}
                        className="mb-1 p-1 bg-orange-100 rounded text-xs cursor-pointer hover:bg-orange-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          onTaskClick(task);
                        }}
                      >
                        <div className="font-medium truncate">{task.title}</div>
                        <Badge variant="secondary" className="text-xs">
                          {task.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
