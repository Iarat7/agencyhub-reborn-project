
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
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
      <Card className="xl:col-span-2">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <CalendarIcon className="w-4 h-4 md:w-5 md:h-5" />
              {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
            </CardTitle>
            <div className="flex gap-1 justify-center sm:justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                className="text-xs md:text-sm"
              >
                <ChevronLeft className="w-3 h-3 md:w-4 md:h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(new Date())}
                className="text-xs md:text-sm px-2 md:px-3"
              >
                Hoje
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                className="text-xs md:text-sm"
              >
                <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-2 md:p-6">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateClick}
            month={currentMonth}
            onMonthChange={setCurrentMonth}
            locale={ptBR}
            className="w-full"
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-muted-foreground rounded-md w-8 md:w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: "h-8 w-8 md:h-9 md:w-9 p-0 font-normal aria-selected:opacity-100 text-xs md:text-sm",
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground",
              day_outside: "text-muted-foreground opacity-50",
              day_disabled: "text-muted-foreground opacity-50",
              day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
            }}
            components={{
              DayContent: ({ date }) => (
                <div className="relative w-full h-full p-1 md:p-2">
                  <span className="text-xs md:text-sm">{date.getDate()}</span>
                  {getDayContent(date)}
                </div>
              ),
            }}
          />
        </CardContent>
      </Card>

      <Card className="xl:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-sm md:text-base">
              {format(selectedDate, "d 'de' MMMM", { locale: ptBR })}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 px-3 md:px-6">
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2 text-sm md:text-base">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              Eventos ({selectedDateEvents.length})
            </h4>
            <div className="space-y-2 max-h-32 md:max-h-40 overflow-y-auto">
              {selectedDateEvents.length === 0 ? (
                <p className="text-xs md:text-sm text-muted-foreground">Nenhum evento</p>
              ) : (
                selectedDateEvents.map((event) => (
                  <div key={event.id} className="p-2 bg-blue-50 rounded-lg">
                    <p className="font-medium text-xs md:text-sm line-clamp-2">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(event.start_date), 'HH:mm')} - {format(new Date(event.end_date), 'HH:mm')}
                    </p>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {event.event_type}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2 text-sm md:text-base">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              Tarefas ({selectedDateTasks.length})
            </h4>
            <div className="space-y-2 max-h-32 md:max-h-40 overflow-y-auto">
              {selectedDateTasks.length === 0 ? (
                <p className="text-xs md:text-sm text-muted-foreground">Nenhuma tarefa</p>
              ) : (
                selectedDateTasks.map((task) => (
                  <div key={task.id} className="p-2 bg-orange-50 rounded-lg">
                    <p className="font-medium text-xs md:text-sm line-clamp-2">{task.title}</p>
                    <Badge 
                      variant={task.priority === 'high' ? 'destructive' : 'secondary'}
                      className="mt-1 text-xs"
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
