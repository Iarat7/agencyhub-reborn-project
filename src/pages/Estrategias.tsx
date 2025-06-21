
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Lightbulb, Plus, Target, LayoutGrid, Table } from 'lucide-react';
import { AIStrategiesCard } from '@/components/ai/AIStrategiesCard';
import { ClientStrategiesTable } from '@/components/strategies/ClientStrategiesTable';
import { CreateStrategyDialog } from '@/components/strategies/CreateStrategyDialog';
import { ContentIdeasDialog } from '@/components/strategies/ContentIdeasDialog';
import { StrategyFilters } from '@/components/strategies/StrategyFilters';
import { StrategiesKanban } from '@/components/strategies/StrategiesKanban';
import { useStrategies, useUpdateStrategyStatus } from '@/hooks/useStrategies';
import { useStrategyFilters } from '@/hooks/useStrategyFilters';

export default function Estrategias() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isContentIdeasDialogOpen, setIsContentIdeasDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('kanban');
  
  const { data: strategies = [], isLoading } = useStrategies();
  const updateStrategyStatus = useUpdateStrategyStatus();
  
  const {
    filters,
    setFilters,
    filteredStrategies,
    resetFilters,
  } = useStrategyFilters(strategies);

  const handleStatusChange = (strategyId: string, newStatus: string) => {
    updateStrategyStatus.mutate({ id: strategyId, status: newStatus });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Estratégias</h1>
          <p className="text-muted-foreground">
            Gerencie estratégias inteligentes e personalizadas para seus clientes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsContentIdeasDialogOpen(true)}>
            <Lightbulb className="h-4 w-4 mr-2" />
            Ideias de Conteúdo
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Estratégia
          </Button>
        </div>
      </div>

      <Tabs defaultValue="ai-strategies" className="space-y-6">
        <TabsList>
          <TabsTrigger value="ai-strategies" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Estratégias IA
          </TabsTrigger>
          <TabsTrigger value="client-strategies" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Estratégias de Clientes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ai-strategies">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Estratégias Geradas por IA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Estratégias automaticamente geradas com base na análise dos seus dados de negócio.
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="xl:col-span-1">
              <AIStrategiesCard />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="client-strategies" className="space-y-6">
          <StrategyFilters
            filters={filters}
            onFiltersChange={setFilters}
            onResetFilters={resetFilters}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {filteredStrategies.length} estratégias encontradas
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                <Table className="h-4 w-4 mr-2" />
                Tabela
              </Button>
              <Button
                variant={viewMode === 'kanban' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('kanban')}
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Kanban
              </Button>
            </div>
          </div>

          {isLoading ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center">
                  <span>Carregando estratégias...</span>
                </div>
              </CardContent>
            </Card>
          ) : viewMode === 'table' ? (
            <ClientStrategiesTable />
          ) : (
            <StrategiesKanban
              strategies={filteredStrategies}
              onStatusChange={handleStatusChange}
            />
          )}
        </TabsContent>
      </Tabs>

      <CreateStrategyDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
      />
      
      <ContentIdeasDialog 
        open={isContentIdeasDialogOpen} 
        onOpenChange={setIsContentIdeasDialogOpen} 
      />
    </div>
  );
}
