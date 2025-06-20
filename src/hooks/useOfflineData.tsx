
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface OfflineStorage {
  clients: any[];
  opportunities: any[];
  tasks: any[];
  lastSync: string;
}

export const useOfflineData = () => {
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleOnline = () => {
      setIsOfflineMode(false);
      // Sincronizar dados quando voltar online
      syncOfflineData();
    };

    const handleOffline = () => {
      setIsOfflineMode(true);
      // Salvar dados atuais no localStorage
      saveDataOffline();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Verificar status inicial
    setIsOfflineMode(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const saveDataOffline = () => {
    try {
      const clients = queryClient.getQueryData(['clients']) || [];
      const opportunities = queryClient.getQueryData(['opportunities']) || [];
      const tasks = queryClient.getQueryData(['tasks']) || [];

      const offlineData: OfflineStorage = {
        clients,
        opportunities,
        tasks,
        lastSync: new Date().toISOString()
      };

      localStorage.setItem('agencyhub-offline-data', JSON.stringify(offlineData));
      console.log('Dados salvos para modo offline');
    } catch (error) {
      console.error('Erro ao salvar dados offline:', error);
    }
  };

  const loadOfflineData = (): OfflineStorage | null => {
    try {
      const data = localStorage.getItem('agencyhub-offline-data');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Erro ao carregar dados offline:', error);
      return null;
    }
  };

  const syncOfflineData = async () => {
    try {
      console.log('Sincronizando dados offline...');
      
      // Invalidar todas as queries para forçar refetch
      await queryClient.invalidateQueries();
      
      // Remover dados offline após sincronização
      localStorage.removeItem('agencyhub-offline-data');
      
      console.log('Sincronização concluída');
    } catch (error) {
      console.error('Erro na sincronização:', error);
    }
  };

  const getOfflineData = (queryKey: string) => {
    if (!isOfflineMode) return null;
    
    const offlineData = loadOfflineData();
    if (!offlineData) return null;

    switch (queryKey) {
      case 'clients':
        return offlineData.clients;
      case 'opportunities':
        return offlineData.opportunities;
      case 'tasks':
        return offlineData.tasks;
      default:
        return null;
    }
  };

  return {
    isOfflineMode,
    saveDataOffline,
    loadOfflineData,
    syncOfflineData,
    getOfflineData
  };
};
