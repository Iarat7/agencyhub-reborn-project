
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Clock, CheckCircle, AlertCircle, Users, Search, Filter } from 'lucide-react';
import { TaskDialog } from '@/components/tasks/TaskDialog';
import { TasksTable } from '@/components/tasks/TasksTable';
import { AdvancedFilters, FilterField } from '@/components/filters/AdvancedFilters';
import { useTasks, useDeleteTask } from '@/hooks/useTasks';
import { useAdvancedFilters } from '@/hooks/useAdvancedFilters';
import { filterTasks } from '@/utils/filterUtils';
import { Task } from '@/services/api/types';

const taskFilterFields: FilterField[] = [
  { key: 'title', label: 'Título', type: 'text', placeholder: 'Título da tarefa' },
  { 
    key: 'status', 
    label: 'Status', 
    type: 'select',
    options: [
      { label: 'Pendente', value: 'pending' },
      { label: 'Em Andamento', value: 'in_progress' },
      { label: 'Concluída', value: 'completed' }
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
  { key: 'due_date', label: 'Data Limite', type: 'date' }
];

export const Tarefas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { data: tasks = [], isLoading } = useTasks();
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

  // Estatísticas das tarefas (baseadas nos dados filtrados)
  const pendingTasks = searchFilteredTasks.filter(task => task.status === 'pending').length;
  const inProgressTasks = searchFilteredTasks.filter(task => task.status === 'in_progress').length;
  const completedTasks = searchFilteredTasks.filter(task => task.status === 'completed').length;
  const urgentTasks = searchFilteredTasks.filter(task => task.priority === 'urgent').length;

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

      {/* Filtros Avançados */}
      <AdvancedFilters
        fields={taskFilterFields}
        values={filters}
        onChange={setFilters}
        onReset={resetFilters}
        isOpen={isFilterOpen}
        onToggle={toggleFilters}
      />

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
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <CardTitle>Lista de Tarefas ({searchFilteredTasks.length})</CardTitle>
              <CardDescription>
                {searchFilteredTasks.length > 0
                  ? `${searchFilteredTasks.length} tarefa${searchFilteredTasks.length !== 1 ? 's' : ''} encontrada${searchFilteredTasks.length !== 1 ? 's' : ''}`
                  : 'Nenhuma tarefa encontrada'}
              </CardDescription>
            </div>
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
          {searchFilteredTasks.length > 0 ? (
            <TasksTable
              tasks={searchFilteredTasks}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                {searchTerm || Object.values(filters).some(v => v) 
                  ? 'Nenhuma tarefa encontrada com os filtros aplicados.' 
                  : 'Nenhuma tarefa cadastrada ainda.'}
              </p>
              {!searchTerm && !Object.values(filters).some(v => v) && (
                <Button onClick={handleNewTask}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar primeira tarefa
                </Button>
              )}
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
