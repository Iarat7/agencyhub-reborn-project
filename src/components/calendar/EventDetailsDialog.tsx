
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Users, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEvents } from '@/hooks/useEvents';
import { useToast } from '@/hooks/use-toast';
import { useClients } from '@/hooks/useClients';
import type { Event } from '@/services/api/types';

interface EventDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event | null;
  onEdit: (event: Event) => void;
}

export const EventDetailsDialog = ({ 
  open, 
  onOpenChange, 
  event, 
  onEdit 
}: EventDetailsDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteEvent } = useEvents();
  const { data: clients = [] } = useClients();
  const { toast } = useToast();

  if (!event) return null;

  const client = event.client_id ? clients.find(c => c.id === event.client_id) : null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteEvent.mutateAsync(event.id);
      toast({
        title: 'Evento excluído',
        description: 'O evento foi excluído com sucesso.',
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao excluir o evento.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const eventTypeLabels = {
    meeting: 'Reunião',
    call: 'Chamada',
    deadline: 'Prazo',
    reminder: 'Lembrete',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {event.title}
          </DialogTitle>
          <DialogDescription>
            Detalhes do evento
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <div>
              <div className="font-medium">
                {format(new Date(event.start_date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </div>
              <div className="text-sm text-muted-foreground">
                {format(new Date(event.start_date), 'HH:mm')} - {format(new Date(event.end_date), 'HH:mm')}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {eventTypeLabels[event.event_type as keyof typeof eventTypeLabels]}
            </Badge>
          </div>

          {client && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="font-medium">{client.name}</div>
                <div className="text-sm text-muted-foreground">Cliente</div>
              </div>
            </div>
          )}

          {event.description && (
            <div>
              <h4 className="font-medium mb-2">Descrição</h4>
              <p className="text-sm text-muted-foreground">{event.description}</p>
            </div>
          )}

          {event.attendees && event.attendees.length > 0 && (
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Participantes
              </h4>
              <div className="space-y-1">
                {event.attendees.map((email, index) => (
                  <div key={index} className="text-sm text-muted-foreground">
                    {email}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            Criado em {format(new Date(event.created_at!), "d/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {isDeleting ? 'Excluindo...' : 'Excluir'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onEdit(event);
              onOpenChange(false);
            }}
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
