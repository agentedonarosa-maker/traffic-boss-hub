# 🔐 Guia de Migração para Supabase Vault

## Por que Migrar?

O Supabase Vault fornece armazenamento criptografado para credenciais sensíveis, protegendo contra:
- ✅ SQL Injection
- ✅ Vazamento de backups
- ✅ Acesso não autorizado via console admin
- ✅ Exposição em logs de erro

## Status da Implementação

### O que já foi feito automaticamente:

1. ✅ **Estrutura de Vault implementada**
   - Campo `vault_secret_name` adicionado à tabela `integrations`
   - Edge Functions criadas para gerenciar secrets
   - Todas as novas integrações são automaticamente criptografadas

2. ✅ **Hooks atualizados**
   - `useCreateIntegration`: armazena credenciais no Vault automaticamente
   - `useUpdateIntegration`: atualiza credenciais no Vault de forma segura
   
3. ✅ **Edge Functions de sincronização atualizadas**
   - `sync-meta-ads`: busca credenciais do Vault
   - `sync-google-ads`: busca credenciais do Vault
   - `sync-tiktok-ads`: busca credenciais do Vault

4. ✅ **Segurança adicional**
   - Logs mascarados para prevenir exposição acidental
   - Trigger que alerta ao inserir credenciais em plaintext
   - Validação obrigatória de `user_id` e `client_id`

---

## ⚠️ AÇÃO NECESSÁRIA: Migrar Integrações Existentes

### Passo 1: Executar Migration

Execute a Edge Function de migração **UMA VEZ**:

#### Opção A - Via cURL:
```bash
curl -X POST 'https://bdkdcwfmevyvzxjvmxgt.supabase.co/functions/v1/migrate-credentials-to-vault' \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJka2Rjd2ZtZXZ5dnp4anZteGd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2MzY1ODksImV4cCI6MjA3NDIxMjU4OX0.14AWclcjZAukMlKSCkf934P_gxIMBzjEM6vQF1BwUsE"
```

#### Opção B - Via Supabase Dashboard:
1. Acesse: https://supabase.com/dashboard/project/bdkdcwfmevyvzxjvmxgt/functions/migrate-credentials-to-vault/details
2. Clique em "Invoke function"
3. Deixe o body vazio: `{}`
4. Clique em "Run"

### Passo 2: Verificar Resultado

A função retorna um JSON como:
```json
{
  "success": true,
  "message": "Migration completed",
  "migrated": 5,
  "total": 5,
  "errors": []
}
```

- **migrated**: número de integrações migradas com sucesso
- **total**: número total de integrações encontradas
- **errors**: lista de erros (se houver)

### Passo 3: Validar no Banco de Dados

Execute no SQL Editor:
```sql
SELECT 
  id,
  platform,
  client_id,
  vault_secret_name,
  created_at,
  CASE 
    WHEN vault_secret_name IS NOT NULL THEN '✅ Migrado para Vault'
    WHEN credentials::text = '{}'::text THEN '⚠️ Sem credenciais'
    ELSE '❌ Pendente migração'
  END as status
FROM integrations
ORDER BY created_at DESC;
```

### Passo 4: Testar Sincronizações

Execute as edge functions de sincronização manualmente para garantir que estão funcionando:

```bash
# Testar Meta Ads
curl -X POST 'https://bdkdcwfmevyvzxjvmxgt.supabase.co/functions/v1/sync-meta-ads' \
  -H "Authorization: Bearer SEU_ANON_KEY"

# Testar Google Ads
curl -X POST 'https://bdkdcwfmevyvzxjvmxgt.supabase.co/functions/v1/sync-google-ads' \
  -H "Authorization: Bearer SEU_ANON_KEY"

# Testar TikTok Ads
curl -X POST 'https://bdkdcwfmevyvzxjvmxgt.supabase.co/functions/v1/sync-tiktok-ads' \
  -H "Authorization: Bearer SEU_ANON_KEY"
```

---

## 🔍 Troubleshooting

### Erro: "Failed to retrieve credentials from Vault"

**Causa:** A integração não foi migrada ou o secret não existe no Vault.

**Solução:**
```sql
-- Verificar integração específica
SELECT id, vault_secret_name, credentials 
FROM integrations 
WHERE id = 'ID_DA_INTEGRACAO';

-- Se vault_secret_name for NULL, execute a migração novamente
```

### Erro: "Vault error: secret already exists"

**Causa:** A migração foi executada mais de uma vez (é seguro, mas pode gerar avisos).

**Solução:** Isso é normal! A migração é idempotente. O secret já existe e está funcionando.

### Credenciais ainda aparecem em plaintext

**Causa:** A migração limpou o campo `credentials` mas o cache pode estar desatualizado.

**Solução:**
```sql
-- Forçar limpeza do campo credentials
UPDATE integrations 
SET credentials = '{}'::jsonb 
WHERE vault_secret_name IS NOT NULL;
```

---

## 📊 Auditoria de Segurança

### Verificar se todas as credenciais estão protegidas:

```sql
-- Esta query deve retornar 0 linhas
SELECT 
  id, 
  platform,
  'ALERTA: Credenciais em plaintext!' as warning
FROM integrations
WHERE 
  vault_secret_name IS NULL 
  AND credentials::text != '{}'::text;
```

### Verificar secrets no Vault:

```sql
-- Listar todos os secrets (apenas nomes, não valores)
SELECT name 
FROM vault.secrets 
WHERE name LIKE 'integration_%_credentials'
ORDER BY created_at DESC;
```

---

## 🚀 Próximos Passos

Após a migração estar completa:

1. ✅ **Ativar Leaked Password Protection**
   - Dashboard: https://supabase.com/dashboard/project/bdkdcwfmevyvzxjvmxgt/auth/policies
   - Protege contra senhas comprometidas em vazamentos públicos

2. ✅ **Configurar Rate Limiting**
   - Implementar limites nas Edge Functions para prevenir abuso

3. ✅ **Monitorar Logs**
   - Verificar Edge Function logs regularmente
   - Configurar alertas para erros de autenticação

4. ✅ **Backup dos Secrets**
   - Documentar processo de recuperação de secrets
   - Configurar rotação periódica de credenciais

---

## 📞 Suporte

- **Edge Function Logs**: https://supabase.com/dashboard/project/bdkdcwfmevyvzxjvmxgt/functions
- **SQL Editor**: https://supabase.com/dashboard/project/bdkdcwfmevyvzxjvmxgt/sql/new
- **Documentação Vault**: https://supabase.com/docs/guides/database/vault

---

**Última atualização:** 2025-10-06  
**Versão:** 1.0