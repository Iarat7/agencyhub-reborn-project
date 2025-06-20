
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { financialEntriesService, clientsService, contractsService } from '@/services';
import { FinancialEntry, Client, Contract } from '@/services/api/types';
import { useToast } from '@/hooks/use-toast';

export const useFinancialEntries = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const entriesQuery = useQuery({
    queryKey: ['financial-entries'],
    queryFn: async () => {
      console.log('Fetching financial entries...');
      const result = await financialEntriesService.list<FinancialEntry>();
      console.log('Financial entries fetched:', result);
      return result;
    },
  });

  const clientsQuery = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientsService.list<Client>(),
  });

  const contractsQuery = useQuery({
    queryKey: ['contracts'],
    queryFn: () => contractsService.list<Contract>(),
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<FinancialEntry>) => {
      console.log('Creating financial entry with data:', data);
      return financialEntriesService.create<FinancialEntry>(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-entries'] });
      toast({
        title: 'Sucesso',
        description: 'Movimentação financeira criada com sucesso!',
      });
    },
    onError: (error) => {
      console.error('Error creating financial entry:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao criar movimentação financeira.',
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<FinancialEntry> }) =>
      financialEntriesService.update<FinancialEntry>(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-entries'] });
      toast({
        title: 'Sucesso',
        description: 'Movimentação financeira atualizada com sucesso!',
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar movimentação financeira.',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => financialEntriesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-entries'] });
      toast({
        title: 'Sucesso',
        description: 'Movimentação financeira excluída com sucesso!',
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Erro ao excluir movimentação financeira.',
        variant: 'destructive',
      });
    },
  });

  // Log dos dados quando mudarem
  useEffect(() => {
    console.log('Financial entries data:', entriesQuery.data);
    console.log('Financial entries loading:', entriesQuery.isLoading);
    console.log('Financial entries error:', entriesQuery.error);
  }, [entriesQuery.data, entriesQuery.isLoading, entriesQuery.error]);

  return {
    entries: entriesQuery.data || [],
    clients: clientsQuery.data || [],
    contracts: contractsQuery.data || [],
    isLoading: entriesQuery.isLoading || clientsQuery.isLoading || contractsQuery.isLoading,
    error: entriesQuery.error || clientsQuery.error || contractsQuery.error,
    createEntry: createMutation.mutate,
    updateEntry: updateMutation.mutate,
    deleteEntry: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
