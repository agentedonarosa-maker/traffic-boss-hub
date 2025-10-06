# 🚀 TrafficPro - Deploy em Produção

Deploy automatizado usando **Docker + Caddy** para servir o app React+Vite como SPA estático.

## 📋 Pré-requisitos

- **Docker** (versão 20.10+)
- **Docker Compose** (versão 2.0+)
- Servidor Linux (Ubuntu, Debian, CentOS, etc.)
- Porta 8080 disponível no host

### Instalação do Docker (Ubuntu/Debian)

```bash
# Atualizar pacotes
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Adicionar usuário ao grupo docker (para rodar sem sudo)
sudo usermod -aG docker $USER
newgrp docker

# Verificar instalação
docker --version
docker compose version
```

## 🔧 Configuração Inicial

### 1. Clonar o Repositório

```bash
# Clone o projeto
git clone https://github.com/seu-usuario/traffic-boss-hub.git
cd traffic-boss-hub
```

### 2. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar com suas credenciais
nano .env
```

**Variáveis obrigatórias:**
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-publica-aqui
```

> ⚠️ **IMPORTANTE:** Nunca commite o arquivo `.env` no Git!

### 3. Tornar Script Executável

```bash
chmod +x ops/scripts/deploy.sh
```

## 🚀 Deploy

### Deploy Automatizado (Recomendado)

```bash
bash ops/scripts/deploy.sh
```

O script irá:
1. ✅ Validar variáveis de ambiente
2. ✅ Puxar últimas mudanças do Git (se aplicável)
3. ✅ Parar containers existentes
4. ✅ Construir nova imagem
5. ✅ Iniciar container
6. ✅ Verificar status

### Deploy Manual

```bash
# Parar containers existentes
docker compose -f ops/docker-compose.yml down

# Construir e iniciar
docker compose -f ops/docker-compose.yml up -d --build

# Verificar logs
docker logs -f traffic-boss-web
```

## 🌐 Acesso

Após o deploy bem-sucedido:

- **Local:** http://localhost:8080
- **Rede:** http://SEU_IP:8080

## 🔒 Configuração de Domínio e HTTPS

### Opção 1: Caddy Reverso Externo (Recomendado)

Se você já tem um Caddy principal gerenciando múltiplos domínios:

**No Caddy principal (`/etc/caddy/Caddyfile`):**
```caddy
trafficpro.seudominio.com {
  reverse_proxy localhost:8080
  
  # HTTPS automático via ACME
  tls seu-email@dominio.com
}
```

Reinicie o Caddy:
```bash
sudo systemctl reload caddy
```

### Opção 2: HTTPS Direto no Container

Edite `ops/Caddyfile` para incluir seu domínio:

```caddy
trafficpro.seudominio.com {
  encode gzip zstd
  root * /srv/dist
  file_server
  
  # ... resto da configuração
  
  tls seu-email@dominio.com
}
```

E mapeie a porta 443 no `docker-compose.yml`:
```yaml
ports:
  - "80:80"
  - "443:443"
```

## 📊 Gerenciamento

### Ver Logs

```bash
# Últimos logs
docker logs traffic-boss-web

# Seguir logs em tempo real
docker logs -f traffic-boss-web

# Últimas 50 linhas
docker logs --tail 50 traffic-boss-web
```

### Comandos Úteis

```bash
# Status dos containers
docker ps

# Reiniciar container
docker compose -f ops/docker-compose.yml restart

# Parar containers
docker compose -f ops/docker-compose.yml down

# Rebuild completo
bash ops/scripts/deploy.sh

# Entrar no container (debug)
docker exec -it traffic-boss-web sh

# Ver uso de recursos
docker stats traffic-boss-web
```

### Atualizar Aplicação

```bash
# Pull das mudanças
git pull

# Rebuild e redeploy
bash ops/scripts/deploy.sh
```

## 🔍 Troubleshooting

### Container não inicia

```bash
# Ver logs de erro
docker logs traffic-boss-web

# Verificar se a porta está em uso
sudo lsof -i :8080

# Rebuild forçado
docker compose -f ops/docker-compose.yml up -d --build --force-recreate
```

### Erro 404 em rotas

O Caddy está configurado para SPA fallback. Verifique:
1. Build do Vite criou a pasta `dist/` corretamente
2. `index.html` existe em `/srv/dist` dentro do container

```bash
# Verificar conteúdo do container
docker exec -it traffic-boss-web ls -la /srv/dist
```

### Variáveis de ambiente não carregadas

```bash
# Verificar se .env existe
ls -la .env

# Ver variáveis dentro do container
docker exec -it traffic-boss-web env | grep VITE
```

### Build falha

```bash
# Limpar cache do Docker
docker builder prune -a

# Rebuild sem cache
docker compose -f ops/docker-compose.yml build --no-cache
```

## 🔐 Segurança

### Boas Práticas Implementadas

✅ Headers de segurança (HSTS, X-Content-Type-Options, etc.)  
✅ Compressão gzip/zstd  
✅ Cache de assets estáticos  
✅ Health checks  
✅ Container sem privilégios  
✅ Imagem Alpine (menor superfície de ataque)

### Recomendações Adicionais

1. **Firewall:**
```bash
# UFW (Ubuntu/Debian)
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

2. **Fail2Ban:**
```bash
sudo apt install fail2ban
sudo systemctl enable fail2ban
```

3. **Atualizações:**
```bash
# Atualizar sistema regularmente
sudo apt update && sudo apt upgrade -y

# Atualizar imagens Docker
docker compose -f ops/docker-compose.yml pull
bash ops/scripts/deploy.sh
```

## 📈 Monitoramento

### Health Check

O container tem health check configurado:
```bash
# Ver status de saúde
docker inspect traffic-boss-web --format='{{.State.Health.Status}}'
```

### Metrics (Opcional)

Para monitoramento avançado, considere:
- **Prometheus + Grafana**
- **Uptime Kuma**
- **Netdata**

## 🔄 Backup

### Backup Automático (Recomendado)

```bash
#!/bin/bash
# backup.sh
BACKUP_DIR="/backups/trafficpro"
mkdir -p $BACKUP_DIR

# Backup da imagem Docker
docker save traffic-boss-web:latest | gzip > $BACKUP_DIR/image_$(date +%F).tar.gz

# Backup do .env
cp .env $BACKUP_DIR/.env_$(date +%F)

# Manter apenas últimos 7 dias
find $BACKUP_DIR -mtime +7 -delete
```

Agende no crontab:
```bash
crontab -e
# Adicione:
0 2 * * * /path/to/backup.sh
```

## 📞 Suporte

- **Documentação:** Ver `/DOCS/` no repositório
- **Issues:** GitHub Issues
- **Autor:** Mauro Duffrayer

## 📝 Estrutura de Arquivos

```
ops/
├── Dockerfile              # Multi-stage build
├── Caddyfile              # Configuração do servidor web
├── docker-compose.yml     # Orquestração dos containers
├── scripts/
│   └── deploy.sh         # Script de deploy automatizado
└── README_DEPLOY.md      # Este arquivo
```

---

**Copyright © 2025 Mauro Duffrayer. Todos os direitos reservados.**
