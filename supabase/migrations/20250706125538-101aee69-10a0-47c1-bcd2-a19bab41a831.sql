-- Verificar e configurar triggers para definir organization_id automaticamente
-- Primeiro, atualizar dados existentes sem organization_id

-- Atualizar clientes existentes para ter organization_id
UPDATE public.clients 
SET organization_id = (
  SELECT organization_id 
  FROM public.organization_members 
  WHERE user_id = clients.created_by 
    AND status = 'active' 
  ORDER BY joined_at ASC 
  LIMIT 1
)
WHERE organization_id IS NULL AND created_by IS NOT NULL;

-- Atualizar oportunidades existentes
UPDATE public.opportunities 
SET organization_id = (
  SELECT organization_id 
  FROM public.organization_members 
  WHERE user_id = opportunities.created_by 
    AND status = 'active' 
  ORDER BY joined_at ASC 
  LIMIT 1
)
WHERE organization_id IS NULL AND created_by IS NOT NULL;

-- Atualizar tarefas existentes
UPDATE public.tasks 
SET organization_id = (
  SELECT organization_id 
  FROM public.organization_members 
  WHERE user_id = tasks.created_by 
    AND status = 'active' 
  ORDER BY joined_at ASC 
  LIMIT 1
)
WHERE organization_id IS NULL AND created_by IS NOT NULL;

-- Atualizar eventos existentes
UPDATE public.events 
SET organization_id = (
  SELECT organization_id 
  FROM public.organization_members 
  WHERE user_id = events.created_by 
    AND status = 'active' 
  ORDER BY joined_at ASC 
  LIMIT 1
)
WHERE organization_id IS NULL AND created_by IS NOT NULL;

-- Atualizar movimentações financeiras existentes
UPDATE public.financial_entries 
SET organization_id = (
  SELECT organization_id 
  FROM public.organization_members 
  WHERE user_id = financial_entries.created_by 
    AND status = 'active' 
  ORDER BY joined_at ASC 
  LIMIT 1
)
WHERE organization_id IS NULL AND created_by IS NOT NULL;

-- Atualizar contratos existentes
UPDATE public.contracts 
SET organization_id = (
  SELECT organization_id 
  FROM public.organization_members 
  WHERE user_id = contracts.created_by 
    AND status = 'active' 
  ORDER BY joined_at ASC 
  LIMIT 1
)
WHERE organization_id IS NULL AND created_by IS NOT NULL;

-- Atualizar estratégias existentes
UPDATE public.strategies 
SET organization_id = (
  SELECT organization_id 
  FROM public.organization_members 
  WHERE user_id = strategies.created_by 
    AND status = 'active' 
  ORDER BY joined_at ASC 
  LIMIT 1
)
WHERE organization_id IS NULL AND created_by IS NOT NULL;

-- Configurar triggers para definir organization_id automaticamente
-- Criar/recriar triggers para todas as tabelas principais

-- Clients
DROP TRIGGER IF EXISTS set_organization_id_trigger ON public.clients;
CREATE TRIGGER set_organization_id_trigger
  BEFORE INSERT ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.set_organization_id();

-- Opportunities  
DROP TRIGGER IF EXISTS set_organization_id_trigger ON public.opportunities;
CREATE TRIGGER set_organization_id_trigger
  BEFORE INSERT ON public.opportunities
  FOR EACH ROW
  EXECUTE FUNCTION public.set_organization_id();

-- Tasks
DROP TRIGGER IF EXISTS set_organization_id_trigger ON public.tasks;
CREATE TRIGGER set_organization_id_trigger
  BEFORE INSERT ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.set_organization_id();

-- Events
DROP TRIGGER IF EXISTS set_organization_id_trigger ON public.events;
CREATE TRIGGER set_organization_id_trigger
  BEFORE INSERT ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.set_organization_id();

-- Financial Entries
DROP TRIGGER IF EXISTS set_organization_id_trigger ON public.financial_entries;
CREATE TRIGGER set_organization_id_trigger
  BEFORE INSERT ON public.financial_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.set_organization_id();

-- Contracts
DROP TRIGGER IF EXISTS set_organization_id_trigger ON public.contracts;
CREATE TRIGGER set_organization_id_trigger
  BEFORE INSERT ON public.contracts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_organization_id();

-- Strategies
DROP TRIGGER IF EXISTS set_organization_id_trigger ON public.strategies;
CREATE TRIGGER set_organization_id_trigger
  BEFORE INSERT ON public.strategies
  FOR EACH ROW
  EXECUTE FUNCTION public.set_organization_id();