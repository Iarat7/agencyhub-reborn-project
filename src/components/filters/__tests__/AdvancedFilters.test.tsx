
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AdvancedFilters, FilterField } from '../AdvancedFilters';

// Create wrapper for all providers
const renderWithProviders = (ui: React.ReactElement) => {
  return render(ui);
};

describe('AdvancedFilters', () => {
  const mockFields: FilterField[] = [
    { key: 'title', label: 'Título', type: 'text', placeholder: 'Digite o título' },
    { 
      key: 'stage', 
      label: 'Estágio', 
      type: 'select',
      options: [
        { label: 'Prospecção', value: 'prospection' },
        { label: 'Qualificação', value: 'qualification' },
      ]
    },
    { key: 'value', label: 'Valor', type: 'number', placeholder: 'Digite o valor' },
    { key: 'date', label: 'Data', type: 'date' },
  ];

  const mockProps = {
    fields: mockFields,
    values: {},
    onChange: jest.fn(),
    onReset: jest.fn(),
    isOpen: true,
    onToggle: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders filter panel when open', () => {
    renderWithProviders(<AdvancedFilters {...mockProps} />);
    
    expect(screen.getByText('Filtros Avançados')).toBeInTheDocument();
    expect(screen.getByLabelText(/título/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/estágio/i)).toBeInTheDocument();
  });

  it('does not render filter panel when closed', () => {
    renderWithProviders(<AdvancedFilters {...mockProps} isOpen={false} />);
    
    expect(screen.queryByText('Filtros Avançados')).not.toBeInTheDocument();
  });

  it('calls onChange when text input changes', () => {
    renderWithProviders(<AdvancedFilters {...mockProps} />);
    
    const titleInput = screen.getByLabelText(/título/i);
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    
    expect(mockProps.onChange).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Test Title' })
    );
  });

  it('calls onReset when reset button is clicked', () => {
    renderWithProviders(<AdvancedFilters {...mockProps} />);
    
    const resetButton = screen.getByRole('button', { name: /limpar/i });
    fireEvent.click(resetButton);
    
    expect(mockProps.onReset).toHaveBeenCalled();
  });

  it('shows active filter count', () => {
    const valuesWithFilters = { title: 'Test', stage: 'prospection' };
    renderWithProviders(<AdvancedFilters {...mockProps} values={valuesWithFilters} />);
    
    // Should show count of active filters
    expect(screen.getByText('2')).toBeInTheDocument();
  });
});
