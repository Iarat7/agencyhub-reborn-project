-- Corrigir recursão infinita nas políticas RLS
-- Primeiro, remover políticas problemáticas
DROP POLICY IF EXISTS "Organization admins can manage members" ON public.organization_members;
DROP POLICY IF EXISTS "Users can view members of their organizations" ON public.organization_members;

-- Criar função security definer para verificar se usuário é admin de uma organização
CREATE OR REPLACE FUNCTION public.is_organization_admin(org_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.organizations 
    WHERE id = org_id 
      AND owner_id = auth.uid()
  );
$$;

-- Criar função security definer para verificar se usuário é membro de uma organização
CREATE OR REPLACE FUNCTION public.is_organization_member(org_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.organizations 
    WHERE id = org_id 
      AND owner_id = auth.uid()
  ) OR EXISTS (
    SELECT 1
    FROM public.organization_members om
    WHERE om.organization_id = org_id
      AND om.user_id = auth.uid()
      AND om.status = 'active'
  );
$$;

-- Recriar políticas sem recursão
CREATE POLICY "Organization admins can manage members"
ON public.organization_members FOR ALL
USING (public.is_organization_admin(organization_id));

CREATE POLICY "Users can view members of their organizations"
ON public.organization_members FOR SELECT
USING (public.is_organization_member(organization_id));

-- Política para permitir inserção automática pelo trigger
CREATE POLICY "System can insert organization members"
ON public.organization_members FOR INSERT
WITH CHECK (true);

-- Atualizar todas as outras políticas para usar as funções security definer
-- Clientes
DROP POLICY IF EXISTS "Organization members can view clients" ON public.clients;
DROP POLICY IF EXISTS "Organization members can create clients" ON public.clients;
DROP POLICY IF EXISTS "Organization members can update clients" ON public.clients;
DROP POLICY IF EXISTS "Organization members can delete clients" ON public.clients;

CREATE POLICY "Organization members can view clients"
ON public.clients FOR SELECT
USING (public.is_organization_member(organization_id));

CREATE POLICY "Organization members can create clients"
ON public.clients FOR INSERT
WITH CHECK (public.is_organization_member(organization_id) AND created_by = auth.uid());

CREATE POLICY "Organization members can update clients"
ON public.clients FOR UPDATE
USING (public.is_organization_member(organization_id));

CREATE POLICY "Organization members can delete clients"
ON public.clients FOR DELETE
USING (public.is_organization_member(organization_id) AND created_by = auth.uid());

-- Oportunidades
DROP POLICY IF EXISTS "Organization members can view opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Organization members can create opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Organization members can update opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Organization members can delete opportunities" ON public.opportunities;

CREATE POLICY "Organization members can view opportunities"
ON public.opportunities FOR SELECT
USING (public.is_organization_member(organization_id));

CREATE POLICY "Organization members can create opportunities"
ON public.opportunities FOR INSERT
WITH CHECK (public.is_organization_member(organization_id) AND created_by = auth.uid());

CREATE POLICY "Organization members can update opportunities"
ON public.opportunities FOR UPDATE
USING (public.is_organization_member(organization_id));

CREATE POLICY "Organization members can delete opportunities"
ON public.opportunities FOR DELETE
USING (public.is_organization_member(organization_id) AND created_by = auth.uid());

-- Tarefas
DROP POLICY IF EXISTS "Organization members can view tasks" ON public.tasks;
DROP POLICY IF EXISTS "Organization members can create tasks" ON public.tasks;
DROP POLICY IF EXISTS "Organization members can update tasks" ON public.tasks;
DROP POLICY IF EXISTS "Organization members can delete tasks" ON public.tasks;

CREATE POLICY "Organization members can view tasks"
ON public.tasks FOR SELECT
USING (public.is_organization_member(organization_id));

CREATE POLICY "Organization members can create tasks"
ON public.tasks FOR INSERT
WITH CHECK (public.is_organization_member(organization_id) AND created_by = auth.uid());

CREATE POLICY "Organization members can update tasks"
ON public.tasks FOR UPDATE
USING (public.is_organization_member(organization_id));

CREATE POLICY "Organization members can delete tasks"
ON public.tasks FOR DELETE
USING (public.is_organization_member(organization_id) AND created_by = auth.uid());

-- Eventos
DROP POLICY IF EXISTS "Organization members can view events" ON public.events;
DROP POLICY IF EXISTS "Organization members can create events" ON public.events;
DROP POLICY IF EXISTS "Organization members can update events" ON public.events;
DROP POLICY IF EXISTS "Organization members can delete events" ON public.events;

CREATE POLICY "Organization members can view events"
ON public.events FOR SELECT
USING (public.is_organization_member(organization_id));

CREATE POLICY "Organization members can create events"
ON public.events FOR INSERT
WITH CHECK (public.is_organization_member(organization_id) AND created_by = auth.uid());

CREATE POLICY "Organization members can update events"
ON public.events FOR UPDATE
USING (public.is_organization_member(organization_id));

CREATE POLICY "Organization members can delete events"
ON public.events FOR DELETE
USING (public.is_organization_member(organization_id) AND created_by = auth.uid());

-- Estratégias
DROP POLICY IF EXISTS "Organization members can view strategies" ON public.strategies;
DROP POLICY IF EXISTS "Organization members can create strategies" ON public.strategies;
DROP POLICY IF EXISTS "Organization members can update strategies" ON public.strategies;
DROP POLICY IF EXISTS "Organization members can delete strategies" ON public.strategies;

CREATE POLICY "Organization members can view strategies"
ON public.strategies FOR SELECT
USING (public.is_organization_member(organization_id));

CREATE POLICY "Organization members can create strategies"
ON public.strategies FOR INSERT
WITH CHECK (public.is_organization_member(organization_id) AND created_by = auth.uid());

CREATE POLICY "Organization members can update strategies"
ON public.strategies FOR UPDATE
USING (public.is_organization_member(organization_id));

CREATE POLICY "Organization members can delete strategies"
ON public.strategies FOR DELETE
USING (public.is_organization_member(organization_id) AND created_by = auth.uid());

-- Contratos
DROP POLICY IF EXISTS "Organization members can view contracts" ON public.contracts;
DROP POLICY IF EXISTS "Organization members can create contracts" ON public.contracts;
DROP POLICY IF EXISTS "Organization members can update contracts" ON public.contracts;
DROP POLICY IF EXISTS "Organization members can delete contracts" ON public.contracts;

CREATE POLICY "Organization members can view contracts"
ON public.contracts FOR SELECT
USING (public.is_organization_member(organization_id));

CREATE POLICY "Organization members can create contracts"
ON public.contracts FOR INSERT
WITH CHECK (public.is_organization_member(organization_id) AND created_by = auth.uid());

CREATE POLICY "Organization members can update contracts"
ON public.contracts FOR UPDATE
USING (public.is_organization_member(organization_id));

CREATE POLICY "Organization members can delete contracts"
ON public.contracts FOR DELETE
USING (public.is_organization_member(organization_id) AND created_by = auth.uid());

-- Entradas financeiras
DROP POLICY IF EXISTS "Organization members can view financial entries" ON public.financial_entries;
DROP POLICY IF EXISTS "Organization members can create financial entries" ON public.financial_entries;
DROP POLICY IF EXISTS "Organization members can update financial entries" ON public.financial_entries;
DROP POLICY IF EXISTS "Organization members can delete financial entries" ON public.financial_entries;

CREATE POLICY "Organization members can view financial entries"
ON public.financial_entries FOR SELECT
USING (public.is_organization_member(organization_id));

CREATE POLICY "Organization members can create financial entries"
ON public.financial_entries FOR INSERT
WITH CHECK (public.is_organization_member(organization_id) AND created_by = auth.uid());

CREATE POLICY "Organization members can update financial entries"
ON public.financial_entries FOR UPDATE
USING (public.is_organization_member(organization_id));

CREATE POLICY "Organization members can delete financial entries"
ON public.financial_entries FOR DELETE
USING (public.is_organization_member(organization_id) AND created_by = auth.uid());