
import { useState, useMemo, useCallback } from 'react';
import { FilterFieldConfig } from '@/components/filters/FilterField';

export interface FilterState {
  values: Record<string, any>;
  isOpen: boolean;
}

export const useAdvancedFiltering = <T extends Record<string, any>>(
  data: T[],
  filterFunction: (item: T, filters: Record<string, any>) => boolean,
  initialFilters: Record<string, any> = {}
) => {
  const [filterState, setFilterState] = useState<FilterState>({
    values: initialFilters,
    isOpen: false
  });

  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const hasActiveFilters = Object.values(filterState.values).some(v => v !== undefined && v !== '');
    if (!hasActiveFilters) return data;

    return data.filter(item => filterFunction(item, filterState.values));
  }, [data, filterState.values, filterFunction]);

  const setFilters = useCallback((values: Record<string, any>) => {
    setFilterState(prev => ({ ...prev, values }));
  }, []);

  const updateFilter = useCallback((key: string, value: any) => {
    setFilterState(prev => ({
      ...prev,
      values: { ...prev.values, [key]: value }
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilterState(prev => ({ ...prev, values: {} }));
  }, []);

  const togglePanel = useCallback(() => {
    setFilterState(prev => ({ ...prev, isOpen: !prev.isOpen }));
  }, []);

  const openPanel = useCallback(() => {
    setFilterState(prev => ({ ...prev, isOpen: true }));
  }, []);

  const closePanel = useCallback(() => {
    setFilterState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const getActiveFiltersCount = useCallback(() => {
    return Object.values(filterState.values).filter(v => v !== undefined && v !== '').length;
  }, [filterState.values]);

  const hasActiveFilters = useMemo(() => {
    return getActiveFiltersCount() > 0;
  }, [getActiveFiltersCount]);

  return {
    filters: filterState.values,
    isFilterOpen: filterState.isOpen,
    filteredData,
    setFilters,
    updateFilter,
    resetFilters,
    togglePanel,
    openPanel,
    closePanel,
    getActiveFiltersCount,
    hasActiveFilters
  };
};
