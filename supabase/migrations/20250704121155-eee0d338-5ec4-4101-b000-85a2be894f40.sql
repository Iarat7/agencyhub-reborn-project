-- Corrigir políticas RLS para incluir organization_id
-- Primeiro, vamos atualizar as políticas para clientes
DROP POLICY IF EXISTS "Users can view their own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can create their own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can update their own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can delete their own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can manage clients" ON public.clients;

-- Políticas baseadas em organização para clientes
CREATE POLICY "Organization members can view clients"
ON public.clients FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND status = 'active'
  )
);

CREATE POLICY "Organization members can create clients"
ON public.clients FOR INSERT
WITH CHECK (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND status = 'active'
  )
  AND created_by = auth.uid()
);

CREATE POLICY "Organization members can update clients"
ON public.clients FOR UPDATE
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND status = 'active'
  )
);

CREATE POLICY "Organization members can delete clients"
ON public.clients FOR DELETE
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND status = 'active'
  )
  AND created_by = auth.uid()
);

-- Atualizar políticas para oportunidades
DROP POLICY IF EXISTS "Users can view their own opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Users can create their own opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Users can update their own opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Users can delete their own opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Users can manage opportunities" ON public.opportunities;

CREATE POLICY "Organization members can view opportunities"
ON public.opportunities FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND status = 'active'
  )
);

CREATE POLICY "Organization members can create opportunities"
ON public.opportunities FOR INSERT
WITH CHECK (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND status = 'active'
  )
  AND created_by = auth.uid()
);

CREATE POLICY "Organization members can update opportunities"
ON public.opportunities FOR UPDATE
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND status = 'active'
  )
);

CREATE POLICY "Organization members can delete opportunities"
ON public.opportunities FOR DELETE
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND status = 'active'
  )
  AND created_by = auth.uid()
);

-- Atualizar políticas para tarefas
DROP POLICY IF EXISTS "Users can view their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can create their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete their own tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can manage tasks" ON public.tasks;

CREATE POLICY "Organization members can view tasks"
ON public.tasks FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND status = 'active'
  )
);

CREATE POLICY "Organization members can create tasks"
ON public.tasks FOR INSERT
WITH CHECK (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND status = 'active'
  )
  AND created_by = auth.uid()
);

CREATE POLICY "Organization members can update tasks"
ON public.tasks FOR UPDATE
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND status = 'active'
  )
);

CREATE POLICY "Organization members can delete tasks"
ON public.tasks FOR DELETE
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND status = 'active'
  )
  AND created_by = auth.uid()
);

-- Atualizar políticas para eventos
DROP POLICY IF EXISTS "Users can manage events" ON public.events;

CREATE POLICY "Organization members can view events"
ON public.events FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND status = 'active'
  )
);

CREATE POLICY "Organization members can create events"
ON public.events FOR INSERT
WITH CHECK (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND status = 'active'
  )
  AND created_by = auth.uid()
);

CREATE POLICY "Organization members can update events"
ON public.events FOR UPDATE
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND status = 'active'
  )
);

CREATE POLICY "Organization members can delete events"
ON public.events FOR DELETE
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND status = 'active'
  )
  AND created_by = auth.uid()
);

-- Atualizar políticas para estratégias
DROP POLICY IF EXISTS "Users can manage strategies" ON public.strategies;

CREATE POLICY "Organization members can view strategies"
ON public.strategies FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND status = 'active'
  )
);

CREATE POLICY "Organization members can create strategies"
ON public.strategies FOR INSERT
WITH CHECK (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND status = 'active'
  )
  AND created_by = auth.uid()
);

CREATE POLICY "Organization members can update strategies"
ON public.strategies FOR UPDATE
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND status = 'active'
  )
);

CREATE POLICY "Organization members can delete strategies"
ON public.strategies FOR DELETE
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND status = 'active'
  )
  AND created_by = auth.uid()
);

-- Atualizar políticas para contratos
DROP POLICY IF EXISTS "Users can create contracts" ON public.contracts;
DROP POLICY IF EXISTS "Users can delete contracts they created" ON public.contracts;
DROP POLICY IF EXISTS "Users can manage contracts" ON public.contracts;
DROP POLICY IF EXISTS "Users can update contracts they created" ON public.contracts;
DROP POLICY IF EXISTS "Users can view all contracts" ON public.contracts;

CREATE POLICY "Organization members can view contracts"
ON public.contracts FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND status = 'active'
  )
);

CREATE POLICY "Organization members can create contracts"
ON public.contracts FOR INSERT
WITH CHECK (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND status = 'active'
  )
  AND created_by = auth.uid()
);

CREATE POLICY "Organization members can update contracts"
ON public.contracts FOR UPDATE
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND status = 'active'
  )
);

CREATE POLICY "Organization members can delete contracts"
ON public.contracts FOR DELETE
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND status = 'active'
  )
  AND created_by = auth.uid()
);

-- Atualizar políticas para entradas financeiras
DROP POLICY IF EXISTS "Users can create financial entries" ON public.financial_entries;
DROP POLICY IF EXISTS "Users can delete financial entries they created" ON public.financial_entries;
DROP POLICY IF EXISTS "Users can manage financial entries" ON public.financial_entries;
DROP POLICY IF EXISTS "Users can update financial entries they created" ON public.financial_entries;
DROP POLICY IF EXISTS "Users can view all financial entries" ON public.financial_entries;

CREATE POLICY "Organization members can view financial entries"
ON public.financial_entries FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND status = 'active'
  )
);

CREATE POLICY "Organization members can create financial entries"
ON public.financial_entries FOR INSERT
WITH CHECK (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND status = 'active'
  )
  AND created_by = auth.uid()
);

CREATE POLICY "Organization members can update financial entries"
ON public.financial_entries FOR UPDATE
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND status = 'active'
  )
);

CREATE POLICY "Organization members can delete financial entries"
ON public.financial_entries FOR DELETE
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() 
    AND status = 'active'
  )
  AND created_by = auth.uid()
);