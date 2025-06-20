
import { useState, useMemo } from 'react';
import { Contract } from '@/services/api/types';
import { isAfter, isBefore, parseISO, addDays } from 'date-fns';

export const useContractFilters = (contracts: Contract[]) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  const filteredContracts = useMemo(() => {
    let filtered = [...contracts];
    const today = new Date();

    // Filtro por status
    if (statusFilter !== 'all') {
      if (statusFilter === 'expiring_30') {
        const thirtyDaysFromNow = addDays(today, 30);
        filtered = filtered.filter(contract => {
          if (contract.status !== 'active') return false;
          const endDate = parseISO(contract.end_date);
          return isAfter(endDate, today) && isBefore(endDate, thirtyDaysFromNow);
        });
      } else {
        filtered = filtered.filter(contract => contract.status === statusFilter);
      }
    }

    // Filtro por período
    if (dateRange.from) {
      filtered = filtered.filter(contract => {
        const startDate = parseISO(contract.start_date);
        return isAfter(startDate, dateRange.from!) || startDate.toDateString() === dateRange.from!.toDateString();
      });
    }

    if (dateRange.to) {
      filtered = filtered.filter(contract => {
        const endDate = parseISO(contract.end_date);
        return isBefore(endDate, dateRange.to!) || endDate.toDateString() === dateRange.to!.toDateString();
      });
    }

    return filtered;
  }, [contracts, statusFilter, dateRange]);

  const resetFilters = () => {
    setStatusFilter('all');
    setDateRange({});
  };

  // Calcular estatísticas
  const stats = useMemo(() => {
    const today = new Date();
    const thirtyDaysFromNow = addDays(today, 30);

    const expired = contracts.filter(contract => {
      const endDate = parseISO(contract.end_date);
      return contract.status === 'active' && isBefore(endDate, today);
    });

    const expiring = contracts.filter(contract => {
      if (contract.status !== 'active') return false;
      const endDate = parseISO(contract.end_date);
      return isAfter(endDate, today) && isBefore(endDate, thirtyDaysFromNow);
    });

    return { expired, expiring };
  }, [contracts]);

  return {
    statusFilter,
    setStatusFilter,
    dateRange,
    setDateRange,
    filteredContracts,
    resetFilters,
    stats
  };
};
