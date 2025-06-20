
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FinancialEntryDialog } from '@/components/financial/FinancialEntryDialog';
import { FinancialTable } from '@/components/financial/FinancialTable';
import { FinancialMetrics } from '@/components/financial/FinancialMetrics';
import { FinancialFilters } from '@/components/financial/FinancialFilters';
import { useFinancialEntries } from '@/hooks/useFinancialEntries';
import { useFinancialFilters } from '@/hooks/useFinancialFilters';
import { FinancialEntry } from '@/services/api/types';

export default function Financeiro() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FinancialEntry | undefined>();
  
  const {
    entries,
    clients,
    contracts,
    isLoading,
    createEntry,
    updateEntry,
    deleteEntry,
    isCreating,
    isUpdating,
  } = useFinancialEntries();

  const {
    periodFilter,
    setPeriodFilter,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    dateRange,
    setDateRange,
    filteredEntries,
    resetFilters
  } = useFinancialFilters(entries);

  const handleSubmit = (data: any) => {
    if (editingEntry) {
      updateEntry({ id: editingEntry.id, data });
    } else {
      createEntry(data);
    }
    setDialogOpen(false);
    setEditingEntry(undefined);
  };

  const handleEdit = (entry: FinancialEntry) => {
    setEditingEntry(entry);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta movimentação?')) {
      deleteEntry(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Carregando dados financeiros...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Financeiro</h1>
          <p className="text-slate-600">Controle receitas e despesas</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Movimentação
        </Button>
      </div>

      {/* Métricas Financeiras */}
      <FinancialMetrics entries={filteredEntries} />

      {/* Filtros */}
      <FinancialFilters
        periodFilter={periodFilter}
        onPeriodFilterChange={setPeriodFilter}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onResetFilters={resetFilters}
      />

      {/* Conteúdo Principal */}
      <Card>
        <CardHeader>
          <CardTitle>Movimentações Financeiras ({filteredEntries.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <FinancialTable
            entries={filteredEntries}
            clients={clients}
            contracts={contracts}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      {/* Dialog de Movimentação Financeira */}
      <FinancialEntryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        entry={editingEntry}
        clients={clients}
        contracts={contracts}
        onSubmit={handleSubmit}
        isSubmitting={isCreating || isUpdating}
      />
    </div>
  );
}
