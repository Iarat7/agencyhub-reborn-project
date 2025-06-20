
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { useTasks } from '@/hooks/useTasks';
import { format, isSameDay, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

interface CalendarViewProps {
  onDateSelect: (date: Date) => void;
}

export const CalendarView = ({ onDateSelect }: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const { data: events = [] } = useEvents();
  const { data: tasks = [] } = useTasks();

  const handleDateClick = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      onDateSelect(date);
    }
  };

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

  const getDayContent = (date: Date) => {
    const dayEvents = getEventsForDate(date);
    const dayTasks = getTasksForDate(date);
    
    if (dayEvents.length === 0 && dayTasks.length === 0) return null;

    return (
      <div className="absolute bottom-0 left-0 right-0 p-1 space-y-1">
        {dayEvents.slice(0, 2).map((event, index) => (
          <div key={index} className="w-full h-1 bg-blue-500 rounded"></div>
        ))}
        {dayTasks.slice(0, 2).map((task, index) => (
          <div key={index} className="w-full h-1 bg-orange-500 rounded"></div>
        ))}
        {(dayEvents.length + dayTasks.length) > 2 && (
          <div className="text-xs text-center text-muted-foreground">
            +{(dayEvents.length + dayTasks.length) - 2}
          </div>
        )}
      </div>
    );
  };

  const selectedDateEvents = getEventsForDate(selectedDate);
  const selectedDateTasks = getTasksForDate(selectedDate);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" />
              {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
            </CardTitle>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(new Date())}
              >
                Hoje
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateClick}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            locale={ptBR}
            className="w-full"
            components={{
              DayContent: ({ date }) => (
                <div className="relative w-full h-full p-2">
                  <span>{date.getDate()}</span>
                  {getDayContent(date)}
                </div>
              ),
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {format(selectedDate, "d 'de' MMMM", { locale: ptBR })}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              Eventos ({selectedDateEvents.length})
            </h4>
            <div className="space-y-2">
              {selectedDateEvents.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum evento</p>
              ) : (
                selectedDateEvents.map((event) => (
                  <div key={event.id} className="p-2 bg-blue-50 rounded-lg">
                    <p className="font-medium text-sm">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(event.start_date), 'HH:mm')} - {format(new Date(event.end_date), 'HH:mm')}
                    </p>
                    <Badge variant="secondary" className="mt-1">
                      {event.event_type}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              Tarefas ({selectedDateTasks.length})
            </h4>
            <div className="space-y-2">
              {selectedDateTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhuma tarefa</p>
              ) : (
                selectedDateTasks.map((task) => (
                  <div key={task.id} className="p-2 bg-orange-50 rounded-lg">
                    <p className="font-medium text-sm">{task.title}</p>
                    <Badge 
                      variant={task.priority === 'high' ? 'destructive' : 'secondary'}
                      className="mt-1"
                    >
                      {task.priority}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
