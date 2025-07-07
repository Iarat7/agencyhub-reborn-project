import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useOrganization } from '@/contexts/OrganizationContext';
import { useToast } from '@/hooks/use-toast';

export const useOrganizationData = () => {
  const { user } = useAuth();
  const { currentOrganization } = useOrganization();
  const { toast } = useToast();

  const ensureOrganizationData = async () => {
    if (!user || !currentOrganization) return;

    console.log('Verificando dados da organização:', currentOrganization.name);

    try {
      // Corrigir dados sem organization_id
      const updates = [];

      // Clientes sem organization_id
      const { data: orphanClients } = await supabase
        .from('clients')
        .select('id')
        .is('organization_id', null)
        .eq('created_by', user.id);

      if (orphanClients && orphanClients.length > 0) {
        updates.push(
          supabase
            .from('clients')
            .update({ organization_id: currentOrganization.id })
            .in('id', orphanClients.map(c => c.id))
        );
      }

      // Oportunidades sem organization_id
      const { data: orphanOpportunities } = await supabase
        .from('opportunities')
        .select('id')
        .is('organization_id', null)
        .eq('created_by', user.id);

      if (orphanOpportunities && orphanOpportunities.length > 0) {
        updates.push(
          supabase
            .from('opportunities')
            .update({ organization_id: currentOrganization.id })
            .in('id', orphanOpportunities.map(o => o.id))
        );
      }

      // Tarefas sem organization_id
      const { data: orphanTasks } = await supabase
        .from('tasks')
        .select('id')
        .is('organization_id', null)
        .eq('created_by', user.id);

      if (orphanTasks && orphanTasks.length > 0) {
        updates.push(
          supabase
            .from('tasks')
            .update({ organization_id: currentOrganization.id })
            .in('id', orphanTasks.map(t => t.id))
        );
      }

      // Eventos sem organization_id
      const { data: orphanEvents } = await supabase
        .from('events')
        .select('id')
        .is('organization_id', null)
        .eq('created_by', user.id);

      if (orphanEvents && orphanEvents.length > 0) {
        updates.push(
          supabase
            .from('events')
            .update({ organization_id: currentOrganization.id })
            .in('id', orphanEvents.map(e => e.id))
        );
      }

      // Contratos sem organization_id
      const { data: orphanContracts } = await supabase
        .from('contracts')
        .select('id')
        .is('organization_id', null)
        .eq('created_by', user.id);

      if (orphanContracts && orphanContracts.length > 0) {
        updates.push(
          supabase
            .from('contracts')
            .update({ organization_id: currentOrganization.id })
            .in('id', orphanContracts.map(c => c.id))
        );
      }

      // Entradas financeiras sem organization_id
      const { data: orphanFinancialEntries } = await supabase
        .from('financial_entries')
        .select('id')
        .is('organization_id', null)
        .eq('created_by', user.id);

      if (orphanFinancialEntries && orphanFinancialEntries.length > 0) {
        updates.push(
          supabase
            .from('financial_entries')
            .update({ organization_id: currentOrganization.id })
            .in('id', orphanFinancialEntries.map(f => f.id))
        );
      }

      // Estratégias sem organization_id
      const { data: orphanStrategies } = await supabase
        .from('strategies')
        .select('id')
        .is('organization_id', null)
        .eq('created_by', user.id);

      if (orphanStrategies && orphanStrategies.length > 0) {
        updates.push(
          supabase
            .from('strategies')
            .update({ organization_id: currentOrganization.id })
            .in('id', orphanStrategies.map(s => s.id))
        );
      }

      // Executar todas as atualizações
      if (updates.length > 0) {
        console.log(`Corrigindo ${updates.length} tipos de dados órfãos...`);
        await Promise.all(updates);
        
        toast({
          title: "Dados atualizados",
          description: "Seus dados foram vinculados à organização atual.",
        });
      }

    } catch (error) {
      console.error('Erro ao corrigir dados da organização:', error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar dados da organização.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (currentOrganization && user) {
      // Executar apenas uma vez quando a organização muda
      ensureOrganizationData();
    }
  }, [currentOrganization?.id]);

  return { ensureOrganizationData };
};