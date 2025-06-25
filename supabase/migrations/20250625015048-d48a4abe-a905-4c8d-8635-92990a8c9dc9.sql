
-- Criar tabela de organizações
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de membros da organização
CREATE TABLE public.organization_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'user')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  invited_by UUID REFERENCES auth.users(id),
  invited_at TIMESTAMP WITH TIME ZONE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

-- Criar tabela de convites pendentes
CREATE TABLE public.organization_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'user')),
  token TEXT UNIQUE NOT NULL,
  invited_by UUID REFERENCES auth.users(id) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(organization_id, email)
);

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_invites ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para organizations
CREATE POLICY "Users can view organizations they belong to" 
  ON public.organizations FOR SELECT 
  USING (
    id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Organization owners can update their organizations" 
  ON public.organizations FOR UPDATE 
  USING (owner_id = auth.uid());

CREATE POLICY "Authenticated users can create organizations" 
  ON public.organizations FOR INSERT 
  WITH CHECK (owner_id = auth.uid());

-- Políticas RLS para organization_members
CREATE POLICY "Users can view members of their organizations" 
  ON public.organization_members FOR SELECT 
  USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Organization admins can manage members" 
  ON public.organization_members FOR ALL 
  USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid() AND role = 'admin' AND status = 'active'
    )
  );

-- Políticas RLS para organization_invites
CREATE POLICY "Users can view invites for their organizations" 
  ON public.organization_invites FOR SELECT 
  USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid() AND role IN ('admin', 'manager') AND status = 'active'
    )
  );

CREATE POLICY "Organization admins can manage invites" 
  ON public.organization_invites FOR ALL 
  USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid() AND role = 'admin' AND status = 'active'
    )
  );

-- Triggers para updated_at
CREATE TRIGGER update_organizations_updated_at 
  BEFORE UPDATE ON public.organizations 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_organization_members_updated_at 
  BEFORE UPDATE ON public.organization_members 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Função para processar convites
CREATE OR REPLACE FUNCTION public.process_organization_invite(invite_token TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  invite_record public.organization_invites%ROWTYPE;
  user_email TEXT;
  result JSON;
BEGIN
  -- Buscar o convite pelo token
  SELECT * INTO invite_record 
  FROM public.organization_invites 
  WHERE token = invite_token 
    AND status = 'pending' 
    AND expires_at > NOW();
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'message', 'Convite inválido ou expirado');
  END IF;
  
  -- Verificar se o usuário logado tem o mesmo email do convite
  SELECT email INTO user_email FROM auth.users WHERE id = auth.uid();
  
  IF user_email != invite_record.email THEN
    RETURN json_build_object('success', false, 'message', 'Email do convite não corresponde ao usuário logado');
  END IF;
  
  -- Verificar se o usuário já é membro da organização
  IF EXISTS (
    SELECT 1 FROM public.organization_members 
    WHERE organization_id = invite_record.organization_id 
      AND user_id = auth.uid()
  ) THEN
    RETURN json_build_object('success', false, 'message', 'Usuário já é membro desta organização');
  END IF;
  
  -- Adicionar usuário à organização
  INSERT INTO public.organization_members (
    organization_id, 
    user_id, 
    role, 
    status,
    invited_by,
    invited_at,
    joined_at
  ) VALUES (
    invite_record.organization_id,
    auth.uid(),
    invite_record.role,
    'active',
    invite_record.invited_by,
    invite_record.created_at,
    NOW()
  );
  
  -- Marcar convite como aceito
  UPDATE public.organization_invites 
  SET status = 'accepted' 
  WHERE id = invite_record.id;
  
  RETURN json_build_object(
    'success', true, 
    'message', 'Convite aceito com sucesso',
    'organization_id', invite_record.organization_id
  );
END;
$$;

-- Função para criar primeira organização automaticamente
CREATE OR REPLACE FUNCTION public.create_default_organization()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  org_id UUID;
BEGIN
  -- Criar organização padrão
  INSERT INTO public.organizations (name, slug, owner_id)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'company_name', 'Minha Empresa'),
    'org-' || NEW.id,
    NEW.id
  ) RETURNING id INTO org_id;
  
  -- Adicionar usuário como admin da organização
  INSERT INTO public.organization_members (organization_id, user_id, role, status)
  VALUES (org_id, NEW.id, 'admin', 'active');
  
  RETURN NEW;
END;
$$;

-- Trigger para criar organização padrão
CREATE TRIGGER on_auth_user_create_organization
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_default_organization();

-- Adicionar colunas de organização nas tabelas existentes
ALTER TABLE public.clients ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.opportunities ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.tasks ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.contracts ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.financial_entries ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.strategies ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;
ALTER TABLE public.events ADD COLUMN organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE;

-- Função para definir organization_id automaticamente
CREATE OR REPLACE FUNCTION public.set_organization_id()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  current_org_id UUID;
BEGIN
  -- Buscar a organização ativa do usuário (primeira organização por enquanto)
  SELECT organization_id INTO current_org_id
  FROM public.organization_members
  WHERE user_id = auth.uid() AND status = 'active'
  ORDER BY joined_at ASC
  LIMIT 1;
  
  IF current_org_id IS NOT NULL THEN
    NEW.organization_id = current_org_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Triggers para definir organization_id automaticamente
CREATE TRIGGER set_clients_organization_id 
  BEFORE INSERT ON public.clients 
  FOR EACH ROW EXECUTE FUNCTION public.set_organization_id();

CREATE TRIGGER set_opportunities_organization_id 
  BEFORE INSERT ON public.opportunities 
  FOR EACH ROW EXECUTE FUNCTION public.set_organization_id();

CREATE TRIGGER set_tasks_organization_id 
  BEFORE INSERT ON public.tasks 
  FOR EACH ROW EXECUTE FUNCTION public.set_organization_id();

CREATE TRIGGER set_contracts_organization_id 
  BEFORE INSERT ON public.contracts 
  FOR EACH ROW EXECUTE FUNCTION public.set_organization_id();

CREATE TRIGGER set_financial_entries_organization_id 
  BEFORE INSERT ON public.financial_entries 
  FOR EACH ROW EXECUTE FUNCTION public.set_organization_id();

CREATE TRIGGER set_strategies_organization_id 
  BEFORE INSERT ON public.strategies 
  FOR EACH ROW EXECUTE FUNCTION public.set_organization_id();

CREATE TRIGGER set_events_organization_id 
  BEFORE INSERT ON public.events 
  FOR EACH ROW EXECUTE FUNCTION public.set_organization_id();
