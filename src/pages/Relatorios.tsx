
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ReportsMetrics } from '@/components/reports/ReportsMetrics';
import { ReportsCharts } from '@/components/reports/ReportsCharts';
import { ReportsFilters } from '@/components/reports/ReportsFilters';
import { ExportDialog } from '@/components/reports/ExportDialog';
import { useAdvancedReportsData } from '@/hooks/useAdvancedReportsData';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Download,
  Calendar,
  Target,
  Activity
} from 'lucide-react';

const Relatorios = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  
  const { data: reportData, isLoading } = useAdvancedReportsData(selectedPeriod);

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
  };

  const handleExport = () => {
    setExportDialogOpen(true);
  };

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
        selectedPeriod={selectedPeriod}
        onPeriodChange={handlePeriodChange}
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
            <ReportsMetrics data={reportData} isLoading={isLoading} />
            <ReportsCharts data={reportData} isLoading={isLoading} />
          </div>
        </TabsContent>

        <TabsContent value="sales">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp size={20} />
                  Análise de Vendas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-slate-500">
                  <TrendingUp size={48} className="mx-auto mb-4 opacity-20" />
                  <p>Relatório de vendas será implementado em breve</p>
                </div>
              </CardContent>
            </Card>
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
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
      />
    </div>
  );
};

export default Relatorios;
