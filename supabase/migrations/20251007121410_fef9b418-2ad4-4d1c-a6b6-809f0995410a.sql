-- Remover o constraint que força uso do Vault
ALTER TABLE public.integrations 
DROP CONSTRAINT IF EXISTS credentials_must_be_empty_or_vault;

-- Remover o trigger que valida Vault
DROP TRIGGER IF EXISTS enforce_vault_credentials_trigger ON public.integrations;

-- Remover a função de validação do Vault
DROP FUNCTION IF EXISTS public.enforce_vault_credentials();

-- Manter apenas o warning trigger (não bloqueia)
-- Isso já existe e apenas alerta sobre plaintext