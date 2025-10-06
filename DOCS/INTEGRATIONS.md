# 🔌 Guia de Integrações - TrafficPro

## Visão Geral

O TrafficPro sincroniza automaticamente métricas de campanhas das seguintes plataformas:
- **Meta Ads** (Facebook & Instagram)
- **Google Ads**
- **TikTok Ads**

As métricas são sincronizadas **diariamente às 3:00 AM** via cronjob automático.

---

## 📱 Meta Ads (Facebook & Instagram)

### Pré-requisitos
1. Conta Business Manager do Facebook
2. App criado no Facebook Developers
3. Permissões de leitura de anúncios

### Obter Credenciais

#### 1. Criar App no Facebook Developers
1. Acesse: https://developers.facebook.com/apps
2. Clique em **"Create App"**
3. Escolha tipo: **"Business"**
4. Preencha nome do app e email de contato
5. Após criar, vá em **Settings > Basic** e copie:
   - App ID
   - App Secret

#### 2. Gerar Access Token
1. Vá em **Tools > Graph API Explorer**
2. Selecione seu App
3. Clique em **"Get Token" > "Get User Access Token"**
4. Marque as permissões:
   - `ads_read`
   - `ads_management`
   - `business_management`
5. Clique em **"Generate Access Token"**
6. Copie o token gerado

#### 3. Obter Ad Account ID
1. Acesse: https://business.facebook.com/settings/ad-accounts
2. Clique na conta de anúncios desejada
3. O ID está no formato: `act_XXXXXXXXXX`
4. Use o ID **COM** o prefixo `act_`

#### 4. Tornar Token Permanente (Importante!)
O token gerado no Graph API Explorer expira em 1-2 horas. Para torná-lo permanente:

1. Acesse:
```
https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=SEU_APP_ID&client_secret=SEU_APP_SECRET&fb_exchange_token=SEU_TOKEN_CURTO
```

2. Substitua:
   - `SEU_APP_ID`: App ID do seu app
   - `SEU_APP_SECRET`: App Secret do seu app
   - `SEU_TOKEN_CURTO`: Token gerado no Graph API Explorer

3. A resposta será um JSON com `access_token` (válido por 60 dias)

4. Para obter um token que nunca expira, você precisa de um **System User Token**:
   - Vá em Business Settings > Users > System Users
   - Crie um System User
   - Gere um token com as permissões necessárias
   - Este token não expira!

### Cadastrar no TrafficPro

1. Acesse **Settings > Integrações**
2. Clique em **"+ Nova Integração"**
3. Selecione plataforma: **Meta Ads**
4. Preencha:
   - **Cliente**: Selecione o cliente
   - **Access Token**: Cole o token permanente
   - **Ad Account ID**: Cole o ID (formato: `act_XXXXXXXXXX`)
5. Clique em **"Salvar"**

### Métricas Sincronizadas
- Impressões
- Cliques
- Investimento (spend)
- Leads (conversões tipo "lead")
- Vendas (conversões tipo "purchase")
- Receita (valor das vendas)
- CTR (calculado)
- CPL (calculado)
- ROAS (calculado)

### Solução de Problemas

**Erro: "Invalid OAuth access token"**
- Token expirado. Gere um novo token permanente.

**Erro: "Unsupported get request"**
- Ad Account ID incorreto. Verifique se está no formato `act_XXXXXXXXXX`.

**Erro: "Permissions error"**
- Faltam permissões. Revise as permissões do token no Graph API Explorer.

---

## 🔍 Google Ads

### Pré-requisitos
1. Conta Google Ads ativa
2. Google Cloud Project
3. API Google Ads habilitada
4. Developer Token aprovado

### Obter Credenciais

#### 1. Criar Projeto no Google Cloud
1. Acesse: https://console.cloud.google.com
2. Crie um novo projeto
3. Habilite a **Google Ads API**:
   - Menu > APIs & Services > Library
   - Busque "Google Ads API"
   - Clique em **"Enable"**

#### 2. Criar Credenciais OAuth
1. Menu > APIs & Services > Credentials
2. Clique em **"Create Credentials" > "OAuth client ID"**
3. Configure tela de consentimento se necessário
4. Tipo de aplicativo: **Web application**
5. Adicione Redirect URI: `https://developers.google.com/oauthplayground`
6. Copie:
   - **Client ID**
   - **Client Secret**

#### 3. Gerar Refresh Token
1. Acesse: https://developers.google.com/oauthplayground
2. Clique no ⚙️ (settings) e marque **"Use your own OAuth credentials"**
3. Cole Client ID e Client Secret
4. Na lista de APIs, busque **"Google Ads API v16"**
5. Selecione o escopo: `https://www.googleapis.com/auth/adwords`
6. Clique em **"Authorize APIs"**
7. Faça login com a conta Google Ads
8. Clique em **"Exchange authorization code for tokens"**
9. Copie o **Refresh token**

#### 4. Obter Developer Token
1. Acesse Google Ads: https://ads.google.com
2. Clique em **Tools > API Center**
3. Solicite um Developer Token
4. **IMPORTANTE**: Você precisa de aprovação do Google (pode levar dias/semanas)
5. Para testes, use o token em modo de teste (limitações aplicam)

#### 5. Obter Customer ID
1. No Google Ads, clique no ícone de ajuda (?)
2. O Customer ID aparece no topo (formato: `123-456-7890`)
3. Use **SEM** os hífens: `1234567890`

### Cadastrar no TrafficPro

1. Acesse **Settings > Integrações**
2. Clique em **"+ Nova Integração"**
3. Selecione plataforma: **Google Ads**
4. Preencha:
   - **Cliente**: Selecione o cliente
   - **Refresh Token**: Cole o refresh token
   - **Client ID**: Cole o OAuth Client ID
   - **Client Secret**: Cole o OAuth Client Secret
   - **Customer ID**: Cole o ID (formato: `1234567890`)
   - **Developer Token**: Cole o developer token
5. Clique em **"Salvar"**

### Métricas Sincronizadas
- Impressões
- Cliques
- Investimento (cost)
- Conversões (conversions)
- Valor das conversões (conversions_value)
- CTR (calculado)
- CPL (calculado)
- ROAS (calculado)

### Solução de Problemas

**Erro: "Developer token is not approved"**
- Token em modo de teste ou não aprovado. Solicite aprovação no API Center.

**Erro: "Authentication error"**
- Refresh token expirado ou inválido. Gere um novo no OAuth Playground.

**Erro: "Customer ID not found"**
- Customer ID incorreto. Verifique se está sem hífens.

---

## 🎵 TikTok Ads

### Pré-requisitos
1. Conta TikTok Business Center
2. App criado no TikTok for Business
3. Acesso ao Advertiser Account

### Obter Credenciais

#### 1. Criar App no TikTok for Business
1. Acesse: https://business-api.tiktok.com
2. Clique em **"Get Started"**
3. Crie um novo app em **"Developer Portal"**
4. Preencha informações do app
5. Após criar, vá em **App Details**

#### 2. Gerar Access Token
1. No Developer Portal, vá em **Authorization**
2. Clique em **"Generate Token"**
3. Selecione os escopos necessários:
   - `Ads Management - Read`
   - `Reporting - Read`
4. Selecione o Advertiser Account
5. Copie o **Access Token** gerado

#### 3. Obter Advertiser ID
1. Acesse TikTok Ads Manager: https://ads.tiktok.com
2. O Advertiser ID aparece no topo da página (formato: `1234567890123456`)
3. Ou em **Profile > Business Center > Advertiser Account**

### Cadastrar no TrafficPro

1. Acesse **Settings > Integrações**
2. Clique em **"+ Nova Integração"**
3. Selecione plataforma: **TikTok Ads**
4. Preencha:
   - **Cliente**: Selecione o cliente
   - **Access Token**: Cole o token gerado
   - **Advertiser ID**: Cole o ID da conta de anúncios
5. Clique em **"Salvar"**

### Métricas Sincronizadas
- Impressões
- Cliques
- Investimento (spend)
- Conversões (conversion)
- Valor de compras (total_onsite_shopping_value)
- CTR (calculado)
- CPL (calculado)
- ROAS (calculado)

### Solução de Problemas

**Erro: "Invalid access token"**
- Token expirado ou revogado. Gere um novo no Developer Portal.

**Erro: "Advertiser not found"**
- Advertiser ID incorreto. Verifique o ID no Ads Manager.

**Erro: "Permission denied"**
- Escopos insuficientes. Regere o token com os escopos corretos.

---

## ⚙️ Sincronização Automática

### Como Funciona
- **Cronjob diário** às 3:00 AM (horário do servidor Supabase)
- Edge function `sync-all-integrations` é chamada automaticamente
- Esta função chama sequencialmente:
  1. `sync-meta-ads`
  2. `sync-google-ads`
  3. `sync-tiktok-ads`
- Cada função:
  - Busca integrações ativas
  - Faz chamadas às APIs externas
  - Salva métricas na tabela `campaign_metrics`
  - Atualiza `last_sync_at`

### Sincronização Manual
Você pode forçar sincronização manual chamando as edge functions:

```bash
# Sincronizar todas as plataformas
curl -X POST https://bdkdcwfmevyvzxjvmxgt.supabase.co/functions/v1/sync-all-integrations

# Sincronizar apenas Meta Ads
curl -X POST https://bdkdcwfmevyvzxjvmxgt.supabase.co/functions/v1/sync-meta-ads

# Sincronizar apenas Google Ads
curl -X POST https://bdkdcwfmevyvzxjvmxgt.supabase.co/functions/v1/sync-google-ads

# Sincronizar apenas TikTok Ads
curl -X POST https://bdkdcwfmevyvzxjvmxgt.supabase.co/functions/v1/sync-tiktok-ads
```

### Verificar Status
1. Acesse Supabase Dashboard:
   - https://supabase.com/dashboard/project/bdkdcwfmevyvzxjvmxgt/functions/sync-all-integrations/logs
2. Veja logs em tempo real das sincronizações
3. Verifique `last_sync_at` na tabela `integrations`

### Alterar Horário do Cronjob
Se quiser alterar o horário de sincronização:

```sql
-- Remover cronjob existente
SELECT cron.unschedule('sync-all-integrations-daily');

-- Criar novo cronjob (exemplo: 5:30 AM)
SELECT cron.schedule(
  'sync-all-integrations-daily',
  '30 5 * * *', -- Min Hora Dia Mês DiaSemana
  $$
  SELECT net.http_post(
    url:='https://bdkdcwfmevyvzxjvmxgt.supabase.co/functions/v1/sync-all-integrations',
    headers:='{"Content-Type": "application/json"}'::jsonb
  );
  $$
);
```

---

## 🔒 Segurança

### Armazenamento de Credenciais
⚠️ **IMPORTANTE**: As credenciais são armazenadas em **formato JSONB** na tabela `integrations`.

**Recomendações de segurança:**
1. **RLS está ativado**: Apenas o dono do cliente pode ver/editar integrações
2. **Nunca logar credenciais completas** no código
3. **Considerar implementar Supabase Vault** para criptografia adicional (veja DOCS/SECURITY.md)

### Rotação de Tokens
**Meta Ads:**
- Tokens permanentes (System User) não expiram
- Revisar permissões a cada 3 meses

**Google Ads:**
- Refresh tokens não expiram (a menos que sejam revogados)
- Renovar se houver erro de autenticação

**TikTok Ads:**
- Tokens expiram em 365 dias
- Configurar alerta 30 dias antes do vencimento

---

## 📊 Métricas Disponíveis

Todas as plataformas sincronizam:

| Métrica | Descrição |
|---------|-----------|
| **impressions** | Número de vezes que o anúncio foi exibido |
| **clicks** | Número de cliques no anúncio |
| **investment** | Valor gasto na campanha (R$) |
| **leads** | Número de conversões/leads gerados |
| **sales** | Número de vendas realizadas |
| **revenue** | Receita total gerada (R$) |
| **ctr** | Click-Through Rate (%) = (clicks / impressions) × 100 |
| **cpl** | Custo Por Lead (R$) = investment / leads |
| **roas** | Return on Ad Spend = revenue / investment |

---

## 🆘 Suporte

### Links Úteis
- **Meta Ads API**: https://developers.facebook.com/docs/marketing-apis
- **Google Ads API**: https://developers.google.com/google-ads/api/docs/start
- **TikTok Ads API**: https://business-api.tiktok.com/portal/docs

### Monitoramento
- **Edge Function Logs**: https://supabase.com/dashboard/project/bdkdcwfmevyvzxjvmxgt/functions
- **Cronjobs Ativos**: Execute `SELECT * FROM cron.job;` no SQL Editor

### Dicas
1. Sempre teste a integração após cadastrar
2. Verifique logs das edge functions para erros
3. Mantenha tokens atualizados
4. Configure alertas para falhas de sincronização

---

**Última atualização:** 2025-10-06
**Versão:** 1.0
