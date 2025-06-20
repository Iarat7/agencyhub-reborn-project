
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wifi, WifiOff } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

export const OfflineNotification = () => {
  const { isOnline } = usePWA();

  if (isOnline) return null;

  return (
    <Alert className="fixed top-4 left-4 right-4 z-50 bg-yellow-50 border-yellow-200">
      <WifiOff className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="text-yellow-800">
        Você está offline. Algumas funcionalidades podem estar limitadas.
      </AlertDescription>
    </Alert>
  );
};
