
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { opportunitiesService } from '@/services';
import { Opportunity } from '@/services/api/types';
import { useToast } from '@/hooks/use-toast';

export const useOpportunities = () => {
  return useQuery({
    queryKey: ['opportunities'],
    queryFn: () => opportunitiesService.list<Opportunity>(),
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
    mutationFn: (data: Partial<Opportunity>) => opportunitiesService.create<Opportunity>(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      toast({
        title: 'Oportunidade criada',
        description: 'Oportunidade criada com sucesso!',
      });
    },
    onError: () => {
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
    mutationFn: ({ id, data }: { id: string; data: Partial<Opportunity> }) =>
      opportunitiesService.update<Opportunity>(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      toast({
        title: 'Oportunidade atualizada',
        description: 'Oportunidade atualizada com sucesso!',
      });
    },
    onError: () => {
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
    mutationFn: (id: string) => opportunitiesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      toast({
        title: 'Oportunidade excluída',
        description: 'Oportunidade excluída com sucesso!',
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Erro ao excluir oportunidade. Tente novamente.',
        variant: 'destructive',
      });
    },
  });
};
