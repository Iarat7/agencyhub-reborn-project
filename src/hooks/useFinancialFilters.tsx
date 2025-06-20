
import { useState, useMemo } from 'react';
import { FinancialEntry } from '@/services/api/types';
import { isAfter, isBefore, parseISO, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear } from 'date-fns';

export const useFinancialFilters = (entries: FinancialEntry[]) => {
  const [periodFilter, setPeriodFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  const filteredEntries = useMemo(() => {
    let filtered = [...entries];
    const today = new Date();

    // Filtro por tipo
    if (typeFilter !== 'all') {
      filtered = filtered.filter(entry => entry.type === typeFilter);
    }

    // Filtro por status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(entry => entry.status === statusFilter);
    }

    // Filtro por período
    if (periodFilter !== 'all' && periodFilter !== 'custom') {
      let startDate: Date;
      let endDate: Date;

      switch (periodFilter) {
        case 'today':
          startDate = startOfDay(today);
          endDate = endOfDay(today);
          break;
        case 'week':
          startDate = startOfWeek(today);
          endDate = endOfWeek(today);
          break;
        case 'month':
          startDate = startOfMonth(today);
          endDate = endOfMonth(today);
          break;
        case 'quarter':
          startDate = startOfQuarter(today);
          endDate = endOfQuarter(today);
          break;
        case 'year':
          startDate = startOfYear(today);
          endDate = endOfYear(today);
          break;
        default:
          startDate = startOfMonth(today);
          endDate = endOfMonth(today);
      }

      filtered = filtered.filter(entry => {
        if (!entry.due_date) return false;
        const dueDate = parseISO(entry.due_date);
        return isAfter(dueDate, startDate) && isBefore(dueDate, endDate) || 
               dueDate.toDateString() === startDate.toDateString() || 
               dueDate.toDateString() === endDate.toDateString();
      });
    }

    // Filtro por período customizado
    if (periodFilter === 'custom') {
      if (dateRange.from) {
        filtered = filtered.filter(entry => {
          if (!entry.due_date) return false;
          const dueDate = parseISO(entry.due_date);
          return isAfter(dueDate, dateRange.from!) || dueDate.toDateString() === dateRange.from!.toDateString();
        });
      }

      if (dateRange.to) {
        filtered = filtered.filter(entry => {
          if (!entry.due_date) return false;
          const dueDate = parseISO(entry.due_date);
          return isBefore(dueDate, dateRange.to!) || dueDate.toDateString() === dateRange.to!.toDateString();
        });
      }
    }

    return filtered;
  }, [entries, periodFilter, typeFilter, statusFilter, dateRange]);

  const resetFilters = () => {
    setPeriodFilter('all');
    setTypeFilter('all');
    setStatusFilter('all');
    setDateRange({});
  };

  return {
    periodFilter,
    setPeriodFilter,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    dateRange,
    setDateRange,
    filteredEntries,
    resetFilters
  };
};
