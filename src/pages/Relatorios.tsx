import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ReportsMetrics } from '@/components/reports/ReportsMetrics';
import { AdvancedCharts } from '@/components/reports/AdvancedCharts';
import { Users, Target, DollarSign, Activity } from 'lucide-react';
import { useClients } from '@/hooks/useClients';
import { useOpportunities } from '@/hooks/useOpportunities';
import { SalesReportChart } from '@/components/reports/SalesReportChart';

export const Relatorios = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const { data: clients = [] } = useClients();
  const { data: opportunities = [] } = useOpportunities();

  // Métricas básicas
  const totalClients = clients.length;
  const activeClients = clients.filter(client => client.status === 'active').length;
  const totalOpportunities = opportunities?.length || 0;
  const wonOpportunities = opportunities?.filter(opp => opp.stage === 'closed_won').length || 0;
  const totalRevenue = opportunities?.filter(opp => opp.stage === 'closed_won')
    .reduce((sum, opp) => sum + (opp.value || 0), 0) || 0;

  // Métricas avançadas
  const avgDealSize = wonOpportunities > 0 ? totalRevenue / wonOpportunities : 0;

  // Dados para os gráficos (exemplo)
  const salesData = [
    { name: 'Jan', vendas: 4000, oportunidades: 2400 },
    { name: 'Fev', vendas: 3000, oportunidades: 1398 },
    { name: 'Mar', vendas: 2000, oportunidades: 9800 },
    { name: 'Abr', vendas: 2780, oportunidades: 3908 },
    { name: 'Mai', vendas: 1890, oportunidades: 4800 },
    { name: 'Jun', vendas: 2390, oportunidades: 3800 },
  ];

  const revenueData = [
    { month: 'Jan', receita: 4000, meta: 5000 },
    { month: 'Fev', receita: 3000, meta: 4000 },
    { month: 'Mar', receita: 2000, meta: 3000 },
    { month: 'Abr', receita: 2780, meta: 3500 },
    { month: 'Mai', receita: 1890, meta: 2500 },
    { month: 'Jun', receita: 2390, meta: 3000 },
  ];

  const conversionData = [
    { stage: 'Prospecção', conversion: 60 },
    { stage: 'Qualificação', conversion: 45 },
    { stage: 'Proposta', conversion: 30 },
    { stage: 'Negociação', conversion: 20 },
  ];

  const activityData = [
    { day: 'Seg', atividades: 30 },
    { day: 'Ter', atividades: 45 },
    { day: 'Qua', atividades: 60 },
    { day: 'Qui', atividades: 50 },
    { day: 'Sex', atividades: 70 },
  ];

  // Top 5 clientes por receita (simulação)
  const topClients = [
    { id: '1', name: 'Cliente A', company: 'Empresa X', total_revenue: 15000 },
    { id: '2', name: 'Cliente B', company: 'Empresa Y', total_revenue: 12000 },
    { id: '3', name: 'Cliente C', company: 'Empresa Z', total_revenue: 10000 },
    { id: '4', name: 'Cliente D', company: 'Empresa W', total_revenue: 8000 },
    { id: '5', name: 'Cliente E', company: 'Empresa V', total_revenue: 6000 },
  ];

  const metrics = {
    totalClients,
    activeClients,
    totalOpportunities,
    wonOpportunities,
    totalRevenue,
    pendingTasks: 10,
    completedTasks: 25,
  };

  const advancedMetrics = {
    avgDealSize,
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    console.log(`Exportando relatório em formato ${format}`);
    // Implementar lógica de exportação
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Relatórios</h1>
          <p className="text-gray-600">Análise detalhada de performance e métricas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            Exportar PDF
          </Button>
          <Button variant="outline" onClick={() => handleExport('excel')}>
            Exportar Excel
          </Button>
        </div>
      </div>

      {/* Filtros de Período */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros de Período</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Data Inicial</label>
              <Input type="date" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Data Final</label>
              <Input type="date" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Período</label>
              <select className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2">
                <option>Últimos 30 dias</option>
                <option>Últimos 3 meses</option>
                <option>Últimos 6 meses</option>
                <option>Último ano</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas Principais */}
      <ReportsMetrics metrics={metrics} advancedMetrics={advancedMetrics} />

      {/* Gráficos de Vendas */}
      <SalesReportChart opportunities={opportunities} />

      {/* Gráficos Avançados */}
      <AdvancedCharts 
        salesData={salesData}
        revenueData={revenueData}
        conversionData={conversionData}
        activityData={activityData}
      />

      {/* Detalhes dos Relatórios */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Clientes por Receita</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topClients.map((client, index) => (
                <div key={client.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-medium">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <p className="text-sm text-gray-600">{client.company}</p>
                    </div>
                  </div>
                  <span className="font-medium text-green-600">
                    {client.total_revenue?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo do Período</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{metrics.totalOpportunities}</p>
                  <p className="text-sm text-blue-800">Oportunidades</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{metrics.wonOpportunities}</p>
                  <p className="text-sm text-green-800">Fechadas</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span>Taxa de Conversão</span>
                  <span className="font-medium">
                    {metrics.totalOpportunities > 0 
                      ? ((metrics.wonOpportunities / metrics.totalOpportunities) * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span>Ticket Médio</span>
                  <span className="font-medium">
                    {advancedMetrics.avgDealSize.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
