
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ClientDialog } from './ClientDialog';
import { ClientDetails } from './ClientDetails';
import { Trash2, Edit, Eye, Plus } from 'lucide-react';
import { useClients } from '@/hooks/useClients';
import type { Client } from '@/services/api/types';

export const ClientsTable = () => {
  const { data: clients, isLoading, deleteClient } = useClients();
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [viewingClient, setViewingClient] = useState<Client | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-red-100 text-red-800',
      'prospect': 'bg-yellow-100 text-yellow-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-slate-600">Carregando clientes...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Lista de Clientes
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Cliente
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Nome</th>
                  <th className="text-left p-2">Empresa</th>
                  <th className="text-left p-2">Email</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Valor Mensal</th>
                  <th className="text-center p-2">Ações</th>
                </tr>
              </thead>
              <tbody>
                {clients?.map((client) => (
                  <tr key={client.id} className="border-b hover:bg-slate-50">
                    <td className="p-2 font-medium">{client.name}</td>
                    <td className="p-2">{client.company || '-'}</td>
                    <td className="p-2">{client.email || '-'}</td>
                    <td className="p-2">
                      <Badge className={getStatusColor(client.status || 'active')}>
                        {client.status === 'active' ? 'Ativo' : 
                         client.status === 'inactive' ? 'Inativo' : 'Prospect'}
                      </Badge>
                    </td>
                    <td className="p-2">
                      {client.monthly_value ? formatCurrency(client.monthly_value) : '-'}
                    </td>
                    <td className="p-2">
                      <div className="flex items-center justify-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setViewingClient(client)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setEditingClient(client)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => deleteClient.mutate(client.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Dialog para criar cliente */}
      <ClientDialog
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
      />

      {/* Dialog para editar cliente */}
      <ClientDialog
        isOpen={!!editingClient}
        onClose={() => setEditingClient(null)}
        client={editingClient || undefined}
      />

      {/* Dialog para visualizar detalhes do cliente */}
      <Dialog open={!!viewingClient} onOpenChange={() => setViewingClient(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Cliente</DialogTitle>
          </DialogHeader>
          {viewingClient && (
            <ClientDetails 
              client={viewingClient}
              onCreateTask={() => {
                // TODO: Implementar criação de tarefa com cliente pré-selecionado
                console.log('Criar tarefa para cliente:', viewingClient.id);
              }}
              onCreateOpportunity={() => {
                // TODO: Implementar criação de oportunidade com cliente pré-selecionado
                console.log('Criar oportunidade para cliente:', viewingClient.id);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
