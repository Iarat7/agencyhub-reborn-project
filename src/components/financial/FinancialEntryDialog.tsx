
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FinancialEntryForm } from './FinancialEntryForm';
import { FinancialEntry, Client, Contract } from '@/services/api/types';

interface FinancialEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry?: FinancialEntry;
  clients: Client[];
  contracts: Contract[];
  onSubmit: (data: any) => void;
  isSubmitting?: boolean;
}

export const FinancialEntryDialog = ({ 
  open, 
  onOpenChange, 
  entry, 
  clients, 
  contracts, 
  onSubmit, 
  isSubmitting 
}: FinancialEntryDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {entry ? 'Editar Movimentação' : 'Nova Movimentação'}
          </DialogTitle>
        </DialogHeader>
        <FinancialEntryForm
          entry={entry}
          clients={clients}
          contracts={contracts}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};
