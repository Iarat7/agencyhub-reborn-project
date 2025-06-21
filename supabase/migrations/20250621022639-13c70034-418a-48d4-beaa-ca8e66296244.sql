
-- Adicionar a coluna ai_strategy_content se ela não existir
ALTER TABLE public.strategies 
ADD COLUMN IF NOT EXISTS ai_strategy_content TEXT;
