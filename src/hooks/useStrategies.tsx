
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
  status?: 'created' | 'in_progress' | 'completed' | 'cancelled';
  ai_generated?: boolean;
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
