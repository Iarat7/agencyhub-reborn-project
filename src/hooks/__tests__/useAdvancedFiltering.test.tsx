
import { renderHook, act } from '@testing-library/react';
import { useAdvancedFiltering } from '../useAdvancedFiltering';
import { mockOpportunity } from '@/utils/testUtils';

describe('useAdvancedFiltering', () => {
  const mockData = [
    { ...mockOpportunity, id: '1', title: 'Opportunity 1', stage: 'prospection' },
    { ...mockOpportunity, id: '2', title: 'Opportunity 2', stage: 'qualification' },
    { ...mockOpportunity, id: '3', title: 'Test Opportunity', stage: 'proposal' },
  ];

  const mockFilterFunction = (item: any, filters: Record<string, any>) => {
    if (filters.title && !item.title.toLowerCase().includes(filters.title.toLowerCase())) {
      return false;
    }
    if (filters.stage && item.stage !== filters.stage) {
      return false;
    }
    return true;
  };

  it('returns all data when no filters are applied', () => {
    const { result } = renderHook(() => 
      useAdvancedFiltering(mockData, mockFilterFunction)
    );

    expect(result.current.filteredData).toHaveLength(3);
    expect(result.current.hasActiveFilters).toBe(false);
  });

  it('filters data correctly when filters are applied', () => {
    const { result } = renderHook(() => 
      useAdvancedFiltering(mockData, mockFilterFunction)
    );

    act(() => {
      result.current.setFilters({ title: 'Test' });
    });

    expect(result.current.filteredData).toHaveLength(1);
    expect(result.current.filteredData[0].title).toBe('Test Opportunity');
    expect(result.current.hasActiveFilters).toBe(true);
  });

  it('resets filters correctly', () => {
    const { result } = renderHook(() => 
      useAdvancedFiltering(mockData, mockFilterFunction)
    );

    act(() => {
      result.current.setFilters({ title: 'Test' });
    });

    expect(result.current.hasActiveFilters).toBe(true);

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.filteredData).toHaveLength(3);
    expect(result.current.hasActiveFilters).toBe(false);
  });

  it('toggles panel state correctly', () => {
    const { result } = renderHook(() => 
      useAdvancedFiltering(mockData, mockFilterFunction)
    );

    expect(result.current.isFilterOpen).toBe(false);

    act(() => {
      result.current.togglePanel();
    });

    expect(result.current.isFilterOpen).toBe(true);

    act(() => {
      result.current.togglePanel();
    });

    expect(result.current.isFilterOpen).toBe(false);
  });

  it('counts active filters correctly', () => {
    const { result } = renderHook(() => 
      useAdvancedFiltering(mockData, mockFilterFunction)
    );

    act(() => {
      result.current.setFilters({ title: 'Test', stage: 'proposal' });
    });

    expect(result.current.getActiveFiltersCount()).toBe(2);
  });
});
