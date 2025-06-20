
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { NotificationProvider } from '@/contexts/NotificationContext';

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Mock data generators
export const mockOpportunity = {
  id: '1',
  title: 'Test Opportunity',
  client_id: 'client-1',
  value: 10000,
  probability: 75,
  stage: 'qualification' as const,
  expected_close_date: '2024-12-31',
  description: 'Test description',
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
};

export const mockClient = {
  id: 'client-1',
  name: 'Test Client',
  email: 'test@example.com',
  phone: '(11) 99999-9999',
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
};

export const mockTask = {
  id: 'task-1',
  title: 'Test Task',
  description: 'Test description',
  status: 'pending' as const,
  priority: 'medium' as const,
  due_date: '2024-12-31',
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
};

// Test helpers
export const waitForLoading = () => new Promise(resolve => setTimeout(resolve, 100));

export function mockApiResponse<T>(data: T, delay = 100): Promise<T> {
  return new Promise<T>(resolve => setTimeout(() => resolve(data), delay));
}

export function mockApiError(message = 'API Error', delay = 100): Promise<never> {
  return new Promise((_, reject) => setTimeout(() => reject(new Error(message)), delay));
}
