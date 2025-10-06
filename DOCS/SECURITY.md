# 🔒 Guia de Segurança - TrafficPro

## ✅ Atualizações Críticas de Segurança (2025-01-06)

### 🛡️ Correções Implementadas Hoje

#### 1. Sistema de Notificações Reforçado ✅
**Problema:** Policy RLS permitia service role inserir notificações sem validação adequada.

**Solução:**
- ✅ Criada função `create_notification_secure()` com validação completa
- ✅ Validação de existência do usuário antes de criar notificação
- ✅ Validação de tipos permitidos: `info`, `success`, `warning`, `error`, `sync`
- ✅ Validação de tamanho: título (200 chars) e mensagem (1000 chars)
- ✅ Removida policy permissiva anterior
- ✅ Adicionada coluna `source` para rastreamento de auditoria
- ✅ Índice de performance otimizado para queries

**Como usar:**
```sql
-- Edge Functions devem usar a função segura
SELECT create_notification_secure(
  'user-uuid'::uuid,
  'Título',
  'Mensagem',
  'info'
);
```

#### 2. Proteção Obrigatória de Credenciais via Vault ✅
**Problema:** Possibilidade de armazenar credenciais em plaintext na coluna `credentials`.

**Solução:**
- ✅ Trigger `enforce_vault_credentials()` bloqueia credenciais em plaintext
- ✅ Sistema exige obrigatoriamente uso de `vault_secret_name`
- ✅ Validação automática em INSERT e UPDATE
- ✅ Mensagens de erro descritivas para desenvolvedores

**Comportamento:**
```sql
-- ❌ BLOQUEADO: Inserir credenciais sem vault
INSERT INTO integrations (credentials) 
VALUES ('{"token": "abc123"}'::jsonb);
-- Erro: "Security violation: Credentials must be stored in Vault"

-- ✅ PERMITIDO: Usar vault
INSERT INTO integrations (vault_secret_name) 
VALUES ('integration_123_credentials');
```

#### 3. Validação Forte de Autenticação ✅
**Problema:** Validação HTML5 básica permitia senhas fracas e não sanitizava inputs.

**Solução:**
- ✅ Schema Zod com requisitos rigorosos de senha:
  - Mínimo 8 caracteres (anteriormente 6)
  - Pelo menos uma letra maiúscula
  - Pelo menos uma letra minúscula
  - Pelo menos um número
  - Pelo menos um caractere especial
- ✅ Validação client-side antes de submit
- ✅ Feedback visual com alertas inline para cada erro
- ✅ Sanitização automática de email (trim + lowercase)
- ✅ Verificação de confirmação de senha

**Exemplo de validação:**
```typescript
// src/lib/validations/auth.ts
export const passwordSchema = z.string()
  .min(8, "Senha deve ter no mínimo 8 caracteres")
  .regex(/[a-z]/, "Senha deve conter pelo menos uma letra minúscula")
  .regex(/[A-Z]/, "Senha deve conter pelo menos uma letra maiúscula")
  .regex(/[0-9]/, "Senha deve conter pelo menos um número")
  .regex(/[^a-zA-Z0-9]/, "Senha deve conter pelo menos um caractere especial");
```

---

## ✅ Fase 1: Correção de Segurança Implementada (Anteriormente)

### 1. Correção de RLS - Client Access

**Problema Identificado:**
A política RLS anterior permitia que qualquer pessoa lesse TODOS os tokens ativos da tabela `client_access`:

```sql
-- ❌ POLÍTICA INSEGURA (REMOVIDA)
CREATE POLICY "Anyone can read with valid token" 
ON public.client_access FOR SELECT 
USING (is_active = true);
```

Isso expunha todos os tokens de acesso de todos os clientes!

**Solução Implementada:**
1. **Removida a política insegura**
2. **Criada Edge Function `validate-client-token`**:
   - Usa `service_role` para validar tokens (bypass RLS)
   - Retorna apenas dados do cliente específico do token
   - Não expõe tokens de outros clientes
   - Registra último acesso automaticamente

3. **Atualizado hook `useClientAccess.ts`**:
   - Usa a edge function em vez de acesso direto ao banco
   - Mantém segurança end-to-end

**Como funciona agora:**
```typescript
// Frontend chama a edge function
const { data } = await supabase.functions.invoke("validate-client-token", {
  body: { token }
});

// Edge function valida com service_role (seguro)
// Retorna APENAS dados do cliente do token fornecido
```

### 2. Proteção de Senhas Vazadas (AÇÃO NECESSÁRIA)

⚠️ **CRITICAL: A proteção contra senhas vazadas está DESATIVADA no Supabase.**

**Por que isso é importante:**
- Previne que usuários usem senhas comprometidas em vazamentos públicos
- Valida senhas contra o banco de dados Have I Been Pwned (HIBP)
- Aumenta significativamente a segurança da autenticação

**Como ativar:**

1. Acesse o painel do Supabase:
   ```
   https://supabase.com/dashboard/project/bdkdcwfmevyvzxjvmxgt/auth/policies
   ```

2. Vá em **Authentication > Policies**

3. Ative **"Leaked Password Protection"**:
   - Marque a opção "Check passwords against leaked password database"
   - Defina o nível de proteção (recomendado: "Medium" ou "High")

4. Salve as configurações

**Documentação oficial:**
https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection

---

### 3. Credenciais em Integrações (MELHORIA RECOMENDADA)

**Situação Atual:**
A tabela `integrations` armazena credenciais de APIs (Meta Ads, Google Ads, TikTok) em formato JSONB:

```sql
-- Estrutura atual
integrations {
  credentials: jsonb -- Armazena tokens em plaintext
}
```

**Riscos:**
- Se houver SQL injection ou acesso indevido ao banco, credenciais ficam expostas
- Logs de erro podem expor credenciais acidentalmente
- Backups do banco contêm credenciais em plaintext

**Soluções Recomendadas (em ordem de prioridade):**

#### Opção 1: Usar Supabase Vault (Recomendado)
O Supabase Vault permite armazenar secrets de forma criptografada:

```sql
-- Criar secret no Vault
SELECT vault.create_secret('meta_ads_token_client_123', 'xpto');

-- Usar em queries
SELECT 
  decrypted_secret 
FROM vault.decrypted_secrets 
WHERE name = 'meta_ads_token_client_123';
```

**Prós:**
- Criptografia nativa do Supabase
- Acesso via RLS
- Auditoria de acessos
- Rotação de secrets facilitada

**Contras:**
- Requer refatoração do código
- Aumenta complexidade

#### Opção 2: Criptografia em Application-Level
Criptografar credenciais antes de salvar no banco:

```typescript
// Exemplo com crypto-js
import CryptoJS from 'crypto-js';

const encryptionKey = Deno.env.get('ENCRYPTION_KEY');

function encryptCredentials(credentials: any): string {
  return CryptoJS.AES.encrypt(
    JSON.stringify(credentials), 
    encryptionKey
  ).toString();
}

function decryptCredentials(encrypted: string): any {
  const bytes = CryptoJS.AES.decrypt(encrypted, encryptionKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}
```

**Prós:**
- Relativamente simples de implementar
- Compatível com estrutura atual

**Contras:**
- Chave de criptografia precisa estar segura (Supabase Secrets)
- Necessário decriptar para usar (overhead)

#### Opção 3: Manter Atual com Melhorias (Mínimo Aceitável)
Se optar por manter o formato atual, implementar:

1. **RLS mais restritivo**:
```sql
-- Apenas donos podem ver credenciais
CREATE POLICY "Only owners see credentials"
ON integrations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM clients 
    WHERE clients.id = integrations.client_id 
    AND clients.user_id = auth.uid()
  )
);
```

2. **Mask em logs**:
```typescript
// Nunca logar credenciais completas
console.log('Integration created:', {
  ...integration,
  credentials: '***MASKED***'
});
```

3. **Rotação periódica**:
   - Implementar lembretes para renovar tokens
   - Expiração automática de tokens antigos

---

## 📊 Status da Segurança

### ✅ Implementado
- [x] RLS corrigido em `client_access`
- [x] Edge function segura para validação de tokens
- [x] Índice otimizado para performance
- [x] Documentação de segurança criada
- [x] **Criptografia com Supabase Vault implementada**
  - Credenciais de integrações armazenadas de forma criptografada
  - Edge function `manage-integration-credentials` para gerenciar secrets
  - Edge function `migrate-credentials-to-vault` para migrar integrações existentes
  - Máscara automática de dados sensíveis em logs
  - Campos `user_id` e `client_id` obrigatórios em `integrations`
  - Foreign key constraint para integridade referencial
  - Trigger de prevenção contra credenciais em plaintext
  - Coluna `credentials` marcada como DEPRECATED

### 🔧 Ação Necessária (Executar AGORA)

> **⚠️ IMPORTANTE:** Com as novas proteções implementadas hoje (2025-01-06), **credenciais antigas em plaintext ainda podem existir no banco**. Execute a migração abaixo para protegê-las.

#### 1. Migrar Credenciais Existentes para o Vault

**Execute esta edge function uma única vez** para migrar todas as integrações existentes:

```bash
# Via Supabase CLI (recomendado)
curl -X POST 'https://bdkdcwfmevyvzxjvmxgt.supabase.co/functions/v1/migrate-credentials-to-vault' \
  -H "Authorization: Bearer SEU_ANON_KEY"
```

Ou acesse diretamente pelo dashboard:
👉 [Executar migração de credenciais](https://supabase.com/dashboard/project/bdkdcwfmevyvzxjvmxgt/functions/migrate-credentials-to-vault/details)

**Importante:** Esta migração é **idempotente** - pode ser executada múltiplas vezes sem problemas.

#### 2. Verificar Migração

Após executar, verifique se todas foram migradas:
```sql
-- Execute no SQL Editor
SELECT 
  id,
  platform,
  vault_secret_name,
  CASE 
    WHEN vault_secret_name IS NOT NULL THEN '✅ Migrado'
    ELSE '❌ Pendente'
  END as status
FROM integrations;
```

### ⚠️ Ação Necessária (Configuração Manual)
- [ ] Ativar "Leaked Password Protection" no Supabase Dashboard
  - Acesse: https://supabase.com/dashboard/project/bdkdcwfmevyvzxjvmxgt/auth/policies
  - Ative "Check passwords against leaked password database"
  - Nível recomendado: "Medium" ou "High"

### ℹ️ Avisos Informativos (Não Críticos)
- **Extension in Public Schema**: As extensões `pg_cron` e `pg_net` foram instaladas no schema público para funcionalidade de cronjobs. Isso é um aviso informativo, não representa risco de segurança significativo.

### 💡 Melhorias Recomendadas (Opcional)
- [ ] Implementar Supabase Vault para credenciais
- [ ] Ou implementar criptografia application-level
- [ ] Configurar alertas de acesso suspeito
- [ ] Implementar rate limiting nas edge functions
- [ ] Adicionar 2FA para usuários admin

---

## 🔍 Auditoria de Segurança Periódica

**Recomendamos executar esta checklist mensalmente:**

1. **Revisar políticas RLS:**
   ```bash
   # Executar linter do Supabase
   supabase db lint
   ```

2. **Verificar logs de acesso:**
   - Acessos não autorizados
   - Tentativas de força bruta
   - Padrões anormais de uso

3. **Validar credenciais de integração:**
   - Tokens expirados
   - Acessos não utilizados
   - Permissões excessivas

4. **Testar recuperação de desastre:**
   - Backup restaura corretamente?
   - Secrets estão preservados?
   - RLS funciona após restore?

---

## 📞 Suporte

Para questões de segurança, contate:
- Supabase Support: https://supabase.com/dashboard/support/new
- Documentação: https://supabase.com/docs/guides/auth/managing-user-data

---

---

## 🎯 Resumo das Melhorias de Segurança

### Implementado Hoje (2025-01-06)
1. ✅ **Notificações validadas** - Função security definer com validação completa
2. ✅ **Vault obrigatório** - Trigger bloqueia credenciais em plaintext
3. ✅ **Senhas fortes** - Validação Zod com requisitos rigorosos

### Próximos Passos
1. ⚠️ **Migrar credenciais existentes** usando edge function
2. ⚠️ **Ativar Leaked Password Protection** no dashboard
3. 💡 Considerar 2FA para usuários admin

---

**Última atualização:** 2025-01-06
**Versão:** 2.0 (Atualização Crítica de Segurança)
