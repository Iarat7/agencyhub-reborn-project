
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ClientForm } from './ClientForm';
import { Client } from '@/services/api/types';
import { useCreateClient, useUpdateClient } from '@/hooks/useClients';
import { useRecurringPayments } from '@/hooks/useRecurringPayments';
import { useToast } from '@/hooks/use-toast';

interface ClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: Client | null;
}

export const ClientDialog = ({ open, onOpenChange, client }: ClientDialogProps) => {
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const { createRecurringPayments } = useRecurringPayments();
  const { toast } = useToast();

  const isEditing = !!client;
  const isLoading = createClient.isPending || updateClient.isPending;

  const handleSubmit = async (data: any) => {
    try {
      let savedClient;
      
      if (isEditing && client) {
        savedClient = await updateClient.mutateAsync({ id: client.id, data });
      } else {
        savedClient = await createClient.mutateAsync(data);
      }

      // Se há informações de pagamento, criar pagamentos recorrentes
      if (data.monthly_value && data.payment_day && data.contract_start_date) {
        const clientId = savedClient?.id || client?.id;
        
        if (clientId) {
          await createRecurringPayments.mutateAsync({
            clientId,
            amount: data.monthly_value,
            paymentDay: data.payment_day,
            frequency: data.payment_frequency || 'monthly',
            contractStartDate: new Date(data.contract_start_date),
            contractEndDate: data.contract_end_date ? new Date(data.contract_end_date) : undefined,
            description: `Pagamento recorrente - ${data.name}`,
          });
        }
      }

      onOpenChange(false);
    } catch (error) {
      console.error('Error saving client:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar cliente. Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Cliente' : 'Novo Cliente'}
          </DialogTitle>
        </DialogHeader>
        <ClientForm
          client={client}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};
