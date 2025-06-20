
import React, { useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { OptimizedDashboardMetrics } from '@/components/dashboard/OptimizedDashboardMetrics';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { DashboardActivities } from '@/components/dashboard/DashboardActivities';
import { NotificationAlerts } from '@/components/dashboard/NotificationAlerts';
import { AIStrategiesCard } from '@/components/ai/AIStrategiesCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Calendar, Brain, Bell } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const isMobile = useIsMobile();

  // Mock data para atividades recentes
  const mockRecentActivities = [
    { action: 'Novo cliente cadastrado', client: 'Empresa ABC', time: '2 horas atrás' },
    { action: 'Oportunidade fechada', client: 'Projeto XYZ', time: '5 horas atrás' },
    { action: 'Tarefa concluída', client: 'Reunião de planejamento', time: '1 dia atrás' }
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      <DashboardHeader 
        selectedPeriod={selectedPeriod}
        onPeriodChange={setSelectedPeriod}
      />
      
      {isMobile ? (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="text-xs">
              <BarChart3 className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="activities" className="text-xs">
              <Calendar className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="ai" className="text-xs">
              <Brain className="w-4 h-4" />
            </TabsTrigger>
            <TabsTrigger value="alerts" className="text-xs">
              <Bell className="w-4 h-4" />
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <OptimizedDashboardMetrics />
            <DashboardCharts />
          </TabsContent>
          
          <TabsContent value="activities">
            <DashboardActivities recentActivities={mockRecentActivities} />
          </TabsContent>
          
          <TabsContent value="ai">
            <AIStrategiesCard />
          </TabsContent>
          
          <TabsContent value="alerts">
            <NotificationAlerts />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 md:gap-6">
          <div className="xl:col-span-3 space-y-4 md:space-y-6">
            <OptimizedDashboardMetrics />
            
            <DashboardCharts />
            
            <DashboardActivities recentActivities={mockRecentActivities} />
          </div>
          
          <div className="xl:col-span-1 space-y-4 md:space-y-6">
            <AIStrategiesCard />
            <NotificationAlerts />
          </div>
        </div>
      )}
    </div>
  );
}
