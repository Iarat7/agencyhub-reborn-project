
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Contract, Client } from '@/services/api/types';
import { ContractAttachments } from './ContractAttachments';
import { useContractAttachments } from '@/hooks/useContractAttachments';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ContractDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contract: Contract | null;
  clients: Client[];
}

export const ContractDetailsDialog = ({ 
  open, 
  onOpenChange, 
  contract, 
  clients 
}: ContractDetailsDialogProps) => {
  const { attachments, refreshAttachments } = useContractAttachments(contract?.id || '');

  if (!contract) return null;

  const client = clients.find(c => c.id === contract.client_id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'draft':
        return 'Rascunho';
      case 'expired':
        return 'Expirado';
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{contract.title}</span>
            <Badge className={getStatusColor(contract.status)}>
              {getStatusLabel(contract.status)}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6">
          {/* Informações Básicas */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações do Contrato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Cliente</label>
                  <p className="text-sm">{client?.name || 'Cliente não encontrado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Valor</label>
                  <p className="text-sm font-semibold">{formatCurrency(contract.value)}</p>
                </div>
                {contract.cost && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Custo</label>
                    <p className="text-sm">{formatCurrency(contract.cost)}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-600">Período</label>
                  <p className="text-sm">
                    {format(new Date(contract.start_date), 'dd/MM/yyyy', { locale: ptBR })} -{' '}
                    {format(new Date(contract.end_date), 'dd/MM/yyyy', { locale: ptBR })}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detalhes Financeiros</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-600">Lucro Estimado</label>
                  <p className="text-sm font-semibold text-green-600">
                    {formatCurrency(contract.value - (contract.cost || 0))}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Margem</label>
                  <p className="text-sm">
                    {contract.cost 
                      ? `${(((contract.value - contract.cost) / contract.value) * 100).toFixed(1)}%`
                      : '100%'
                    }
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Duração</label>
                  <p className="text-sm">
                    {Math.ceil(
                      (new Date(contract.end_date).getTime() - new Date(contract.start_date).getTime()) 
                      / (1000 * 60 * 60 * 24)
                    )} dias
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Descrição */}
          {contract.description && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Descrição</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{contract.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Anexos */}
          <ContractAttachments
            contractId={contract.id}
            attachments={attachments}
            onAttachmentsChange={refreshAttachments}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
