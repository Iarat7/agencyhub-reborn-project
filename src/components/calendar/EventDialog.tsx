
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { EventForm } from './EventForm';
import type { Event } from '@/services/api/types';

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: Event;
  selectedDate?: Date;
}

export const EventDialog = ({ open, onOpenChange, event, selectedDate }: EventDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = () => {
    onOpenChange(false);
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {event ? 'Editar Evento' : 'Novo Evento'}
          </DialogTitle>
          <DialogDescription>
            {event 
              ? 'Edite as informações do evento abaixo.'
              : 'Preencha as informações para criar um novo evento.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <EventForm
          event={event}
          selectedDate={selectedDate}
          onSuccess={handleSuccess}
          isSubmitting={isSubmitting}
          onSubmittingChange={setIsSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};
