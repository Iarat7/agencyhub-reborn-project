
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Clock, CheckCircle, AlertCircle, Users } from 'lucide-react';
import { TaskDialog } from '@/components/tasks/TaskDialog';
import { TasksTable } from '@/components/tasks/TasksTable';
import { useTasks, useDeleteTask } from '@/hooks/useTasks';
import { Task } from '@/services/api/types';

export const Tarefas = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { data: tasks = [], isLoading } = useTasks();
  const deleteTask = useDeleteTask();

  const handleNewTask = () => {
    setEditingTask(null);
    setIsDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const handleDeleteTask = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      await deleteTask.mutateAsync(id);
    }
  };

  // Estatísticas das tarefas
  const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress').length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const urgentTasks = tasks.filter(task => task.priority === 'urgent').length;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Tarefas</h1>
        </div>
        <div className="text-center py-8">Carregando tarefas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tarefas</h1>
          <p className="text-gray-600">Gerencie suas tarefas e atividades</p>
        </div>
        <Button onClick={handleNewTask}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Tarefa
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasks}</div>
            <p className="text-xs text-muted-foreground">
              Tarefas aguardando início
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressTasks}</div>
            <p className="text-xs text-muted-foreground">
              Tarefas em execução
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks}</div>
            <p className="text-xs text-muted-foreground">
              Tarefas finalizadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgentes</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{urgentTasks}</div>
            <p className="text-xs text-muted-foreground">
              Tarefas com alta prioridade
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Tarefas */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Tarefas</CardTitle>
          <CardDescription>
            {tasks.length > 0
              ? `${tasks.length} tarefa${tasks.length !== 1 ? 's' : ''} encontrada${tasks.length !== 1 ? 's' : ''}`
              : 'Nenhuma tarefa encontrada'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tasks.length > 0 ? (
            <TasksTable
              tasks={tasks}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Nenhuma tarefa cadastrada ainda.</p>
              <Button onClick={handleNewTask}>
                <Plus className="mr-2 h-4 w-4" />
                Criar primeira tarefa
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        task={editingTask}
      />
    </div>
  );
};
