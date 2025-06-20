
-- Criar tabela para notificações
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info', -- 'info', 'warning', 'error', 'success'
  category TEXT NOT NULL DEFAULT 'general', -- 'task', 'opportunity', 'client', 'general'
  is_read BOOLEAN NOT NULL DEFAULT false,
  related_id UUID, -- ID da tarefa, oportunidade, etc.
  related_table TEXT, -- 'tasks', 'opportunities', etc.
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Adicionar RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Política para visualizar notificações próprias
CREATE POLICY "Users can view their own notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Política para marcar como lida
CREATE POLICY "Users can update their own notifications" 
  ON public.notifications 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Função para criar notificações automáticas
CREATE OR REPLACE FUNCTION check_and_create_notifications()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Notificações para tarefas vencidas
  INSERT INTO public.notifications (user_id, title, message, type, category, related_id, related_table)
  SELECT 
    COALESCE(t.assigned_to, t.created_by) as user_id,
    'Tarefa Vencida' as title,
    'A tarefa "' || t.title || '" está vencida desde ' || t.due_date as message,
    'error' as type,
    'task' as category,
    t.id as related_id,
    'tasks' as related_table
  FROM tasks t
  WHERE t.due_date < CURRENT_DATE 
    AND t.status IN ('pending', 'in_progress')
    AND NOT EXISTS (
      SELECT 1 FROM notifications n 
      WHERE n.related_id = t.id 
        AND n.related_table = 'tasks' 
        AND n.type = 'error'
        AND n.created_at > CURRENT_DATE - INTERVAL '1 day'
    );

  -- Notificações para tarefas próximas do vencimento (3 dias)
  INSERT INTO public.notifications (user_id, title, message, type, category, related_id, related_table)
  SELECT 
    COALESCE(t.assigned_to, t.created_by) as user_id,
    'Tarefa Próxima do Vencimento' as title,
    'A tarefa "' || t.title || '" vence em ' || t.due_date as message,
    'warning' as type,
    'task' as category,
    t.id as related_id,
    'tasks' as related_table
  FROM tasks t
  WHERE t.due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '3 days'
    AND t.status IN ('pending', 'in_progress')
    AND NOT EXISTS (
      SELECT 1 FROM notifications n 
      WHERE n.related_id = t.id 
        AND n.related_table = 'tasks' 
        AND n.type = 'warning'
        AND n.created_at > CURRENT_DATE - INTERVAL '1 day'
    );

  -- Notificações para oportunidades próximas do fechamento (7 dias)
  INSERT INTO public.notifications (user_id, title, message, type, category, related_id, related_table)
  SELECT 
    o.created_by as user_id,
    'Oportunidade Próxima do Fechamento' as title,
    'A oportunidade "' || o.title || '" tem data prevista de fechamento em ' || o.expected_close_date as message,
    'warning' as type,
    'opportunity' as category,
    o.id as related_id,
    'opportunities' as related_table
  FROM opportunities o
  WHERE o.expected_close_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
    AND o.stage IN ('prospection', 'qualification', 'proposal', 'negotiation')
    AND NOT EXISTS (
      SELECT 1 FROM notifications n 
      WHERE n.related_id = o.id 
        AND n.related_table = 'opportunities' 
        AND n.type = 'warning'
        AND n.created_at > CURRENT_DATE - INTERVAL '1 day'
    );
END;
$$;

-- Trigger para executar verificações automaticamente
CREATE OR REPLACE FUNCTION trigger_notification_check()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  PERFORM check_and_create_notifications();
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Criar triggers para tasks e opportunities
CREATE TRIGGER task_notification_trigger
  AFTER INSERT OR UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION trigger_notification_check();

CREATE TRIGGER opportunity_notification_trigger
  AFTER INSERT OR UPDATE ON opportunities
  FOR EACH ROW
  EXECUTE FUNCTION trigger_notification_check();
