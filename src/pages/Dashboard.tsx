
import React from 'react';
import { SubscriptionStatus } from '@/components/subscription/SubscriptionStatus';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardMetrics } from '@/components/dashboard/DashboardMetrics';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { DashboardActivities } from '@/components/dashboard/DashboardActivities';
import { DashboardWidgets } from '@/components/dashboard/DashboardWidgets';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { usePredictiveAnalytics } from '@/hooks/usePredictiveAnalytics';
import { useSmartInsights } from '@/hooks/useSmartInsights';

const Dashboard = () => {
  const { data: metrics, isLoading: metricsLoading } = useDashboardMetrics();
  const { data: predictiveData, isLoading: predictiveLoading } = usePredictiveAnalytics();
  const { data: insights, isLoading: insightsLoading } = useSmartInsights();

  const isLoading = metricsLoading || predictiveLoading || insightsLoading;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <DashboardHeader />
      
      <SubscriptionStatus />
      
      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-slate-600">Carregando dashboard...</p>
        </div>
      ) : (
        <>
          <DashboardMetrics metrics={metrics} />
          <DashboardCharts metrics={metrics} />
          <DashboardWidgets 
            metrics={metrics}
            predictiveData={predictiveData}
            insights={insights}
          />
          <DashboardActivities />
        </>
      )}
    </div>
  );
};

export default Dashboard;
