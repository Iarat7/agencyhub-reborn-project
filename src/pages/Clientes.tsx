import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { ClientsTable } from '@/components/clients/ClientsTable';
import { ClientDialog } from '@/components/clients/ClientDialog';
import { AdvancedFilters, FilterField } from '@/components/filters/AdvancedFilters';
import { useClients, useDeleteClient } from '@/hooks/useClients';
import { useAdvancedFilters } from '@/hooks/useAdvancedFilters';
import { filterClients } from '@/utils/filterUtils';
import { Client } from '@/services/api/types';
import { useNavigate } from 'react-router-dom';

const clientFilterFields: FilterField[] = [
  { key: 'name', label: 'Nome', type: 'text', placeholder: 'Nome do cliente' },
  { key: 'email', label: 'Email', type: 'text', placeholder: 'Email do cliente' },
  { key: 'company', label: 'Empresa', type: 'text', placeholder: 'Nome da empresa' },
  { key: 'phone', label: 'Telefone', type: 'text', placeholder: 'Telefone do cliente' },
  { 
    key: 'status', 
    label: 'Status', 
    type: 'select',
    options: [
      { label: 'Ativo', value: 'active' },
      { label: 'Inativo', value: 'inactive' },
      { label: 'Lead', value: 'lead' }
    ]
  }
];

const Clientes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  const { data: clients = [], isLoading, error } = useClients();
  const deleteClientMutation = useDeleteClient();

  const {
    filters,
    setFilters,
    filteredData: filteredClients,
    resetFilters,
    isFilterOpen,
    toggleFilters
  } = useAdvancedFilters(clients, filterClients);

  // Aplicar busca simples sobre os dados já filtrados
  const searchFilteredClients = filteredClients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (client.company && client.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleNewClient = () => {
    setEditingClient(null);
    setDialogOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setDialogOpen(true);
  };

  const handleViewClient = (client: Client) => {
    navigate(`/clientes/${client.id}`);
  };

  const handleViewAssociations = (client: Client) => {
    navigate(`/clientes/${client.id}/associacoes`);
  };

  const handleDeleteClient = (clientId: string) => {
    setClientToDelete(clientId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteClient = () => {
    if (clientToDelete) {
      deleteClientMutation.mutate(clientToDelete);
      setDeleteDialogOpen(false);
      setClientToDelete(null);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingClient(null);
  };

  // Métricas simples dos clientes
  const totalClients = searchFilteredClients.length;
  const activeClients = searchFilteredClients.filter(client => client.status === 'active').length;
  const totalValue = searchFilteredClients
    .filter(client => client.status === 'active')
    .reduce((sum, client) => sum + (client.monthly_value || 0), 0);

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-red-600">Erro ao carregar clientes. Tente novamente.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Clientes</h1>
          <p className="text-slate-600 mt-2">Gerencie sua base de clientes</p>
        </div>
        <Button onClick={handleNewClient} className="bg-blue-600 hover:bg-blue-700">
          <Plus size={16} className="mr-2" />
          Novo Cliente
        </Button>
      </div>

      {/* Métricas dos Clientes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-blue-600">{totalClients}</div>
            <p className="text-sm text-slate-600">Total de Clientes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">{activeClients}</div>
            <p className="text-sm text-slate-600">Clientes Ativos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-purple-600">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}
            </div>
            <p className="text-sm text-slate-600">Valor Total Mensal</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros Avançados */}
      <AdvancedFilters
        fields={clientFilterFields}
        values={filters}
        onChange={setFilters}
        onReset={resetFilters}
        isOpen={isFilterOpen}
        onToggle={toggleFilters}
      />

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>Lista de Clientes ({searchFilteredClients.length})</CardTitle>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                <Input
                  placeholder="Buscar clientes..."
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
              <p className="text-slate-600">Carregando clientes...</p>
            </div>
          ) : searchFilteredClients.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-600">
                {searchTerm || Object.values(filters).some(v => v) 
                  ? 'Nenhum cliente encontrado com os filtros aplicados.' 
                  : 'Nenhum cliente cadastrado ainda.'}
              </p>
              {!searchTerm && !Object.values(filters).some(v => v) && (
                <Button onClick={handleNewClient} className="mt-4">
                  <Plus size={16} className="mr-2" />
                  Cadastrar primeiro cliente
                </Button>
              )}
            </div>
          ) : (
            <ClientsTable 
              clients={searchFilteredClients} 
              onEdit={handleEditClient}
              onDelete={handleDeleteClient}
              onView={handleViewClient}
              onViewAssociations={handleViewAssociations}
            />
          )}
        </CardContent>
      </Card>

      <ClientDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        client={editingClient}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
              Todos os dados relacionados (oportunidades, tarefas, etc.) também serão removidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteClient}
              className="bg-red-600 hover:bg-red-700"
              disabled={deleteClientMutation.isPending}
            >
              {deleteClientMutation.isPending ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Clientes;
