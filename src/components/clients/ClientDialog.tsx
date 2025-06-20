
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

interface ClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: Client | null;
}

export const ClientDialog = ({ open, onOpenChange, client }: ClientDialogProps) => {
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();

  const isEditing = !!client;
  const isLoading = createClient.isPending || updateClient.isPending;

  const handleSubmit = async (data: any) => {
    if (isEditing && client) {
      await updateClient.mutateAsync({ id: client.id, data });
    } else {
      await createClient.mutateAsync(data);
    }
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
