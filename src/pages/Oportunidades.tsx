
import React, { useState } from 'react';
import { Plus, Search, Filter, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OpportunitiesTable } from '@/components/opportunities/OpportunitiesTable';
import { OpportunityDialog } from '@/components/opportunities/OpportunityDialog';
import { AdvancedFilters, FilterField } from '@/components/filters/AdvancedFilters';
import { useOpportunities } from '@/hooks/useOpportunities';
import { useAdvancedFilters } from '@/hooks/useAdvancedFilters';
import { filterOpportunities } from '@/utils/filterUtils';
import { Opportunity } from '@/services/api/types';

const opportunityFilterFields: FilterField[] = [
  { key: 'title', label: 'Título', type: 'text', placeholder: 'Título da oportunidade' },
  { 
    key: 'stage', 
    label: 'Estágio', 
    type: 'select',
    options: [
      { label: 'Prospecção', value: 'prospection' },
      { label: 'Qualificação', value: 'qualification' },
      { label: 'Proposta', value: 'proposal' },
      { label: 'Negociação', value: 'negotiation' },
      { label: 'Fechado - Ganho', value: 'closed_won' },
      { label: 'Fechado - Perdido', value: 'closed_lost' }
    ]
  },
  { key: 'min_value', label: 'Valor Mínimo', type: 'number', placeholder: 'Valor mínimo' },
  { key: 'max_value', label: 'Valor Máximo', type: 'number', placeholder: 'Valor máximo' },
  { key: 'min_probability', label: 'Probabilidade Mín.', type: 'number', placeholder: 'Probabilidade mínima (%)' },
  { key: 'expected_close_date', label: 'Data Limite de Fechamento', type: 'date' }
];

export const Oportunidades = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | null>(null);

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

  const totalValue = searchFilteredOpportunities.reduce((acc, opportunity) => {
    return acc + (opportunity.value || 0);
  }, 0);

  const activeOpportunities = searchFilteredOpportunities.filter(
    opp => !['closed_won', 'closed_lost'].includes(opp.stage)
  );

  const conversionRate = opportunities.length > 0 
    ? Math.round((opportunities.filter(opp => opp.stage === 'closed_won').length / opportunities.length) * 100)
    : 0;

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-red-600">Erro ao carregar oportunidades. Tente novamente.</p>
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

      {/* Filtros Avançados */}
      <AdvancedFilters
        fields={opportunityFilterFields}
        values={filters}
        onChange={setFilters}
        onReset={resetFilters}
        isOpen={isFilterOpen}
        onToggle={toggleFilters}
      />

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-slate-600">Pipeline Total</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              {totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-slate-600">Oportunidades Ativas</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{activeOpportunities.length}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-slate-600">Taxa de Conversão</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{conversionRate}%</p>
          </CardContent>
        </Card>
      </div>

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
          ) : (
            <OpportunitiesTable opportunities={searchFilteredOpportunities} onEdit={handleEditOpportunity} />
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
