
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTasks } from '@/hooks/useTasks';
import { useToast } from '@/hooks/use-toast';
import { useClients } from '@/hooks/useClients';
import type { Task } from '@/services/api/types';

interface TaskDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onEdit: (task: Task) => void;
}

export const TaskDetailsDialog = ({ 
  open, 
  onOpenChange, 
  task, 
  onEdit 
}: TaskDetailsDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteTask } = useTasks();
  const { data: clients = [] } = useClients();
  const { toast } = useToast();

  if (!task) return null;

  const client = task.client_id ? clients.find(c => c.id === task.client_id) : null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteTask.mutateAsync(task.id);
      toast({
        title: 'Tarefa excluída',
        description: 'A tarefa foi excluída com sucesso.',
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao excluir a tarefa.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const priorityLabels = {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta',
    urgent: 'Urgente',
  };

  const statusLabels = {
    pending: 'Pendente',
    in_progress: 'Em Andamento',
    in_approval: 'Em Aprovação',
    completed: 'Concluída',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            {task.title}
          </DialogTitle>
          <DialogDescription>
            Detalhes da tarefa
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {task.due_date && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="font-medium">Prazo</div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(task.due_date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <Badge 
              variant={task.priority === 'high' || task.priority === 'urgent' ? 'destructive' : 'secondary'}
            >
              {priorityLabels[task.priority]}
            </Badge>
            <Badge variant="outline">
              {statusLabels[task.status]}
            </Badge>
          </div>

          {client && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <div>
                <div className="font-medium">{client.name}</div>
                <div className="text-sm text-muted-foreground">Cliente</div>
              </div>
            </div>
          )}

          {task.description && (
            <div>
              <h4 className="font-medium mb-2">Descrição</h4>
              <p className="text-sm text-muted-foreground">{task.description}</p>
            </div>
          )}

          <div className="text-xs text-muted-foreground">
            Criado em {format(new Date(task.created_at!), "d/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {isDeleting ? 'Excluindo...' : 'Excluir'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onEdit(task);
              onOpenChange(false);
            }}
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
