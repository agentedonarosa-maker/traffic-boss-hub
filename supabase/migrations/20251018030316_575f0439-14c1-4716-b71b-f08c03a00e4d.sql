-- Criar tabela de pagamentos de clientes
CREATE TABLE public.client_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  client_id UUID NOT NULL,
  contract_value NUMERIC NOT NULL,
  payment_frequency TEXT NOT NULL CHECK (payment_frequency IN ('monthly', 'quarterly', 'annual', 'one_time')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('pix', 'boleto', 'credit_card', 'transfer')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'overdue', 'cancelled')),
  due_date DATE NOT NULL,
  paid_date DATE,
  payment_code TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar índices para melhor performance
CREATE INDEX idx_client_payments_user_id ON public.client_payments(user_id);
CREATE INDEX idx_client_payments_client_id ON public.client_payments(client_id);
CREATE INDEX idx_client_payments_due_date ON public.client_payments(due_date);
CREATE INDEX idx_client_payments_status ON public.client_payments(payment_status);

-- Ativar RLS
ALTER TABLE public.client_payments ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can view their own client payments"
  ON public.client_payments
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own client payments"
  ON public.client_payments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own client payments"
  ON public.client_payments
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own client payments"
  ON public.client_payments
  FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_client_payments_updated_at
  BEFORE UPDATE ON public.client_payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();