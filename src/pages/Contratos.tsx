
import React, { useState } from 'react';
import { Plus, AlertTriangle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ContractDialog } from '@/components/contracts/ContractDialog';
import { ContractDetailsDialog } from '@/components/contracts/ContractDetailsDialog';
import { ContractsTable } from '@/components/contracts/ContractsTable';
import { ContractFilters } from '@/components/contracts/ContractFilters';
import { useContracts } from '@/hooks/useContracts';
import { useContractFilters } from '@/hooks/useContractFilters';
import { Contract } from '@/services/api/types';

export default function Contratos() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | undefined>();
  const [viewingContract, setViewingContract] = useState<Contract | null>(null);
  
  const {
    contracts,
    clients,
    isLoading,
    createContract,
    updateContract,
    deleteContract,
    isCreating,
    isUpdating,
    error,
  } = useContracts();

  const {
    statusFilter,
    setStatusFilter,
    dateRange,
    setDateRange,
    filteredContracts,
    resetFilters,
    stats
  } = useContractFilters(contracts);

  const handleSubmit = (data: any) => {
    console.log('Submitting contract data:', data);
    if (editingContract) {
      updateContract({ id: editingContract.id, data });
    } else {
      createContract(data);
    }
    setDialogOpen(false);
    setEditingContract(undefined);
  };

  const handleEdit = (contract: Contract) => {
    setEditingContract(contract);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este contrato?')) {
      deleteContract(id);
    }
  };

  const handleView = (contract: Contract) => {
    setViewingContract(contract);
    setDetailsDialogOpen(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Métricas dos contratos
  const activeContracts = contracts.filter(c => c.status === 'active');
  const totalValue = activeContracts.reduce((sum, c) => sum + c.value, 0);
  const totalCost = activeContracts.reduce((sum, c) => sum + (c.cost || 0), 0);
  const totalProfit = totalValue - totalCost;

  console.log('Contracts page - contracts:', contracts);
  console.log('Contracts page - isLoading:', isLoading);
  console.log('Contracts page - error:', error);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Carregando contratos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Erro ao carregar contratos</p>
          <p className="text-sm text-gray-600">{error.toString()}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Contratos</h1>
          <p className="text-slate-600">Gerencie contratos com clientes</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Contrato
        </Button>
      </div>

      {/* Métricas dos Contratos */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Contratos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{activeContracts.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{formatCurrency(totalValue)}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Lucro Estimado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">{formatCurrency(totalProfit)}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              Expirados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">{stats.expired.length}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Expirando (30d)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{stats.expiring.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <ContractFilters
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onResetFilters={resetFilters}
      />

      {/* Tabela de Contratos */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Contratos ({filteredContracts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <ContractsTable
            contracts={filteredContracts}
            clients={clients}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
          />
        </CardContent>
      </Card>

      {/* Dialog de Contrato */}
      <ContractDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        contract={editingContract}
        clients={clients}
        onSubmit={handleSubmit}
        isSubmitting={isCreating || isUpdating}
      />

      {/* Dialog de Detalhes do Contrato */}
      <ContractDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        contract={viewingContract}
        clients={clients}
      />
    </div>
  );
}
