-- Corrigir search_path da função para segurança
CREATE OR REPLACE FUNCTION prevent_plaintext_credentials()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Se vault_secret_name está NULL mas credentials não está vazio, alertar
  IF NEW.vault_secret_name IS NULL AND NEW.credentials IS NOT NULL AND NEW.credentials::text != '{}'::text THEN
    RAISE WARNING 'Inserindo credenciais em plaintext. Use Vault para segurança!';
  END IF;
  
  RETURN NEW;
END;
$$;