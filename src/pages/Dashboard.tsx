
import React, { useState } from 'react';
import { SubscriptionStatus } from '@/components/subscription/SubscriptionStatus';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardMetrics } from '@/components/dashboard/DashboardMetrics';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { DashboardActivities } from '@/components/dashboard/DashboardActivities';
import { DashboardWidgets } from '@/components/dashboard/DashboardWidgets';
import { useCompleteDashboardData } from '@/hooks/useDashboard';
import { usePredictiveAnalytics } from '@/hooks/usePredictiveAnalytics';
import { useSmartInsights } from '@/hooks/useSmartInsights';

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6m');
  
  const { data: dashboardData, isLoading: dashboardLoading, error } = useCompleteDashboardData(selectedPeriod);
  const { data: predictiveData, isLoading: predictiveLoading } = usePredictiveAnalytics(selectedPeriod);
  const { data: insights, isLoading: insightsLoading } = useSmartInsights(selectedPeriod);

  const isLoading = dashboardLoading || predictiveLoading || insightsLoading;

  if (error) {
    console.error('Erro no dashboard:', error);
  }

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <DashboardHeader 
        selectedPeriod={selectedPeriod} 
        onPeriodChange={setSelectedPeriod} 
      />
      
      <SubscriptionStatus />
      
      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-slate-600">Carregando dashboard...</p>
        </div>
      ) : (
        <>
          <DashboardMetrics metrics={dashboardData?.metrics} />
          <DashboardCharts metrics={dashboardData?.metrics} />
          <DashboardWidgets 
            metrics={dashboardData?.metrics}
            predictiveData={predictiveData}
            insights={insights}
          />
          <DashboardActivities recentActivities={dashboardData?.recentActivities || []} />
        </>
      )}
    </div>
  );
};

export default Dashboard;
