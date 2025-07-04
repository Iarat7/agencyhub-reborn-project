
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { opportunitiesService } from '@/services';
import { Opportunity } from '@/services/api/types';
import { useToast } from '@/hooks/use-toast';
import { useOrganization } from '@/contexts/OrganizationContext';

export const useOpportunities = () => {
  const { currentOrganization } = useOrganization();

  return useQuery({
    queryKey: ['opportunities', currentOrganization?.id],
    queryFn: async () => {
      if (!currentOrganization) {
        return [];
      }
      
      console.log('Buscando oportunidades para organização:', currentOrganization.name);
      
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .eq('organization_id', currentOrganization.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Erro ao buscar oportunidades:', error);
        throw error;
      }
      
      console.log('Oportunidades encontradas:', data?.length || 0);
      return (data || []) as Opportunity[];
    },
    enabled: !!currentOrganization,
  });
};

export const useOpportunity = (id: string) => {
  return useQuery({
    queryKey: ['opportunities', id],
    queryFn: () => opportunitiesService.get<Opportunity>(id),
    enabled: !!id,
  });
};

export const useCreateOpportunity = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Partial<Opportunity>) => {
      console.log('Criando oportunidade:', data);
      try {
        const result = await opportunitiesService.create<Opportunity>(data);
        console.log('Oportunidade criada com sucesso:', result);
        return result;
      } catch (error) {
        console.error('Erro detalhado ao criar oportunidade:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Invalidando cache e mostrando toast de sucesso');
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      toast({
        title: 'Oportunidade criada',
        description: 'Oportunidade criada com sucesso!',
      });
    },
    onError: (error) => {
      console.error('Erro ao criar oportunidade:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao criar oportunidade. Tente novamente.',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateOpportunity = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Opportunity> }) => {
      console.log('Atualizando oportunidade:', id, data);
      try {
        const result = await opportunitiesService.update<Opportunity>(id, data);
        console.log('Oportunidade atualizada com sucesso:', result);
        return result;
      } catch (error) {
        console.error('Erro detalhado ao atualizar oportunidade:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      toast({
        title: 'Oportunidade atualizada',
        description: 'Oportunidade atualizada com sucesso!',
      });
    },
    onError: (error) => {
      console.error('Erro ao atualizar oportunidade:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar oportunidade. Tente novamente.',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteOpportunity = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Excluindo oportunidade:', id);
      try {
        const result = await opportunitiesService.delete(id);
        console.log('Oportunidade excluída com sucesso:', result);
        return result;
      } catch (error) {
        console.error('Erro detalhado ao excluir oportunidade:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      toast({
        title: 'Oportunidade excluída',
        description: 'Oportunidade excluída com sucesso!',
      });
    },
    onError: (error) => {
      console.error('Erro ao excluir oportunidade:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir oportunidade. Tente novamente.',
        variant: 'destructive',
      });
    },
  });
};
