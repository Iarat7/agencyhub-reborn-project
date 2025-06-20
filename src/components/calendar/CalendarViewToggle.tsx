
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, List, Grid } from 'lucide-react';

export type CalendarViewType = 'month' | 'week' | 'day';

interface CalendarViewToggleProps {
  view: CalendarViewType;
  onViewChange: (view: CalendarViewType) => void;
}

export const CalendarViewToggle = ({ view, onViewChange }: CalendarViewToggleProps) => {
  return (
    <div className="flex gap-1 bg-muted p-1 rounded-lg">
      <Button
        variant={view === 'month' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('month')}
        className="text-xs"
      >
        <Calendar className="w-3 h-3 mr-1" />
        Mês
      </Button>
      <Button
        variant={view === 'week' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('week')}
        className="text-xs"
      >
        <Grid className="w-3 h-3 mr-1" />
        Semana
      </Button>
      <Button
        variant={view === 'day' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('day')}
        className="text-xs"
      >
        <List className="w-3 h-3 mr-1" />
        Dia
      </Button>
    </div>
  );
};
