# TrafficPro

<div align="center">

![TrafficPro Logo](https://lovable.dev/projects/d707b2cd-02af-4bd8-b170-ae2153e7654c)

**Plataforma Profissional de Gestão de Campanhas de Marketing Digital**

[![License](https://img.shields.io/badge/license-Proprietary-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.x-3ECF8E?logo=supabase)](https://supabase.com/)

</div>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Integrações](#-integrações)
- [Segurança](#-segurança)
- [Deployment](#-deployment)
- [Documentação Adicional](#-documentação-adicional)
- [Suporte](#-suporte)
- [Licença](#-licença)

---

## 🚀 Sobre o Projeto

**TrafficPro** é uma plataforma completa de gestão de campanhas de marketing digital que centraliza e otimiza o gerenciamento de anúncios em múltiplas plataformas publicitárias. Desenvolvida com tecnologias modernas e foco em segurança, a solução oferece integração nativa com as principais plataformas de anúncios do mercado.

### Objetivo

Proporcionar a agências e profissionais de marketing uma ferramenta poderosa para:
- Centralizar dados de campanhas de diferentes plataformas
- Automatizar sincronização de métricas
- Gerar relatórios profissionais e personalizados
- Gerenciar clientes e contratos de forma eficiente
- Monitorar performance em tempo real

---

## ✨ Funcionalidades

### Dashboard Inteligente
- **Visão Geral de Métricas**: Acompanhe investimento, impressões, cliques, leads, vendas e ROAS em tempo real
- **Gráficos Interativos**: Visualização de dados com gráficos responsivos e interativos
- **Filtros Personalizados**: Filtre dados por cliente, campanha, período e plataforma

### Gestão de Clientes
- **Cadastro Completo**: Registre informações detalhadas de clientes
- **Portal do Cliente**: Acesso exclusivo para clientes visualizarem suas campanhas
- **Contratos Digitais**: Envio e gerenciamento de contratos via email
- **Tokens de Acesso**: Sistema seguro de autenticação para clientes

### Campanhas
- **Criação e Edição**: Interface intuitiva para gerenciar campanhas
- **Métricas Detalhadas**: Acompanhe todas as métricas importantes por campanha
- **Histórico Completo**: Visualize o histórico de performance ao longo do tempo
- **Status e Tags**: Organize campanhas com status e categorias personalizadas

### Integrações de Anúncios
- **Meta Ads (Facebook/Instagram)**: Sincronização automática de campanhas, métricas e custos
- **Google Ads**: Integração completa via API oficial
- **TikTok Ads**: Sincronização de dados de campanhas TikTok
- **Sincronização Automática**: Cronjobs diários para atualização de dados
- **Credenciais Seguras**: Armazenamento criptografado via Supabase Vault

### Calendário e Reuniões
- **Agendamento de Reuniões**: Organize reuniões com clientes
- **Visualização de Calendário**: Interface de calendário intuitiva
- **Tarefas de Otimização**: Gerencie tarefas de otimização de campanhas
- **Notificações**: Alertas para reuniões e tarefas importantes

### Relatórios Profissionais
- **Geração Automática**: Crie relatórios detalhados em PDF
- **Personalização**: Escolha métricas, períodos e clientes
- **Design Profissional**: Relatórios com layout profissional e branding
- **Exportação**: Exporte relatórios em PDF para compartilhamento

### Sistema de Notificações
- **Notificações em Tempo Real**: Alertas sobre eventos importantes
- **Central de Notificações**: Visualize todas as notificações em um só lugar
- **Marcação de Leitura**: Gerencie notificações lidas e não lidas

### Autenticação e Segurança
- **Autenticação Segura**: Sistema de login com Supabase Auth
- **Controle de Acesso**: Diferentes níveis de permissão para usuários
- **Proteção de Dados**: RLS (Row Level Security) implementado em todas as tabelas
- **Criptografia**: Credenciais sensíveis armazenadas no Supabase Vault

---

## 🛠 Tecnologias Utilizadas

### Frontend
- **[React 18.3.1](https://reactjs.org/)** - Biblioteca JavaScript para interfaces de usuário
- **[TypeScript](https://www.typescriptlang.org/)** - Superset tipado de JavaScript
- **[Vite](https://vitejs.dev/)** - Build tool rápido e moderno
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS utility-first
- **[shadcn/ui](https://ui.shadcn.com/)** - Componentes React reutilizáveis e acessíveis
- **[React Router DOM](https://reactrouter.com/)** - Roteamento para aplicações React
- **[React Hook Form](https://react-hook-form.com/)** - Gerenciamento de formulários
- **[Zod](https://zod.dev/)** - Validação de schemas TypeScript-first
- **[TanStack Query](https://tanstack.com/query)** - Gerenciamento de estado e cache de dados
- **[Recharts](https://recharts.org/)** - Biblioteca de gráficos para React
- **[date-fns](https://date-fns.org/)** - Biblioteca moderna de manipulação de datas
- **[Lucide React](https://lucide.dev/)** - Ícones SVG bonitos e consistentes

### Backend & Infraestrutura
- **[Supabase](https://supabase.com/)** - Backend as a Service (BaaS)
  - PostgreSQL Database
  - Authentication
  - Row Level Security (RLS)
  - Edge Functions
  - Vault (armazenamento seguro de secrets)
- **[jsPDF](https://github.com/parallax/jsPDF)** - Geração de PDFs no client-side

### Ferramentas de Desenvolvimento
- **ESLint** - Linting de código JavaScript/TypeScript
- **PostCSS** - Processamento de CSS
- **Bun** - Runtime JavaScript e gerenciador de pacotes

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18.x ou superior) - [Download](https://nodejs.org/)
- **npm** (geralmente vem com Node.js) ou **[Bun](https://bun.sh/)**
- **Git** - [Download](https://git-scm.com/)
- Conta no **[Supabase](https://supabase.com/)** (para configuração do backend)

---

## 🔧 Instalação

### 1. Clone o Repositório

```bash
# Clone o repositório
git clone <URL_DO_REPOSITORIO>

# Navegue até o diretório do projeto
cd trafficpro
```

### 2. Instale as Dependências

```bash
# Usando npm
npm install

# OU usando Bun (mais rápido)
bun install
```

### 3. Configure as Variáveis de Ambiente

⚠️ **ATENÇÃO: Segurança de Credenciais**

1. **Copie o arquivo de exemplo:**
   ```bash
   cp .env.example .env
   ```

2. **Preencha as credenciais:**
   - As credenciais do Supabase estão disponíveis no [Dashboard do Supabase](https://supabase.com/dashboard/project/bdkdcwfmevyvzxjvmxgt/settings/api)
   - **Nota Importante**: O arquivo `src/integrations/supabase/client.ts` já contém as credenciais públicas (ANON_KEY) hardcoded para facilitar o desenvolvimento

3. **⚠️ NÃO COMMITE O ARQUIVO `.env`**
   - O `.env` está protegido pelo `.gitignore`
   - Nunca adicione credenciais sensíveis ao repositório Git
   - Use apenas `.env.example` para documentar variáveis necessárias

#### 🔒 Tipos de Credenciais

| Tipo | Segurança | Uso | Observação |
|------|-----------|-----|------------|
| `ANON_KEY` / `PUBLISHABLE_KEY` | ✅ Pública | Frontend | Já hardcoded no código |
| `SERVICE_ROLE_KEY` | 🔴 **SECRETA** | Backend/Edge Functions | **NUNCA expor no frontend** |
| Tokens de integração (Meta/Google/TikTok) | 🔴 **SECRETOS** | Edge Functions | Armazenados criptografados no Supabase Vault |

**Credenciais de integrações** são automaticamente armazenadas de forma criptografada no **Supabase Vault** quando você configura uma integração pela interface do sistema.

📖 **Leia mais sobre segurança**: [DOCS/SECURITY.md](DOCS/SECURITY.md)

### 4. Inicie o Servidor de Desenvolvimento

```bash
# Usando npm
npm run dev

# OU usando Bun
bun run dev
```

O projeto estará disponível em: **http://localhost:5173**

---

## ⚙️ Configuração

### Configuração do Supabase

O projeto utiliza um projeto Supabase externo já configurado. As principais configurações incluem:

#### 1. Database Schema

O banco de dados possui as seguintes tabelas principais:
- `clients` - Cadastro de clientes
- `campaigns` - Campanhas de marketing
- `metrics` - Métricas de campanhas
- `integrations` - Integrações com plataformas de anúncios
- `meetings` - Agendamento de reuniões
- `tasks` - Tarefas de otimização
- `notifications` - Sistema de notificações
- `reports` - Relatórios gerados

#### 2. Row Level Security (RLS)

Todas as tabelas possuem políticas RLS implementadas para garantir que:
- Usuários só acessem seus próprios dados
- Clientes só visualizem suas próprias informações no portal
- Credenciais sensíveis sejam protegidas

#### 3. Edge Functions

O projeto utiliza Edge Functions para:
- **`sync-all-integrations`** - Sincronização automática de todas as integrações
- **`sync-meta-ads`** - Sincronização específica do Meta Ads
- **`sync-google-ads`** - Sincronização específica do Google Ads
- **`sync-tiktok-ads`** - Sincronização específica do TikTok Ads
- **`send-contract`** - Envio de contratos por email
- **`validate-client-token`** - Validação de tokens de acesso de clientes
- **`manage-integration-credentials`** - Gerenciamento de credenciais no Vault
- **`migrate-credentials-to-vault`** - Migração de credenciais para o Vault

#### 4. Cronjobs Automáticos

Um cronjob está configurado para executar diariamente às 03:00 (UTC):
```sql
-- Sincronização automática diária
SELECT cron.schedule(
  'sync-all-integrations-daily',
  '0 3 * * *',
  $$
  SELECT net.http_post(
    url:='https://bdkdcwfmevyvzxjvmxgt.supabase.co/functions/v1/sync-all-integrations',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer <service_role_key>"}'::jsonb
  ) as request_id;
  $$
);
```

---

## 📁 Estrutura do Projeto

```
trafficpro/
├── DOCS/                           # Documentação técnica
│   ├── INTEGRATIONS.md            # Guia de integrações
│   ├── SECURITY.md                # Documentação de segurança
│   └── VAULT-MIGRATION.md         # Guia de migração para Vault
├── public/                         # Arquivos públicos estáticos
│   ├── robots.txt                 # Configuração para crawlers
│   └── ...
├── src/
│   ├── components/                # Componentes React
│   │   ├── auth/                  # Componentes de autenticação
│   │   │   └── ProtectedRoute.tsx
│   │   ├── calendar/              # Componentes de calendário
│   │   │   ├── CalendarView.tsx
│   │   │   ├── MeetingForm.tsx
│   │   │   ├── OptimizationTasks.tsx
│   │   │   └── UpcomingMeetings.tsx
│   │   ├── campaigns/             # Componentes de campanhas
│   │   │   └── CampaignForm.tsx
│   │   ├── clients/               # Componentes de clientes
│   │   │   └── ClientForm.tsx
│   │   ├── dashboard/             # Componentes do dashboard
│   │   │   └── MetricCard.tsx
│   │   ├── layout/                # Componentes de layout
│   │   │   ├── AppLayout.tsx
│   │   │   ├── AppSidebar.tsx
│   │   │   └── NotificationsPopover.tsx
│   │   ├── reports/               # Componentes de relatórios
│   │   │   ├── ReportGenerator.tsx
│   │   │   └── ReportView.tsx
│   │   └── ui/                    # Componentes UI (shadcn/ui)
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       └── ... (50+ componentes)
│   ├── contexts/                  # Contextos React
│   │   └── AuthContext.tsx        # Contexto de autenticação
│   ├── hooks/                     # Custom React Hooks
│   │   ├── useCampaigns.ts        # Hook para campanhas
│   │   ├── useClients.ts          # Hook para clientes
│   │   ├── useIntegrations.ts     # Hook para integrações
│   │   ├── useMeetings.ts         # Hook para reuniões
│   │   ├── useNotifications.ts    # Hook para notificações
│   │   └── ... (30+ hooks)
│   ├── integrations/              # Integrações externas
│   │   └── supabase/
│   │       ├── client.ts          # Cliente Supabase
│   │       └── types.ts           # Tipos TypeScript gerados
│   ├── lib/                       # Utilitários e bibliotecas
│   │   ├── pdfExport.ts           # Geração de PDFs
│   │   ├── security.ts            # Funções de segurança
│   │   ├── utils.ts               # Funções utilitárias
│   │   └── validations/           # Schemas de validação Zod
│   │       ├── campaign.ts
│   │       ├── client.ts
│   │       ├── meeting.ts
│   │       ├── metric.ts
│   │       └── task.ts
│   ├── pages/                     # Páginas da aplicação
│   │   ├── Auth.tsx               # Página de login/registro
│   │   ├── Calendar.tsx           # Página de calendário
│   │   ├── Campaigns.tsx          # Página de campanhas
│   │   ├── ClientPortal.tsx       # Portal do cliente
│   │   ├── Clients.tsx            # Página de clientes
│   │   ├── Dashboard.tsx          # Dashboard principal
│   │   ├── Index.tsx              # Página inicial
│   │   ├── NotFound.tsx           # Página 404
│   │   ├── Onboarding.tsx         # Página de onboarding
│   │   ├── Reports.tsx            # Página de relatórios
│   │   ├── Settings.tsx           # Configurações
│   │   └── Terms.tsx              # Termos de uso
│   ├── App.tsx                    # Componente raiz da aplicação
│   ├── App.css                    # Estilos globais
│   ├── index.css                  # Estilos e tokens do design system
│   ├── main.tsx                   # Ponto de entrada da aplicação
│   └── vite-env.d.ts              # Tipos do Vite
├── supabase/                      # Configuração Supabase
│   ├── config.toml                # Configuração do projeto
│   ├── functions/                 # Edge Functions
│   │   ├── manage-integration-credentials/
│   │   ├── migrate-credentials-to-vault/
│   │   ├── send-contract/
│   │   ├── sync-all-integrations/
│   │   ├── sync-google-ads/
│   │   ├── sync-meta-ads/
│   │   ├── sync-tiktok-ads/
│   │   └── validate-client-token/
│   └── migrations/                # Migrações do banco de dados
├── .gitignore                     # Arquivos ignorados pelo Git
├── components.json                # Configuração shadcn/ui
├── eslint.config.js               # Configuração ESLint
├── index.html                     # HTML principal
├── package.json                   # Dependências do projeto
├── postcss.config.js              # Configuração PostCSS
├── README.md                      # Este arquivo
├── tailwind.config.ts             # Configuração Tailwind CSS
├── tsconfig.json                  # Configuração TypeScript
└── vite.config.ts                 # Configuração Vite
```

---

## 🔌 Integrações

### Meta Ads (Facebook/Instagram)

Sincronize dados de campanhas do Facebook e Instagram Ads.

**Credenciais Necessárias:**
- App ID
- App Secret
- Access Token (permanente)
- Ad Account ID

**Métricas Sincronizadas:**
- Impressões
- Cliques
- Investimento
- Leads
- Vendas
- Receita
- CTR, CPL, ROAS

📖 **[Guia Completo de Integração Meta Ads](DOCS/INTEGRATIONS.md#meta-ads-integration)**

---

### Google Ads

Integração completa com a API do Google Ads.

**Credenciais Necessárias:**
- Client ID
- Client Secret
- Refresh Token
- Developer Token
- Customer ID

**Métricas Sincronizadas:**
- Impressões
- Cliques
- Investimento
- Conversões
- CTR, CPC, CPA

📖 **[Guia Completo de Integração Google Ads](DOCS/INTEGRATIONS.md#google-ads-integration)**

---

### TikTok Ads

Sincronize campanhas da plataforma TikTok for Business.

**Credenciais Necessárias:**
- Access Token
- Advertiser ID

**Métricas Sincronizadas:**
- Impressões
- Cliques
- Investimento
- Conversões
- CTR, CPC, CVR

📖 **[Guia Completo de Integração TikTok Ads](DOCS/INTEGRATIONS.md#tiktok-ads-integration)**

---

### Sincronização Manual

Para testar ou forçar sincronizações manualmente:

```bash
# Sincronizar todas as integrações
curl -X POST \
  https://bdkdcwfmevyvzxjvmxgt.supabase.co/functions/v1/sync-all-integrations \
  -H "Authorization: Bearer <anon_key>"

# Sincronizar apenas Meta Ads
curl -X POST \
  https://bdkdcwfmevyvzxjvmxgt.supabase.co/functions/v1/sync-meta-ads \
  -H "Authorization: Bearer <anon_key>"

# Sincronizar apenas Google Ads
curl -X POST \
  https://bdkdcwfmevyvzxjvmxgt.supabase.co/functions/v1/sync-google-ads \
  -H "Authorization: Bearer <anon_key>"

# Sincronizar apenas TikTok Ads
curl -X POST \
  https://bdkdcwfmevyvzxjvmxgt.supabase.co/functions/v1/sync-tiktok-ads \
  -H "Authorization: Bearer <anon_key>"
```

---

## 🔐 Segurança

### Armazenamento Seguro de Credenciais

O TrafficPro utiliza **Supabase Vault** para armazenamento criptografado de credenciais sensíveis:

✅ **Implementado:**
- Credenciais de integrações armazenadas no Vault
- Edge Functions acessam credenciais via Vault
- Mascaramento automático de dados sensíveis em logs
- RLS habilitado em todas as tabelas

### Proteção de Dados de Clientes

- **RLS (Row Level Security)**: Cada usuário só acessa seus próprios dados
- **Validação de Tokens**: Tokens de cliente validados via Edge Function
- **Portal Isolado**: Clientes só visualizam suas próprias campanhas

### Autenticação

- **Supabase Auth**: Sistema de autenticação robusto
- **Proteção de Rotas**: Rotas protegidas com `ProtectedRoute`
- **Sessões Seguras**: Gerenciamento automático de sessões

### Migração de Credenciais

Para migrar credenciais existentes para o Vault:

```bash
curl -X POST \
  https://bdkdcwfmevyvzxjvmxgt.supabase.co/functions/v1/migrate-credentials-to-vault \
  -H "Authorization: Bearer <service_role_key>"
```

📖 **[Guia Completo de Segurança](DOCS/SECURITY.md)**
📖 **[Guia de Migração para Vault](DOCS/VAULT-MIGRATION.md)**

---

## 🚀 Deployment

### Deploy via Lovable

O projeto está hospedado no **Lovable** e pode ser publicado facilmente:

1. Acesse o [Projeto no Lovable](https://lovable.dev/projects/d707b2cd-02af-4bd8-b170-ae2153e7654c)
2. Clique no botão **"Publish"** no canto superior direito
3. Configure seu domínio personalizado em **Settings > Domains**

**URL do Projeto:** https://lovable.dev/projects/d707b2cd-02af-4bd8-b170-ae2153e7654c

### Deploy Manual

Para deploy em outras plataformas (Vercel, Netlify, etc.):

```bash
# Build do projeto
npm run build

# O output estará na pasta dist/
```

### Deploy em VPS Self-Hosted

Para hospedar o TrafficPro em seu próprio servidor VPS (Ubuntu/Debian):

#### Pré-requisitos do Servidor

- Ubuntu 20.04+ ou Debian 11+
- Mínimo 2GB RAM
- 20GB de armazenamento
- Acesso root ou sudo
- Domínio configurado apontando para o IP do servidor

#### 1. Configuração Inicial do Servidor

```bash
# Atualize o sistema
sudo apt update && sudo apt upgrade -y

# Instale dependências essenciais
sudo apt install -y curl git nginx certbot python3-certbot-nginx ufw

# Configure o firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

#### 2. Instale o Node.js

```bash
# Instale o Node.js 18.x via NodeSource
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verifique a instalação
node --version  # Deve mostrar v18.x.x
npm --version   # Deve mostrar 9.x.x ou superior
```

#### 3. Clone e Configure o Projeto

```bash
# Crie um diretório para aplicações
sudo mkdir -p /var/www
cd /var/www

# Clone o repositório
sudo git clone <URL_DO_SEU_REPOSITORIO> trafficpro
cd trafficpro

# Instale as dependências
sudo npm install

# Build do projeto
sudo npm run build
```

#### 4. Configure o Nginx

Crie um arquivo de configuração para o Nginx:

```bash
sudo nano /etc/nginx/sites-available/trafficpro
```

Adicione a seguinte configuração:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name seu-dominio.com www.seu-dominio.com;

    root /var/www/trafficpro/dist;
    index index.html;

    # Compressão Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Cache de assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing - redireciona todas as rotas para index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Desabilitar logs de acesso para assets (opcional)
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
        access_log off;
    }
}
```

Ative a configuração:

```bash
# Crie um link simbólico
sudo ln -s /etc/nginx/sites-available/trafficpro /etc/nginx/sites-enabled/

# Remova a configuração padrão
sudo rm /etc/nginx/sites-enabled/default

# Teste a configuração
sudo nginx -t

# Reinicie o Nginx
sudo systemctl restart nginx
```

#### 5. Configure SSL com Let's Encrypt

```bash
# Obtenha certificado SSL gratuito
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com

# Certbot irá:
# 1. Verificar propriedade do domínio
# 2. Gerar certificados SSL
# 3. Configurar HTTPS no Nginx automaticamente
# 4. Configurar renovação automática

# Teste a renovação automática
sudo certbot renew --dry-run
```

Após a configuração SSL, o Nginx será atualizado automaticamente para:

```nginx
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name seu-dominio.com www.seu-dominio.com;

    ssl_certificate /etc/letsencrypt/live/seu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com/privkey.pem;
    
    # ... resto da configuração
}

# Redirecionamento HTTP para HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name seu-dominio.com www.seu-dominio.com;
    return 301 https://$server_name$request_uri;
}
```

#### 6. Configure Atualizações Automáticas

Crie um script de deploy:

```bash
sudo nano /var/www/trafficpro/deploy.sh
```

Adicione o seguinte conteúdo:

```bash
#!/bin/bash

# Script de Deploy TrafficPro
# Copyright © 2025 Mauro Duffrayer

echo "🚀 Iniciando deploy do TrafficPro..."

# Navegar para o diretório do projeto
cd /var/www/trafficpro

# Fazer backup do build anterior
echo "📦 Criando backup..."
if [ -d "dist" ]; then
    mv dist dist.backup.$(date +%Y%m%d_%H%M%S)
fi

# Atualizar código do repositório
echo "📥 Atualizando código..."
git pull origin main

# Instalar/atualizar dependências
echo "📦 Instalando dependências..."
npm install

# Build do projeto
echo "🔨 Compilando projeto..."
npm run build

# Verificar se o build foi bem-sucedido
if [ ! -d "dist" ]; then
    echo "❌ Erro: Build falhou!"
    if [ -d "dist.backup.*" ]; then
        echo "♻️  Restaurando backup..."
        mv dist.backup.* dist
    fi
    exit 1
fi

# Limpar backups antigos (manter apenas os 3 mais recentes)
echo "🧹 Limpando backups antigos..."
ls -dt dist.backup.* 2>/dev/null | tail -n +4 | xargs rm -rf

# Recarregar Nginx
echo "🔄 Recarregando Nginx..."
sudo systemctl reload nginx

echo "✅ Deploy concluído com sucesso!"
echo "🌐 Site disponível em: https://seu-dominio.com"
```

Torne o script executável:

```bash
sudo chmod +x /var/www/trafficpro/deploy.sh
```

Para fazer deploy:

```bash
sudo /var/www/trafficpro/deploy.sh
```

#### 7. Configuração de Deploy com GitHub Actions (Opcional)

Crie `.github/workflows/deploy.yml` no seu repositório:

```yaml
name: Deploy to VPS

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Deploy via SSH
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.VPS_HOST }}
        username: ${{ secrets.VPS_USERNAME }}
        key: ${{ secrets.VPS_SSH_KEY }}
        script: |
          cd /var/www/trafficpro
          ./deploy.sh
```

Configure os secrets no GitHub:
- `VPS_HOST`: IP do seu servidor
- `VPS_USERNAME`: usuário SSH (geralmente root)
- `VPS_SSH_KEY`: chave SSH privada

#### 8. Monitoramento e Logs

```bash
# Ver logs do Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Verificar status do Nginx
sudo systemctl status nginx

# Reiniciar Nginx se necessário
sudo systemctl restart nginx

# Verificar uso de recursos
htop  # ou top

# Verificar espaço em disco
df -h
```

#### 9. Configuração de PM2 para SPA (Alternativa)

Se preferir usar PM2 para servir a aplicação:

```bash
# Instalar PM2 globalmente
sudo npm install -g pm2

# Criar servidor Node.js simples
sudo nano /var/www/trafficpro/server.js
```

Adicione:

```javascript
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`TrafficPro rodando na porta ${PORT}`);
});
```

```bash
# Instalar express
cd /var/www/trafficpro
sudo npm install express

# Iniciar com PM2
sudo pm2 start server.js --name trafficpro

# Configurar inicialização automática
sudo pm2 startup
sudo pm2 save

# Comandos úteis do PM2
sudo pm2 status
sudo pm2 logs trafficpro
sudo pm2 restart trafficpro
```

Configure o Nginx como proxy reverso (atualize `/etc/nginx/sites-available/trafficpro`):

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 10. Backup e Manutenção

```bash
# Script de backup automático
sudo nano /var/www/backup.sh
```

Adicione:

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/trafficpro"
mkdir -p $BACKUP_DIR

# Backup do código
tar -czf $BACKUP_DIR/trafficpro_$(date +%Y%m%d).tar.gz /var/www/trafficpro

# Manter apenas backups dos últimos 7 dias
find $BACKUP_DIR -name "trafficpro_*.tar.gz" -mtime +7 -delete
```

Configure cron para backup diário:

```bash
sudo crontab -e
```

Adicione:

```bash
# Backup diário às 2h da manhã
0 2 * * * /var/www/backup.sh
```

#### 11. Otimizações de Performance

```bash
# Instalar e configurar Redis (cache)
sudo apt install redis-server -y
sudo systemctl enable redis-server

# Configurar swap (se tiver menos de 4GB RAM)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

#### 12. Segurança Adicional

```bash
# Configurar fail2ban (proteção contra brute force)
sudo apt install fail2ban -y
sudo systemctl enable fail2ban

# Desabilitar login root via SSH (recomendado)
sudo nano /etc/ssh/sshd_config
# Altere: PermitRootLogin no

# Reiniciar SSH
sudo systemctl restart sshd

# Configurar atualizações automáticas de segurança
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure -plow unattended-upgrades
```

#### 13. Troubleshooting Comum

**Problema: Site não carrega**
```bash
# Verificar se Nginx está rodando
sudo systemctl status nginx

# Verificar logs de erro
sudo tail -f /var/log/nginx/error.log

# Testar configuração
sudo nginx -t
```

**Problema: Erro 502 Bad Gateway**
```bash
# Se usando PM2, verificar status
sudo pm2 status
sudo pm2 logs trafficpro

# Reiniciar aplicação
sudo pm2 restart trafficpro
```

**Problema: Certificado SSL expirado**
```bash
# Renovar manualmente
sudo certbot renew

# Verificar renovação automática
sudo systemctl status certbot.timer
```

**Problema: Sem espaço em disco**
```bash
# Limpar logs antigos
sudo journalctl --vacuum-time=7d

# Limpar cache do npm
sudo npm cache clean --force

# Remover pacotes não utilizados
sudo apt autoremove -y
```

#### 14. Checklist de Deploy

- [ ] Servidor atualizado e configurado
- [ ] Node.js instalado (v18+)
- [ ] Projeto clonado e build realizado
- [ ] Nginx configurado e testado
- [ ] SSL configurado com Let's Encrypt
- [ ] Firewall (UFW) configurado
- [ ] Script de deploy criado
- [ ] Backups automáticos configurados
- [ ] Monitoramento ativo
- [ ] Documentação de acesso e credenciais
- [ ] Fail2ban configurado
- [ ] Testes de carga e performance realizados

### Configuração de Domínio Personalizado

1. Configure os registros DNS:
   ```
   Tipo: A
   Nome: @ (ou subdomínio desejado)
   Valor: 185.158.133.1
   ```

2. No Lovable, vá em **Settings > Domains**

3. Adicione seu domínio e aguarde a verificação

4. Aguarde a propagação DNS (pode levar até 48h)

📖 **[Documentação de Domínio Customizado](https://docs.lovable.dev/features/custom-domain)**

---

## 📚 Documentação Adicional

- **[Guia de Integrações](DOCS/INTEGRATIONS.md)** - Como configurar Meta Ads, Google Ads e TikTok Ads
- **[Documentação de Segurança](DOCS/SECURITY.md)** - Políticas RLS, Vault e boas práticas
- **[Guia de Migração para Vault](DOCS/VAULT-MIGRATION.md)** - Como migrar credenciais existentes
- **[Documentação Lovable](https://docs.lovable.dev/)** - Documentação oficial do Lovable
- **[Documentação Supabase](https://supabase.com/docs)** - Documentação oficial do Supabase

---

## 💬 Suporte

### Recursos de Suporte

- **Discord Lovable**: [Comunidade Lovable](https://discord.com/channels/1119885301872070706/1280461670979993613)
- **Documentação Lovable**: [docs.lovable.dev](https://docs.lovable.dev/)
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)

### Links Úteis do Projeto

- **Projeto Lovable**: https://lovable.dev/projects/d707b2cd-02af-4bd8-b170-ae2153e7654c
- **SQL Editor**: https://supabase.com/dashboard/project/bdkdcwfmevyvzxjvmxgt/sql/new
- **Edge Functions**: https://supabase.com/dashboard/project/bdkdcwfmevyvzxjvmxgt/functions
- **Auth Providers**: https://supabase.com/dashboard/project/bdkdcwfmevyvzxjvmxgt/auth/providers
- **Storage**: https://supabase.com/dashboard/project/bdkdcwfmevyvzxjvmxgt/storage/buckets

---

## 🎯 Roadmap

### Futuras Funcionalidades
- [ ] Integração com LinkedIn Ads
- [ ] Integração com Twitter Ads
- [ ] Dashboard de BI com visualizações avançadas
- [ ] Automações de otimização de campanhas com IA
- [ ] Aplicativo móvel (React Native)
- [ ] API pública para integrações de terceiros
- [ ] Suporte multi-idioma (i18n)
- [ ] Modo offline com sincronização

---

## 📄 Licença

**Copyright © 2025 Mauro Duffrayer. Todos os direitos reservados.**

Este projeto é de propriedade exclusiva de **Mauro Duffrayer** (designer).

### Termos de Uso

- ✅ Uso autorizado apenas pelo proprietário e usuários licenciados
- ❌ Proibida a reprodução, distribuição ou modificação sem autorização expressa
- ❌ Proibido o uso comercial não autorizado
- ❌ Proibida a engenharia reversa

Para consultas sobre licenciamento, entre em contato com o proprietário.

---

## 👨‍💻 Autor

**Mauro Duffrayer**  
Designer & Desenvolvedor

---

<div align="center">

**Desenvolvido com ❤️ por Mauro Duffrayer**

[![Lovable](https://img.shields.io/badge/Built%20with-Lovable-ff69b4)](https://lovable.dev)
[![Supabase](https://img.shields.io/badge/Powered%20by-Supabase-3ECF8E)](https://supabase.com)

</div>
