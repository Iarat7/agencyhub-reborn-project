
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { FinancialEntry, Client, Contract } from '@/services/api/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FinancialTableProps {
  entries: FinancialEntry[];
  clients: Client[];
  contracts: Contract[];
  onEdit: (entry: FinancialEntry) => void;
  onDelete: (id: string) => void;
}

export const FinancialTable = ({ entries, clients, contracts, onEdit, onDelete }: FinancialTableProps) => {
  const getClientName = (clientId?: string) => {
    if (!clientId) return '-';
    const client = clients.find(c => c.id === clientId);
    return client?.name || 'Cliente não encontrado';
  };

  const getContractTitle = (contractId?: string) => {
    if (!contractId) return '-';
    const contract = contracts.find(c => c.id === contractId);
    return contract?.title || 'Contrato não encontrado';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Pago';
      case 'pending':
        return 'Pendente';
      case 'overdue':
        return 'Vencido';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (entries.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-600">Nenhuma movimentação encontrada</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Vencimento</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>
                <div className="flex items-center space-x-2">
                  {entry.type === 'income' ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span>{entry.type === 'income' ? 'Receita' : 'Despesa'}</span>
                </div>
              </TableCell>
              <TableCell>{entry.category}</TableCell>
              <TableCell>
                <span className={entry.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                  {formatCurrency(entry.amount)}
                </span>
              </TableCell>
              <TableCell>{getClientName(entry.client_id)}</TableCell>
              <TableCell>
                {entry.due_date ? format(new Date(entry.due_date), 'dd/MM/yyyy', { locale: ptBR }) : '-'}
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(entry.status)}>
                  {getStatusLabel(entry.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(entry)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(entry.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
