
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useOrganization } from '@/contexts/OrganizationContext';

export const useFixOrphanData = () => {
  const { user } = useAuth();
  const { currentOrganization } = useOrganization();

  const fixOrphanData = async () => {
    if (!user || !currentOrganization) return;

    console.log('Verificando dados órfãos para organização:', currentOrganization.name);

    try {
      // Corrigir clientes sem organization_id
      const { data: orphanClients } = await supabase
        .from('clients')
        .select('id')
        .or(`organization_id.is.null,created_by.eq.${user.id}`);

      if (orphanClients && orphanClients.length > 0) {
        console.log('Corrigindo', orphanClients.length, 'clientes órfãos');
        
        const { error } = await supabase
          .from('clients')
          .update({ organization_id: currentOrganization.id })
          .in('id', orphanClients.map(c => c.id));

        if (error) {
          console.error('Erro ao corrigir clientes:', error);
        } else {
          console.log('Clientes órfãos corrigidos com sucesso');
        }
      }

      // Corrigir oportunidades sem organization_id
      const { data: orphanOpportunities } = await supabase
        .from('opportunities')
        .select('id')
        .or(`organization_id.is.null,created_by.eq.${user.id}`);

      if (orphanOpportunities && orphanOpportunities.length > 0) {
        console.log('Corrigindo', orphanOpportunities.length, 'oportunidades órfãs');
        
        const { error } = await supabase
          .from('opportunities')
          .update({ organization_id: currentOrganization.id })
          .in('id', orphanOpportunities.map(o => o.id));

        if (error) {
          console.error('Erro ao corrigir oportunidades:', error);
        }
      }

      // Corrigir tarefas sem organization_id
      const { data: orphanTasks } = await supabase
        .from('tasks')
        .select('id')
        .or(`organization_id.is.null,created_by.eq.${user.id}`);

      if (orphanTasks && orphanTasks.length > 0) {
        console.log('Corrigindo', orphanTasks.length, 'tarefas órfãs');
        
        const { error } = await supabase
          .from('tasks')
          .update({ organization_id: currentOrganization.id })
          .in('id', orphanTasks.map(t => t.id));

        if (error) {
          console.error('Erro ao corrigir tarefas:', error);
        }
      }

    } catch (error) {
      console.error('Erro ao corrigir dados órfãos:', error);
    }
  };

  useEffect(() => {
    if (currentOrganization) {
      // Aguardar um pouco para garantir que a organização foi carregada
      setTimeout(fixOrphanData, 1000);
    }
  }, [currentOrganization?.id]);

  return { fixOrphanData };
};
