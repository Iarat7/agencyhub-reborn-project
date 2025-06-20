
import React, { useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { OptimizedDashboardMetrics } from '@/components/dashboard/OptimizedDashboardMetrics';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { DashboardActivities } from '@/components/dashboard/DashboardActivities';
import { DashboardWidgets } from '@/components/dashboard/DashboardWidgets';
import { NotificationAlerts } from '@/components/dashboard/NotificationAlerts';
import { AIStrategiesCard } from '@/components/ai/AIStrategiesCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Calendar, Brain, Bell } from 'lucide-react';
import { useMobile } from '@/hooks/use-mobile';

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const isMobile = useMobile();

  return (
    <div className="space-y-4 md:space-y-6">
      <DashboardHeader />
      
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
            <OptimizedDashboardMetrics 
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
            />
            <DashboardCharts selectedPeriod={selectedPeriod} />
          </TabsContent>
          
          <TabsContent value="activities">
            <DashboardActivities />
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
            <OptimizedDashboardMetrics 
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
            />
            
            <DashboardCharts selectedPeriod={selectedPeriod} />
            
            <DashboardActivities />
          </div>
          
          <div className="xl:col-span-1 space-y-4 md:space-y-6">
            <AIStrategiesCard />
            <NotificationAlerts />
            <DashboardWidgets />
          </div>
        </div>
      )}
    </div>
  );
}
