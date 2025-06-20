
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAdvancedReports = () => {
  return useQuery({
    queryKey: ['advanced-reports'],
    queryFn: async () => {
      // Buscar dados dos últimos 6 meses
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const { data: opportunities } = await supabase
        .from('opportunities')
        .select('*')
        .gte('created_at', sixMonthsAgo.toISOString());

      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .gte('created_at', sixMonthsAgo.toISOString());

      const { data: clients } = await supabase
        .from('clients')
        .select('*');

      console.log('Advanced reports data:', { opportunities, tasks, clients });

      // Dados de vendas vs oportunidades por mês
      const salesData = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthName = date.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase();
        
        const monthOpportunities = opportunities?.filter(o => {
          const opDate = new Date(o.created_at!);
          return opDate.getMonth() === date.getMonth() && opDate.getFullYear() === date.getFullYear();
        }).length || 0;

        const monthSales = opportunities?.filter(o => {
          if (o.stage !== 'closed_won' || !o.updated_at) return false;
          const opDate = new Date(o.updated_at);
          return opDate.getMonth() === date.getMonth() && opDate.getFullYear() === date.getFullYear();
        }).reduce((sum, o) => sum + (o.value || 0), 0) || 0;

        return {
          name: monthName,
          vendas: monthSales,
          oportunidades: monthOpportunities
        };
      }).reverse();

      // Dados de receita vs meta (simulando metas)
      const revenueData = salesData.map(item => ({
        month: item.name,
        receita: item.vendas,
        meta: 50000 // Meta fixa para demonstração
      }));

      // Dados do funil de conversão
      const totalOpportunities = opportunities?.length || 0;
      const prospectionCount = opportunities?.filter(o => o.stage === 'prospection').length || 0;
      const qualificationCount = opportunities?.filter(o => o.stage === 'qualification').length || 0;
      const proposalCount = opportunities?.filter(o => o.stage === 'proposal').length || 0;
      const negotiationCount = opportunities?.filter(o => o.stage === 'negotiation').length || 0;
      const closedWonCount = opportunities?.filter(o => o.stage === 'closed_won').length || 0;

      const conversionData = [
        { stage: 'Prospects', conversion: totalOpportunities > 0 ? 100 : 0 },
        { stage: 'Qualificação', conversion: totalOpportunities > 0 ? Math.round((qualificationCount / totalOpportunities) * 100) : 0 },
        { stage: 'Proposta', conversion: totalOpportunities > 0 ? Math.round((proposalCount / totalOpportunities) * 100) : 0 },
        { stage: 'Negociação', conversion: totalOpportunities > 0 ? Math.round((negotiationCount / totalOpportunities) * 100) : 0 },
        { stage: 'Fechado', conversion: totalOpportunities > 0 ? Math.round((closedWonCount / totalOpportunities) * 100) : 0 }
      ];

      // Dados de atividades por dia (últimos 30 dias)
      const activityData = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        const dayTasks = tasks?.filter(t => {
          const taskDate = new Date(t.created_at!);
          return taskDate.toDateString() === date.toDateString();
        }).length || 0;

        const dayOpportunities = opportunities?.filter(o => {
          const opDate = new Date(o.created_at!);
          return opDate.toDateString() === date.toDateString();
        }).length || 0;

        return {
          day: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
          atividades: dayTasks + dayOpportunities
        };
      }).reverse();

      // Métricas resumidas
      const totalRevenue = opportunities?.filter(o => o.stage === 'closed_won')
        .reduce((sum, o) => sum + (o.value || 0), 0) || 0;
      
      const avgDealSize = closedWonCount > 0 ? totalRevenue / closedWonCount : 0;
      const conversionRate = totalOpportunities > 0 ? (closedWonCount / totalOpportunities) * 100 : 0;
      const activeTasks = tasks?.filter(t => t.status === 'pending' || t.status === 'in_progress').length || 0;

      return {
        charts: {
          salesData,
          revenueData,
          conversionData,
          activityData
        },
        metrics: {
          totalRevenue,
          avgDealSize,
          conversionRate,
          activeTasks,
          totalOpportunities,
          totalClients: clients?.length || 0
        }
      };
    },
  });
};
