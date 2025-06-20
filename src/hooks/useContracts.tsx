
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contractsService, clientsService } from '@/services';
import { Contract, Client } from '@/services/api/types';
import { useToast } from '@/hooks/use-toast';

export const useContracts = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const contractsQuery = useQuery({
    queryKey: ['contracts'],
    queryFn: () => contractsService.list<Contract>(),
  });

  const clientsQuery = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientsService.list<Client>(),
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Contract>) => contractsService.create<Contract>(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      toast({
        title: 'Sucesso',
        description: 'Contrato criado com sucesso!',
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Erro ao criar contrato.',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Contract> }) =>
      contractsService.update<Contract>(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      toast({
        title: 'Sucesso',
        description: 'Contrato atualizado com sucesso!',
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar contrato.',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => contractsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      toast({
        title: 'Sucesso',
        description: 'Contrato excluído com sucesso!',
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Erro ao excluir contrato.',
        variant: 'destructive',
      });
    },
  });

  return {
    contracts: contractsQuery.data || [],
    clients: clientsQuery.data || [],
    isLoading: contractsQuery.isLoading || clientsQuery.isLoading,
    error: contractsQuery.error || clientsQuery.error,
    createContract: createMutation.mutate,
    updateContract: updateMutation.mutate,
    deleteContract: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
