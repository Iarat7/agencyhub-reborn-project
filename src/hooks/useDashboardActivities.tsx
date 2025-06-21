
import { useQuery } from '@tanstack/react-query';

export const useDashboardActivities = () => {
  return useQuery({
    queryKey: ['dashboard-activities'],
    queryFn: async () => {
      console.log('📊 Fetching dashboard activities...');
      
      const recentActivities = [
        {
          action: 'Novo cliente cadastrado',
          client: 'Cliente Exemplo',
          time: new Date().toLocaleDateString('pt-BR'),
        },
        {
          action: 'Oportunidade fechada',
          client: 'Projeto ABC',
          time: new Date().toLocaleDateString('pt-BR'),
        },
        {
          action: 'Tarefa concluída',
          client: 'Revisão de contrato',
          time: new Date().toLocaleDateString('pt-BR'),
        }
      ];

      return recentActivities;
    },
    staleTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
