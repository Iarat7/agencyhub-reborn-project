import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateTask, useUpdateTask } from '@/hooks/useTasks';
import { useEvents } from '@/hooks/useEvents';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatDateForRecife, getCurrentRecifeTime } from '@/utils/timezone';

interface QuickCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date;
}

export const QuickCreateDialog = ({ 
  open, 
  onOpenChange, 
  selectedDate 
}: QuickCreateDialogProps) => {
  const [activeTab, setActiveTab] = useState('task');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventType, setEventType] = useState('meeting');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');

  const createTask = useCreateTask();
  const { createEvent } = useEvents();
  const { toast } = useToast();

  const handleCreateTask = async () => {
    if (!taskTitle.trim()) return;

    try {
      await createTask.mutateAsync({
        title: taskTitle,
        description: taskDescription || undefined,
        priority: taskPriority as any,
        status: 'pending',
        due_date: formatDateForRecife(selectedDate),
      });

      toast({
        title: 'Tarefa criada',
        description: 'Tarefa criada com sucesso!',
      });

      resetForm();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao criar tarefa.',
        variant: 'destructive',
      });
    }
  };

  const handleCreateEvent = async () => {
    if (!eventTitle.trim()) return;

    try {
      const startDateTime = new Date(selectedDate);
      const [hours, minutes] = startTime.split(':');
      startDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const endDateTime = new Date(selectedDate);
      const [endHours, endMinutes] = endTime.split(':');
      endDateTime.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);

      await createEvent.mutateAsync({
        title: eventTitle,
        description: eventDescription || undefined,
        start_date: formatDateForRecife(startDateTime),
        end_date: formatDateForRecife(endDateTime),
        event_type: eventType as any,
      });

      toast({
        title: 'Evento criado',
        description: 'Evento criado com sucesso!',
      });

      resetForm();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao criar evento.',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setTaskTitle('');
    setTaskDescription('');
    setTaskPriority('medium');
    setEventTitle('');
    setEventDescription('');
    setEventType('meeting');
    setStartTime('09:00');
    setEndTime('10:00');
  };

  const isLoading = createTask.isPending || createEvent.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            Criação Rápida - {format(selectedDate, "d 'de' MMMM", { locale: ptBR })}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="task">Tarefa</TabsTrigger>
            <TabsTrigger value="event">Evento</TabsTrigger>
          </TabsList>

          <TabsContent value="task" className="space-y-4">
            <div>
              <Label htmlFor="task-title">Título da Tarefa</Label>
              <Input
                id="task-title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Digite o título..."
              />
            </div>

            <div>
              <Label htmlFor="task-priority">Prioridade</Label>
              <Select value={taskPriority} onValueChange={setTaskPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="task-description">Descrição (opcional)</Label>
              <Textarea
                id="task-description"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                placeholder="Descrição da tarefa..."
                rows={3}
              />
            </div>

            <Button 
              onClick={handleCreateTask} 
              disabled={!taskTitle.trim() || isLoading}
              className="w-full"
            >
              {isLoading ? 'Criando...' : 'Criar Tarefa'}
            </Button>
          </TabsContent>

          <TabsContent value="event" className="space-y-4">
            <div>
              <Label htmlFor="event-title">Título do Evento</Label>
              <Input
                id="event-title"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="Digite o título..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-time">Horário de Início</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="end-time">Horário de Fim</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="event-type">Tipo de Evento</Label>
              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger>
                  <SelectValue />
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
              <Label htmlFor="event-description">Descrição (opcional)</Label>
              <Textarea
                id="event-description"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                placeholder="Descrição do evento..."
                rows={3}
              />
            </div>

            <Button 
              onClick={handleCreateEvent} 
              disabled={!eventTitle.trim() || isLoading}
              className="w-full"
            >
              {isLoading ? 'Criando...' : 'Criar Evento'}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
