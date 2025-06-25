
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useOrganization } from '@/contexts/OrganizationContext';
import { useToast } from '@/hooks/use-toast';

interface OrganizationSubscription {
  id: string;
  organization_id: string;
  plan_type: 'trial' | 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'inactive' | 'canceled' | 'past_due';
  trial_start_date?: string;
  trial_end_date?: string;
  subscription_start_date?: string;
  subscription_end_date?: string;
  stripe_subscription_id?: string;
  stripe_customer_id?: string;
  created_at: string;
  updated_at: string;
}

export const useSubscription = () => {
  const { currentOrganization } = useOrganization();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: subscription, isLoading } = useQuery({
    queryKey: ['subscription', currentOrganization?.id],
    queryFn: async () => {
      if (!currentOrganization?.id) return null;
      
      const { data, error } = await supabase
        .from('organization_subscriptions')
        .select('*')
        .eq('organization_id', currentOrganization.id)
        .single();

      if (error) {
        console.error('Error fetching subscription:', error);
        return null;
      }

      return data as OrganizationSubscription;
    },
    enabled: !!currentOrganization?.id,
  });

  const checkPremiumAccess = useMutation({
    mutationFn: async (orgId: string) => {
      const { data, error } = await supabase.rpc('organization_has_premium_access', {
        org_id: orgId
      });

      if (error) {
        console.error('Error checking premium access:', error);
        return false;
      }

      return data as boolean;
    },
  });

  const isTrialExpired = subscription?.plan_type === 'trial' && 
    subscription?.trial_end_date && 
    new Date(subscription.trial_end_date) < new Date();

  const isPremium = subscription?.plan_type === 'premium' || subscription?.plan_type === 'enterprise';
  
  const isActive = subscription?.status === 'active' && 
    (isPremium || (subscription?.plan_type === 'trial' && !isTrialExpired));

  const daysLeftInTrial = subscription?.trial_end_date 
    ? Math.max(0, Math.ceil((new Date(subscription.trial_end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  return {
    subscription,
    isLoading,
    isPremium,
    isActive,
    isTrialExpired,
    daysLeftInTrial,
    checkPremiumAccess: checkPremiumAccess.mutateAsync,
  };
};
