
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
    retry: 3,
    refetchOnWindowFocus: false,
  });

  const clientsQuery = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientsService.list<Client>(),
    retry: 3,
    refetchOnWindowFocus: false,
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Contract>) => {
      console.log('Creating contract with data:', data);
      return contractsService.create<Contract>(data);
    },
    onSuccess: (result) => {
      console.log('Contract created successfully:', result);
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      toast({
        title: 'Sucesso',
        description: 'Contrato criado com sucesso!',
      });
    },
    onError: (error) => {
      console.error('Error creating contract:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao criar contrato.',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Contract> }) => {
      console.log('Updating contract:', id, data);
      return contractsService.update<Contract>(id, data);
    },
    onSuccess: (result) => {
      console.log('Contract updated successfully:', result);
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      toast({
        title: 'Sucesso',
        description: 'Contrato atualizado com sucesso!',
      });
    },
    onError: (error) => {
      console.error('Error updating contract:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar contrato.',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      console.log('Deleting contract:', id);
      return contractsService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      toast({
        title: 'Sucesso',
        description: 'Contrato excluído com sucesso!',
      });
    },
    onError: (error) => {
      console.error('Error deleting contract:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir contrato.',
        variant: 'destructive',
      });
    },
  });

  // Debug: log dos dados
  useEffect(() => {
    console.log('Contracts query data:', contractsQuery.data);
    console.log('Contracts query status:', contractsQuery.status);
    console.log('Contracts query error:', contractsQuery.error);
  }, [contractsQuery.data, contractsQuery.status, contractsQuery.error]);

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
