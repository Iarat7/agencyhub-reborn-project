
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEvents } from './useEvents';
import { useContracts } from './useContracts';
import { useOpportunities } from './useOpportunities';
import { useFinancialEntries } from './useFinancialEntries';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Event } from '@/services/api/types';

interface CalendarEvent extends Omit<Event, 'id'> {
  id: string;
  source: 'event' | 'contract' | 'opportunity' | 'payment';
  original_id?: string;
}

export const useCalendarEvents = () => {
  const { data: events = [] } = useEvents();
  const { data: contracts = [] } = useContracts();
  const { data: opportunities = [] } = useOpportunities();
  const { data: financialEntries = [] } = useFinancialEntries();

  return useQuery({
    queryKey: ['calendar-events', events, contracts, opportunities, financialEntries],
    queryFn: () => {
      const calendarEvents: CalendarEvent[] = [];

      // Eventos normais
      events.forEach(event => {
        calendarEvents.push({
          ...event,
          source: 'event',
        });
      });

      // Eventos de contratos
      contracts.forEach(contract => {
        if (contract.start_date) {
          calendarEvents.push({
            id: `contract-start-${contract.id}`,
            title: `Início do Contrato: ${contract.title}`,
            description: `Contrato com ${contract.client?.name} inicia hoje`,
            start_date: contract.start_date,
            end_date: contract.start_date,
            event_type: 'reminder',
            client_id: contract.client_id,
            created_by: contract.created_by,
            created_at: contract.created_at,
            updated_at: contract.updated_at,
            source: 'contract',
            original_id: contract.id,
          });
        }

        if (contract.end_date) {
          calendarEvents.push({
            id: `contract-end-${contract.id}`,
            title: `Fim do Contrato: ${contract.title}`,
            description: `Contrato com ${contract.client?.name} termina hoje`,
            start_date: contract.end_date,
            end_date: contract.end_date,
            event_type: 'deadline',
            client_id: contract.client_id,
            created_by: contract.created_by,
            created_at: contract.created_at,
            updated_at: contract.updated_at,
            source: 'contract',
            original_id: contract.id,
          });
        }
      });

      // Eventos de oportunidades
      opportunities.forEach(opportunity => {
        if (opportunity.expected_close_date) {
          calendarEvents.push({
            id: `opportunity-close-${opportunity.id}`,
            title: `Fechamento Previsto: ${opportunity.title}`,
            description: `Oportunidade com ${opportunity.client?.name} - Valor: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(opportunity.value || 0)}`,
            start_date: opportunity.expected_close_date,
            end_date: opportunity.expected_close_date,
            event_type: 'deadline',
            client_id: opportunity.client_id,
            created_by: opportunity.created_by,
            created_at: opportunity.created_at,
            updated_at: opportunity.updated_at,
            source: 'opportunity',
            original_id: opportunity.id,
          });
        }
      });

      // Eventos de pagamentos
      financialEntries
        .filter(entry => entry.type === 'income' && entry.due_date)
        .forEach(entry => {
          calendarEvents.push({
            id: `payment-${entry.id}`,
            title: `Recebimento: ${entry.description}`,
            description: `Valor: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(entry.amount)}`,
            start_date: entry.due_date!,
            end_date: entry.due_date!,
            event_type: 'reminder',
            client_id: entry.client_id,
            created_by: entry.created_by,
            created_at: entry.created_at,
            updated_at: entry.updated_at,
            source: 'payment',
            original_id: entry.id,
          });
        });

      return calendarEvents;
    },
  });
};
