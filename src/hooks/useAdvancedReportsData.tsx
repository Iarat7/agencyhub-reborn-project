
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { subDays, subMonths, subYears, startOfDay, endOfDay } from 'date-fns';

interface AdvancedReportsFilter {
  period: string;
  dateRange?: { from?: Date; to?: Date };
}

export const useAdvancedReportsData = (filters: AdvancedReportsFilter) => {
  return useQuery({
    queryKey: ['advanced-reports', filters],
    queryFn: async () => {
      const now = new Date();
      let startDate: Date;
      let endDate: Date = endOfDay(now);

      // Calcular datas baseadas no período
      switch (filters.period) {
        case '7d':
          startDate = startOfDay(subDays(now, 7));
          break;
        case '30d':
          startDate = startOfDay(subDays(now, 30));
          break;
        case '3m':
          startDate = startOfDay(subMonths(now, 3));
          break;
        case '6m':
          startDate = startOfDay(subMonths(now, 6));
          break;
        case '1y':
          startDate = startOfDay(subYears(now, 1));
          break;
        case 'custom':
          if (filters.dateRange?.from && filters.dateRange?.to) {
            startDate = startOfDay(filters.dateRange.from);
            endDate = endOfDay(filters.dateRange.to);
          } else {
            startDate = startOfDay(subMonths(now, 6));
          }
          break;
        default:
          startDate = startOfDay(subMonths(now, 6));
      }

      console.log('Fetching advanced reports data for period:', filters.period, 'from:', startDate, 'to:', endDate);

      // Buscar dados do período atual
      const [clientsResult, opportunitiesResult, tasksResult] = await Promise.all([
        supabase
          .from('clients')
          .select('*')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString()),
        
        supabase
          .from('opportunities')
          .select('*')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString()),
        
        supabase
          .from('tasks')
          .select('*')
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString())
      ]);

      // Buscar dados do período anterior para comparação
      const periodDiff = endDate.getTime() - startDate.getTime();
      const previousStartDate = new Date(startDate.getTime() - periodDiff);
      const previousEndDate = new Date(startDate.getTime() - 1);

      const [prevClientsResult, prevOpportunitiesResult, prevTasksResult] = await Promise.all([
        supabase
          .from('clients')
          .select('*')
          .gte('created_at', previousStartDate.toISOString())
          .lte('created_at', previousEndDate.toISOString()),
        
        supabase
          .from('opportunities')
          .select('*')
          .gte('created_at', previousStartDate.toISOString())
          .lte('created_at', previousEndDate.toISOString()),
        
        supabase
          .from('tasks')
          .select('*')
          .gte('created_at', previousStartDate.toISOString())
          .lte('created_at', previousEndDate.toISOString())
      ]);

      const clients = clientsResult.data || [];
      const opportunities = opportunitiesResult.data || [];
      const tasks = tasksResult.data || [];
      
      const prevClients = prevClientsResult.data || [];
      const prevOpportunities = prevOpportunitiesResult.data || [];
      const prevTasks = prevTasksResult.data || [];

      // Calcular métricas atuais
      const metrics = {
        totalClients: clients.length,
        newClients: clients.filter(c => c.status === 'active').length,
        totalOpportunities: opportunities.length,
        wonOpportunities: opportunities.filter(o => o.stage === 'closed_won').length,
        totalRevenue: opportunities
          .filter(o => o.stage === 'closed_won')
          .reduce((sum, o) => sum + (o.value || 0), 0),
        averageDealSize: 0,
        conversionRate: 0,
        pendingTasks: tasks.filter(t => t.status === 'pending').length,
        completedTasks: tasks.filter(t => t.status === 'completed').length,
        taskCompletionRate: 0,
      };

      // Calcular métricas do período anterior
      const prevMetrics = {
        totalClients: prevClients.length,
        newClients: prevClients.filter(c => c.status === 'active').length,
        totalOpportunities: prevOpportunities.length,
        wonOpportunities: prevOpportunities.filter(o => o.stage === 'closed_won').length,
        totalRevenue: prevOpportunities
          .filter(o => o.stage === 'closed_won')
          .reduce((sum, o) => sum + (o.value || 0), 0),
        pendingTasks: prevTasks.filter(t => t.status === 'pending').length,
        completedTasks: prevTasks.filter(t => t.status === 'completed').length,
      };

      // Calcular taxas
      if (metrics.wonOpportunities > 0) {
        metrics.averageDealSize = metrics.totalRevenue / metrics.wonOpportunities;
      }
      
      if (metrics.totalOpportunities > 0) {
        metrics.conversionRate = (metrics.wonOpportunities / metrics.totalOpportunities) * 100;
      }
      
      if (metrics.completedTasks + metrics.pendingTasks > 0) {
        metrics.taskCompletionRate = (metrics.completedTasks / (metrics.completedTasks + metrics.pendingTasks)) * 100;
      }

      // Dados para gráficos por mês
      const monthlyData = [];
      const currentMonth = new Date(startDate);
      
      while (currentMonth <= endDate) {
        const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
        
        const monthOpportunities = opportunities.filter(o => {
          const opDate = new Date(o.created_at!);
          return opDate >= monthStart && opDate <= monthEnd;
        });
        
        const monthRevenue = monthOpportunities
          .filter(o => o.stage === 'closed_won')
          .reduce((sum, o) => sum + (o.value || 0), 0);
        
        monthlyData.push({
          month: monthStart.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
          opportunities: monthOpportunities.length,
          revenue: monthRevenue,
          clients: clients.filter(c => {
            const clientDate = new Date(c.created_at!);
            return clientDate >= monthStart && clientDate <= monthEnd;
          }).length
        });
        
        currentMonth.setMonth(currentMonth.getMonth() + 1);
      }

      return {
        metrics,
        prevMetrics,
        chartData: {
          monthly: monthlyData,
          opportunities: opportunities,
          clients: clients,
          tasks: tasks
        },
        rawData: {
          clients,
          opportunities,
          tasks
        },
        period: {
          start: startDate,
          end: endDate,
          label: filters.period
        }
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};
