
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDashboardData = () => {
  return useQuery({
    queryKey: ['dashboard-data'],
    queryFn: async () => {
      // Buscar dados de clientes
      const { data: clients } = await supabase
        .from('clients')
        .select('*');

      // Buscar dados de oportunidades
      const { data: opportunities } = await supabase
        .from('opportunities')
        .select('*');

      // Buscar dados de tarefas
      const { data: tasks } = await supabase
        .from('tasks')
        .select('*');

      console.log('Dashboard dados carregados:', { clients, opportunities, tasks });

      // Calcular métricas
      const totalClients = clients?.length || 0;
      const activeClients = clients?.filter(c => c.status === 'active').length || 0;
      const totalOpportunities = opportunities?.length || 0;
      const wonOpportunities = opportunities?.filter(o => o.stage === 'closed_won').length || 0;
      const totalRevenue = opportunities?.filter(o => o.stage === 'closed_won')
        .reduce((sum, o) => sum + (o.value || 0), 0) || 0;
      const pendingTasks = tasks?.filter(t => t.status === 'pending').length || 0;
      const completedTasks = tasks?.filter(t => t.status === 'completed').length || 0;

      // Taxa de conversão
      const conversionRate = totalOpportunities > 0 ? (wonOpportunities / totalOpportunities) * 100 : 0;

      // Dados para gráficos - últimos 6 meses
      const currentDate = new Date();
      const last6Months = Array.from({ length: 6 }, (_, i) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        return {
          month: date.toLocaleDateString('pt-BR', { month: 'short' }),
          name: date.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase(),
          value: 0
        };
      }).reverse();

      // Vendas por mês (oportunidades ganhas)
      const salesData = last6Months.map(month => ({
        ...month,
        vendas: opportunities?.filter(o => {
          if (o.stage !== 'closed_won' || !o.updated_at) return false;
          const opDate = new Date(o.updated_at);
          const monthName = opDate.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase();
          return monthName === month.name;
        }).reduce((sum, o) => sum + (o.value || 0), 0) || 0
      }));

      // Oportunidades por mês
      const opportunityData = last6Months.map(month => ({
        ...month,
        oportunidades: opportunities?.filter(o => {
          if (!o.created_at) return false;
          const opDate = new Date(o.created_at);
          const monthName = opDate.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase();
          return monthName === month.name;
        }).length || 0
      }));

      // Atividades recentes
      const recentActivities = [
        ...clients?.slice(-2).map(client => ({
          action: 'Novo cliente cadastrado',
          client: client.name,
          time: new Date(client.created_at!).toLocaleDateString('pt-BR'),
        })) || [],
        ...opportunities?.filter(o => o.stage === 'closed_won').slice(-1).map(opp => ({
          action: 'Oportunidade fechada',
          client: opp.title,
          time: new Date(opp.updated_at!).toLocaleDateString('pt-BR'),
        })) || [],
        ...tasks?.filter(t => t.status === 'completed').slice(-1).map(task => ({
          action: 'Tarefa concluída',
          client: task.title,
          time: new Date(task.updated_at!).toLocaleDateString('pt-BR'),
        })) || []
      ].slice(0, 4);

      return {
        metrics: {
          totalClients,
          activeClients,
          totalOpportunities,
          wonOpportunities,
          totalRevenue,
          pendingTasks,
          completedTasks,
          conversionRate
        },
        charts: {
          salesData,
          opportunityData
        },
        recentActivities,
        rawData: {
          clients: clients || [],
          opportunities: opportunities || [],
          tasks: tasks || []
        }
      };
    },
  });
};
