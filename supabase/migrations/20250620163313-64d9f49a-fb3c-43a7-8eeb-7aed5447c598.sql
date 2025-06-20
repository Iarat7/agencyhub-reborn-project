
-- Remover o trigger existente e recriar
DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;

-- Trigger para atualizar updated_at
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Verificar se o trigger para created_by já existe e criar se necessário
DROP TRIGGER IF EXISTS set_created_by_events ON public.events;

CREATE TRIGGER set_created_by_events
  BEFORE INSERT ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.set_created_by();
