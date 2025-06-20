
import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClientsTable } from '@/components/clients/ClientsTable';
import { ClientDialog } from '@/components/clients/ClientDialog';
import { AdvancedFilters, FilterField } from '@/components/filters/AdvancedFilters';
import { useClients } from '@/hooks/useClients';
import { useAdvancedFilters } from '@/hooks/useAdvancedFilters';
import { filterClients } from '@/utils/filterUtils';
import { Client } from '@/services/api/types';

const clientFilterFields: FilterField[] = [
  { key: 'name', label: 'Nome', type: 'text', placeholder: 'Nome do cliente' },
  { key: 'email', label: 'Email', type: 'text', placeholder: 'Email do cliente' },
  { key: 'company', label: 'Empresa', type: 'text', placeholder: 'Nome da empresa' },
  { 
    key: 'segment', 
    label: 'Segmento', 
    type: 'select',
    options: [
      { label: 'Tecnologia', value: 'tecnologia' },
      { label: 'Saúde', value: 'saude' },
      { label: 'Educação', value: 'educacao' },
      { label: 'Varejo', value: 'varejo' },
      { label: 'Serviços', value: 'servicos' },
      { label: 'Agência', value: 'agencia' },
      { label: 'Outros', value: 'outros' }
    ]
  },
  { 
    key: 'status', 
    label: 'Status', 
    type: 'select',
    options: [
      { label: 'Ativo', value: 'active' },
      { label: 'Inativo', value: 'inactive' },
      { label: 'Prospect', value: 'prospect' }
    ]
  },
  { key: 'monthly_value', label: 'Valor Mensal Mín.', type: 'number', placeholder: 'Valor mínimo' }
];

export const Clientes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const { data: clients = [], isLoading, error } = useClients();

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

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingClient(null);
  };

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
          <p className="text-slate-600 mt-2">Gerencie seus clientes e prospects</p>
        </div>
        <Button onClick={handleNewClient} className="bg-blue-600 hover:bg-blue-700">
          <Plus size={16} className="mr-2" />
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
                  Criar primeiro cliente
                </Button>
              )}
            </div>
          ) : (
            <ClientsTable />
          )}
        </CardContent>
      </Card>

      <ClientDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        client={editingClient}
      />
    </div>
  );
};
