
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { periodOptions } from '@/components/dashboard/PeriodSelector';

export const useDashboardData = (selectedPeriod: string = '6m') => {
  return useQuery({
    queryKey: ['dashboard-data', selectedPeriod],
    queryFn: async () => {
      const periodConfig = periodOptions.find(p => p.value === selectedPeriod);
      
      // Calcular datas baseado no tipo de período
      const now = new Date();
      let startDate: Date;
      let endDate = new Date(now);
      
      if (periodConfig?.type === 'days') {
        if (periodConfig.value === 'today') {
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        } else {
          startDate = new Date(now.getTime() - (periodConfig.days! * 24 * 60 * 60 * 1000));
        }
      } else if (periodConfig?.type === 'current_month') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      } else if (periodConfig?.type === 'last_month') {
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0);
      } else {
        // months type - comportamento anterior
        const months = periodConfig?.months || 6;
        startDate = new Date(now.getFullYear(), now.getMonth() - months, 1);
      }

      console.log('Período selecionado:', selectedPeriod, 'Data início:', startDate, 'Data fim:', endDate);

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

      // Gerar dados para gráficos baseado no tipo de período
      let chartData = [];
      
      if (periodConfig?.type === 'days' || periodConfig?.type === 'current_month' || periodConfig?.type === 'last_month') {
        // Para períodos de dias, gerar dados diários
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const daysToShow = Math.min(diffDays, 30); // Máximo 30 dias para visualização
        
        chartData = Array.from({ length: daysToShow }, (_, i) => {
          const date = new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000));
          return {
            name: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
            value: 0
          };
        });
      } else {
        // Para períodos de meses, usar comportamento anterior
        const months = periodConfig?.months || 6;
        chartData = Array.from({ length: months }, (_, i) => {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          return {
            month: date.toLocaleDateString('pt-BR', { month: 'short' }),
            name: date.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase(),
            value: 0
          };
        }).reverse();
      }

      // Vendas por período
      const salesData = chartData.map(item => ({
        ...item,
        vendas: opportunities?.filter(o => {
          if (o.stage !== 'closed_won' || !o.updated_at) return false;
          const opDate = new Date(o.updated_at);
          
          if (periodConfig?.type === 'days' || periodConfig?.type === 'current_month' || periodConfig?.type === 'last_month') {
            const itemDate = item.name.split('/');
            const itemDay = parseInt(itemDate[0]);
            const itemMonth = parseInt(itemDate[1]);
            return opDate.getDate() === itemDay && (opDate.getMonth() + 1) === itemMonth;
          } else {
            const monthName = opDate.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase();
            return monthName === item.name;
          }
        }).reduce((sum, o) => sum + (o.value || 0), 0) || 0
      }));

      // Oportunidades por período
      const opportunityData = chartData.map(item => ({
        ...item,
        oportunidades: opportunities?.filter(o => {
          if (!o.created_at) return false;
          const opDate = new Date(o.created_at);
          
          if (periodConfig?.type === 'days' || periodConfig?.type === 'current_month' || periodConfig?.type === 'last_month') {
            const itemDate = item.name.split('/');
            const itemDay = parseInt(itemDate[0]);
            const itemMonth = parseInt(itemDate[1]);
            return opDate.getDate() === itemDay && (opDate.getMonth() + 1) === itemMonth;
          } else {
            const monthName = opDate.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase();
            return monthName === item.name;
          }
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
