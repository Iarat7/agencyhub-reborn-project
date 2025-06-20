
import React, { useState } from 'react';
import { Users, Target, DollarSign, TrendingUp, Calendar, CheckCircle } from 'lucide-react';
import { DashboardCard } from '@/components/DashboardCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useDashboardData } from '@/hooks/useDashboard';
import { PeriodSelector, periodOptions } from '@/components/dashboard/PeriodSelector';

export const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6');
  const periodMonths = periodOptions.find(p => p.value === selectedPeriod)?.months || 6;
  const { data: dashboardData, isLoading, error } = useDashboardData(periodMonths);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-2">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-red-600 mt-2">Erro ao carregar dados do dashboard</p>
        </div>
      </div>
    );
  }

  const { metrics, charts, recentActivities } = dashboardData || {};

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-2">Visão geral do seu negócio</p>
        </div>
        <PeriodSelector value={selectedPeriod} onChange={setSelectedPeriod} />
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total de Clientes"
          value={metrics?.totalClients || 0}
          icon={Users}
          trend={{ value: metrics?.activeClients || 0, isPositive: true }}
          className="bg-gradient-to-br from-blue-50 to-blue-100"
        />
        <DashboardCard
          title="Oportunidades Ativas"
          value={metrics?.totalOpportunities || 0}
          icon={Target}
          trend={{ value: metrics?.wonOpportunities || 0, isPositive: true }}
          className="bg-gradient-to-br from-green-50 to-green-100"
        />
        <DashboardCard
          title="Receita Total"
          value={formatCurrency(metrics?.totalRevenue || 0)}
          icon={DollarSign}
          trend={{ value: Math.round(metrics?.conversionRate || 0), isPositive: true }}
          className="bg-gradient-to-br from-purple-50 to-purple-100"
        />
        <DashboardCard
          title="Tarefas Pendentes"
          value={metrics?.pendingTasks || 0}
          icon={Calendar}
          trend={{ value: metrics?.completedTasks || 0, isPositive: true }}
          className="bg-gradient-to-br from-orange-50 to-orange-100"
        />
      </div>

      {/* Resumo rápido */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Taxa de Conversão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {metrics?.conversionRate?.toFixed(1) || 0}%
            </div>
            <p className="text-sm text-slate-600 mt-2">
              {metrics?.wonOpportunities || 0} de {metrics?.totalOpportunities || 0} oportunidades fechadas
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Clientes Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {metrics?.activeClients || 0}
            </div>
            <p className="text-sm text-slate-600 mt-2">
              de {metrics?.totalClients || 0} clientes totais
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Produtividade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {((metrics?.completedTasks || 0) / Math.max((metrics?.completedTasks || 0) + (metrics?.pendingTasks || 0), 1) * 100).toFixed(0)}%
            </div>
            <p className="text-sm text-slate-600 mt-2">
              {metrics?.completedTasks || 0} tarefas concluídas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Receita por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={charts?.salesData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="vendas" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Oportunidades por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={charts?.opportunityData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="oportunidades" stroke="#16a34a" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Atividades recentes */}
      <Card>
        <CardHeader>
          <CardTitle>Atividades Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities && recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">{activity.action}</p>
                    <p className="text-sm text-slate-600">{activity.client}</p>
                  </div>
                  <Badge variant="outline">{activity.time}</Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-600">Nenhuma atividade recente encontrada</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
