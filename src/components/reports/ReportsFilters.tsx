
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReportsFiltersProps {
  period: string;
  onPeriodChange: (period: string) => void;
  dateRange: { from?: Date; to?: Date };
  onDateRangeChange: (range: { from?: Date; to?: Date }) => void;
  onApplyFilters: () => void;
}

export const ReportsFilters = ({
  period,
  onPeriodChange,
  dateRange,
  onDateRangeChange,
  onApplyFilters
}: ReportsFiltersProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros de Relatório
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Período</label>
            <Select value={period} onValueChange={onPeriodChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Últimos 7 dias</SelectItem>
                <SelectItem value="30d">Últimos 30 dias</SelectItem>
                <SelectItem value="3m">Últimos 3 meses</SelectItem>
                <SelectItem value="6m">Últimos 6 meses</SelectItem>
                <SelectItem value="1y">Último ano</SelectItem>
                <SelectItem value="custom">Período customizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {period === 'custom' && (
            <>
              <div>
                <label className="text-sm font-medium">Data Início</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        format(dateRange.from, 'dd/MM/yyyy', { locale: ptBR })
                      ) : (
                        'Selecionar data'
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) => onDateRangeChange({ ...dateRange, from: date })}
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-sm font-medium">Data Fim</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.to ? (
                        format(dateRange.to, 'dd/MM/yyyy', { locale: ptBR })
                      ) : (
                        'Selecionar data'
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) => onDateRangeChange({ ...dateRange, to: date })}
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </>
          )}
        </div>

        <Button onClick={onApplyFilters} className="w-full">
          Aplicar Filtros
        </Button>
      </CardContent>
    </Card>
  );
};
