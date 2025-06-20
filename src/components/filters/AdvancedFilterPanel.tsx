
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FilterX, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { FilterField, FilterFieldConfig } from './FilterField';
import { useFormValidation } from '@/hooks/useFormValidation';

interface AdvancedFilterPanelProps {
  fields: FilterFieldConfig[];
  values: Record<string, any>;
  onChange: (values: Record<string, any>) => void;
  onReset: () => void;
  isOpen: boolean;
  onToggle: () => void;
  onApply?: (values: Record<string, any>) => void;
  title?: string;
  validateOnChange?: boolean;
}

export const AdvancedFilterPanel = ({
  fields,
  values,
  onChange,
  onReset,
  isOpen,
  onToggle,
  onApply,
  title = 'Filtros Avançados',
  validateOnChange = false
}: AdvancedFilterPanelProps) => {
  const { errors, validateForm, validateSingleField, clearFieldError } = useFormValidation(fields);

  const handleFieldChange = (key: string, value: any) => {
    const newValues = { ...values, [key]: value || undefined };
    onChange(newValues);

    if (validateOnChange) {
      validateSingleField(key, value);
    } else {
      clearFieldError(key);
    }
  };

  const handleApply = () => {
    if (onApply) {
      const isValid = validateForm(values);
      if (isValid) {
        onApply(values);
      }
    }
  };

  const activeFiltersCount = Object.values(values).filter(v => v !== undefined && v !== '').length;

  const getActiveFiltersBadges = () => {
    return Object.entries(values)
      .filter(([_, value]) => value !== undefined && value !== '')
      .map(([key, value]) => {
        const field = fields.find(f => f.key === key);
        const displayValue = field?.type === 'select' 
          ? field.options?.find(o => o.value === value)?.label || value
          : field?.type === 'date'
          ? new Date(value).toLocaleDateString('pt-BR')
          : value;
        return {
          key,
          label: field?.label || key,
          value: displayValue
        };
      });
  };

  if (!isOpen) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <Button variant="outline" onClick={onToggle} className="relative">
          <Search className="h-4 w-4 mr-2" />
          {title}
          {activeFiltersCount > 0 && (
            <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
        
        {activeFiltersCount > 0 && (
          <>
            <div className="flex flex-wrap gap-1">
              {getActiveFiltersBadges().map(({ key, label, value }) => (
                <Badge key={key} variant="secondary" className="text-xs">
                  {label}: {value}
                </Badge>
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={onReset}>
              <FilterX className="h-4 w-4 mr-1" />
              Limpar
            </Button>
          </>
        )}
      </div>
    );
  }

  return (
    <Card className="border-dashed">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5" />
            {title}
          </CardTitle>
          <div className="flex gap-2">
            {onApply && (
              <Button variant="default" size="sm" onClick={handleApply}>
                Aplicar Filtros
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onReset}>
              <FilterX className="h-4 w-4 mr-1" />
              Limpar
            </Button>
            <Button variant="outline" size="sm" onClick={onToggle}>
              <ChevronUp className="h-4 w-4 mr-1" />
              Fechar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fields.map((field) => (
            <FilterField
              key={field.key}
              config={field}
              value={values[field.key]}
              onChange={(value) => handleFieldChange(field.key, value)}
              error={errors[field.key]}
            />
          ))}
        </div>
        
        {activeFiltersCount > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>Filtros ativos ({activeFiltersCount}):</span>
              <div className="flex flex-wrap gap-1">
                {getActiveFiltersBadges().map(({ key, label, value }) => (
                  <Badge key={key} variant="secondary" className="text-xs">
                    {label}: {value}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
