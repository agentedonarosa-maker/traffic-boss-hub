# 🚀 Checklist de Deploy - TrafficPro

Este checklist ajuda a garantir um deploy bem-sucedido em produção.

---

## 📋 Antes do Deploy

### Repositório
- [ ] Código atualizado no branch principal
- [ ] `.env` está no `.gitignore` (nunca commitado)
- [ ] Não há credenciais sensíveis no código

### Servidor VPS
- [ ] Docker instalado (versão 20.10+)
- [ ] Docker Compose instalado (versão 2.0+)
- [ ] Portas necessárias liberadas no firewall:
  - [ ] 8080 (HTTP interno)
  - [ ] 80 (HTTP externo - opcional)
  - [ ] 443 (HTTPS - opcional)
- [ ] SSH configurado e funcionando
- [ ] Usuário com permissões para Docker

### DNS (se usando domínio customizado)
- [ ] Registro A apontando para IP do servidor
- [ ] TTL baixo configurado (para propagação rápida)
- [ ] Certificado SSL configurado (via Caddy ou Let's Encrypt)

---

## ⚙️ Durante o Deploy

### Executar Deploy
```bash
# Clone o repositório
git clone <url-do-repositorio> trafficpro
cd trafficpro

# Torne o script executável
chmod +x ops/scripts/deploy.sh

# Execute o deploy
bash ops/scripts/deploy.sh
```

### Verificações
- [ ] Script de deploy executou sem erros
- [ ] Container `traffic-boss-web` está rodando
- [ ] Logs não mostram erros críticos:
  ```bash
  docker logs -f traffic-boss-web
  ```

---

## ✅ Após o Deploy

### Testes Funcionais
- [ ] Página de login carrega corretamente
- [ ] Cadastro de novo usuário funciona
- [ ] Login com usuário existente funciona
- [ ] Dashboard exibe dados corretamente
- [ ] Portal do Cliente acessível com token válido
- [ ] Navegação entre páginas funciona

### Testes de Integrações
- [ ] Edge Functions respondendo (verificar no Supabase Dashboard)
- [ ] Sincronização de campanhas funcionando
- [ ] Notificações sendo criadas

### Testes de Segurança
- [ ] HTTPS funcionando (se configurado)
- [ ] Headers de segurança presentes:
  ```bash
  curl -I https://seu-dominio.com
  ```
- [ ] Rotas privadas não acessíveis sem login

---

## 🔧 Configurações no Supabase Dashboard

### Segurança
- [ ] **Leaked Password Protection** ativado
  - Dashboard → Authentication → Policies
  - Ativar "Check passwords against leaked password database"
  
### Edge Functions
- [ ] Todas as functions ativas e sem erros
- [ ] Verificar logs de execução recentes

### Cronjobs (se necessário)
- [ ] Sincronização diária configurada
- [ ] Verificar última execução bem-sucedida

---

## 📊 Monitoramento Pós-Deploy

### Comandos Úteis
```bash
# Ver status do container
docker ps --filter "name=traffic-boss-web"

# Ver logs em tempo real
docker logs -f traffic-boss-web

# Ver uso de recursos
docker stats traffic-boss-web

# Reiniciar container
docker compose -f ops/docker-compose.yml restart

# Parar container
docker compose -f ops/docker-compose.yml down

# Rebuild completo
bash ops/scripts/deploy.sh
```

### Health Check
```bash
# Verificar se aplicação está respondendo
curl -I http://localhost:8080

# Verificar health interno
docker inspect --format='{{.State.Health.Status}}' traffic-boss-web
```

---

## 🔄 Atualizações Futuras

Para atualizar a aplicação:

```bash
cd trafficpro

# Baixar últimas alterações
git pull origin main

# Executar deploy (rebuild automático)
bash ops/scripts/deploy.sh
```

---

## 🆘 Troubleshooting

### Container não inicia
```bash
# Ver logs detalhados
docker logs traffic-boss-web

# Verificar se porta está em uso
lsof -i :8080
```

### Erro 404 em rotas
- Verificar se Caddyfile tem `try_files` configurado para SPA

### Erro de conexão com Supabase
- Verificar se Edge Functions estão ativas
- Confirmar que ANON_KEY está correta no código

### Performance lenta
- Considerar aumentar recursos do container
- Verificar se compressão gzip está ativa

---

## 📞 Suporte

- **Documentação de Deploy**: `ops/README_DEPLOY.md`
- **Segurança**: `DOCS/SECURITY.md`
- **Integrações**: `DOCS/INTEGRATIONS.md`
