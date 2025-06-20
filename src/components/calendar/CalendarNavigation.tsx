
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format, addDays, addWeeks, addMonths, subDays, subWeeks, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarViewType } from './CalendarViewToggle';

interface CalendarNavigationProps {
  currentDate: Date;
  view: CalendarViewType;
  onDateChange: (date: Date) => void;
}

export const CalendarNavigation = ({ 
  currentDate, 
  view, 
  onDateChange 
}: CalendarNavigationProps) => {
  const getNavigationFunctions = () => {
    switch (view) {
      case 'day':
        return {
          prev: () => onDateChange(subDays(currentDate, 1)),
          next: () => onDateChange(addDays(currentDate, 1)),
          format: "EEEE, d 'de' MMMM 'de' yyyy"
        };
      case 'week':
        return {
          prev: () => onDateChange(subWeeks(currentDate, 1)),
          next: () => onDateChange(addWeeks(currentDate, 1)),
          format: "'Semana de' d 'de' MMMM"
        };
      default:
        return {
          prev: () => onDateChange(subMonths(currentDate, 1)),
          next: () => onDateChange(addMonths(currentDate, 1)),
          format: "MMMM 'de' yyyy"
        };
    }
  };

  const { prev, next, format: dateFormat } = getNavigationFunctions();

  const goToToday = () => {
    onDateChange(new Date());
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={prev}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={goToToday}
          className="text-sm px-3"
        >
          <Calendar className="h-4 w-4 mr-1" />
          Hoje
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={next}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <h2 className="text-lg font-semibold">
        {format(currentDate, dateFormat, { locale: ptBR })}
      </h2>
    </div>
  );
};
