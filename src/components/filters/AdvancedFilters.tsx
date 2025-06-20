
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, FilterX, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
  const handleFieldChange = (key: string, value: string | number) => {
    onChange({
      ...values,
      [key]: value || undefined
    });
  };

  const activeFiltersCount = Object.values(values).filter(v => v !== undefined && v !== '').length;

  if (!isOpen) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onToggle} className="relative">
          <Search className="h-4 w-4 mr-2" />
          Filtros Avançados
          {activeFiltersCount > 0 && (
            <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onReset}>
            <FilterX className="h-4 w-4 mr-1" />
            Limpar
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className="border-dashed">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filtros Avançados</CardTitle>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onReset}>
              <FilterX className="h-4 w-4 mr-1" />
              Limpar Filtros
            </Button>
            <Button variant="outline" size="sm" onClick={onToggle}>
              Fechar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                {field.label}
              </label>
              {field.type === 'text' && (
                <Input
                  placeholder={field.placeholder || `Filtrar por ${field.label.toLowerCase()}`}
                  value={values[field.key] as string || ''}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                />
              )}
              {field.type === 'select' && (
                <Select
                  value={values[field.key] as string || 'placeholder'}
                  onValueChange={(value) => handleFieldChange(field.key, value === 'placeholder' ? '' : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Selecionar ${field.label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="placeholder">Todos</SelectItem>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {field.type === 'number' && (
                <Input
                  type="number"
                  placeholder={field.placeholder || `Filtrar por ${field.label.toLowerCase()}`}
                  value={values[field.key] as number || ''}
                  onChange={(e) => handleFieldChange(field.key, Number(e.target.value))}
                />
              )}
              {field.type === 'date' && (
                <Input
                  type="date"
                  value={values[field.key] as string || ''}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
        
        {activeFiltersCount > 0 && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>Filtros ativos:</span>
              <div className="flex flex-wrap gap-1">
                {Object.entries(values)
                  .filter(([_, value]) => value !== undefined && value !== '')
                  .map(([key, value]) => {
                    const field = fields.find(f => f.key === key);
                    const displayValue = field?.type === 'select' 
                      ? field.options?.find(o => o.value === value)?.label || value
                      : value;
                    return (
                      <Badge key={key} variant="secondary" className="text-xs">
                        {field?.label}: {displayValue}
                      </Badge>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
