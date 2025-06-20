
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TaskForm } from './TaskForm';
import { Task } from '@/services/api/types';
import { useCreateTask, useUpdateTask } from '@/hooks/useTasks';

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task | null;
}

export const TaskDialog = ({ open, onOpenChange, task }: TaskDialogProps) => {
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();

  const isEditing = !!task;
  const isLoading = createTask.isPending || updateTask.isPending;

  const handleSubmit = async (data: any) => {
    if (isEditing && task) {
      await updateTask.mutateAsync({ id: task.id, data });
    } else {
      await createTask.mutateAsync(data);
    }
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}
          </DialogTitle>
        </DialogHeader>
        <TaskForm
          task={task}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};
