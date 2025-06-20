
import React from 'react';
import { AlertTriangle, Calendar, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/hooks/useNotifications';

export const NotificationAlerts = () => {
  const { notifications } = useNotifications();

  // Filtrar apenas notificações não lidas e importantes
  const urgentNotifications = notifications.filter(
    n => !n.is_read && (n.type === 'error' || n.type === 'warning')
  ).slice(0, 3); // Mostrar apenas as 3 mais recentes

  if (urgentNotifications.length === 0) return null;

  return (
    <div className="space-y-3 mb-6">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-yellow-500" />
        <h3 className="text-lg font-semibold">Alertas Importantes</h3>
      </div>
      
      {urgentNotifications.map((notification) => (
        <Alert 
          key={notification.id} 
          variant={notification.type === 'error' ? 'destructive' : 'default'}
          className="border-l-4"
        >
          <div className="flex items-start gap-3">
            {notification.category === 'task' && <Calendar className="h-4 w-4 mt-0.5" />}
            {notification.category === 'opportunity' && <TrendingUp className="h-4 w-4 mt-0.5" />}
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <AlertDescription className="font-medium">
                  {notification.title}
                </AlertDescription>
                <Badge variant={notification.type === 'error' ? 'destructive' : 'secondary'} className="text-xs">
                  {notification.category === 'task' ? 'Tarefa' : 'Oportunidade'}
                </Badge>
              </div>
              <AlertDescription className="text-sm text-muted-foreground">
                {notification.message}
              </AlertDescription>
            </div>
          </div>
        </Alert>
      ))}
    </div>
  );
};
