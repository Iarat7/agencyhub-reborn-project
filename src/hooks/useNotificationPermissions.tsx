
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useNotificationPermissions = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const { toast } = useToast();

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        title: 'Notificações não suportadas',
        description: 'Seu navegador não suporta notificações.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        toast({
          title: 'Notificações ativadas',
          description: 'Você receberá notificações importantes.',
        });
        return true;
      } else {
        toast({
          title: 'Notificações negadas',
          description: 'Você pode ativar nas configurações do navegador.',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
      return false;
    }
  };

  const showNotification = (title: string, options?: NotificationOptions) => {
    if (permission === 'granted') {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });
    }
  };

  return {
    permission,
    requestPermission,
    showNotification,
    isSupported: 'Notification' in window,
  };
};
