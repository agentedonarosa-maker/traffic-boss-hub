-- Remover a coluna credentials obsoleta após migração para Vault
-- IMPORTANTE: Execute APENAS após rodar a edge function migrate-credentials-to-vault

-- Primeiro, verificar se ainda há integrações não migradas
DO $$
DECLARE
  unmigrated_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO unmigrated_count
  FROM integrations
  WHERE vault_secret_name IS NULL;
  
  IF unmigrated_count > 0 THEN
    RAISE NOTICE 'AVISO: Ainda existem % integrações não migradas para o Vault', unmigrated_count;
    RAISE NOTICE 'Execute a edge function migrate-credentials-to-vault antes de continuar';
  END IF;
END $$;

-- Adicionar comentário explicativo na coluna credentials
COMMENT ON COLUMN integrations.credentials IS 'DEPRECATED: Credenciais agora são armazenadas no Supabase Vault (vault_secret_name). Este campo será removido em versão futura.';

-- Criar trigger para prevenir inserção de credenciais em plaintext
CREATE OR REPLACE FUNCTION prevent_plaintext_credentials()
RETURNS TRIGGER AS $$
BEGIN
  -- Se vault_secret_name está NULL mas credentials não está vazio, alertar
  IF NEW.vault_secret_name IS NULL AND NEW.credentials IS NOT NULL AND NEW.credentials::text != '{}'::text THEN
    RAISE WARNING 'Inserindo credenciais em plaintext. Use Vault para segurança!';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER warn_plaintext_credentials
  BEFORE INSERT OR UPDATE ON integrations
  FOR EACH ROW
  EXECUTE FUNCTION prevent_plaintext_credentials();