
import { useQuery } from '@tanstack/react-query';
import { useOrganization } from '@/contexts/OrganizationContext';

interface ActivityData {
  clients: any[];
  allOpportunities: any[];
  tasks: any[];
}

export const useDashboardActivities = (startDate: Date, endDate: Date, data: ActivityData) => {
  const { currentOrganization } = useOrganization();

  return useQuery({
    queryKey: ['dashboard-activities', startDate.toISOString(), endDate.toISOString(), currentOrganization?.id],
    queryFn: async () => {
      if (!currentOrganization) {
        console.log('Nenhuma organização para buscar atividades');
        return [];
      }

      console.log('Buscando atividades recentes para organização:', currentOrganization.name);
      
      if (!data || !data.clients || !data.allOpportunities || !data.tasks) {
        return [];
      }
      
      const recentActivities = [
        ...data.clients?.slice(-2).map(client => ({
          action: 'Novo cliente cadastrado',
          client: client.name,
          time: new Date(client.created_at!).toLocaleDateString('pt-BR'),
        })) || [],
        ...data.allOpportunities?.filter(o => {
          if (o.stage !== 'closed_won' || !o.updated_at) return false;
          const opDate = new Date(o.updated_at);
          return opDate >= startDate && opDate <= endDate;
        }).slice(-1).map(opp => ({
          action: 'Oportunidade fechada',
          client: opp.title,
          time: new Date(opp.updated_at!).toLocaleDateString('pt-BR'),
        })) || [],
        ...data.tasks?.filter(t => t.status === 'completed').slice(-1).map(task => ({
          action: 'Tarefa concluída',
          client: task.title,
          time: new Date(task.updated_at!).toLocaleDateString('pt-BR'),
        })) || []
      ].slice(0, 4);

      return recentActivities;
    },
    enabled: !!(currentOrganization && data?.clients?.length !== undefined),
    staleTime: 30 * 60 * 1000, // 30 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
  });
};
