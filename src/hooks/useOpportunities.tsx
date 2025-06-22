
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { opportunitiesService } from '@/services';
import { Opportunity } from '@/services/api/types';
import { useToast } from '@/hooks/use-toast';

export const useOpportunities = () => {
  return useQuery({
    queryKey: ['opportunities'],
    queryFn: async () => {
      console.log('Buscando oportunidades...');
      const result = await opportunitiesService.list<Opportunity>();
      console.log('Oportunidades encontradas:', result);
      return result;
    },
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
      const result = await opportunitiesService.create<Opportunity>(data);
      console.log('Oportunidade criada:', result);
      return result;
    },
    onSuccess: () => {
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
      const result = await opportunitiesService.update<Opportunity>(id, data);
      console.log('Oportunidade atualizada:', result);
      return result;
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
      const result = await opportunitiesService.delete(id);
      console.log('Oportunidade excluída:', result);
      return result;
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
