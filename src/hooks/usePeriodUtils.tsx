
import { useMemo } from 'react';

export interface PeriodDates {
  startDate: Date;
  endDate: Date;
  periodConfig: {
    type: 'days' | 'months' | 'current_month' | 'last_month' | 'yesterday';
    days?: number;
    months?: number;
  };
}

export const usePeriodUtils = () => {
  const calculatePeriodDates = (selectedPeriod: string): PeriodDates => {
    const now = new Date();
    
    switch (selectedPeriod) {
      case 'today':
        return {
          startDate: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
          endDate: now,
          periodConfig: { type: 'days', days: 0 }
        };
      case 'yesterday':
        const yesterday = new Date(now);
        yesterday.setDate(yesterday.getDate() - 1);
        return {
          startDate: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate()),
          endDate: new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59),
          periodConfig: { type: 'yesterday' }
        };
      case '7':
        return {
          startDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
          endDate: now,
          periodConfig: { type: 'days', days: 7 }
        };
      case '14':
        return {
          startDate: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
          endDate: now,
          periodConfig: { type: 'days', days: 14 }
        };
      case '30':
        return {
          startDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
          endDate: now,
          periodConfig: { type: 'days', days: 30 }
        };
      case 'current_month':
        return {
          startDate: new Date(now.getFullYear(), now.getMonth(), 1),
          endDate: now,
          periodConfig: { type: 'current_month' }
        };
      case 'last_month':
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
        return {
          startDate: lastMonth,
          endDate: lastMonthEnd,
          periodConfig: { type: 'last_month' }
        };
      case '3m':
        return {
          startDate: new Date(now.getFullYear(), now.getMonth() - 3, 1),
          endDate: now,
          periodConfig: { type: 'months', months: 3 }
        };
      case '6m':
        return {
          startDate: new Date(now.getFullYear(), now.getMonth() - 6, 1),
          endDate: now,
          periodConfig: { type: 'months', months: 6 }
        };
      case '12m':
        return {
          startDate: new Date(now.getFullYear(), now.getMonth() - 12, 1),
          endDate: now,
          periodConfig: { type: 'months', months: 12 }
        };
      case '24m':
        return {
          startDate: new Date(now.getFullYear(), now.getMonth() - 24, 1),
          endDate: now,
          periodConfig: { type: 'months', months: 24 }
        };
      default:
        // Default para 6 meses
        return {
          startDate: new Date(now.getFullYear(), now.getMonth() - 6, 1),
          endDate: now,
          periodConfig: { type: 'months', months: 6 }
        };
    }
  };

  return { calculatePeriodDates };
};
