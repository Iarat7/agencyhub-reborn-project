
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Users, TrendingUp, DollarSign, Search, Filter, Eye } from 'lucide-react';
import { ClientDialog } from '@/components/clients/ClientDialog';
import { ClientsTable } from '@/components/clients/ClientsTable';
import { ClientAssociations } from '@/components/clients/ClientAssociations';
import { AdvancedFilters, FilterField } from '@/components/filters/AdvancedFilters';
import { useClients, useDeleteClient } from '@/hooks/useClients';
import { useAdvancedFilters } from '@/hooks/useAdvancedFilters';
import { filterClients } from '@/utils/filterUtils';
import { Client } from '@/services/api/types';
import { useNavigate } from 'react-router-dom';

export const Clientes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const { data: clients = [], isLoading } = useClients();
  const deleteClient = useDeleteClient();
  const navigate = useNavigate();

  const clientFilterFields: FilterField[] = [
    { key: 'name', label: 'Nome', type: 'text', placeholder: 'Nome do cliente' },
    { key: 'email', label: 'Email', type: 'text', placeholder: 'Email do cliente' },
    { key: 'company', label: 'Empresa', type: 'text', placeholder: 'Nome da empresa' },
    { key: 'segment', label: 'Segmento', type: 'text', placeholder: 'Segmento de atuação' },
    { 
      key: 'status', 
      label: 'Status', 
      type: 'select',
      options: [
        { label: 'Ativo', value: 'active' },
        { label: 'Inativo', value: 'inactive' },
        { label: 'Prospect', value: 'prospect' }
      ]
    }
  ];

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
    setIsDialogOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsDialogOpen(true);
  };

  const handleDeleteClient = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      await deleteClient.mutateAsync(id);
    }
  };

  const handleViewClient = (client: Client) => {
    navigate(`/clientes/${client.id}/dashboard`);
  };

  const handleViewAssociations = (client: Client) => {
    setSelectedClient(client);
  };

  // Estatísticas dos clientes (baseadas nos dados filtrados)
  const activeClients = searchFilteredClients.filter(client => client.status === 'active').length;
  const prospects = searchFilteredClients.filter(client => client.status === 'prospect').length;
  const totalRevenue = searchFilteredClients.reduce((sum, client) => sum + (client.monthly_value || 0), 0);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Clientes</h1>
        </div>
        <div className="text-center py-8">Carregando clientes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="text-gray-600">Gerencie seus clientes e relacionamentos</p>
        </div>
        <Button onClick={handleNewClient}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
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

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{searchFilteredClients.length}</div>
            <p className="text-xs text-muted-foreground">
              Clientes cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeClients}</div>
            <p className="text-xs text-muted-foreground">
              Com relacionamento ativo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prospects</CardTitle>
            <Users className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{prospects}</div>
            <p className="text-xs text-muted-foreground">
              Potenciais clientes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              Valor mensal total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Clientes */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <CardTitle>Lista de Clientes ({searchFilteredClients.length})</CardTitle>
              <CardDescription>
                {searchFilteredClients.length > 0
                  ? `${searchFilteredClients.length} cliente${searchFilteredClients.length !== 1 ? 's' : ''} encontrado${searchFilteredClients.length !== 1 ? 's' : ''}`
                  : 'Nenhum cliente encontrado'}
              </CardDescription>
            </div>
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
          {searchFilteredClients.length > 0 ? (
            <ClientsTable
              clients={searchFilteredClients}
              onEdit={handleEditClient}
              onDelete={handleDeleteClient}
              onView={handleViewClient}
              onViewAssociations={handleViewAssociations}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">
                {searchTerm || Object.values(filters).some(v => v) 
                  ? 'Nenhum cliente encontrado com os filtros aplicados.' 
                  : 'Nenhum cliente cadastrado ainda.'}
              </p>
              {!searchTerm && !Object.values(filters).some(v => v) && (
                <Button onClick={handleNewClient}>
                  <Plus className="mr-2 h-4 w-4" />
                  Criar primeiro cliente
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Associações do Cliente Selecionado */}
      {selectedClient && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Associações do Cliente</h2>
            <Button variant="outline" onClick={() => setSelectedClient(null)}>
              Fechar
            </Button>
          </div>
          <ClientAssociations client={selectedClient} />
        </div>
      )}

      <ClientDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        client={editingClient}
      />
    </div>
  );
};
