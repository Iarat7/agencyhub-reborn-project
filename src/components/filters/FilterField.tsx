
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export interface FilterFieldOption {
  label: string;
  value: string;
}

export interface FilterFieldConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number' | 'email' | 'phone';
  options?: FilterFieldOption[];
  placeholder?: string;
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: RegExp;
    message?: string;
  };
}

interface FilterFieldProps {
  config: FilterFieldConfig;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

export const FilterField = ({ config, value, onChange, error }: FilterFieldProps) => {
  const { type, label, placeholder, options } = config;

  const renderField = () => {
    switch (type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <Input
            type={type === 'email' ? 'email' : type === 'phone' ? 'tel' : 'text'}
            placeholder={placeholder || `Filtrar por ${label.toLowerCase()}`}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={error ? 'border-red-500' : ''}
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            placeholder={placeholder || `Filtrar por ${label.toLowerCase()}`}
            value={value || ''}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : '')}
            className={error ? 'border-red-500' : ''}
          />
        );

      case 'select':
        return (
          <Select
            value={value || 'placeholder'}
            onValueChange={(val) => onChange(val === 'placeholder' ? '' : val)}
          >
            <SelectTrigger className={error ? 'border-red-500' : ''}>
              <SelectValue placeholder={`Selecionar ${label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="placeholder">Todos</SelectItem>
              {options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !value && "text-muted-foreground",
                  error && "border-red-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(new Date(value), "dd/MM/yyyy") : "Selecionar data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={(date) => onChange(date ? format(date, 'yyyy-MM-dd') : '')}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">
        {label}
        {config.validation?.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderField()}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
