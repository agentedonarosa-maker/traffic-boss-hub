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

O projeto está configurado para usar o Supabase. As credenciais estão integradas diretamente no código (não são necessárias variáveis de ambiente VITE_*).

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
