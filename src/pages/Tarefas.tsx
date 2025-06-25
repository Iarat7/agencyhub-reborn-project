import React, { useState } from 'react';
import { Plus, Search, Filter, Calendar, Clock, User, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TasksTable } from '@/components/tasks/TasksTable';
import { TaskDialog } from '@/components/tasks/TaskDialog';
import { AdvancedFilters, FilterField } from '@/components/filters/AdvancedFilters';
import { useTasks, useDeleteTask } from '@/hooks/useTasks';
import { useAdvancedFilters } from '@/hooks/useAdvancedFilters';
import { filterTasks } from '@/utils/filterUtils';
import { Task } from '@/services/api/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const taskFilterFields: FilterField[] = [
  { key: 'title', label: 'Título', type: 'text', placeholder: 'Título da tarefa' },
  { key: 'description', label: 'Descrição', type: 'text', placeholder: 'Descrição da tarefa' },
  { 
    key: 'status', 
    label: 'Status', 
    type: 'select',
    options: [
      { label: 'Pendente', value: 'pending' },
      { label: 'Em Progresso', value: 'in_progress' },
      { label: 'Concluída', value: 'completed' },
      { label: 'Cancelada', value: 'cancelled' }
    ]
  },
  { 
    key: 'priority', 
    label: 'Prioridade', 
    type: 'select',
    options: [
      { label: 'Baixa', value: 'low' },
      { label: 'Média', value: 'medium' },
      { label: 'Alta', value: 'high' },
      { label: 'Urgente', value: 'urgent' }
    ]
  },
  { key: 'due_date', label: 'Data de Vencimento', type: 'date' }
];

const Tarefas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const { data: tasks = [], isLoading, error } = useTasks();
  const deleteTask = useDeleteTask();

  const {
    filters,
    setFilters,
    filteredData: filteredTasks,
    resetFilters,
    isFilterOpen,
    toggleFilters
  } = useAdvancedFilters(tasks, filterTasks);

  // Aplicar busca simples sobre os dados já filtrados
  const searchFilteredTasks = filteredTasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleNewTask = () => {
    setEditingTask(null);
    setDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleDeleteTask = (task: Task) => {
    setTaskToDelete(task);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;
    
    try {
      await deleteTask.mutateAsync(taskToDelete.id);
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingTask(null);
  };

  // Métricas das tarefas
  const completedTasks = searchFilteredTasks.filter(task => task.status === 'completed').length;
  const pendingTasks = searchFilteredTasks.filter(task => task.status === 'pending').length;
  const inProgressTasks = searchFilteredTasks.filter(task => task.status === 'in_progress').length;
  const overdueTasks = searchFilteredTasks.filter(task => {
    if (!task.due_date || task.status === 'completed') return false;
    return new Date(task.due_date) < new Date();
  }).length;

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-red-600">Erro ao carregar tarefas. Tente novamente.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Tarefas</h1>
          <p className="text-slate-600 mt-2">Gerencie suas atividades e compromissos</p>
        </div>
        <Button onClick={handleNewTask} className="bg-blue-600 hover:bg-blue-700">
          <Plus size={16} className="mr-2" />
          Nova Tarefa
        </Button>
      </div>

      {/* Métricas das Tarefas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
                <p className="text-sm text-slate-600">Concluídas</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-600">{inProgressTasks}</p>
                <p className="text-sm text-slate-600">Em Progresso</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-yellow-600">{pendingTasks}</p>
                <p className="text-sm text-slate-600">Pendentes</p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-600">{overdueTasks}</p>
                <p className="text-sm text-slate-600">Atrasadas</p>
              </div>
              <User className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros Avançados */}
      <AdvancedFilters
        fields={taskFilterFields}
        values={filters}
        onChange={setFilters}
        onReset={resetFilters}
        isOpen={isFilterOpen}
        onToggle={toggleFilters}
      />

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>Lista de Tarefas ({searchFilteredTasks.length})</CardTitle>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                <Input
                  placeholder="Buscar tarefas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              {!isFilterOpen && (
                <Button variant="outline" size="sm" onClick={toggleFilters}>
                  <Filter size={16} className="mr-2" />
                  Filtros
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-slate-600">Carregando tarefas...</p>
            </div>
          ) : searchFilteredTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-600">
                {searchTerm || Object.values(filters).some(v => v) 
                  ? 'Nenhuma tarefa encontrada com os filtros aplicados.' 
                  : 'Nenhuma tarefa cadastrada ainda.'}
              </p>
              {!searchTerm && !Object.values(filters).some(v => v) && (
                <Button onClick={handleNewTask} className="mt-4">
                  <Plus size={16} className="mr-2" />
                  Criar primeira tarefa
                </Button>
              )}
            </div>
          ) : (
            <TasksTable 
              tasks={searchFilteredTasks} 
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          )}
        </CardContent>
      </Card>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        task={editingTask}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a tarefa "{taskToDelete?.title}"? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setDeleteDialogOpen(false);
              setTaskToDelete(null);
            }}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteTask}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteTask.isPending}
            >
              {deleteTask.isPending ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Tarefas;
