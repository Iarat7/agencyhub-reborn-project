
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';

export interface PeriodOption {
  value: string;
  label: string;
  months?: number;
  days?: number;
  type: 'days' | 'months' | 'current_month' | 'last_month' | 'yesterday';
}

interface PeriodSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const periodOptions: PeriodOption[] = [
  { value: 'today', label: 'Hoje', days: 0, type: 'days' },
  { value: 'yesterday', label: 'Ontem', type: 'yesterday' },
  { value: '7', label: 'Últimos 7 dias', days: 7, type: 'days' },
  { value: '14', label: 'Últimos 14 dias', days: 14, type: 'days' },
  { value: '30', label: 'Últimos 30 dias', days: 30, type: 'days' },
  { value: 'current_month', label: 'Este mês', type: 'current_month' },
  { value: 'last_month', label: 'Mês passado', type: 'last_month' },
  { value: '3m', label: 'Últimos 3 meses', months: 3, type: 'months' },
  { value: '6m', label: 'Últimos 6 meses', months: 6, type: 'months' },
  { value: '12m', label: 'Últimos 12 meses', months: 12, type: 'months' },
  { value: '24m', label: 'Últimos 2 anos', months: 24, type: 'months' }
];

export const PeriodSelector = ({ value, onChange }: PeriodSelectorProps) => {
  const selectedOption = periodOptions.find(option => option.value === value);
  
  return (
    <div className="flex items-center gap-2">
      <CalendarIcon className="h-4 w-4 text-slate-600" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Selecionar período">
            {selectedOption?.label || 'Selecionar período'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {periodOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
