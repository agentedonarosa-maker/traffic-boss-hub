-- Fase 1: Correção de Segurança - Client Access RLS

-- PROBLEMA: A política atual "Anyone can read with valid token" permite que qualquer pessoa
-- leia TODOS os tokens ativos da tabela client_access, expondo tokens de todos os clientes.

-- SOLUÇÃO: Remover essa política insegura e criar uma edge function para validação de tokens.

-- 1. Remover a política insegura
DROP POLICY IF EXISTS "Anyone can read with valid token" ON public.client_access;

-- 2. A política "Users can manage their clients tokens" já cobre:
--    - SELECT, INSERT, UPDATE, DELETE para donos dos clientes
--    Isso garante que apenas o gestor de tráfego pode ver/gerenciar os tokens de seus clientes.

-- 3. Para o portal do cliente (acesso público com token), vamos criar uma edge function
--    que usa service_role para validar tokens de forma segura.

-- 4. Adicionar índice para melhorar performance da validação de tokens
CREATE INDEX IF NOT EXISTS idx_client_access_token ON public.client_access(access_token) 
WHERE is_active = true;

-- 5. Adicionar comentários para documentação
COMMENT ON TABLE public.client_access IS 'Tokens de acesso para portal do cliente. Acesso público deve ser feito via edge function validate-client-token.';
COMMENT ON COLUMN public.client_access.access_token IS 'Token único para acesso ao portal. Nunca deve ser exposto via RLS público.';