
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
      
      // Verificar e atualizar entries vencidas
      if (result && result.length > 0) {
        await checkAndUpdateOverdueEntries(result);
      }
      
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

  // Função para verificar e atualizar movimentações vencidas
  const checkAndUpdateOverdueEntries = async (entries: FinancialEntry[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Zerar horas para comparar apenas datas
    
    const entriesToUpdate = entries.filter(entry => {
      if (!entry.due_date || entry.status === 'paid' || entry.status === 'cancelled') {
        return false;
      }
      
      const dueDate = new Date(entry.due_date);
      dueDate.setHours(0, 0, 0, 0);
      
      // Se a data de vencimento passou e não está paga, deve ser marcada como vencida
      return dueDate < today && entry.status !== 'overdue';
    });

    // Atualizar entries vencidas em lote
    for (const entry of entriesToUpdate) {
      try {
        await financialEntriesService.update<FinancialEntry>(entry.id, { status: 'overdue' });
        console.log(`Entry ${entry.id} updated to overdue status`);
      } catch (error) {
        console.error(`Error updating entry ${entry.id} to overdue:`, error);
      }
    }

    // Se houve atualizações, invalidar a query para refetch
    if (entriesToUpdate.length > 0) {
      queryClient.invalidateQueries({ queryKey: ['financial-entries'] });
    }
  };

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

  // Verificar movimentações vencidas periodicamente (a cada 5 minutos)
  useEffect(() => {
    const interval = setInterval(() => {
      if (entriesQuery.data && entriesQuery.data.length > 0) {
        checkAndUpdateOverdueEntries(entriesQuery.data);
      }
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, [entriesQuery.data]);

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
