
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRealtimeNotifications = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    const channel = supabase
      .channel('notifications-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications'
        },
        (payload) => {
          console.log('Nova notificação recebida:', payload);
          
          // Invalidar queries para atualizar os dados
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
          
          // Mostrar toast para notificações importantes
          const notification = payload.new as any;
          if (notification.type === 'error' || notification.type === 'warning') {
            toast({
              title: notification.title,
              description: notification.message,
              variant: notification.type === 'error' ? 'destructive' : 'default',
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast]);
};
