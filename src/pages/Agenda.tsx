
import React, { useState } from 'react';
import { CalendarView } from '@/components/calendar/CalendarView';
import { EventDialog } from '@/components/calendar/EventDialog';
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
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Agenda</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Gerencie seus eventos, reuniões e compromissos
          </p>
        </div>
        <Button 
          onClick={() => setIsEventDialogOpen(true)}
          className="w-full sm:w-auto"
        >
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
  );
};

export default Agenda;
