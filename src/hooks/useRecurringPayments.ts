
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { generateRecurringDates, formatDateForRecife } from '@/utils/timezone';
import { useToast } from '@/hooks/use-toast';

interface CreateRecurringPaymentsData {
  clientId: string;
  amount: number;
  paymentDay: number; // Dia do mês (1-31)
  frequency: 'monthly' | 'quarterly' | 'yearly';
  contractStartDate: Date;
  contractEndDate?: Date;
  description?: string;
}

export const useRecurringPayments = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createRecurringPayments = useMutation({
    mutationFn: async (data: CreateRecurringPaymentsData) => {
      const { 
        clientId, 
        amount, 
        paymentDay, 
        frequency, 
        contractStartDate, 
        contractEndDate,
        description 
      } = data;

      // Gerar datas de pagamento
      const paymentDates = generateRecurringDates(
        contractStartDate,
        frequency,
        contractEndDate
      );

      // Criar entradas financeiras para cada data
      const payments = paymentDates.map(date => {
        // Ajustar para o dia de pagamento específico
        const paymentDate = new Date(date);
        paymentDate.setDate(paymentDay);
        
        return {
          type: 'income',
          amount,
          description: description || `Pagamento recorrente - Cliente`,
          client_id: clientId,
          due_date: formatDateForRecife(paymentDate),
          status: 'pending',
          category: 'recurring_payment',
        };
      });

      const { data: createdPayments, error } = await supabase
        .from('financial_entries')
        .insert(payments)
        .select();

      if (error) {
        console.error('Error creating recurring payments:', error);
        throw error;
      }

      return createdPayments;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-entries'] });
      toast({
        title: 'Pagamentos recorrentes criados',
        description: 'Os pagamentos foram agendados com sucesso.',
      });
    },
    onError: (error) => {
      console.error('Error creating recurring payments:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao criar pagamentos recorrentes.',
        variant: 'destructive',
      });
    },
  });

  return {
    createRecurringPayments,
  };
};
