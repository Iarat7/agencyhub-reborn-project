
import { useMemo, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface CacheConfig {
  staleTime?: number;
  gcTime?: number;
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
  refetchInterval?: false | number;
}

const DEFAULT_CACHE_CONFIG: CacheConfig = {
  staleTime: 5 * 60 * 1000, // 5 minutos
  gcTime: 10 * 60 * 1000, // 10 minutos
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchInterval: false,
};

export const useOptimizedQuery = <T,>(
  queryKey: (string | number | boolean)[],
  queryFn: () => Promise<T>,
  config: CacheConfig = {}
) => {
  const finalConfig = useMemo(() => ({
    ...DEFAULT_CACHE_CONFIG,
    ...config,
  }), [config]);

  return useQuery({
    queryKey,
    queryFn,
    ...finalConfig,
  });
};

export const useQueryInvalidation = () => {
  const queryClient = useQueryClient();

  const invalidateQueries = useCallback((queryKeys: string[]) => {
    queryKeys.forEach(key => {
      queryClient.invalidateQueries({ queryKey: [key] });
    });
  }, [queryClient]);

  const prefetchQuery = useCallback(<T,>(
    queryKey: (string | number | boolean)[],
    queryFn: () => Promise<T>,
    config: CacheConfig = {}
  ) => {
    return queryClient.prefetchQuery({
      queryKey,
      queryFn,
      ...DEFAULT_CACHE_CONFIG,
      ...config,
    });
  }, [queryClient]);

  const setQueryData = useCallback(<T,>(
    queryKey: (string | number | boolean)[],
    data: T
  ) => {
    queryClient.setQueryData(queryKey, data);
  }, [queryClient]);

  return {
    invalidateQueries,
    prefetchQuery,
    setQueryData,
  };
};

export const useMemoizedCalculation = <T, R>(
  data: T,
  calculator: (data: T) => R,
  dependencies: React.DependencyList = []
): R => {
  return useMemo(() => {
    if (!data) return {} as R;
    return calculator(data);
  }, [data, ...dependencies]);
};
