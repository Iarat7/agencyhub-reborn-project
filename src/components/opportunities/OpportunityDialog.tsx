
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
  initialClientId?: string;
}

export const OpportunityDialog = ({ open, onOpenChange, opportunity, initialClientId }: OpportunityDialogProps) => {
  const createOpportunity = useCreateOpportunity();
  const updateOpportunity = useUpdateOpportunity();

  const isEditing = !!opportunity;
  const isLoading = createOpportunity.isPending || updateOpportunity.isPending;

  const handleSubmit = async (data: any) => {
    // Se temos um initialClientId e não estamos editando, adiciona o client_id
    const opportunityData = initialClientId && !isEditing 
      ? { ...data, client_id: initialClientId }
      : data;

    if (isEditing && opportunity) {
      await updateOpportunity.mutateAsync({ id: opportunity.id, data: opportunityData });
    } else {
      await createOpportunity.mutateAsync(opportunityData);
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
          initialClientId={initialClientId}
        />
      </DialogContent>
    </Dialog>
  );
};
