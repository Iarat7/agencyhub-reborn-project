
import React from 'react';
import { AdvancedFilterPanel } from './AdvancedFilterPanel';
import { FilterFieldConfig } from './FilterField';

export interface FilterField {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number';
  options?: { label: string; value: string }[];
  placeholder?: string;
}

export interface FilterValues {
  [key: string]: string | number | undefined;
}

interface AdvancedFiltersProps {
  fields: FilterField[];
  values: FilterValues;
  onChange: (values: FilterValues) => void;
  onReset: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const AdvancedFilters = ({
  fields,
  values,
  onChange,
  onReset,
  isOpen,
  onToggle
}: AdvancedFiltersProps) => {
  // Convert legacy FilterField to new FilterFieldConfig
  const convertedFields: FilterFieldConfig[] = fields.map(field => ({
    ...field,
    type: field.type as any // Keep compatibility
  }));

  return (
    <AdvancedFilterPanel
      fields={convertedFields}
      values={values}
      onChange={onChange}
      onReset={onReset}
      isOpen={isOpen}
      onToggle={onToggle}
      title="Filtros Avançados"
    />
  );
};
