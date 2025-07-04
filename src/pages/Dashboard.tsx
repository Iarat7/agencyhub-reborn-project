
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
import { useOrganizationData } from '@/hooks/useOrganizationData';
import { useOrganization } from '@/contexts/OrganizationContext';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6m');
  const { currentOrganization, loading: orgLoading, refreshOrganizations } = useOrganization();
  
  // Hook para garantir que os dados estão na organização correta
  useOrganizationData();
  
  const { data: dashboardData, isLoading: dashboardLoading, error } = useCompleteDashboardData(selectedPeriod);
  const { data: predictiveData, isLoading: predictiveLoading } = usePredictiveAnalytics(selectedPeriod);
  const { data: insights, isLoading: insightsLoading } = useSmartInsights(selectedPeriod);

  const isLoading = dashboardLoading || predictiveLoading || insightsLoading || orgLoading;

  if (error) {
    console.error('Erro no dashboard:', error);
  }

  // Se ainda está carregando as organizações
  if (orgLoading) {
    return (
      <div className="space-y-6 p-4 sm:p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando organizações...</p>
        </div>
      </div>
    );
  }

  // Se não há organização selecionada
  if (!currentOrganization) {
    return (
      <div className="space-y-6 p-4 sm:p-6">
        <DashboardHeader 
          selectedPeriod={selectedPeriod} 
          onPeriodChange={setSelectedPeriod} 
        />
        
        <Card className="border-2 border-dashed border-yellow-300 bg-yellow-50">
          <CardContent className="p-8 text-center">
            <Building2 className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              Problema ao Carregar Organização
            </h3>
            <p className="text-yellow-700 mb-4">
              Não foi possível carregar sua organização. Vamos tentar recarregar.
            </p>
            <Button 
              onClick={refreshOrganizations}
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Recarregar Organizações
            </Button>
            <div className="bg-yellow-100 border border-yellow-200 rounded-lg p-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-yellow-800">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>Se o problema persistir, entre em contato com o suporte.</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
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
