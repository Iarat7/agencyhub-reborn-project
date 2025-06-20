
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { OpportunityForm } from './OpportunityForm';
import { Opportunity } from '@/services/api/types';
import { useCreateOpportunity, useUpdateOpportunity } from '@/hooks/useOpportunities';

interface OpportunityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  opportunity?: Opportunity | null;
}

export const OpportunityDialog = ({ open, onOpenChange, opportunity }: OpportunityDialogProps) => {
  const createOpportunity = useCreateOpportunity();
  const updateOpportunity = useUpdateOpportunity();

  const isEditing = !!opportunity;
  const isLoading = createOpportunity.isPending || updateOpportunity.isPending;

  const handleSubmit = async (data: any) => {
    if (isEditing && opportunity) {
      await updateOpportunity.mutateAsync({ id: opportunity.id, data });
    } else {
      await createOpportunity.mutateAsync(data);
    }
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Oportunidade' : 'Nova Oportunidade'}
          </DialogTitle>
        </DialogHeader>
        <OpportunityForm
          opportunity={opportunity}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};
