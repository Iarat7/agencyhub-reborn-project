
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useNotificationAutomation = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Função para verificar e criar notificações automáticas
    const checkAndCreateNotifications = async () => {
      try {
        console.log('Executando verificação automática de notificações...');
        
        // Chamar a função do banco que cria notificações automáticas
        const { error } = await supabase.rpc('check_and_create_notifications');
        
        if (error) {
          console.error('Erro ao criar notificações automáticas:', error);
        } else {
          console.log('Verificação de notificações automáticas concluída');
          // Invalidar cache das notificações para atualizar a UI
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
      } catch (error) {
        console.error('Erro na verificação automática:', error);
      }
    };

    // Executar imediatamente
    checkAndCreateNotifications();

    // Configurar para executar a cada 5 minutos
    const interval = setInterval(checkAndCreateNotifications, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [queryClient]);
};
