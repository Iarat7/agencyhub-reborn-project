
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Brain, Plus, Target } from 'lucide-react';
import { AIStrategiesCard } from '@/components/ai/AIStrategiesCard';
import { ClientStrategiesTable } from '@/components/strategies/ClientStrategiesTable';
import { CreateStrategyDialog } from '@/components/strategies/CreateStrategyDialog';

export default function Estrategias() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Estratégias</h1>
          <p className="text-muted-foreground">
            Gerencie estratégias inteligentes e personalizadas para seus clientes
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Estratégia
        </Button>
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

        <TabsContent value="client-strategies">
          <ClientStrategiesTable />
        </TabsContent>
      </Tabs>

      <CreateStrategyDialog 
        open={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen} 
      />
    </div>
  );
}
