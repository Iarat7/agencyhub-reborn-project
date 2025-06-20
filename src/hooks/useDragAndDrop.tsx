
import { useState, useCallback } from 'react';
import { useUpdateTask } from '@/hooks/useTasks';
import { useEvents } from '@/hooks/useEvents';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import type { Task, Event } from '@/services/api/types';

interface DragItem {
  type: 'task' | 'event';
  id: string;
  data: Task | Event;
}

export const useDragAndDrop = () => {
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [dragOverDate, setDragOverDate] = useState<Date | null>(null);
  
  const updateTask = useUpdateTask();
  const { updateEvent } = useEvents();
  const { toast } = useToast();

  const handleDragStart = useCallback((type: 'task' | 'event', id: string, data: Task | Event) => {
    setDraggedItem({ type, id, data });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, date: Date) => {
    e.preventDefault();
    setDragOverDate(date);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOverDate(null);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent, targetDate: Date) => {
    e.preventDefault();
    setDragOverDate(null);

    if (!draggedItem) return;

    try {
      const newDate = format(targetDate, 'yyyy-MM-dd');
      
      if (draggedItem.type === 'task') {
        const task = draggedItem.data as Task;
        await updateTask.mutateAsync({
          id: draggedItem.id,
          data: { due_date: newDate }
        });
        
        toast({
          title: 'Tarefa movida',
          description: `Tarefa "${task.title}" movida para ${format(targetDate, 'dd/MM/yyyy')}`,
        });
      } else {
        const event = draggedItem.data as Event;
        const currentStart = new Date(event.start_date);
        const currentEnd = new Date(event.end_date);
        
        // Manter o mesmo horário, mas mudar a data
        const newStartTime = currentStart.getHours() * 100 + currentStart.getMinutes();
        const newEndTime = currentEnd.getHours() * 100 + currentEnd.getMinutes();
        
        const newStartDate = new Date(targetDate);
        newStartDate.setHours(Math.floor(newStartTime / 100), newStartTime % 100);
        
        const newEndDate = new Date(targetDate);
        newEndDate.setHours(Math.floor(newEndTime / 100), newEndTime % 100);

        await updateEvent.mutateAsync({
          id: draggedItem.id,
          start_date: newStartDate.toISOString(),
          end_date: newEndDate.toISOString(),
        });
        
        toast({
          title: 'Evento movido',
          description: `Evento "${event.title}" movido para ${format(targetDate, 'dd/MM/yyyy')}`,
        });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao mover item. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setDraggedItem(null);
    }
  }, [draggedItem, updateTask, updateEvent, toast]);

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);
    setDragOverDate(null);
  }, []);

  return {
    draggedItem,
    dragOverDate,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    isDragging: !!draggedItem,
  };
};
