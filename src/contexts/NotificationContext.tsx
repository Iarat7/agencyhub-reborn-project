
import React, { createContext, useContext, ReactNode } from 'react';
import { useNotificationSystem, NotificationItem } from '@/hooks/useNotificationSystem';
import { useNotificationPermissions } from '@/hooks/useNotificationPermissions';

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => string;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  // Novas funcionalidades
  permission: NotificationPermission;
  requestPermission: () => Promise<boolean>;
  showBrowserNotification: (title: string, options?: NotificationOptions) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const notificationSystem = useNotificationSystem();
  const permissions = useNotificationPermissions();

  const contextValue = {
    ...notificationSystem,
    permission: permissions.permission,
    requestPermission: permissions.requestPermission,
    showBrowserNotification: permissions.showNotification,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};
