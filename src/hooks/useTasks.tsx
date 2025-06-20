
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksService } from '@/services';
import { Task } from '@/services/api/types';
import { useToast } from '@/hooks/use-toast';

export const useTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: () => tasksService.list<Task>(),
  });
};

export const useTask = (id: string) => {
  return useQuery({
    queryKey: ['tasks', id],
    queryFn: () => tasksService.get<Task>(id),
    enabled: !!id,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: Partial<Task>) => tasksService.create<Task>(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: 'Tarefa criada',
        description: 'Tarefa criada com sucesso!',
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Erro ao criar tarefa. Tente novamente.',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Task> }) =>
      tasksService.update<Task>(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: 'Tarefa atualizada',
        description: 'Tarefa atualizada com sucesso!',
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar tarefa. Tente novamente.',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => tasksService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: 'Tarefa excluída',
        description: 'Tarefa excluída com sucesso!',
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Erro ao excluir tarefa. Tente novamente.',
        variant: 'destructive',
      });
    },
  });
};
