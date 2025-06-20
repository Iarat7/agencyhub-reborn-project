
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
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TasksTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
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
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead className="text-right">Ações</TableHead>
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
              <TableCell>
                {task.due_date
                  ? format(new Date(task.due_date), 'dd/MM/yyyy', { locale: ptBR })
                  : '-'}
              </TableCell>
              <TableCell>{task.client_id || '-'}</TableCell>
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
                    onClick={() => onDelete(task.id)}
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
