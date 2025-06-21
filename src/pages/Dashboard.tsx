
import React, { useState, useEffect } from 'react';
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
import { MobileOptimizedLoader } from '@/components/MobileOptimizedLoader';

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    console.log('📊 Dashboard component mounted');
    setMounted(true);
  }, []);

  // Buscar dados completos do dashboard - sempre chamar o hook
  const { data: dashboardData, isLoading, error } = useCompleteDashboardData(
    mounted ? selectedPeriod : null
  );
  
  // Buscar insights baseados nas métricas calculadas - sempre chamar o hook
  const { data: insights } = useSmartInsights(dashboardData?.metrics || null);

  console.log('📊 Dashboard render:', { 
    dashboardData: dashboardData ? 'Present' : 'Null', 
    isLoading, 
    isMobile,
    mounted,
    error: error ? error.message : 'None'
  });

  if (!mounted) {
    return <MobileOptimizedLoader message="Carregando dashboard..." />;
  }

  if (error) {
    console.error('📊 Dashboard error:', error);
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-2">Erro ao carregar dashboard</p>
          <button 
            onClick={() => window.location.reload()} 
            className="text-blue-500 underline"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

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
          <div className="space-y-4 md:space-y-6">
            <OptimizedDashboardMetrics metrics={dashboardData?.metrics} />
            <DashboardCharts metrics={dashboardData?.metrics} />
          </div>

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
