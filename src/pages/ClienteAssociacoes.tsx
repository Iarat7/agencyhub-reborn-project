
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useClient } from '@/hooks/useClients';
import { ClientAssociations } from '@/components/clients/ClientAssociations';
import { Skeleton } from '@/components/ui/skeleton';

const ClienteAssociacoes = () => {
  const { id: clientId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: client, isLoading, error } = useClient(clientId || '');

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
        <Skeleton className="h-96 w-full" />
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
      {/* Header */}
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
          <h1 className="text-2xl font-bold text-slate-900">Associações</h1>
          <p className="text-slate-600">{client.name} - {client.company || 'Tarefas e Eventos'}</p>
        </div>
      </div>

      {/* Associações do Cliente */}
      <ClientAssociations client={client} />
    </div>
  );
};

export default ClienteAssociacoes;
