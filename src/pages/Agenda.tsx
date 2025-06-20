import React, { useState } from 'react';
import { CalendarView } from '@/components/calendar/CalendarView';
import { WeekView } from '@/components/calendar/WeekView';
import { DayView } from '@/components/calendar/DayView';
import { EventDialog } from '@/components/calendar/EventDialog';
import { EventDetailsDialog } from '@/components/calendar/EventDetailsDialog';
import { TaskDetailsDialog } from '@/components/calendar/TaskDetailsDialog';
import { CalendarViewToggle, CalendarViewType } from '@/components/calendar/CalendarViewToggle';
import { CalendarFilters, CalendarFilters as CalendarFiltersType } from '@/components/calendar/CalendarFilters';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { useTasks } from '@/hooks/useTasks';
import type { Event } from '@/services/api/types';
import type { Task } from '@/services/api/types';

const Agenda = () => {
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);
  const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>();
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [view, setView] = useState<CalendarViewType>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filters, setFilters] = useState<CalendarFiltersType>({
    eventTypes: [],
    clients: [],
    assignees: [],
  });

  const { data: allEvents = [] } = useEvents();
  const { data: allTasks = [] } = useTasks();

  // Filter events and tasks based on active filters
  const filteredEvents = allEvents.filter(event => {
    if (filters.eventTypes.length > 0 && !filters.eventTypes.includes(event.event_type)) {
      return false;
    }
    if (filters.clients.length > 0 && event.client_id && !filters.clients.includes(event.client_id)) {
      return false;
    }
    if (filters.assignees.length > 0 && event.created_by && !filters.assignees.includes(event.created_by)) {
      return false;
    }
    return true;
  });

  const filteredTasks = allTasks.filter(task => {
    if (filters.clients.length > 0 && task.client_id && !filters.clients.includes(task.client_id)) {
      return false;
    }
    if (filters.assignees.length > 0) {
      const taskAssignee = task.assigned_to || task.created_by;
      if (!taskAssignee || !filters.assignees.includes(taskAssignee)) {
        return false;
      }
    }
    return true;
  });

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setCurrentDate(date);
    setEditingEvent(undefined);
    setIsEventDialogOpen(true);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsEventDetailsOpen(true);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDetailsOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setSelectedDate(new Date(event.start_date));
    setIsEventDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    // TODO: Abrir dialog de edição de tarefa quando implementado
    console.log('Edit task:', task);
  };

  const renderCalendarView = () => {
    switch (view) {
      case 'week':
        return (
          <WeekView
            currentDate={currentDate}
            events={filteredEvents}
            tasks={filteredTasks}
            onEventClick={handleEventClick}
            onTaskClick={handleTaskClick}
            onDateClick={handleDateSelect}
          />
        );
      case 'day':
        return (
          <DayView
            currentDate={currentDate}
            events={filteredEvents}
            tasks={filteredTasks}
            onEventClick={handleEventClick}
            onTaskClick={handleTaskClick}
          />
        );
      default:
        return (
          <CalendarView 
            onDateSelect={handleDateSelect}
            events={filteredEvents}
            tasks={filteredTasks}
            onEventClick={handleEventClick}
            onTaskClick={handleTaskClick}
          />
        );
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Agenda</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Gerencie seus eventos, reuniões e compromissos
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <CalendarViewToggle view={view} onViewChange={setView} />
          <Button 
            onClick={() => {
              setEditingEvent(undefined);
              setSelectedDate(undefined);
              setIsEventDialogOpen(true);
            }}
            className="w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Evento
          </Button>
        </div>
      </div>

      <CalendarFilters 
        filters={filters} 
        onFiltersChange={setFilters} 
      />

      {renderCalendarView()}

      <EventDialog 
        open={isEventDialogOpen} 
        onOpenChange={setIsEventDialogOpen}
        event={editingEvent}
        selectedDate={selectedDate}
      />

      <EventDetailsDialog
        open={isEventDetailsOpen}
        onOpenChange={setIsEventDetailsOpen}
        event={selectedEvent}
        onEdit={handleEditEvent}
      />

      <TaskDetailsDialog
        open={isTaskDetailsOpen}
        onOpenChange={setIsTaskDetailsOpen}
        task={selectedTask}
        onEdit={handleEditTask}
      />
    </div>
  );
};

export default Agenda;
