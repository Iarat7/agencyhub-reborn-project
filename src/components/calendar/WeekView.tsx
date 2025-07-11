
import React from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
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
  dragAndDrop?: any;
}

export const WeekView = ({ 
  currentDate, 
  events, 
  tasks, 
  onEventClick, 
  onTaskClick, 
  onDateClick,
  dragAndDrop
}: WeekViewProps) => {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      isSameDay(parseISO(event.start_date), date)
    );
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => 
      task.due_date && isSameDay(parseISO(task.due_date), date)
    );
  };

  const timeSlots = Array.from({ length: 24 }, (_, i) => i);

  const handleCellClick = (date: Date, hour: number, e: React.MouseEvent) => {
    if (dragAndDrop?.isDragging) {
      e.preventDefault();
      return;
    }
    
    // Criar novo evento com a data e hora especificadas
    const eventDate = new Date(date);
    eventDate.setHours(hour, 0, 0, 0);
    onDateClick(eventDate);
  };

  const handleDayHeaderClick = (date: Date, e: React.MouseEvent) => {
    if (dragAndDrop?.isDragging) {
      e.preventDefault();
      return;
    }
    onDateClick(date);
  };

  return (
    <div className="space-y-4">
      {/* Headers - Mobile friendly */}
      <div className="grid grid-cols-8 gap-1 md:gap-2">
        <div className="text-xs font-medium text-muted-foreground p-1 md:p-2">
          Hora
        </div>
        
        {weekDays.map((day) => (
          <div 
            key={day.toISOString()} 
            className={`text-center cursor-pointer hover:bg-accent rounded p-1 ${
              dragAndDrop?.dragOverDate && isSameDay(day, dragAndDrop.dragOverDate) 
                ? 'bg-blue-100 rounded' 
                : ''
            }`}
            onClick={(e) => handleDayHeaderClick(day, e)}
          >
            <div className="text-xs font-medium text-muted-foreground">
              {format(day, 'EEE', { locale: ptBR })}
            </div>
            <div 
              className={`text-sm md:text-lg font-semibold ${
                isSameDay(day, new Date()) ? 'bg-primary text-primary-foreground rounded' : ''
              }`}
            >
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>

      {/* Timeline - Mobile optimized */}
      <div className="max-h-96 overflow-y-auto">
        <div className="grid grid-cols-8 gap-1 md:gap-2">
          {timeSlots.map((hour) => (
            <React.Fragment key={hour}>
              {/* Time label */}
              <div className="text-xs text-muted-foreground p-1 border-r text-center">
                {hour.toString().padStart(2, '0')}:00
              </div>
              
              {/* Day columns */}
              {weekDays.map((day) => {
                const dayEvents = getEventsForDate(day).filter(event => {
                  const eventHour = parseISO(event.start_date).getHours();
                  return eventHour === hour;
                });
                
                const dayTasks = getTasksForDate(day);
                const isDropZone = dragAndDrop?.dragOverDate && isSameDay(day, dragAndDrop.dragOverDate);
                
                return (
                  <div 
                    key={`${day.toISOString()}-${hour}`} 
                    className={`min-h-8 md:min-h-12 border border-border/50 p-0.5 md:p-1 cursor-pointer hover:bg-accent/50 ${
                      isDropZone ? 'bg-blue-100 border-blue-300' : ''
                    }`}
                    onClick={(e) => handleCellClick(day, hour, e)}
                    onDragOver={(e) => dragAndDrop?.handleDragOver(e, day)}
                    onDragLeave={dragAndDrop?.handleDragLeave}
                    onDrop={(e) => dragAndDrop?.handleDrop(e, day)}
                  >
                    {/* Events */}
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className="mb-0.5 md:mb-1 p-0.5 md:p-1 bg-blue-100 rounded text-xs cursor-pointer hover:bg-blue-200 transition-colors"
                        draggable={!!dragAndDrop}
                        onDragStart={() => dragAndDrop?.handleDragStart('event', event.id, event)}
                        onDragEnd={dragAndDrop?.handleDragEnd}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                      >
                        <div className="font-medium truncate text-xs">{event.title}</div>
                        <div className="text-muted-foreground text-xs hidden md:block">
                          {format(parseISO(event.start_date), 'HH:mm')}
                        </div>
                      </div>
                    ))}
                    
                    {/* Tasks - only show in first hour slot */}
                    {hour === 0 && dayTasks.map((task) => (
                      <div
                        key={task.id}
                        className="mb-0.5 md:mb-1 p-0.5 md:p-1 bg-orange-100 rounded text-xs cursor-pointer hover:bg-orange-200 transition-colors"
                        draggable={!!dragAndDrop}
                        onDragStart={() => dragAndDrop?.handleDragStart('task', task.id, task)}
                        onDragEnd={dragAndDrop?.handleDragEnd}
                        onClick={(e) => {
                          e.stopPropagation();
                          onTaskClick(task);
                        }}
                      >
                        <div className="font-medium truncate text-xs">{task.title}</div>
                        <Badge variant="secondary" className="text-xs hidden md:inline-flex">
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
