-- Adicionar campo para armazenar o nome do secret no Vault
ALTER TABLE integrations 
  ADD COLUMN vault_secret_name TEXT UNIQUE;

-- Criar índice para performance
CREATE INDEX idx_integrations_vault_secret ON integrations(vault_secret_name);

-- Adicionar comentário explicativo
COMMENT ON COLUMN integrations.vault_secret_name IS 'Nome do secret no Supabase Vault que contém as credenciais criptografadas';

-- Tornar client_id e user_id obrigatórios (correção de segurança)
UPDATE integrations SET client_id = (SELECT id FROM clients LIMIT 1) WHERE client_id IS NULL;
UPDATE integrations SET user_id = (SELECT user_id FROM clients WHERE clients.id = integrations.client_id LIMIT 1) WHERE user_id IS NULL;

ALTER TABLE integrations 
  ALTER COLUMN client_id SET NOT NULL,
  ALTER COLUMN user_id SET NOT NULL;

-- Adicionar foreign key constraint
ALTER TABLE integrations 
  ADD CONSTRAINT fk_integrations_client 
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE;