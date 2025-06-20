
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEvents } from '@/hooks/useEvents';
import { useClients } from '@/hooks/useClients';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import type { Event } from '@/services/api/types';

const eventSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  start_date: z.string().min(1, 'Data de início é obrigatória'),
  end_date: z.string().min(1, 'Data de fim é obrigatória'),
  event_type: z.enum(['meeting', 'call', 'deadline', 'reminder']),
  client_id: z.string().optional(),
  attendees: z.string().optional(),
});

type EventFormData = z.infer<typeof eventSchema>;

interface EventFormProps {
  event?: Event;
  selectedDate?: Date;
  onSuccess: () => void;
  isSubmitting: boolean;
  onSubmittingChange: (submitting: boolean) => void;
}

export const EventForm = ({ 
  event, 
  selectedDate, 
  onSuccess, 
  isSubmitting, 
  onSubmittingChange 
}: EventFormProps) => {
  const { createEvent, updateEvent } = useEvents();
  const { data: clients = [] } = useClients();
  const { toast } = useToast();

  const defaultDate = selectedDate || new Date();
  const defaultStartTime = format(defaultDate, "yyyy-MM-dd'T'HH:mm");
  const defaultEndTime = format(new Date(defaultDate.getTime() + 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm");

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event?.title || '',
      description: event?.description || '',
      start_date: event?.start_date ? format(new Date(event.start_date), "yyyy-MM-dd'T'HH:mm") : defaultStartTime,
      end_date: event?.end_date ? format(new Date(event.end_date), "yyyy-MM-dd'T'HH:mm") : defaultEndTime,
      event_type: event?.event_type || 'meeting',
      client_id: event?.client_id || '',
      attendees: event?.attendees?.join(', ') || '',
    },
  });

  const onSubmit = async (data: EventFormData) => {
    try {
      onSubmittingChange(true);

      const eventData = {
        ...data,
        start_date: new Date(data.start_date).toISOString(),
        end_date: new Date(data.end_date).toISOString(),
        client_id: data.client_id || null,
        attendees: data.attendees ? data.attendees.split(',').map(email => email.trim()).filter(Boolean) : [],
      };

      if (event) {
        await updateEvent.mutateAsync({ id: event.id, ...eventData });
        toast({
          title: 'Evento atualizado',
          description: 'O evento foi atualizado com sucesso.',
        });
      } else {
        await createEvent.mutateAsync(eventData);
        toast({
          title: 'Evento criado',
          description: 'O evento foi criado com sucesso.',
        });
      }

      onSuccess();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar o evento.',
        variant: 'destructive',
      });
    } finally {
      onSubmittingChange(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label htmlFor="title">Título *</Label>
          <Input
            id="title"
            {...form.register('title')}
            placeholder="Ex: Reunião com cliente"
          />
          {form.formState.errors.title && (
            <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
          )}
        </div>

        <div className="col-span-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            {...form.register('description')}
            placeholder="Detalhes do evento..."
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="start_date">Data e Hora de Início *</Label>
          <Input
            id="start_date"
            type="datetime-local"
            {...form.register('start_date')}
          />
          {form.formState.errors.start_date && (
            <p className="text-sm text-destructive">{form.formState.errors.start_date.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="end_date">Data e Hora de Fim *</Label>
          <Input
            id="end_date"
            type="datetime-local"
            {...form.register('end_date')}
          />
          {form.formState.errors.end_date && (
            <p className="text-sm text-destructive">{form.formState.errors.end_date.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="event_type">Tipo do Evento</Label>
          <Select value={form.watch('event_type')} onValueChange={(value) => form.setValue('event_type', value as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="meeting">Reunião</SelectItem>
              <SelectItem value="call">Chamada</SelectItem>
              <SelectItem value="deadline">Prazo</SelectItem>
              <SelectItem value="reminder">Lembrete</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="client_id">Cliente (opcional)</Label>
          <Select value={form.watch('client_id')} onValueChange={(value) => form.setValue('client_id', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um cliente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Nenhum cliente</SelectItem>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-2">
          <Label htmlFor="attendees">Participantes (emails separados por vírgula)</Label>
          <Input
            id="attendees"
            {...form.register('attendees')}
            placeholder="email1@exemplo.com, email2@exemplo.com"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : (event ? 'Atualizar' : 'Criar')} Evento
        </Button>
      </div>
    </form>
  );
};
