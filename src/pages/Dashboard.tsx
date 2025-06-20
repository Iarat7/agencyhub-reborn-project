
import React, { useState } from "react";
import { useCompleteDashboardData } from "@/hooks/useDashboard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { DashboardActivities } from "@/components/dashboard/DashboardActivities";
import { NotificationAlerts } from "@/components/dashboard/NotificationAlerts";

export function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('6m');
  const { data, isLoading } = useCompleteDashboardData(selectedPeriod);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const metrics = data?.metrics;
  const recentActivities = data?.recentActivities || [];

  return (
    <div className="flex-1 space-y-6 p-6">
      <DashboardHeader 
        selectedPeriod={selectedPeriod} 
        onPeriodChange={setSelectedPeriod} 
      />

      <NotificationAlerts />

      <DashboardMetrics metrics={metrics} />

      <DashboardCharts metrics={metrics} />

      <DashboardActivities recentActivities={recentActivities} />
    </div>
  );
}
