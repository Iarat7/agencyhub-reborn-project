
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ContractForm } from './ContractForm';
import { Contract, Client } from '@/services/api/types';

interface ContractDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contract?: Contract;
  clients: Client[];
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
}

export const ContractDialog = ({ 
  open, 
  onOpenChange, 
  contract, 
  clients, 
  onSubmit, 
  isSubmitting 
}: ContractDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {contract ? 'Editar Contrato' : 'Novo Contrato'}
          </DialogTitle>
        </DialogHeader>
        <ContractForm
          contract={contract}
          clients={clients}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};
