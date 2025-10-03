-- Criar tabela para tokens de acesso dos clientes
CREATE TABLE public.client_access (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_accessed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(client_id)
);

-- Criar índice para busca rápida por token
CREATE INDEX idx_client_access_token ON public.client_access(access_token);

-- Habilitar RLS
ALTER TABLE public.client_access ENABLE ROW LEVEL SECURITY;

-- Política para leitura pública pelo token (sem autenticação)
CREATE POLICY "Anyone can read with valid token"
ON public.client_access
FOR SELECT
USING (is_active = true);

-- Política para o usuário gerenciar tokens de seus clientes
CREATE POLICY "Users can manage their clients tokens"
ON public.client_access
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.clients
    WHERE clients.id = client_access.client_id
    AND clients.user_id = auth.uid()
  )
);

-- Função para gerar token único
CREATE OR REPLACE FUNCTION public.generate_client_token()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_token TEXT;
  token_exists BOOLEAN;
BEGIN
  LOOP
    -- Gerar token aleatório de 32 caracteres
    new_token := encode(gen_random_bytes(24), 'base64');
    new_token := replace(new_token, '/', '_');
    new_token := replace(new_token, '+', '-');
    
    -- Verificar se token já existe
    SELECT EXISTS(SELECT 1 FROM client_access WHERE access_token = new_token) INTO token_exists;
    
    EXIT WHEN NOT token_exists;
  END LOOP;
  
  RETURN new_token;
END;
$$;