
import React, { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FinancialEntryDialog } from '@/components/financial/FinancialEntryDialog';
import { FinancialTable } from '@/components/financial/FinancialTable';
import { FinancialMetrics } from '@/components/financial/FinancialMetrics';
import { useFinancialEntries } from '@/hooks/useFinancialEntries';
import { FinancialEntry } from '@/services/api/types';

export default function Financeiro() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FinancialEntry | undefined>();
  const [activeTab, setActiveTab] = useState('all');
  
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

  const filteredEntries = entries.filter(entry => {
    switch (activeTab) {
      case 'income':
        return entry.type === 'income';
      case 'expense':
        return entry.type === 'expense';
      case 'pending':
        return entry.status === 'pending';
      case 'overdue':
        return entry.status === 'overdue';
      default:
        return true;
    }
  });

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
      <FinancialMetrics entries={entries} />

      {/* Conteúdo Principal */}
      <Card>
        <CardHeader>
          <CardTitle>Movimentações Financeiras</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="income">Receitas</TabsTrigger>
              <TabsTrigger value="expense">Despesas</TabsTrigger>
              <TabsTrigger value="pending">Pendentes</TabsTrigger>
              <TabsTrigger value="overdue">Vencidas</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              <FinancialTable
                entries={filteredEntries}
                clients={clients}
                contracts={contracts}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </TabsContent>
          </Tabs>
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
