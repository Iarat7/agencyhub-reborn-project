
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: 'admin' | 'manager' | 'user';
  status: 'active' | 'inactive' | 'pending';
  organization?: Organization;
}

interface OrganizationContextType {
  organizations: Organization[];
  currentOrganization: Organization | null;
  userRole: string | null;
  loading: boolean;
  switchOrganization: (organizationId: string) => void;
  refreshOrganizations: () => Promise<void>;
  processInvite: (token: string) => Promise<{ success: boolean; message: string }>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

interface OrganizationProviderProps {
  children: ReactNode;
}

export function OrganizationProvider({ children }: OrganizationProviderProps) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchOrganizations = async () => {
    if (!user) {
      setOrganizations([]);
      setCurrentOrganization(null);
      setUserRole(null);
      setLoading(false);
      return;
    }

    try {
      const { data: memberships, error } = await supabase
        .from('organization_members')
        .select(`
          *,
          organization:organizations(*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching organizations:', error);
        return;
      }

      const orgs = memberships?.map(m => m.organization).filter(Boolean) || [];
      setOrganizations(orgs as Organization[]);

      // Definir organização atual (primeira por padrão ou a salva no localStorage)
      if (orgs.length > 0) {
        const savedOrgId = localStorage.getItem('currentOrganizationId');
        let currentOrg = orgs.find(org => org.id === savedOrgId) || orgs[0];
        
        setCurrentOrganization(currentOrg as Organization);
        
        // Buscar role do usuário na organização atual
        const membership = memberships?.find(m => m.organization_id === currentOrg.id);
        setUserRole(membership?.role || null);
        
        localStorage.setItem('currentOrganizationId', currentOrg.id);
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const switchOrganization = (organizationId: string) => {
    const org = organizations.find(o => o.id === organizationId);
    if (org) {
      setCurrentOrganization(org);
      localStorage.setItem('currentOrganizationId', organizationId);
      
      // Buscar role na nova organização
      fetchUserRole(organizationId);
    }
  };

  const fetchUserRole = async (organizationId: string) => {
    if (!user) return;

    const { data: membership } = await supabase
      .from('organization_members')
      .select('role')
      .eq('user_id', user.id)
      .eq('organization_id', organizationId)
      .eq('status', 'active')
      .single();

    setUserRole(membership?.role || null);
  };

  const processInvite = async (token: string) => {
    try {
      const { data, error } = await supabase.rpc('process_organization_invite', {
        invite_token: token
      });

      if (error) {
        console.error('Error processing invite:', error);
        return { success: false, message: 'Erro ao processar convite' };
      }

      if (data?.success) {
        // Atualizar organizações após aceitar convite
        await fetchOrganizations();
        return { success: true, message: data.message };
      }

      return { success: false, message: data?.message || 'Erro desconhecido' };
    } catch (error) {
      console.error('Error processing invite:', error);
      return { success: false, message: 'Erro ao processar convite' };
    }
  };

  const refreshOrganizations = async () => {
    await fetchOrganizations();
  };

  useEffect(() => {
    fetchOrganizations();
  }, [user]);

  const value = {
    organizations,
    currentOrganization,
    userRole,
    loading,
    switchOrganization,
    refreshOrganizations,
    processInvite,
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
}
