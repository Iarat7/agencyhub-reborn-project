
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useReportsData = () => {
  return useQuery({
    queryKey: ['reports-data'],
    queryFn: async () => {
      // Buscar dados de clientes com dados relacionados
      const { data: clients } = await supabase
        .from('clients')
        .select('*');

      // Buscar dados de oportunidades com informações de clientes
      const { data: opportunities } = await supabase
        .from('opportunities')
        .select(`
          *,
          clients!inner(name, company)
        `);

      // Buscar dados de tarefas com informações de clientes
      const { data: tasks } = await supabase
        .from('tasks')
        .select(`
          *,
          clients(name, company)
        `);

      console.log('Dados carregados:', { clients, opportunities, tasks });

      // Calcular métricas
      const totalClients = clients?.length || 0;
      const activeClients = clients?.filter(c => c.status === 'active').length || 0;
      const totalOpportunities = opportunities?.length || 0;
      const wonOpportunities = opportunities?.filter(o => o.stage === 'closed_won').length || 0;
      const totalRevenue = opportunities?.filter(o => o.stage === 'closed_won')
        .reduce((sum, o) => sum + (o.value || 0), 0) || 0;
      const pendingTasks = tasks?.filter(t => t.status === 'pending').length || 0;
      const completedTasks = tasks?.filter(t => t.status === 'completed').length || 0;

      // Dados para gráficos
      const opportunitiesByStage = [
        { stage: 'Prospecção', count: opportunities?.filter(o => o.stage === 'prospection').length || 0 },
        { stage: 'Qualificação', count: opportunities?.filter(o => o.stage === 'qualification').length || 0 },
        { stage: 'Proposta', count: opportunities?.filter(o => o.stage === 'proposal').length || 0 },
        { stage: 'Negociação', count: opportunities?.filter(o => o.stage === 'negotiation').length || 0 },
        { stage: 'Ganhou', count: wonOpportunities },
        { stage: 'Perdeu', count: opportunities?.filter(o => o.stage === 'closed_lost').length || 0 },
      ];

      const tasksByStatus = [
        { status: 'Pendente', count: pendingTasks },
        { status: 'Em Progresso', count: tasks?.filter(t => t.status === 'in_progress').length || 0 },
        { status: 'Em Aprovação', count: tasks?.filter(t => t.status === 'in_approval').length || 0 },
        { status: 'Concluída', count: completedTasks },
      ];

      const clientsByStatus = [
        { status: 'Ativo', count: activeClients },
        { status: 'Inativo', count: clients?.filter(c => c.status === 'inactive').length || 0 },
        { status: 'Prospect', count: clients?.filter(c => c.status === 'prospect').length || 0 },
      ];

      // Dados detalhados para relatórios mais específicos
      const recentOpportunities = opportunities?.slice(-5) || [];
      const urgentTasks = tasks?.filter(t => t.priority === 'urgent' && t.status !== 'completed') || [];

      return {
        metrics: {
          totalClients,
          activeClients,
          totalOpportunities,
          wonOpportunities,
          totalRevenue,
          pendingTasks,
          completedTasks,
        },
        charts: {
          opportunitiesByStage,
          tasksByStatus,
          clientsByStatus,
        },
        details: {
          recentOpportunities,
          urgentTasks,
          clients: clients || [],
          opportunities: opportunities || [],
          tasks: tasks || [],
        },
      };
    },
  });
};

// Hook para buscar tarefas de um cliente específico
export const useClientTasks = (clientId: string) => {
  return useQuery({
    queryKey: ['client-tasks', clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!clientId,
  });
};

// Hook para buscar oportunidades de um cliente específico
export const useClientOpportunities = (clientId: string) => {
  return useQuery({
    queryKey: ['client-opportunities', clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!clientId,
  });
};
