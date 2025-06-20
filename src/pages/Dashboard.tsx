
import React, { useState } from "react";
import { useCompleteDashboardData } from "@/hooks/useDashboard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { DashboardActivities } from "@/components/dashboard/DashboardActivities";

export function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('6m');
  
  const { data: dashboardData, isLoading } = useCompleteDashboardData(selectedPeriod);

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

      <DashboardMetrics metrics={dashboardData?.metrics} />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <DashboardCharts metrics={dashboardData?.metrics} />
        </div>
        
        <div>
          <DashboardActivities activities={dashboardData?.recentActivities} />
        </div>
      </div>
    </div>
  );
}
