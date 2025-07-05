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
      console.log('Nenhum usuário logado');
      setOrganizations([]);
      setCurrentOrganization(null);
      setUserRole(null);
      setLoading(false);
      return;
    }

    console.log('Buscando organizações para usuário:', user.id);
    
    try {
      // Primeiro buscar organizações onde o usuário é owner
      const { data: ownedOrgs, error: ownedError } = await supabase
        .from('organizations')
        .select('*')
        .eq('owner_id', user.id);

      if (ownedError) {
        console.error('Erro ao buscar organizações próprias:', ownedError);
      }

      console.log('Organizações próprias encontradas:', ownedOrgs?.length || 0);

      // Depois buscar organizações onde é membro
      const { data: memberships, error: memberError } = await supabase
        .from('organization_members')
        .select(`
          *,
          organization:organizations(*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (memberError) {
        console.error('Erro ao buscar memberships:', memberError);
      }

      console.log('Memberships encontradas:', memberships?.length || 0);

      // Combinar organizações próprias e onde é membro
      const memberOrgs = memberships?.map(m => m.organization).filter(Boolean) || [];
      const allOrgs = [...(ownedOrgs || []), ...memberOrgs];
      
      // Remover duplicatas
      const uniqueOrgs = allOrgs.filter((org, index, self) => 
        index === self.findIndex(o => o.id === org.id)
      );

      console.log('Total de organizações únicas:', uniqueOrgs.length);
      
      setOrganizations(uniqueOrgs as Organization[]);

      // Definir organização atual
      if (uniqueOrgs.length > 0) {
        const savedOrgId = localStorage.getItem('currentOrganizationId');
        let currentOrg = uniqueOrgs.find(org => org.id === savedOrgId) || uniqueOrgs[0];
        
        console.log('Organização atual definida:', currentOrg.name);
        setCurrentOrganization(currentOrg as Organization);
        
        // Definir role do usuário
        if (currentOrg.owner_id === user.id) {
          setUserRole('admin');
        } else {
          // Buscar role na tabela de membros
          const membership = memberships?.find(m => m.organization_id === currentOrg.id);
          setUserRole(membership?.role || 'user');
        }
        
        localStorage.setItem('currentOrganizationId', currentOrg.id);
      } else {
        console.log('Aguardando criação automática de organização...');
        // As organizações são criadas automaticamente pelo trigger
        // Se não há organizações, aguardar um pouco e tentar novamente
        setTimeout(() => {
          if (user) fetchOrganizations();
        }, 1000);
      }
    } catch (error) {
      console.error('Erro geral na busca de organizações:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função removida - organizações são criadas automaticamente pelo trigger do banco

  const switchOrganization = (organizationId: string) => {
    const org = organizations.find(o => o.id === organizationId);
    if (org) {
      console.log('Trocando para organização:', org.name);
      setCurrentOrganization(org);
      localStorage.setItem('currentOrganizationId', organizationId);
      
      // Buscar role na nova organização
      fetchUserRole(organizationId);
    }
  };

  const fetchUserRole = async (organizationId: string) => {
    if (!user) return;

    const org = organizations.find(o => o.id === organizationId);
    if (org?.owner_id === user.id) {
      setUserRole('admin');
      return;
    }

    const { data: membership } = await supabase
      .from('organization_members')
      .select('role')
      .eq('user_id', user.id)
      .eq('organization_id', organizationId)
      .eq('status', 'active')
      .single();

    setUserRole(membership?.role || 'user');
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

      const result = data as { success: boolean; message: string };

      if (result?.success) {
        await fetchOrganizations();
        return { success: true, message: result.message };
      }

      return { success: false, message: result?.message || 'Erro desconhecido' };
    } catch (error) {
      console.error('Error processing invite:', error);
      return { success: false, message: 'Erro ao processar convite' };
    }
  };

  const refreshOrganizations = async () => {
    await fetchOrganizations();
  };

  useEffect(() => {
    if (user) {
      fetchOrganizations();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Organizações são criadas automaticamente pelo trigger do banco quando um usuário é criado

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
