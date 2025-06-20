
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';

export interface PeriodOption {
  value: string;
  label: string;
  months: number;
}

interface PeriodSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const periodOptions: PeriodOption[] = [
  { value: '3', label: 'Últimos 3 meses', months: 3 },
  { value: '6', label: 'Últimos 6 meses', months: 6 },
  { value: '12', label: 'Últimos 12 meses', months: 12 },
  { value: '24', label: 'Últimos 2 anos', months: 24 }
];

export const PeriodSelector = ({ value, onChange }: PeriodSelectorProps) => {
  return (
    <div className="flex items-center gap-2">
      <CalendarIcon className="h-4 w-4 text-slate-600" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Selecionar período" />
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
