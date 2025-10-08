# 🚨 Procedimento de Emergência - Credenciais Expostas

**Guia de resposta rápida para exposição acidental de credenciais no Git**

---

## 📋 Índice

- [Avaliação Inicial](#-avaliação-inicial)
- [Ações Imediatas por Tipo](#-ações-imediatas-por-tipo)
- [Limpeza do Histórico do Git](#-limpeza-do-histórico-do-git)
- [Prevenção Futura](#-prevenção-futura)
- [Checklist de Segurança](#-checklist-de-segurança)

---

## 🔍 Avaliação Inicial

Antes de tomar qualquer ação, responda:

- [ ] **Qual tipo de credencial foi exposta?** (ANON_KEY, SERVICE_ROLE_KEY, tokens de integração)
- [ ] **Foi commitada apenas localmente ou pusheada para repositório remoto?**
- [ ] **O repositório é público ou privado?**
- [ ] **Há quanto tempo a credencial está exposta?**
- [ ] **Quem mais teve acesso ao repositório nesse período?**

### Níveis de Risco

| Credencial Exposta | Risco | Ação |
|-------------------|-------|------|
| `ANON_KEY` / `PUBLISHABLE_KEY` | 🟢 **BAIXO** | Remover do Git apenas |
| `SERVICE_ROLE_KEY` | 🔴 **CRÍTICO** | Regenerar imediatamente + limpar Git |
| Tokens de integração (Meta/Google/TikTok) | 🟠 **ALTO** | Revogar + regenerar + limpar Git |
| Senhas de usuário | 🔴 **CRÍTICO** | Forçar reset de senha + notificar usuário |

---

## ⚡ Ações Imediatas por Tipo

### 1. ANON_KEY Exposta (Risco BAIXO)

**Por que é baixo risco?**
- A ANON_KEY é pública por design e é enviada ao frontend
- Está protegida por Row Level Security (RLS)
- Não permite bypass de permissões

**Ações:**
```bash
# 1. Remover do Git
git rm --cached .env
git commit -m "chore: remove .env from repository"

# 2. Verificar se .env está no .gitignore
echo ".env" >> .gitignore
git add .gitignore
git commit -m "chore: add .env to .gitignore"

# 3. (Opcional) Regenerar no Supabase
# Dashboard > Settings > API > Project API keys > Reset
```

---

### 2. SERVICE_ROLE_KEY Exposta (Risco CRÍTICO)

**⚠️ PERIGO**: Essa chave **bypassa todas as políticas RLS** e dá acesso total ao banco de dados!

**Ações IMEDIATAS:**

#### Passo 1: Regenerar a SERVICE_ROLE_KEY

1. Acesse: [Supabase Dashboard - API Settings](https://supabase.com/dashboard/project/bdkdcwfmevyvzxjvmxgt/settings/api)
2. Localize a seção "Service Role (secret)"
3. Clique em **"Reset service_role secret"**
4. **COPIE A NOVA CHAVE IMEDIATAMENTE** (não será mostrada novamente)

#### Passo 2: Atualizar Edge Functions

Todas as Edge Functions que usam `SUPABASE_SERVICE_ROLE_KEY` precisam ser atualizadas:

```bash
# O Supabase injeta automaticamente as variáveis de ambiente nas Edge Functions
# Após regenerar, as funções já receberão a nova chave na próxima execução

# Verifique quais funções usam SERVICE_ROLE_KEY:
grep -r "SUPABASE_SERVICE_ROLE_KEY" supabase/functions/
```

**Edge Functions afetadas no TrafficPro:**
- ✅ `manage-integration-credentials` - Usa `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `migrate-credentials-to-vault` - Usa `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `sync-all-integrations` - Usa `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `sync-meta-ads` - Usa `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `sync-google-ads` - Usa `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `sync-tiktok-ads` - Usa `SUPABASE_SERVICE_ROLE_KEY`

#### Passo 3: Atualizar Cronjobs (se aplicável)

Se você configurou cronjobs que usam a `SERVICE_ROLE_KEY`:

```sql
-- Atualizar o cronjob de sincronização diária
SELECT cron.unschedule('sync-all-integrations-daily');

SELECT cron.schedule(
  'sync-all-integrations-daily',
  '0 3 * * *',
  $$
  SELECT net.http_post(
    url:='https://bdkdcwfmevyvzxjvmxgt.supabase.co/functions/v1/sync-all-integrations',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer <NOVA_SERVICE_ROLE_KEY>"}'::jsonb
  ) as request_id;
  $$
);
```

#### Passo 4: Limpar o Histórico do Git

**Veja seção: [Limpeza do Histórico do Git](#-limpeza-do-histórico-do-git)**

#### Passo 5: Auditar Acessos

1. Verifique logs de acesso no Supabase Dashboard
2. Procure por atividades suspeitas no período de exposição
3. Considere notificar stakeholders se houver acesso não autorizado

---

### 3. Tokens de Integração Expostos (Risco ALTO)

**Plataformas afetadas:** Meta Ads, Google Ads, TikTok Ads

#### Meta Ads (Facebook/Instagram)

**Credenciais expostas:**
- `access_token` (permanente)
- `app_id`
- `app_secret`
- `ad_account_id`

**Ações:**

1. **Revogar o Access Token:**
   ```bash
   # Usar a Graph API Explorer para revogar
   # https://developers.facebook.com/tools/explorer/
   
   # Ou via curl:
   curl -X DELETE \
     "https://graph.facebook.com/v18.0/me/permissions" \
     -d "access_token=<TOKEN_EXPOSTO>"
   ```

2. **Gerar novo token:**
   - Acesse: [Meta for Developers](https://developers.facebook.com/apps/)
   - Selecione seu app > Tools > Access Token Tool
   - Gere um novo token com as permissões necessárias:
     - `ads_read`
     - `ads_management`
     - `business_management`

3. **Atualizar no TrafficPro:**
   - Interface: Settings > Integrations > Meta Ads > "Editar Credenciais"
   - O sistema armazenará automaticamente no Supabase Vault

4. **Limpar histórico do Git** (veja seção abaixo)

---

#### Google Ads

**Credenciais expostas:**
- `refresh_token`
- `client_id`
- `client_secret`
- `developer_token`
- `customer_id`

**Ações:**

1. **Revogar o Refresh Token:**
   ```bash
   curl -X POST https://oauth2.googleapis.com/revoke \
     -d "token=<REFRESH_TOKEN_EXPOSTO>"
   ```

2. **Regenerar Client Secret:**
   - Acesse: [Google Cloud Console](https://console.cloud.google.com/)
   - Navegue para: APIs & Services > Credentials
   - Localize seu OAuth 2.0 Client ID
   - Clique em "Reset Secret"

3. **Gerar novo Refresh Token:**
   - Use o OAuth Playground ou sua aplicação
   - Solicite novos tokens com os scopes:
     - `https://www.googleapis.com/auth/adwords`

4. **Verificar Developer Token:**
   - Se o `developer_token` foi exposto, considere solicitar um novo no [Google Ads API Center](https://ads.google.com/aw/apicenter)

5. **Atualizar no TrafficPro:**
   - Interface: Settings > Integrations > Google Ads > "Editar Credenciais"

6. **Limpar histórico do Git** (veja seção abaixo)

---

#### TikTok Ads

**Credenciais expostas:**
- `access_token`
- `advertiser_id`

**Ações:**

1. **Revogar o Access Token:**
   - Acesse: [TikTok for Business](https://business.tiktok.com/)
   - Navegue para: Tools > API Access
   - Revogue o token exposto

2. **Gerar novo Access Token:**
   - Siga o fluxo OAuth do TikTok Marketing API
   - Obtenha novo `access_token` e `refresh_token`

3. **Atualizar no TrafficPro:**
   - Interface: Settings > Integrations > TikTok Ads > "Editar Credenciais"

4. **Limpar histórico do Git** (veja seção abaixo)

---

## 🧹 Limpeza do Histórico do Git

### Opção 1: Remover do Último Commit (Simples)

Se você **acabou de commitar** e **ainda não fez push**:

```bash
# Remover arquivo do commit
git reset HEAD~1 .env

# Adicionar .env ao .gitignore
echo ".env" >> .gitignore

# Adicionar .gitignore ao Git
git add .gitignore

# Refazer o commit sem o .env
git commit -m "chore: add .gitignore to protect credentials"
```

---

### Opção 2: Remover do Histórico Completo (Avançado)

Se o arquivo `.env` **já foi pusheado** para o repositório remoto:

#### Método A: Usando `git filter-branch` (Nativo)

```bash
# ⚠️ BACKUP PRIMEIRO!
git clone --mirror https://github.com/seu-usuario/trafficpro.git trafficpro-backup

# Remover .env de todo o histórico
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Forçar push (⚠️ cuidado - reescreve histórico)
git push origin --force --all
git push origin --force --tags

# Limpar cache local
rm -rf .git/refs/original/
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

#### Método B: Usando BFG Repo-Cleaner (Recomendado)

**Mais rápido e seguro que `filter-branch`**

1. **Instale o BFG:**
   ```bash
   # macOS
   brew install bfg
   
   # Linux/Windows - Download do JAR
   # https://rtyley.github.io/bfg-repo-cleaner/
   ```

2. **Clone o repositório como mirror:**
   ```bash
   git clone --mirror https://github.com/seu-usuario/trafficpro.git
   ```

3. **Execute o BFG:**
   ```bash
   # Remover o arquivo .env
   bfg --delete-files .env trafficpro.git
   
   # OU remover por padrão (mais seguro)
   bfg --delete-files '*.env' trafficpro.git
   ```

4. **Limpar e fazer push:**
   ```bash
   cd trafficpro.git
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   git push --force
   ```

---

### Opção 3: Criar Novo Repositório (Mais Seguro)

Se o repositório é **público** e houve exposição de credenciais críticas:

```bash
# 1. Criar backup local
cp -r trafficpro trafficpro-backup

# 2. Remover histórico Git
cd trafficpro
rm -rf .git

# 3. Inicializar novo repositório
git init
git add .
git commit -m "chore: initial commit with secure credentials"

# 4. Criar novo repositório no GitHub/GitLab
# (use a interface web)

# 5. Conectar e fazer push
git remote add origin https://github.com/seu-usuario/trafficpro-new.git
git push -u origin main

# 6. Arquivar ou deletar o repositório antigo
```

---

## 🛡️ Prevenção Futura

### 1. Configurar `.gitignore` Corretamente

Adicione ao `.gitignore`:

```gitignore
# Environment variables
.env
.env.local
.env.*.local
.env.production

# Backup files
*.backup
*.bak
*.tmp

# Logs que podem conter credenciais
logs/
*.log

# Configurações locais
.vscode/settings.json
.idea/workspace.xml
```

### 2. Usar Pre-commit Hooks

Instale verificação automática antes de cada commit:

```bash
# Instalar pre-commit (Python)
pip install pre-commit

# Criar .pre-commit-config.yaml
cat > .pre-commit-config.yaml << EOF
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: check-added-large-files
      - id: detect-private-key
      - id: check-yaml
      - id: end-of-file-fixer

  - repo: https://github.com/Yelp/detect-secrets
    rev: v1.4.0
    hooks:
      - id: detect-secrets
        args: ['--baseline', '.secrets.baseline']
EOF

# Instalar hooks
pre-commit install

# Gerar baseline (primeira vez)
detect-secrets scan > .secrets.baseline
```

### 3. Usar Supabase Vault para TUDO

**Nunca armazene credenciais em:**
- ❌ Arquivos `.env` commitados
- ❌ Código-fonte (hardcoded)
- ❌ Campos JSONB da tabela `integrations`

**Sempre use:**
- ✅ Supabase Vault para credenciais sensíveis
- ✅ Edge Functions para acessar o Vault
- ✅ Mascaramento automático em logs (`src/lib/security.ts`)

### 4. Auditar Código Regularmente

```bash
# Procurar por credenciais hardcoded
grep -r "password\|secret\|api_key\|token" . --exclude-dir={node_modules,.git,dist}

# Usar ferramentas de análise
npm install -g git-secrets
git secrets --scan
```

### 5. Documentar Políticas de Segurança

- Mantenha `DOCS/SECURITY.md` atualizado
- Treine a equipe sobre boas práticas
- Revise permissões de acesso ao repositório regularmente

---

## ✅ Checklist de Segurança

Após resolver a exposição, verifique:

### Imediato
- [ ] Credenciais expostas foram regeneradas
- [ ] `.env` foi removido do Git (histórico limpo)
- [ ] `.env` está no `.gitignore`
- [ ] Edge Functions foram atualizadas (se necessário)
- [ ] Tokens de integração foram revogados e regenerados
- [ ] Cronjobs foram atualizados com novas credenciais

### Curto Prazo (24-48h)
- [ ] Logs de acesso foram auditados
- [ ] Nenhuma atividade suspeita foi detectada
- [ ] Stakeholders foram notificados (se necessário)
- [ ] Repositório foi verificado por outras exposições

### Longo Prazo
- [ ] Pre-commit hooks instalados
- [ ] Equipe treinada sobre segurança de credenciais
- [ ] Política de rotação de credenciais implementada
- [ ] Documentação de segurança revisada

---

## 📚 Recursos Adicionais

- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth/row-level-security)
- [GitHub: Removing sensitive data from a repository](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [OWASP: Credential Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Credential_Storage_Cheat_Sheet.html)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)

---

## 🆘 Suporte

Se você precisar de ajuda adicional:

1. **Comunidade TrafficPro**: [Discord/Slack]
2. **Supabase Support**: [support@supabase.com](mailto:support@supabase.com)
3. **Segurança Crítica**: [security@trafficpro.com](mailto:security@trafficpro.com)

---

**Última Atualização**: 2025-01-XX  
**Versão**: 1.0.0
