
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export interface Strategy {
  id: string;
  title: string;
  objectives?: string;
  challenges?: string;
  target_audience?: string;
  client_id?: string;
  budget?: number;
  deadline?: string;
  status?: string;
  ai_generated?: boolean;
  ai_strategy_content?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export const useStrategies = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['strategies', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('strategies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching strategies:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user?.id,
  });
};

export const useStrategy = (strategyId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['strategy', strategyId, user?.id],
    queryFn: async () => {
      if (!user?.id || !strategyId) return null;

      const { data, error } = await supabase
        .from('strategies')
        .select('*')
        .eq('id', strategyId)
        .single();

      if (error) {
        console.error('Error fetching strategy:', error);
        throw error;
      }

      return data;
    },
    enabled: !!user?.id && !!strategyId,
  });
};

export const useCreateStrategy = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (strategy: Omit<Strategy, 'id' | 'created_at' | 'updated_at'>) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('strategies')
        .insert({
          ...strategy,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating strategy:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategies'] });
      toast({
        title: 'Estratégia criada',
        description: 'A estratégia foi criada com sucesso.',
      });
    },
    onError: (error) => {
      console.error('Error creating strategy:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao criar a estratégia.',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateStrategyStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('strategies')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating strategy status:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategies'] });
      toast({
        title: 'Status atualizado',
        description: 'O status da estratégia foi atualizado com sucesso.',
      });
    },
    onError: (error) => {
      console.error('Error updating strategy status:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao atualizar o status da estratégia.',
        variant: 'destructive',
      });
    },
  });
};
