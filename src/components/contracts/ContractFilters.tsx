
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Filter, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ContractFiltersProps {
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  dateRange: { from?: Date; to?: Date };
  onDateRangeChange: (range: { from?: Date; to?: Date }) => void;
  onResetFilters: () => void;
}

export const ContractFilters = ({
  statusFilter,
  onStatusFilterChange,
  dateRange,
  onDateRangeChange,
  onResetFilters
}: ContractFiltersProps) => {
  const hasActiveFilters = statusFilter !== 'all' || dateRange.from || dateRange.to;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filtros
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium">Status</label>
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="draft">Rascunhos</SelectItem>
                <SelectItem value="expired">Expirados</SelectItem>
                <SelectItem value="cancelled">Cancelados</SelectItem>
                <SelectItem value="expiring_30">Expirando em 30 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>

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

          <div className="flex items-end">
            {hasActiveFilters && (
              <Button variant="outline" onClick={onResetFilters} className="w-full">
                <X className="mr-2 h-4 w-4" />
                Limpar Filtros
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
