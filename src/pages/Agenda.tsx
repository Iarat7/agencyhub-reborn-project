
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { CalendarView } from '@/components/calendar/CalendarView';
import { EventDialog } from '@/components/calendar/EventDialog';
import { EventForm } from '@/components/calendar/EventForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Agenda = () => {
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setIsEventDialogOpen(true);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Agenda</h1>
            <p className="text-muted-foreground">
              Gerencie seus eventos, reuniões e compromissos
            </p>
          </div>
          <Button onClick={() => setIsEventDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Novo Evento
          </Button>
        </div>

        <CalendarView onDateSelect={handleDateSelect} />

        <EventDialog 
          open={isEventDialogOpen} 
          onOpenChange={setIsEventDialogOpen}
          selectedDate={selectedDate}
        />
      </div>
    </AppLayout>
  );
};

export default Agenda;
