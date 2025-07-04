
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useOrganization } from '@/contexts/OrganizationContext';
import type { Event } from '@/services/api/types';

// Tipo específico para criação de eventos
type CreateEventData = {
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  event_type?: 'meeting' | 'call' | 'deadline' | 'reminder';
  client_id?: string;
  attendees?: string[];
};

// Tipo específico para atualização de eventos
type UpdateEventData = {
  id: string;
  title?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  event_type?: 'meeting' | 'call' | 'deadline' | 'reminder';
  client_id?: string;
  attendees?: string[];
};

export const useEvents = () => {
  const queryClient = useQueryClient();
  const { currentOrganization } = useOrganization();

  const eventsQuery = useQuery({
    queryKey: ['events', currentOrganization?.id],
    queryFn: async () => {
      if (!currentOrganization) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          client:clients(id, name)
        `)
        .eq('organization_id', currentOrganization.id)
        .order('start_date', { ascending: true });

      if (error) {
        console.error('Error fetching events:', error);
        throw error;
      }

      return data as Event[];
    },
    enabled: !!currentOrganization,
  });

  const createEvent = useMutation({
    mutationFn: async (eventData: CreateEventData) => {
      const { data, error } = await supabase
        .from('events')
        .insert(eventData)
        .select()
        .single();

      if (error) {
        console.error('Error creating event:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  const updateEvent = useMutation({
    mutationFn: async ({ id, ...eventData }: UpdateEventData) => {
      const { data, error } = await supabase
        .from('events')
        .update(eventData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating event:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  const deleteEvent = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting event:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  return {
    data: eventsQuery.data || [],
    isLoading: eventsQuery.isLoading,
    error: eventsQuery.error,
    createEvent,
    updateEvent,
    deleteEvent,
  };
};
