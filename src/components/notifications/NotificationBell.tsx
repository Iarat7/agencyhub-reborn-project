
import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { NotificationPanel } from './NotificationPanel';
import { useNotifications } from '@/hooks/useNotifications';
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications';
import { useNotificationAutomation } from '@/hooks/useNotificationAutomation';

export const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount } = useNotifications();
  
  // Ativar funcionalidades automáticas
  useRealtimeNotifications();
  useNotificationAutomation();

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs animate-pulse"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <NotificationPanel onClose={() => setIsOpen(false)} />
      </PopoverContent>
    </Popover>
  );
};
