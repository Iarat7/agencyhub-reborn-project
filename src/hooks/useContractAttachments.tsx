
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contractAttachmentsService } from '@/services';
import { ContractAttachment } from '@/services/api/types';

export const useContractAttachments = (contractId: string) => {
  const queryClient = useQueryClient();

  const attachmentsQuery = useQuery({
    queryKey: ['contract-attachments', contractId],
    queryFn: () => contractAttachmentsService.getByContractId(contractId),
    enabled: !!contractId,
  });

  const refreshAttachments = () => {
    queryClient.invalidateQueries({ queryKey: ['contract-attachments', contractId] });
  };

  return {
    attachments: attachmentsQuery.data || [],
    isLoading: attachmentsQuery.isLoading,
    error: attachmentsQuery.error,
    refreshAttachments,
  };
};
