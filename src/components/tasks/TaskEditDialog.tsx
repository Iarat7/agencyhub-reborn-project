
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TaskForm } from './TaskForm';
import { Task } from '@/services/api/types';
import { useUpdateTask } from '@/hooks/useTasks';
import { useToast } from '@/hooks/use-toast';

interface TaskEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
}

export const TaskEditDialog = ({ open, onOpenChange, task }: TaskEditDialogProps) => {
  const updateTask = useUpdateTask();
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    if (!task) return;

    try {
      await updateTask.mutateAsync({ id: task.id, data });
      toast({
        title: 'Tarefa atualizada',
        description: 'Tarefa atualizada com sucesso!',
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar tarefa. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Tarefa</DialogTitle>
        </DialogHeader>
        <TaskForm
          task={task}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={updateTask.isPending}
        />
      </DialogContent>
    </Dialog>
  );
};
