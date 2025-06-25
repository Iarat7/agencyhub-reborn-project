
-- Criar tabela de assinatura de organizações
CREATE TABLE public.organization_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL DEFAULT 'trial' CHECK (plan_type IN ('trial', 'basic', 'premium', 'enterprise')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'canceled', 'past_due')),
  trial_start_date TIMESTAMP WITH TIME ZONE,
  trial_end_date TIMESTAMP WITH TIME ZONE,
  subscription_start_date TIMESTAMP WITH TIME ZONE,
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(organization_id)
);

-- Habilitar RLS
ALTER TABLE public.organization_subscriptions ENABLE ROW LEVEL SECURITY;

-- Política para permitir que membros da organização vejam a assinatura
CREATE POLICY "organization_members_can_view_subscription" ON public.organization_subscriptions
FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() AND status = 'active'
  )
);

-- Política para permitir que admins da organização atualizem a assinatura
CREATE POLICY "organization_admins_can_update_subscription" ON public.organization_subscriptions
FOR UPDATE
USING (
  organization_id IN (
    SELECT organization_id 
    FROM public.organization_members 
    WHERE user_id = auth.uid() AND role = 'admin' AND status = 'active'
  )
);

-- Política para edge functions atualizarem assinaturas (usando service role)
CREATE POLICY "service_role_can_manage_subscriptions" ON public.organization_subscriptions
FOR ALL
USING (true);

-- Trigger para criar assinatura trial quando organização é criada
CREATE OR REPLACE FUNCTION public.create_trial_subscription()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  owner_email TEXT;
BEGIN
  -- Buscar email do owner da organização
  SELECT email INTO owner_email 
  FROM auth.users 
  WHERE id = NEW.owner_id;
  
  -- Verificar se é o email especial que deve ter acesso pago
  IF owner_email = 'gestaot7prod@gmail.com' THEN
    -- Criar assinatura premium permanente
    INSERT INTO public.organization_subscriptions (
      organization_id,
      plan_type,
      status,
      subscription_start_date
    ) VALUES (
      NEW.id,
      'premium',
      'active',
      NOW()
    );
  ELSE
    -- Criar trial de 7 dias
    INSERT INTO public.organization_subscriptions (
      organization_id,
      plan_type,
      status,
      trial_start_date,
      trial_end_date
    ) VALUES (
      NEW.id,
      'trial',
      'active',
      NOW(),
      NOW() + INTERVAL '7 days'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Criar trigger para quando uma organização é criada
DROP TRIGGER IF EXISTS create_trial_subscription_trigger ON public.organizations;
CREATE TRIGGER create_trial_subscription_trigger
  AFTER INSERT ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.create_trial_subscription();

-- Função para verificar se organização tem acesso a features premium
CREATE OR REPLACE FUNCTION public.organization_has_premium_access(org_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  subscription_record public.organization_subscriptions%ROWTYPE;
BEGIN
  SELECT * INTO subscription_record
  FROM public.organization_subscriptions
  WHERE organization_id = org_id;
  
  -- Se não tem assinatura, não tem acesso
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Se está inativo ou cancelado, não tem acesso
  IF subscription_record.status IN ('inactive', 'canceled') THEN
    RETURN FALSE;
  END IF;
  
  -- Se é premium ou enterprise, tem acesso
  IF subscription_record.plan_type IN ('premium', 'enterprise') THEN
    RETURN TRUE;
  END IF;
  
  -- Se é trial e ainda não expirou, tem acesso
  IF subscription_record.plan_type = 'trial' AND 
     subscription_record.trial_end_date > NOW() THEN
    RETURN TRUE;
  END IF;
  
  -- Caso contrário, não tem acesso
  RETURN FALSE;
END;
$$;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_organization_subscriptions_updated_at
  BEFORE UPDATE ON public.organization_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
