
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
          endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        } else {
          startDate = new Date(now.getTime() - (periodConfig.days! * 24 * 60 * 60 * 1000));
        }
      } else if (periodConfig?.type === 'yesterday') {
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        startDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
        endDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59);
      } else if (periodConfig?.type === 'current_month') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      } else if (periodConfig?.type === 'last_month') {
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
      } else {
        // months type - comportamento anterior
        const months = periodConfig?.months || 6;
        startDate = new Date(now.getFullYear(), now.getMonth() - months, 1);
      }

      console.log('Período selecionado:', selectedPeriod, 'Data início:', startDate, 'Data fim:', endDate);

      // Buscar dados com filtro de data quando aplicável
      const startDateISO = startDate.toISOString();
      const endDateISO = endDate.toISOString();

      const { data: clients } = await supabase
        .from('clients')
        .select('*')
        .gte('created_at', startDateISO)
        .lte('created_at', endDateISO);

      const { data: allClients } = await supabase
        .from('clients')
        .select('*');

      const { data: opportunities } = await supabase
        .from('opportunities')
        .select('*')
        .gte('created_at', startDateISO)
        .lte('created_at', endDateISO);

      const { data: allOpportunities } = await supabase
        .from('opportunities')
        .select('*');

      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .gte('created_at', startDateISO)
        .lte('created_at', endDateISO);

      const { data: allTasks } = await supabase
        .from('tasks')
        .select('*');

      console.log('Dashboard dados carregados:', { 
        clientsNoPeriodo: clients?.length, 
        opportunitiesNoPeriodo: opportunities?.length, 
        tasksNoPeriodo: tasks?.length 
      });

      // Calcular métricas baseadas no período selecionado
      const totalClients = clients?.length || 0;
      const activeClients = allClients?.filter(c => c.status === 'active').length || 0;
      const totalOpportunities = opportunities?.length || 0;
      
      // Para oportunidades fechadas, filtrar por updated_at no período
      const wonOpportunities = allOpportunities?.filter(o => {
        if (o.stage !== 'closed_won' || !o.updated_at) return false;
        const opDate = new Date(o.updated_at);
        return opDate >= startDate && opDate <= endDate;
      }).length || 0;

      const totalRevenue = allOpportunities?.filter(o => {
        if (o.stage !== 'closed_won' || !o.updated_at) return false;
        const opDate = new Date(o.updated_at);
        return opDate >= startDate && opDate <= endDate;
      }).reduce((sum, o) => sum + (o.value || 0), 0) || 0;

      const pendingTasks = tasks?.filter(t => t.status === 'pending').length || 0;
      const completedTasks = tasks?.filter(t => t.status === 'completed').length || 0;

      const conversionRate = totalOpportunities > 0 ? (wonOpportunities / totalOpportunities) * 100 : 0;

      // Gerar dados para gráficos baseado no tipo de período
      let chartData = [];
      
      if (periodConfig?.type === 'days' || periodConfig?.type === 'current_month' || periodConfig?.type === 'last_month' || periodConfig?.type === 'yesterday') {
        // Para períodos de dias, gerar dados diários
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const daysToShow = Math.min(diffDays + 1, 30); // +1 para incluir o dia atual, máximo 30 dias
        
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
        vendas: allOpportunities?.filter(o => {
          if (o.stage !== 'closed_won' || !o.updated_at) return false;
          const opDate = new Date(o.updated_at);
          
          if (periodConfig?.type === 'days' || periodConfig?.type === 'current_month' || periodConfig?.type === 'last_month' || periodConfig?.type === 'yesterday') {
            const itemDate = item.name.split('/');
            const itemDay = parseInt(itemDate[0]);
            const itemMonth = parseInt(itemDate[1]);
            return opDate.getDate() === itemDay && (opDate.getMonth() + 1) === itemMonth && opDate.getFullYear() === now.getFullYear();
          } else {
            const monthName = opDate.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase();
            return monthName === item.name;
          }
        }).reduce((sum, o) => sum + (o.value || 0), 0) || 0
      }));

      const opportunityData = chartData.map(item => ({
        ...item,
        oportunidades: opportunities?.filter(o => {
          if (!o.created_at) return false;
          const opDate = new Date(o.created_at);
          
          if (periodConfig?.type === 'days' || periodConfig?.type === 'current_month' || periodConfig?.type === 'last_month' || periodConfig?.type === 'yesterday') {
            const itemDate = item.name.split('/');
            const itemDay = parseInt(itemDate[0]);
            const itemMonth = parseInt(itemDate[1]);
            return opDate.getDate() === itemDay && (opDate.getMonth() + 1) === itemMonth && opDate.getFullYear() === now.getFullYear();
          } else {
            const monthName = opDate.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase();
            return monthName === item.name;
          }
        }).length || 0
      }));

      const recentActivities = [
        ...clients?.slice(-2).map(client => ({
          action: 'Novo cliente cadastrado',
          client: client.name,
          time: new Date(client.created_at!).toLocaleDateString('pt-BR'),
        })) || [],
        ...allOpportunities?.filter(o => {
          if (o.stage !== 'closed_won' || !o.updated_at) return false;
          const opDate = new Date(o.updated_at);
          return opDate >= startDate && opDate <= endDate;
        }).slice(-1).map(opp => ({
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
