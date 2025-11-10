-- Adicionar foreign key que estava faltando na tabela client_payments
ALTER TABLE public.client_payments
ADD CONSTRAINT client_payments_client_id_fkey
FOREIGN KEY (client_id)
REFERENCES public.clients(id)
ON DELETE CASCADE;

-- Comentário para documentação
COMMENT ON CONSTRAINT client_payments_client_id_fkey ON public.client_payments 
IS 'Foreign key to ensure payment is linked to an existing client';