
import React, { useState } from 'react';
import { CalendarView } from '@/components/calendar/CalendarView';
import { WeekView } from '@/components/calendar/WeekView';
import { DayView } from '@/components/calendar/DayView';
import { CalendarMobileView } from '@/components/calendar/CalendarMobileView';
import { CalendarIntegrations } from '@/components/calendar/CalendarIntegrations';
import { EventDialog } from '@/components/calendar/EventDialog';
import { EventDetailsDialog } from '@/components/calendar/EventDetailsDialog';
import { TaskDetailsDialog } from '@/components/calendar/TaskDetailsDialog';
import { TaskEditDialog } from '@/components/tasks/TaskEditDialog';
import { QuickCreateDialog } from '@/components/calendar/QuickCreateDialog';
import { CalendarNavigation } from '@/components/calendar/CalendarNavigation';
import { CalendarViewToggle, CalendarViewType } from '@/components/calendar/CalendarViewToggle';
import { CalendarFilters, CalendarFilters as CalendarFiltersType } from '@/components/calendar/CalendarFilters';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Zap, Settings, Smartphone } from 'lucide-react';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { useTasks } from '@/hooks/useTasks';
import { useCalendarNotifications } from '@/hooks/useCalendarNotifications';
import { useCalendarRealtime } from '@/hooks/useCalendarRealtime';
import { useDragAndDrop } from '@/hooks/useDragAndDrop';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatDateForRecife, getCurrentRecifeTime } from '@/utils/timezone';
import type { Event } from '@/services/api/types';
import type { Task } from '@/services/api/types';

const Agenda = () => {
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);
  const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false);
  const [isTaskEditOpen, setIsTaskEditOpen] = useState(false);
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>();
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [view, setView] = useState<CalendarViewType>('month');
  const [currentDate, setCurrentDate] = useState(getCurrentRecifeTime());
  const [filters, setFilters] = useState<CalendarFiltersType>({
    eventTypes: [],
    clients: [],
    assignees: [],
  });

  const { data: allEvents = [] } = useCalendarEvents();
  const { data: allTasks = [] } = useTasks();
  const isMobile = useIsMobile();

  // Hooks para funcionalidades avançadas
  useCalendarNotifications();
  useCalendarRealtime();
  const dragAndDrop = useDragAndDrop();

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
    // Se a data vier com horário específico (das views de semana/dia), use ela
    // Senão, use a data com horário atual de Recife
    const recifeNow = getCurrentRecifeTime();
    const eventDate = date.getHours() === 0 && date.getMinutes() === 0 
      ? new Date(date.getFullYear(), date.getMonth(), date.getDate(), recifeNow.getHours())
      : date;
      
    setSelectedDate(eventDate);
    setCurrentDate(eventDate);
    setEditingEvent(undefined);
    setIsEventDialogOpen(true);
  };

  const handleQuickCreate = (date: Date) => {
    setSelectedDate(date);
    setIsQuickCreateOpen(true);
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
    setIsTaskEditOpen(true);
  };

  const renderCalendarView = () => {
    const baseProps = {
      events: filteredEvents,
      tasks: filteredTasks,
      onEventClick: handleEventClick,
      onTaskClick: handleTaskClick,
      dragAndDrop,
    };

    if (isMobile) {
      return (
        <CalendarMobileView
          currentDate={currentDate}
          {...baseProps}
        />
      );
    }

    switch (view) {
      case 'week':
        return (
          <WeekView
            currentDate={currentDate}
            onDateClick={handleDateSelect}
            {...baseProps}
          />
        );
      case 'day':
        return (
          <DayView
            currentDate={currentDate}
            onDateClick={handleDateSelect}
            {...baseProps}
          />
        );
      default:
        return (
          <CalendarView 
            onDateSelect={handleDateSelect}
            {...baseProps}
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
          {!isMobile && <CalendarViewToggle view={view} onViewChange={setView} />}
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => {
                setSelectedDate(getCurrentRecifeTime());
                setIsQuickCreateOpen(true);
              }}
              className="flex-1 sm:flex-none"
            >
              <Zap className="w-4 h-4 mr-2" />
              Criação Rápida
            </Button>
            <Button 
              onClick={() => {
                setEditingEvent(undefined);
                setSelectedDate(undefined);
                setIsEventDialogOpen(true);
              }}
              className="flex-1 sm:flex-none"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Evento
            </Button>
          </div>
        </div>
      </div>

      {isMobile ? (
        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calendar" className="text-xs">
              <Smartphone className="w-4 h-4 mr-1" />
              Agenda
            </TabsTrigger>
            <TabsTrigger value="integrations" className="text-xs">
              <Settings className="w-4 h-4 mr-1" />
              Config
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar" className="space-y-4">
            <CalendarFilters 
              filters={filters} 
              onFiltersChange={setFilters} 
            />
            {renderCalendarView()}
          </TabsContent>
          
          <TabsContent value="integrations">
            <CalendarIntegrations />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 space-y-4">
            <CalendarFilters 
              filters={filters} 
              onFiltersChange={setFilters} 
            />

            {view !== 'month' && (
              <CalendarNavigation
                currentDate={currentDate}
                view={view}
                onDateChange={setCurrentDate}
              />
            )}

            {dragAndDrop.isDragging && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center text-blue-700">
                Arraste para uma data para mover o item
              </div>
            )}

            {renderCalendarView()}
          </div>

          <div className="xl:col-span-1 space-y-6">
            <CalendarIntegrations />
          </div>
        </div>
      )}

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

      <TaskEditDialog
        open={isTaskEditOpen}
        onOpenChange={setIsTaskEditOpen}
        task={editingTask}
      />

      <QuickCreateDialog
        open={isQuickCreateOpen}
        onOpenChange={setIsQuickCreateOpen}
        selectedDate={selectedDate || getCurrentRecifeTime()}
      />
    </div>
  );
};

export default Agenda;
