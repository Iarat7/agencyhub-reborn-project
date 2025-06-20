
import React, { useState } from "react";
import { useCompleteDashboardData } from "@/hooks/useDashboard";
import { usePredictiveAnalytics } from "@/hooks/usePredictiveAnalytics";
import { useSmartInsights } from "@/hooks/useSmartInsights";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardWidgets } from "@/components/dashboard/DashboardWidgets";

export function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('6m');
  
  const { data: dashboardData, isLoading: isDashboardLoading } = useCompleteDashboardData(selectedPeriod);
  const { data: predictiveData, isLoading: isPredictiveLoading } = usePredictiveAnalytics(selectedPeriod);
  const { data: insights, isLoading: isInsightsLoading } = useSmartInsights(selectedPeriod);

  const isLoading = isDashboardLoading || isPredictiveLoading || isInsightsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <DashboardHeader 
        selectedPeriod={selectedPeriod} 
        onPeriodChange={setSelectedPeriod} 
      />

      <DashboardWidgets
        metrics={dashboardData?.metrics}
        predictiveData={predictiveData}
        insights={insights}
      />
    </div>
  );
}
