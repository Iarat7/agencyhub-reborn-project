
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ExportDialog } from './ExportDialog';

interface ReportsTableProps<T> {
  title: string;
  data: T[];
  columns: {
    key: keyof T;
    label: string;
    render?: (value: any, item: T) => React.ReactNode;
  }[];
  filename: string;
}

export function ReportsTable<T>({ title, data, columns, filename }: ReportsTableProps<T>) {
  const renderCell = (item: T, column: typeof columns[0]) => {
    const value = item[column.key];
    
    if (column.render) {
      return column.render(value, item);
    }
    
    return value?.toString() || '-';
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline', label: string }> = {
      'active': { variant: 'default', label: 'Ativo' },
      'inactive': { variant: 'secondary', label: 'Inativo' },
      'prospect': { variant: 'outline', label: 'Prospect' },
      'pending': { variant: 'outline', label: 'Pendente' },
      'in_progress': { variant: 'default', label: 'Em Progresso' },
      'completed': { variant: 'default', label: 'Concluída' },
      'closed_won': { variant: 'default', label: 'Ganhou' },
      'closed_lost': { variant: 'destructive', label: 'Perdeu' },
      'prospection': { variant: 'outline', label: 'Prospecção' },
      'qualification': { variant: 'secondary', label: 'Qualificação' },
      'proposal': { variant: 'default', label: 'Proposta' },
      'negotiation': { variant: 'default', label: 'Negociação' },
    };

    const config = statusMap[status] || { variant: 'outline' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <ExportDialog data={data} filename={filename} title={title} />
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={String(column.key)}>{column.label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                    Nenhum dado encontrado
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item, index) => (
                  <TableRow key={index}>
                    {columns.map((column) => (
                      <TableCell key={String(column.key)}>
                        {renderCell(item, column)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
