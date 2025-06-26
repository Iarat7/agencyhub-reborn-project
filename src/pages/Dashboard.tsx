
import React, { useState } from 'react';
import { SubscriptionStatus } from '@/components/subscription/SubscriptionStatus';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardMetrics } from '@/components/dashboard/DashboardMetrics';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { DashboardActivities } from '@/components/dashboard/DashboardActivities';
import { DashboardWidgets } from '@/components/dashboard/DashboardWidgets';
import { useCalculatedDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { usePredictiveAnalytics } from '@/hooks/usePredictiveAnalytics';
import { useSmartInsights } from '@/hooks/useSmartInsights';
import { useDashboardActivities } from '@/hooks/useDashboardActivities';
import { usePeriodUtils } from '@/hooks/usePeriodUtils';

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6m');
  const { calculatePeriodDates } = usePeriodUtils();
  
  const periodDates = calculatePeriodDates(selectedPeriod);
  const { startDate, endDate } = periodDates;

  const { data: metricsData, isLoading: metricsLoading } = useCalculatedDashboardMetrics(startDate, endDate);
  const { data: predictiveData, isLoading: predictiveLoading } = usePredictiveAnalytics();
  const { data: insights, isLoading: insightsLoading } = useSmartInsights();
  
  const { data: recentActivities } = useDashboardActivities(
    startDate, 
    endDate, 
    metricsData?.rawData || { clients: [], allOpportunities: [], tasks: [] }
  );

  const isLoading = metricsLoading || predictiveLoading || insightsLoading;

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
          <DashboardMetrics metrics={metricsData} />
          <DashboardCharts metrics={metricsData} />
          <DashboardWidgets 
            metrics={metricsData}
            predictiveData={predictiveData}
            insights={insights}
          />
          <DashboardActivities recentActivities={recentActivities || []} />
        </>
      )}
    </div>
  );
};

export default Dashboard;
