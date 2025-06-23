import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ReportsMetrics } from '@/components/reports/ReportsMetrics';
import { ReportsCharts } from '@/components/reports/ReportsCharts';
import { ReportsFilters } from '@/components/reports/ReportsFilters';
import { SalesReport } from '@/components/reports/SalesReport';
import { ExportDialog } from '@/components/reports/ExportDialog';
import { useAdvancedReportsData } from '@/hooks/useAdvancedReportsData';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Download,
  Target,
  Activity
} from 'lucide-react';

const Relatorios = () => {
  const [period, setPeriod] = useState('30d');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  
  const { data: reportData, isLoading } = useAdvancedReportsData({
    period,
    dateRange: period === 'custom' ? dateRange : undefined
  });

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
  };

  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    setDateRange(range);
  };

  const handleApplyFilters = () => {
    console.log('Applying filters with period:', period, 'and range:', dateRange);
  };

  const handleExport = () => {
    setExportDialogOpen(true);
  };

  const exportData = reportData ? [reportData.metrics] : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Relatórios</h1>
          <p className="text-slate-600 mt-2">Análise detalhada dos seus dados</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download size={16} className="mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <ReportsFilters 
        period={period}
        onPeriodChange={handlePeriodChange}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        onApplyFilters={handleApplyFilters}
      />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 size={16} />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="sales" className="flex items-center gap-2">
            <DollarSign size={16} />
            Vendas
          </TabsTrigger>
          <TabsTrigger value="clients" className="flex items-center gap-2">
            <Users size={16} />
            Clientes
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <Target size={16} />
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-6">
            {reportData && (
              <>
                <ReportsMetrics 
                  metrics={{
                    totalClients: reportData.metrics.totalClients,
                    activeClients: reportData.metrics.newClients,
                    totalOpportunities: reportData.metrics.totalOpportunities,
                    wonOpportunities: reportData.metrics.wonOpportunities,
                    totalRevenue: reportData.metrics.totalRevenue,
                    pendingTasks: reportData.metrics.pendingTasks,
                    completedTasks: reportData.metrics.completedTasks
                  }}
                  advancedMetrics={{ avgDealSize: reportData.metrics.averageDealSize }}
                />
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <ReportsCharts data={{
                    opportunitiesByStage: [
                      { stage: 'Prospecção', count: reportData.rawData.opportunities.filter(o => o.stage === 'prospection').length },
                      { stage: 'Qualificação', count: reportData.rawData.opportunities.filter(o => o.stage === 'qualification').length },
                      { stage: 'Proposta', count: reportData.rawData.opportunities.filter(o => o.stage === 'proposal').length },
                      { stage: 'Negociação', count: reportData.rawData.opportunities.filter(o => o.stage === 'negotiation').length },
                      { stage: 'Ganhou', count: reportData.rawData.opportunities.filter(o => o.stage === 'closed_won').length },
                      { stage: 'Perdeu', count: reportData.rawData.opportunities.filter(o => o.stage === 'closed_lost').length },
                    ],
                    tasksByStatus: [
                      { status: 'Pendente', count: reportData.rawData.tasks.filter(t => t.status === 'pending').length },
                      { status: 'Em Progresso', count: reportData.rawData.tasks.filter(t => t.status === 'in_progress').length },
                      { status: 'Em Aprovação', count: reportData.rawData.tasks.filter(t => t.status === 'in_approval').length },
                      { status: 'Concluída', count: reportData.rawData.tasks.filter(t => t.status === 'completed').length },
                    ],
                    clientsByStatus: [
                      { status: 'Ativo', count: reportData.rawData.clients.filter(c => c.status === 'active').length },
                      { status: 'Inativo', count: reportData.rawData.clients.filter(c => c.status === 'inactive').length },
                      { status: 'Prospect', count: reportData.rawData.clients.filter(c => c.status === 'prospect').length },
                    ]
                  }} />
                </div>
              </>
            )}
            {isLoading && (
              <div className="text-center py-8">
                <p className="text-slate-600">Carregando relatórios...</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="sales">
          <div className="space-y-6">
            {reportData ? (
              <SalesReport 
                data={{
                  opportunities: reportData.rawData.opportunities,
                  clients: reportData.rawData.clients,
                  contracts: []
                }}
              />
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-600">Carregando dados de vendas...</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="clients">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users size={20} />
                  Análise de Clientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-slate-500">
                  <Users size={48} className="mx-auto mb-4 opacity-20" />
                  <p>Relatório de clientes será implementado em breve</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity size={20} />
                  Análise de Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-slate-500">
                  <Activity size={48} className="mx-auto mb-4 opacity-20" />
                  <p>Relatório de performance será implementado em breve</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <ExportDialog 
        data={exportData}
        filename="relatorios"
        title="Relatórios"
      />
    </div>
  );
};

export default Relatorios;
