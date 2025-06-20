
import { useState, useMemo } from 'react';
import { FilterValues } from '@/components/filters/AdvancedFilters';

export const useAdvancedFilters = <T extends Record<string, any>>(
  data: T[],
  filterFunction: (item: T, filters: FilterValues) => boolean
) => {
  const [filters, setFilters] = useState<FilterValues>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredData = useMemo(() => {
    if (!data) return [];
    
    const hasActiveFilters = Object.values(filters).some(v => v !== undefined && v !== '');
    if (!hasActiveFilters) return data;

    return data.filter(item => filterFunction(item, filters));
  }, [data, filters, filterFunction]);

  const resetFilters = () => {
    setFilters({});
  };

  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return {
    filters,
    setFilters,
    filteredData,
    resetFilters,
    isFilterOpen,
    toggleFilters
  };
};
