
import React, { useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { OptimizedDashboardMetrics } from '@/components/dashboard/OptimizedDashboardMetrics';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { NotificationAlerts } from '@/components/dashboard/NotificationAlerts';
import { AIStrategiesCard } from '@/components/ai/AIStrategiesCard';
import { SmartInsights } from '@/components/dashboard/SmartInsights';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Brain, Bell } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSmartInsights } from '@/hooks/useSmartInsights';
import { useCompleteDashboardData } from '@/hooks/useDashboard';

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const isMobile = useIsMobile();

  // Buscar dados completos do dashboard
  const { data: dashboardData, isLoading } = useCompleteDashboardData(selectedPeriod);
  
  // Dados para insights
  const { data: insights } = useSmartInsights(selectedPeriod);

  return (
    <div className="space-y-4 md:space-y-6">
      <DashboardHeader 
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
      />
      
      {isMobile ? (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="text-xs">
              <BarChart3 className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="ai" className="text-xs">
              <Brain className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="alerts" className="text-xs">
              <Bell className="w-4 h-4" />
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <OptimizedDashboardMetrics metrics={dashboardData?.metrics} />
            <DashboardCharts metrics={dashboardData?.metrics} />
          </TabsContent>
          
          <TabsContent value="ai" className="space-y-4">
            <AIStrategiesCard />
            <SmartInsights insights={insights} />
          </TabsContent>
          
          <TabsContent value="alerts">
            <NotificationAlerts />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="space-y-4 md:space-y-6">
          {/* Layout principal - Métricas e Gráficos ocupando todo o espaço */}
          <div className="space-y-4 md:space-y-6">
            <OptimizedDashboardMetrics metrics={dashboardData?.metrics} />
            <DashboardCharts metrics={dashboardData?.metrics} />
          </div>

          {/* Seção de Inteligência Artificial */}
          <div className="border-t pt-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Brain className="h-6 w-6" />
              Inteligência Artificial
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <AIStrategiesCard />
              <SmartInsights insights={insights} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
