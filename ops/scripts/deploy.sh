#!/usr/bin/env bash
# =====================================================
# TrafficPro - Deploy Script
# Automated deployment with Docker Compose
# =====================================================

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🚀 TrafficPro - Starting Deployment..."
echo ""

# Navigate to project root
cd "$(dirname "$0")"
cd ../..

# Check if .env exists
if [ ! -f ".env" ]; then
  echo -e "${YELLOW}⚠️  .env file not found. Copying from .env.example...${NC}"
  cp .env.example .env
  echo -e "${RED}❌ Please fill in the variables in .env before continuing!${NC}"
  echo ""
  echo "Edit .env and run this script again:"
  echo "  nano .env"
  echo "  bash ops/scripts/deploy.sh"
  exit 1
fi

# Validate required environment variables
echo "🔍 Validating environment variables..."
source .env

if [ -z "${VITE_SUPABASE_URL:-}" ] || [ "${VITE_SUPABASE_URL}" = "https://seu-projeto.supabase.co" ]; then
  echo -e "${RED}❌ VITE_SUPABASE_URL is not configured in .env${NC}"
  exit 1
fi

if [ -z "${VITE_SUPABASE_ANON_KEY:-}" ] || [ "${VITE_SUPABASE_ANON_KEY}" = "sua-chave-publica-aqui" ]; then
  echo -e "${RED}❌ VITE_SUPABASE_ANON_KEY is not configured in .env${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Environment variables validated${NC}"
echo ""

# Pull latest changes (optional - comment out if not using git)
if [ -d ".git" ]; then
  echo "📥 Pulling latest changes from Git..."
  git pull || echo -e "${YELLOW}⚠️  Git pull failed or not needed${NC}"
  echo ""
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker compose -f ops/docker-compose.yml down || true
echo ""

# Build and start containers
echo "🏗️  Building and starting containers..."
docker compose -f ops/docker-compose.yml up -d --build

# Wait for container to be healthy
echo ""
echo "⏳ Waiting for container to be healthy..."
sleep 5

# Check container status
if docker ps | grep -q traffic-boss-web; then
  echo -e "${GREEN}✅ Container is running!${NC}"
  echo ""
  
  # Show container info
  echo "📊 Container Status:"
  docker ps --filter "name=traffic-boss-web" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
  echo ""
  
  # Show logs
  echo "📝 Last logs:"
  docker logs --tail 20 traffic-boss-web
  echo ""
  
  echo -e "${GREEN}✅ Deploy completed successfully!${NC}"
  echo ""
  echo "🌐 Access the application:"
  echo "   Local: http://localhost:8080"
  echo "   Network: http://$(hostname -I | awk '{print $1}'):8080"
  echo ""
  echo "📖 Useful commands:"
  echo "   View logs:    docker logs -f traffic-boss-web"
  echo "   Restart:      docker compose -f ops/docker-compose.yml restart"
  echo "   Stop:         docker compose -f ops/docker-compose.yml down"
  echo "   Rebuild:      bash ops/scripts/deploy.sh"
else
  echo -e "${RED}❌ Container failed to start!${NC}"
  echo "Check logs with: docker logs traffic-boss-web"
  exit 1
fi
