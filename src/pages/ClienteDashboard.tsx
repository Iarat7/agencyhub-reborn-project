
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useClient } from '@/hooks/useClients';
import { ClientDetails } from '@/components/clients/ClientDetails';
import { TaskDialog } from '@/components/tasks/TaskDialog';
import { OpportunityDialog } from '@/components/opportunities/OpportunityDialog';
import { Skeleton } from '@/components/ui/skeleton';

export const ClienteDashboard = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [opportunityDialogOpen, setOpportunityDialogOpen] = useState(false);

  const { data: client, isLoading, error } = useClient(clientId || '');

  const handleCreateTask = () => {
    setTaskDialogOpen(true);
  };

  const handleCreateOpportunity = () => {
    setOpportunityDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="grid gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/clientes')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
        <div className="text-center py-8">
          <p className="text-red-600">Cliente não encontrado ou erro ao carregar dados.</p>
          <Button 
            onClick={() => navigate('/clientes')} 
            className="mt-4"
          >
            Voltar para Clientes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com navegação */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/clientes')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{client.name}</h1>
            <p className="text-slate-600">{client.company || 'Dashboard do Cliente'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/clientes`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar Cliente
          </Button>
          <Button
            size="sm"
            onClick={handleCreateTask}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Tarefa
          </Button>
          <Button
            size="sm"
            onClick={handleCreateOpportunity}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Oportunidade
          </Button>
        </div>
      </div>

      {/* Dashboard do Cliente */}
      <ClientDetails
        client={client}
        onCreateTask={handleCreateTask}
        onCreateOpportunity={handleCreateOpportunity}
      />

      {/* Diálogos */}
      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        task={null}
        initialClientId={client.id}
      />

      <OpportunityDialog
        open={opportunityDialogOpen}
        onOpenChange={setOpportunityDialogOpen}
        opportunity={null}
        initialClientId={client.id}
      />
    </div>
  );
};
