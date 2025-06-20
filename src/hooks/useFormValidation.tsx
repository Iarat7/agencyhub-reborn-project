
import { useState, useCallback } from 'react';
import { FilterFieldConfig } from '@/components/filters/FilterField';

export interface ValidationError {
  field: string;
  message: string;
}

export const useFormValidation = (fields: FilterFieldConfig[]) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = useCallback((field: FilterFieldConfig, value: any): string | null => {
    const { validation } = field;
    if (!validation) return null;

    // Required validation
    if (validation.required && (!value || value === '')) {
      return validation.message || `${field.label} é obrigatório`;
    }

    // Skip other validations if field is empty and not required
    if (!value || value === '') return null;

    // Number validations
    if (field.type === 'number') {
      const numValue = Number(value);
      if (isNaN(numValue)) {
        return `${field.label} deve ser um número válido`;
      }
      if (validation.min !== undefined && numValue < validation.min) {
        return `${field.label} deve ser maior ou igual a ${validation.min}`;
      }
      if (validation.max !== undefined && numValue > validation.max) {
        return `${field.label} deve ser menor ou igual a ${validation.max}`;
      }
    }

    // Email validation
    if (field.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return `${field.label} deve ser um email válido`;
      }
    }

    // Phone validation
    if (field.type === 'phone') {
      const phoneRegex = /^[\d\s\(\)\-\+]+$/;
      if (!phoneRegex.test(value)) {
        return `${field.label} deve ser um telefone válido`;
      }
    }

    // Pattern validation
    if (validation.pattern && !validation.pattern.test(value)) {
      return validation.message || `${field.label} não atende ao formato esperado`;
    }

    return null;
  }, []);

  const validateForm = useCallback((values: Record<string, any>): boolean => {
    const newErrors: Record<string, string> = {};

    fields.forEach(field => {
      const error = validateField(field, values[field.key]);
      if (error) {
        newErrors[field.key] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [fields, validateField]);

  const validateSingleField = useCallback((fieldKey: string, value: any): boolean => {
    const field = fields.find(f => f.key === fieldKey);
    if (!field) return true;

    const error = validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [fieldKey]: error || ''
    }));

    return !error;
  }, [fields, validateField]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((fieldKey: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldKey];
      return newErrors;
    });
  }, []);

  return {
    errors,
    validateForm,
    validateSingleField,
    clearErrors,
    clearFieldError
  };
};
