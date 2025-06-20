
import { useState, useMemo } from 'react';
import { Strategy } from './useStrategies';
import { StrategyFilterValues } from '@/components/strategies/StrategyFilters';

export const useStrategyFilters = (strategies: Strategy[]) => {
  const [filters, setFilters] = useState<StrategyFilterValues>({
    search: '',
    client_id: 'all',
    period: 'all',
    status: 'all',
  });

  const filteredStrategies = useMemo(() => {
    if (!strategies) return [];

    return strategies.filter((strategy) => {
      // Filtro de busca
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const titleMatch = strategy.title.toLowerCase().includes(searchLower);
        const objectivesMatch = strategy.objectives?.toLowerCase().includes(searchLower);
        if (!titleMatch && !objectivesMatch) return false;
      }

      // Filtro de cliente
      if (filters.client_id !== 'all') {
        if (strategy.client_id !== filters.client_id) return false;
      }

      // Filtro de status
      if (filters.status !== 'all') {
        if (strategy.status !== filters.status) return false;
      }

      // Filtro de período
      if (filters.period !== 'all' && strategy.created_at) {
        const strategyDate = new Date(strategy.created_at);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - strategyDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        switch (filters.period) {
          case '7d':
            if (diffDays > 7) return false;
            break;
          case '30d':
            if (diffDays > 30) return false;
            break;
          case '90d':
            if (diffDays > 90) return false;
            break;
          case '1y':
            if (diffDays > 365) return false;
            break;
        }
      }

      return true;
    });
  }, [strategies, filters]);

  const resetFilters = () => {
    setFilters({
      search: '',
      client_id: 'all',
      period: 'all',
      status: 'all',
    });
  };

  return {
    filters,
    setFilters,
    filteredStrategies,
    resetFilters,
  };
};
