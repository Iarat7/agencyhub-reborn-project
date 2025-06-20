
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useCalendarRealtime = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    // Escutar mudanças em tarefas
    const tasksChannel = supabase
      .channel('tasks-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks'
        },
        (payload) => {
          console.log('Mudança em tarefas:', payload);
          queryClient.invalidateQueries({ queryKey: ['tasks'] });
          
          if (payload.eventType === 'INSERT' && payload.new) {
            toast({
              title: 'Nova tarefa',
              description: `Tarefa "${payload.new.title}" foi criada`,
            });
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            toast({
              title: 'Tarefa atualizada',
              description: `Tarefa "${payload.new.title}" foi atualizada`,
            });
          }
        }
      )
      .subscribe();

    // Escutar mudanças em eventos
    const eventsChannel = supabase
      .channel('events-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events'
        },
        (payload) => {
          console.log('Mudança em eventos:', payload);
          queryClient.invalidateQueries({ queryKey: ['events'] });
          
          if (payload.eventType === 'INSERT' && payload.new) {
            toast({
              title: 'Novo evento',
              description: `Evento "${payload.new.title}" foi criado`,
            });
          } else if (payload.eventType === 'UPDATE' && payload.new) {
            toast({
              title: 'Evento atualizado',
              description: `Evento "${payload.new.title}" foi atualizado`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(tasksChannel);
      supabase.removeChannel(eventsChannel);
    };
  }, [queryClient, toast]);
};
