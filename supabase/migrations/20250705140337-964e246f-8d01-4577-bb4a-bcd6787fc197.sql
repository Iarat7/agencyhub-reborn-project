-- Corrigir políticas RLS para organizations
-- Primeiro, verificar e corrigir políticas da tabela organizations

-- Remover políticas existentes problemáticas
DROP POLICY IF EXISTS "Authenticated users can create organizations" ON public.organizations;
DROP POLICY IF EXISTS "Organization owners can update their organizations" ON public.organizations;
DROP POLICY IF EXISTS "Users can view organizations they belong to" ON public.organizations;

-- Criar política para permitir usuários criarem suas próprias organizações
CREATE POLICY "Users can create their own organizations"
ON public.organizations FOR INSERT
WITH CHECK (owner_id = auth.uid());

-- Política para owners atualizarem suas organizações
CREATE POLICY "Organization owners can update their organizations"
ON public.organizations FOR UPDATE
USING (owner_id = auth.uid());

-- Política para visualizar organizações que o usuário é dono ou membro
CREATE POLICY "Users can view organizations they belong to"
ON public.organizations FOR SELECT
USING (
  owner_id = auth.uid() OR 
  id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
      AND status = 'active'
  )
);

-- Permitir que o sistema (triggers) possa inserir na tabela organization_members
-- Atualizar a política para ser mais permissiva para inserções do sistema
DROP POLICY IF EXISTS "System can insert organization members" ON public.organization_members;

CREATE POLICY "Users can create organization members"
ON public.organization_members FOR INSERT
WITH CHECK (
  -- Permitir se o usuário é dono da organização
  organization_id IN (
    SELECT id FROM public.organizations WHERE owner_id = auth.uid()
  ) OR
  -- Permitir se é inserção do próprio usuário (para triggers)
  user_id = auth.uid()
);