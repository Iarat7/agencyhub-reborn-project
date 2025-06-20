
-- Primeiro, vamos adicionar RLS para as tabelas que não têm
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_entries ENABLE ROW LEVEL SECURITY;

-- Políticas para contratos
CREATE POLICY "Users can view all contracts" 
  ON public.contracts 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create contracts" 
  ON public.contracts 
  FOR INSERT 
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update contracts they created" 
  ON public.contracts 
  FOR UPDATE 
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete contracts they created" 
  ON public.contracts 
  FOR DELETE 
  USING (auth.uid() = created_by);

-- Políticas para entradas financeiras
CREATE POLICY "Users can view all financial entries" 
  ON public.financial_entries 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create financial entries" 
  ON public.financial_entries 
  FOR INSERT 
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update financial entries they created" 
  ON public.financial_entries 
  FOR UPDATE 
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete financial entries they created" 
  ON public.financial_entries 
  FOR DELETE 
  USING (auth.uid() = created_by);

-- Criar bucket de storage para anexos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('contract-attachments', 'contract-attachments', true);

-- Políticas para o bucket de anexos
CREATE POLICY "Users can upload attachments" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'contract-attachments');

CREATE POLICY "Users can view attachments" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'contract-attachments');

CREATE POLICY "Users can update their attachments" 
  ON storage.objects 
  FOR UPDATE 
  USING (bucket_id = 'contract-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their attachments" 
  ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'contract-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Criar tabela para anexos de contratos
CREATE TABLE public.contract_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS para anexos de contratos
ALTER TABLE public.contract_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all contract attachments" 
  ON public.contract_attachments 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can create contract attachments" 
  ON public.contract_attachments 
  FOR INSERT 
  WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can delete contract attachments they uploaded" 
  ON public.contract_attachments 
  FOR DELETE 
  USING (auth.uid() = uploaded_by);

-- Adicionar trigger para definir created_by automaticamente
CREATE OR REPLACE FUNCTION set_created_by_trigger()
RETURNS TRIGGER AS $$
BEGIN
  NEW.created_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger nas tabelas
CREATE TRIGGER set_contracts_created_by
  BEFORE INSERT ON public.contracts
  FOR EACH ROW EXECUTE FUNCTION set_created_by_trigger();

CREATE TRIGGER set_financial_entries_created_by
  BEFORE INSERT ON public.financial_entries
  FOR EACH ROW EXECUTE FUNCTION set_created_by_trigger();

-- Trigger para uploaded_by em anexos
CREATE OR REPLACE FUNCTION set_uploaded_by_trigger()
RETURNS TRIGGER AS $$
BEGIN
  NEW.uploaded_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_contract_attachments_uploaded_by
  BEFORE INSERT ON public.contract_attachments
  FOR EACH ROW EXECUTE FUNCTION set_uploaded_by_trigger();
