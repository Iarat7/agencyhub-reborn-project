
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { Task } from '@/services/api/types';
import { useUsers } from '@/hooks/useUsers';
import { useClients } from '@/hooks/useClients';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TasksTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const statusLabels = {
  pending: 'Pendente',
  in_progress: 'Em Andamento',
  in_approval: 'Em Aprovação',
  completed: 'Concluída',
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  in_approval: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
};

const priorityLabels = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  urgent: 'Urgente',
};

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
};

export const TasksTable = ({ tasks, onEdit, onDelete }: TasksTableProps) => {
  const { data: users = [] } = useUsers();
  const { data: clients = [] } = useClients();

  const getUserName = (userId?: string) => {
    if (!userId) return '-';
    const user = users.find(u => u.id === userId);
    return user?.full_name || user?.email || 'Usuário não encontrado';
  };

  const getClientName = (clientId?: string) => {
    if (!clientId) return '-';
    const client = clients.find(c => c.id === clientId);
    return client?.name || client?.company || 'Cliente não encontrado';
  };

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px]">Título</TableHead>
            <TableHead className="min-w-[120px]">Status</TableHead>
            <TableHead className="min-w-[120px]">Prioridade</TableHead>
            <TableHead className="min-w-[150px]">Responsável</TableHead>
            <TableHead className="min-w-[120px]">Vencimento</TableHead>
            <TableHead className="min-w-[150px]">Cliente</TableHead>
            <TableHead className="min-w-[120px]">Criado em</TableHead>
            <TableHead className="text-right min-w-[120px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="font-medium">{task.title}</TableCell>
              <TableCell>
                <Badge className={statusColors[task.status as keyof typeof statusColors]}>
                  {statusLabels[task.status as keyof typeof statusLabels]}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={priorityColors[task.priority as keyof typeof priorityColors]}>
                  {priorityLabels[task.priority as keyof typeof priorityLabels]}
                </Badge>
              </TableCell>
              <TableCell>{getUserName(task.assigned_to)}</TableCell>
              <TableCell>
                {task.due_date
                  ? format(new Date(task.due_date), 'dd/MM/yyyy', { locale: ptBR })
                  : '-'}
              </TableCell>
              <TableCell>{getClientName(task.client_id)}</TableCell>
              <TableCell>
                {task.created_at
                  ? format(new Date(task.created_at), 'dd/MM/yyyy', { locale: ptBR })
                  : '-'}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(task)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(task)}
                    className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
