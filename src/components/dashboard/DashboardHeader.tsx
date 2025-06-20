
import React from 'react';
import { PeriodSelector } from "@/components/dashboard/PeriodSelector";

interface DashboardHeaderProps {
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
}

export const DashboardHeader = ({ selectedPeriod, onPeriodChange }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Visão geral do seu negócio
        </p>
      </div>
      <PeriodSelector value={selectedPeriod} onChange={onPeriodChange} />
    </div>
  );
};
