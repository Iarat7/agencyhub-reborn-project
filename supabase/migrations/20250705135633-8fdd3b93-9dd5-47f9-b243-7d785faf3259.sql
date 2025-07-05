-- Criar trigger para organização automática ao criar usuário
CREATE OR REPLACE FUNCTION public.create_default_organization_for_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  org_id UUID;
  user_name TEXT;
BEGIN
  -- Extrair nome do usuário dos metadata
  user_name = COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email);
  
  -- Criar organização pessoal
  INSERT INTO public.organizations (name, slug, owner_id, description)
  VALUES (
    user_name || ' - Pessoal',
    'personal-' || NEW.id,
    NEW.id,
    'Organização pessoal'
  ) RETURNING id INTO org_id;
  
  -- Adicionar usuário como admin da organização
  INSERT INTO public.organization_members (organization_id, user_id, role, status)
  VALUES (org_id, NEW.id, 'admin', 'active');
  
  RETURN NEW;
END;
$$;

-- Remover trigger existente se houver
DROP TRIGGER IF EXISTS create_default_organization_trigger ON auth.users;

-- Criar trigger que executa após inserção de usuário
CREATE TRIGGER create_default_organization_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_default_organization_for_user();

-- Atualizar função de processamento de convites para garantir organização pessoal
CREATE OR REPLACE FUNCTION public.process_organization_invite(invite_token text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  invite_record public.organization_invites%ROWTYPE;
  user_email TEXT;
  user_record auth.users%ROWTYPE;
  personal_org_id UUID;
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
  
  -- Buscar dados do usuário
  SELECT * INTO user_record FROM auth.users WHERE id = auth.uid();
  
  -- Verificar se o usuário tem organização pessoal, se não criar
  SELECT id INTO personal_org_id 
  FROM public.organizations 
  WHERE owner_id = auth.uid() 
    AND slug LIKE 'personal-%'
  LIMIT 1;
  
  IF personal_org_id IS NULL THEN
    -- Criar organização pessoal se não existir
    INSERT INTO public.organizations (name, slug, owner_id, description)
    VALUES (
      COALESCE(user_record.raw_user_meta_data->>'full_name', user_record.email) || ' - Pessoal',
      'personal-' || auth.uid(),
      auth.uid(),
      'Organização pessoal'
    ) RETURNING id INTO personal_org_id;
    
    -- Adicionar como membro da organização pessoal
    INSERT INTO public.organization_members (organization_id, user_id, role, status)
    VALUES (personal_org_id, auth.uid(), 'admin', 'active');
  END IF;
  
  -- Verificar se o usuário já é membro da organização do convite
  IF EXISTS (
    SELECT 1 FROM public.organization_members 
    WHERE organization_id = invite_record.organization_id 
      AND user_id = auth.uid()
  ) THEN
    RETURN json_build_object('success', false, 'message', 'Usuário já é membro desta organização');
  END IF;
  
  -- Adicionar usuário à organização do convite
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
    'message', 'Convite aceito! Você agora faz parte da organização e mantém sua organização pessoal.',
    'organization_id', invite_record.organization_id,
    'personal_org_id', personal_org_id
  );
END;
$$;