
-- Aplicar políticas RLS para a tabela opportunities
-- Primeiro, verificar se RLS está habilitado
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes se houver conflito
DROP POLICY IF EXISTS "Users can view their own opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Users can create their own opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Users can update their own opportunities" ON public.opportunities;
DROP POLICY IF EXISTS "Users can delete their own opportunities" ON public.opportunities;

-- Criar políticas RLS para opportunities
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

-- Aplicar trigger para definir created_by automaticamente
DROP TRIGGER IF EXISTS set_created_by_opportunities ON public.opportunities;
CREATE TRIGGER set_created_by_opportunities
  BEFORE INSERT ON public.opportunities
  FOR EACH ROW EXECUTE FUNCTION public.set_created_by();

-- Verificar se há oportunidades sem created_by e atualizar para o usuário atual
UPDATE public.opportunities 
SET created_by = (SELECT id FROM auth.users LIMIT 1)
WHERE created_by IS NULL;
