
import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render, mockOpportunity, mockClient } from '@/utils/testUtils';
import { OpportunityForm } from '../OpportunityForm';
import * as useClientsHook from '@/hooks/useClients';

// Mock the useClients hook
jest.mock('@/hooks/useClients');
const mockUseClients = useClientsHook as jest.Mocked<typeof useClientsHook>;

describe('OpportunityForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseClients.useClients.mockReturnValue({
      data: [mockClient],
      isLoading: false,
      error: null,
    } as any);
  });

  it('renders form fields correctly', () => {
    render(
      <OpportunityForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );

    expect(screen.getByLabelText(/título/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cliente/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/valor/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/probabilidade/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/estágio/i)).toBeInTheDocument();
  });

  it('submits form with correct data', async () => {
    render(
      <OpportunityForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );

    fireEvent.change(screen.getByLabelText(/título/i), {
      target: { value: 'New Opportunity' }
    });
    
    fireEvent.change(screen.getByLabelText(/valor/i), {
      target: { value: '5000' }
    });

    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Opportunity',
          value: 5000,
        })
      );
    });
  });

  it('pre-fills form when editing opportunity', () => {
    render(
      <OpportunityForm
        opportunity={mockOpportunity}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );

    expect(screen.getByDisplayValue(mockOpportunity.title)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockOpportunity.value.toString())).toBeInTheDocument();
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(
      <OpportunityForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={false}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it('disables submit button when loading', () => {
    render(
      <OpportunityForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={true}
      />
    );

    const submitButton = screen.getByRole('button', { name: /salvando/i });
    expect(submitButton).toBeDisabled();
  });
});
