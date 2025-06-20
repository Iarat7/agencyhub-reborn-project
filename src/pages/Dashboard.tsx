
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardCard } from "@/components/DashboardCard";
import { ReportsCharts } from "@/components/reports/ReportsCharts";
import { PeriodSelector } from "@/components/dashboard/PeriodSelector";
import { NotificationAlerts } from "@/components/dashboard/NotificationAlerts";
import { useDashboardData } from "@/hooks/useDashboard";
import { Users, Target, DollarSign, CheckCircle, AlertCircle, TrendingUp } from "lucide-react";
import { useState } from "react";

export function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('6m');
  const { data, isLoading } = useDashboardData(selectedPeriod);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const metrics = data?.metrics;
  const charts = data?.charts;
  const recentActivities = data?.recentActivities || [];

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Visão geral do seu negócio
          </p>
        </div>
        <PeriodSelector value={selectedPeriod} onChange={setSelectedPeriod} />
      </div>

      <NotificationAlerts />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total de Clientes"
          value={metrics?.totalClients?.toString() || "0"}
          description={`${metrics?.activeClients || 0} ativos`}
          icon={Users}
          trend={undefined}
        />
        <DashboardCard
          title="Oportunidades"
          value={metrics?.totalOpportunities?.toString() || "0"}
          description={`${metrics?.wonOpportunities || 0} fechadas`}
          icon={Target}
          trend={undefined}
        />
        <DashboardCard
          title="Receita Total"
          value={`R$ ${(metrics?.totalRevenue || 0).toLocaleString('pt-BR')}`}
          description={`Taxa de conversão: ${metrics?.conversionRate?.toFixed(1) || 0}%`}
          icon={DollarSign}
          trend={undefined}
        />
        <DashboardCard
          title="Tarefas"
          value={`${metrics?.completedTasks || 0}/${(metrics?.completedTasks || 0) + (metrics?.pendingTasks || 0)}`}
          description={`${metrics?.pendingTasks || 0} pendentes`}
          icon={CheckCircle}
          trend={undefined}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <ReportsCharts 
            salesData={charts?.salesData || []}
            opportunityData={charts?.opportunityData || []}
          />
        </div>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Atividades Recentes
            </CardTitle>
            <CardDescription>
              Últimas atividades da sua equipe
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {activity.action.includes('cliente') && <Users className="h-4 w-4 text-blue-500 mt-1" />}
                    {activity.action.includes('Oportunidade') && <Target className="h-4 w-4 text-green-500 mt-1" />}
                    {activity.action.includes('Tarefa') && <CheckCircle className="h-4 w-4 text-purple-500 mt-1" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500 truncate">{activity.client}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Nenhuma atividade recente</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
