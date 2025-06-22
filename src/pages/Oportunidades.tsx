
import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OpportunityMetrics } from '@/components/opportunities/OpportunityMetrics';
import { OpportunitiesTable } from '@/components/opportunities/OpportunitiesTable';
import { KanbanBoard } from '@/components/opportunities/KanbanBoard';
import { OpportunityDialog } from '@/components/opportunities/OpportunityDialog';
import { ViewToggle } from '@/components/opportunities/ViewToggle';
import { AdvancedFilters, FilterField } from '@/components/filters/AdvancedFilters';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useAdvancedFilters } from '@/hooks/useAdvancedFilters';
import { filterOpportunities } from '@/utils/filterUtils';
import { Opportunity } from '@/services/api/types';

const opportunityFilterFields: FilterField[] = [
  { key: 'title', label: 'Título', type: 'text', placeholder: 'Título da oportunidade' },
  { key: 'description', label: 'Descrição', type: 'text', placeholder: 'Descrição da oportunidade' },
  { 
    key: 'stage', 
    label: 'Estágio', 
    type: 'select',
    options: [
      { label: 'Prospecção', value: 'prospection' },
      { label: 'Qualificação', value: 'qualification' },
      { label: 'Proposta', value: 'proposal' },
      { label: 'Negociação', value: 'negotiation' },
      { label: 'Fechada - Ganha', value: 'closed_won' },
      { label: 'Fechada - Perdida', value: 'closed_lost' }
    ]
  },
  { key: 'value', label: 'Valor Mínimo', type: 'number', placeholder: 'Valor mínimo' },
  { key: 'expected_close_date', label: 'Data de Fechamento', type: 'date' }
];

const Oportunidades = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');

  const { data: opportunities = [], isLoading, error } = useOpportunities();

  const {
    filters,
    setFilters,
    filteredData: filteredOpportunities,
    resetFilters,
    isFilterOpen,
    toggleFilters
  } = useAdvancedFilters(opportunities, filterOpportunities);

  // Aplicar busca simples sobre os dados já filtrados
  const searchFilteredOpportunities = filteredOpportunities.filter(opportunity =>
    opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (opportunity.description && opportunity.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleNewOpportunity = () => {
    setEditingOpportunity(null);
    setDialogOpen(true);
  };

  const handleEditOpportunity = (opportunity: Opportunity) => {
    setEditingOpportunity(opportunity);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingOpportunity(null);
  };

  console.log('Oportunidades carregadas:', opportunities);
  console.log('Oportunidades filtradas:', searchFilteredOpportunities);

  if (error) {
    console.error('Erro ao carregar oportunidades:', error);
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-red-600">Erro ao carregar oportunidades. Tente novamente.</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Recarregar página
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Oportunidades</h1>
          <p className="text-slate-600 mt-2">Gerencie seu pipeline de vendas</p>
        </div>
        <Button onClick={handleNewOpportunity} className="bg-blue-600 hover:bg-blue-700">
          <Plus size={16} className="mr-2" />
          Nova Oportunidade
        </Button>
      </div>

      {/* Métricas das Oportunidades */}
      <OpportunityMetrics opportunities={searchFilteredOpportunities} />

      {/* Filtros Avançados */}
      <AdvancedFilters
        fields={opportunityFilterFields}
        values={filters}
        onChange={setFilters}
        onReset={resetFilters}
        isOpen={isFilterOpen}
        onToggle={toggleFilters}
      />

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <CardTitle>Pipeline de Vendas ({searchFilteredOpportunities.length})</CardTitle>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                <Input
                  placeholder="Buscar oportunidades..."
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
              <ViewToggle view={viewMode} onViewChange={setViewMode} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-slate-600">Carregando oportunidades...</p>
            </div>
          ) : searchFilteredOpportunities.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-600">
                {searchTerm || Object.values(filters).some(v => v) 
                  ? 'Nenhuma oportunidade encontrada com os filtros aplicados.' 
                  : 'Nenhuma oportunidade cadastrada ainda.'}
              </p>
              {!searchTerm && !Object.values(filters).some(v => v) && (
                <Button onClick={handleNewOpportunity} className="mt-4">
                  <Plus size={16} className="mr-2" />
                  Criar primeira oportunidade
                </Button>
              )}
            </div>
          ) : viewMode === 'table' ? (
            <OpportunitiesTable opportunities={searchFilteredOpportunities} onEdit={handleEditOpportunity} />
          ) : (
            <KanbanBoard opportunities={searchFilteredOpportunities} onEdit={handleEditOpportunity} />
          )}
        </CardContent>
      </Card>

      <OpportunityDialog
        open={dialogOpen}
        onOpenChange={handleDialogClose}
        opportunity={editingOpportunity}
      />
    </div>
  );
};

export default Oportunidades;
