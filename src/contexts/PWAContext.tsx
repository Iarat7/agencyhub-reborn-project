
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { usePWA } from '@/hooks/usePWA';

interface PWAContextType {
  isOnline: boolean;
  isInstallable: boolean;
  isInstalled: boolean;
  showInstallPrompt: boolean;
  dismissInstallPrompt: () => void;
  installPWA: () => Promise<void>;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

interface PWAProviderProps {
  children: ReactNode;
}

export const PWAProvider: React.FC<PWAProviderProps> = ({ children }) => {
  const pwa = usePWA();
  const [showInstallPrompt, setShowInstallPrompt] = useState(true);

  const dismissInstallPrompt = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  React.useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      setShowInstallPrompt(false);
    }
  }, []);

  const value: PWAContextType = {
    ...pwa,
    showInstallPrompt: showInstallPrompt && pwa.isInstallable && !pwa.isInstalled,
    dismissInstallPrompt,
  };

  return (
    <PWAContext.Provider value={value}>
      {children}
    </PWAContext.Provider>
  );
};

export const usePWAContext = () => {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error('usePWAContext deve ser usado dentro de PWAProvider');
  }
  return context;
};
