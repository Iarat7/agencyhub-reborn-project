
import { useCallback } from 'react';
import { periodOptions } from '@/components/dashboard/PeriodSelector';

export const usePeriodUtils = () => {
  const calculatePeriodDates = useCallback((selectedPeriod: string) => {
    const periodConfig = periodOptions.find(p => p.value === selectedPeriod);
    const now = new Date();
    let startDate: Date;
    let endDate = new Date(now);
    
    if (periodConfig?.type === 'days') {
      if (periodConfig.value === 'today') {
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
      } else {
        startDate = new Date(now.getTime() - (periodConfig.days! * 24 * 60 * 60 * 1000));
      }
    } else if (periodConfig?.type === 'yesterday') {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      startDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
      endDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59);
    } else if (periodConfig?.type === 'current_month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    } else if (periodConfig?.type === 'last_month') {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    } else {
      const months = periodConfig?.months || 6;
      startDate = new Date(now.getFullYear(), now.getMonth() - months, 1);
    }

    return { startDate, endDate, periodConfig };
  }, []);

  return { calculatePeriodDates };
};
