
-- Primeiro, vamos adicionar políticas RLS para todas as tabelas principais
-- Isso garante que apenas usuários autenticados possam acessar os dados

-- Políticas para a tabela clients
CREATE POLICY "Users can view their own clients" 
  ON public.clients 
  FOR SELECT 
  USING (auth.uid() = created_by);

CREATE POLICY "Users can create their own clients" 
  ON public.clients 
  FOR INSERT 
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own clients" 
  ON public.clients 
  FOR UPDATE 
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own clients" 
  ON public.clients 
  FOR DELETE 
  USING (auth.uid() = created_by);

-- Habilitar RLS na tabela clients
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Políticas para a tabela opportunities
CREATE POLICY "Users can view their own opportunities" 
  ON public.opportunities 
  FOR SELECT 
  USING (auth.uid() = created_by);

CREATE POLICY "Users can create their own opportunities" 
  ON public.opportunities 
  FOR INSERT 
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own opportunities" 
  ON public.opportunities 
  FOR UPDATE 
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own opportunities" 
  ON public.opportunities 
  FOR DELETE 
  USING (auth.uid() = created_by);

-- Habilitar RLS na tabela opportunities
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

-- Políticas para a tabela tasks
CREATE POLICY "Users can view their own tasks" 
  ON public.tasks 
  FOR SELECT 
  USING (auth.uid() = created_by OR auth.uid() = assigned_to);

CREATE POLICY "Users can create their own tasks" 
  ON public.tasks 
  FOR INSERT 
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own tasks" 
  ON public.tasks 
  FOR UPDATE 
  USING (auth.uid() = created_by OR auth.uid() = assigned_to);

CREATE POLICY "Users can delete their own tasks" 
  ON public.tasks 
  FOR DELETE 
  USING (auth.uid() = created_by);

-- Habilitar RLS na tabela tasks
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Políticas para a tabela profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Habilitar RLS na tabela profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Função para criar o primeiro usuário admin
CREATE OR REPLACE FUNCTION public.create_admin_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Atualizar o primeiro usuário criado para ser admin
  UPDATE public.profiles 
  SET role = 'admin' 
  WHERE id = (
    SELECT id 
    FROM public.profiles 
    ORDER BY created_at ASC 
    LIMIT 1
  );
END;
$$;

-- Trigger para definir created_by automaticamente
CREATE OR REPLACE FUNCTION public.set_created_by()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.created_by = auth.uid();
  RETURN NEW;
END;
$$;

-- Aplicar trigger nas tabelas que precisam
CREATE TRIGGER set_created_by_clients
  BEFORE INSERT ON public.clients
  FOR EACH ROW EXECUTE FUNCTION public.set_created_by();

CREATE TRIGGER set_created_by_opportunities
  BEFORE INSERT ON public.opportunities
  FOR EACH ROW EXECUTE FUNCTION public.set_created_by();

CREATE TRIGGER set_created_by_tasks
  BEFORE INSERT ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.set_created_by();
